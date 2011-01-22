
//--------------------------------- OsmData : DataPanel ------------------------
var OsmData = function(){
	this.setTitle("Mapová data");
	this.setId();
	this.setTitle(this.id);
	
	this.$().append("<input type='button' name='showCurrent' class='osmczbutton' value='Načíst aktuální zobrazení'>"
								 +"<br><input type='button' name='enableBoxSelector' class='osmczbutton' value='Nakreslit obdelník'>");
	
	
	var panel = this;
		//poslouchat kliknutí na button uvnitř panelu
		this.$().find('.osmczbutton').live('mouseover', function(e){
		
	    var feature = panel.layer.features[$(this).attr('data-fid')];

	    for (var i = 0; i < panel.layer.selectedFeatures.length; i++) { //unselect previous
	      var f = panel.layer.selectedFeatures[i]; 
	      panel.layer.drawFeature(f, panel.layer.styleMap.createSymbolizer(f, "default"));
	    }

	    panel.browseSelectControl.select(feature);
	    //OSMCZ.map.setCenter(feature.geometry.getBounds().getCenterLonLat());
			return false;
		});
}
OsmData.prototype = new DataPanel();
OsmData.prototype.layer = null;  ///always store .data as LL (epsg:4326)
OsmData.prototype.browseSelectControl = null;

OsmData.prototype.setData = function(data){
	this.Panel.setData.call(this, data);    // Call super-class method (if desired)
	
	this.$().append("<p><b>"+data.toBBOX()+"</b>");
	this.loadDataLayer();
}
OsmData.prototype.setQuery = function(query){
	this.Panel.setQuery.call(this, query);    // Call super-class method (if desired)
	
	OSMCZ.lastHash = window.location.hash = '#'+this.getQuery();
}

OsmData.prototype.buttonClicked = function(obj){
	if(obj.attr('tagName') == "A"){
    for (var i = 0; i < this.layer.selectedFeatures.length; i++) { //unselect previous
      var f = this.layer.selectedFeatures[i]; 
      this.layer.drawFeature(f, this.layer.styleMap.createSymbolizer(f, "default"));
    }
    
    var feature = this.layer.features[obj.attr('data-fid')];
    this.onFeatureSelect(feature);
    OSMCZ.map.setCenter(feature.geometry.getBounds().getCenterLonLat()); 
    return false;
	
	}

	var objName = obj.attr('name');
	 
	if(objName == 'showCurrent'){
		data = toLL(OSMCZ.map.getExtent());
		this.setData(data);
		this.setQuery(OsmData.buildQuery(data));
		
	}
	else if(objName == 'enableBoxSelector'){
		OSMCZ.boxSelectControl.handler.callbacks.done = OpenLayers.Function.bind(this.endDrag, this);
		OSMCZ.boxSelectControl.activate();
		obj.attr('name', 'disableBoxSelector');
		obj.attr('value','Zrušit výběr');
		this.lastObj = obj;
		
	}
	else if(objName == 'disableBoxSelector'){
		OSMCZ.boxSelectControl.deactivate();
		obj.attr('name', 'enableBoxSelector');
		obj.attr('value', 'Nakreslit obdelník');
		
	}
}

OsmData.prototype.endDrag = function(bounds){
	OSMCZ.boxSelectControl.deactivate();
	this.lastObj.attr('name', 'enableBoxSelector');
	this.lastObj.attr('value', 'Nakreslit obdelník');

	data = toLL(bounds.getBounds());
	this.setData(data);
	this.setQuery(OsmData.buildQuery(data));
}


OsmData.prototype.loadDataLayer = function () {
	url = "http://www.openstreetmap.org/api/0.6/map?bbox=" + this.getData().toBBOX();
  //setStatus("Načítá se…");
  //$("browse_content").innerHTML = "";

  if (!this.layer) {
    var style = new OpenLayers.Style();

    style.addRules([new OpenLayers.Rule({
      symbolizer: {
        Polygon: { fillColor: '#ff0000', strokeColor: '#ff0000', strokeWidth: 2, fillOpacity: '0.2' },
        Line: { fillColor: '#ffff00', strokeColor: '#000000', strokeWidth: 4, strokeOpacity: '0.4' },
        Point: { fillColor: '#00ff00', strokeColor: '#00ff00', strokeWidth: 4 }
      }
    })]);

    this.layer = new OpenLayers.Layer.GML("Data", url, {
    	OSMCZ_panel: this,
      format: OpenLayers.Format.OSM,
      formatOptions: {
        checkTags: true, 
        interestingTagsExclude: ['source','source_ref','source:ref','history','attribution','created_by','tiger:county','tiger:tlid','tiger:upload_uuid']
      },
      maxFeatures: 100,
      requestSuccess: this.onLayerLoaded,
      displayInLayerSwitcher: false,
      styleMap: new OpenLayers.StyleMap({
        'default': style,
        'select': { strokeColor: '#0000ff', strokeWidth: 8, strokeOpacity: '0.4' }
      })
    });
    //this.layer.events.register("loadend", this.layer, this.onLayerLoaded );
    OSMCZ.map.addLayer(this.layer);
    
    this.browseSelectControl = new OpenLayers.Control.SelectFeature(this.layer, { onSelect: this.onFeatureSelect });
    this.browseSelectControl.handlers.feature.stopDown = false;
    this.browseSelectControl.handlers.feature.stopUp = false;
    OSMCZ.map.addControl(this.browseSelectControl);
    this.browseSelectControl.activate();
  } else {
    this.layer.setUrl(url);
  }

  //browseActiveFeature = null;
}

OsmData.prototype.onLayerLoaded = function (request){
	//    if (this.map.dataLayer.active) {
	
  var doc = request.responseXML;
  if (!doc || !doc.documentElement)
    doc = request.responseText;

  var options = {};
  OpenLayers.Util.extend(options, this.formatOptions);
  options.externalProjection = OSMCZ.map.displayProjection;
  options.internalProjection = OSMCZ.map.projection;

  var gml = this.format ? new this.format(options) : new OpenLayers.Format.GML(options);
  browseFeatureList = gml.read(doc);	
	
	var html = "<ul>";
  for (var i = 0; i < browseFeatureList.length; i++) {
    var feature = browseFeatureList[i]; 
    var type = featureType(feature);
    html += "<li>" + type + " "
        + "<a href='http://osm.org/browse/" + type + "/" + feature.osm_id + "' data-fid='"+i+"' class='osmczbutton'>" 
				+ featureName(feature) + "</a>"; //viewFeatureLink  
  }
  html += "</ul>";
  this.OSMCZ_panel.$().append(html);
  
  if (browseFeatureList.length < 130 || window.confirm("Zobrazit na mapě >130 objektů?")){
    this.OSMCZ_panel.layer.addFeatures(browseFeatureList);
  }
}

OsmData.prototype.onFeatureSelect = function(feature){
	//alert(feature.osm_id);
}



OsmData.parseQuery = function(query){
	arr = query.split(':');
	if(arr[0] != 'osmdata') return false;
	if(arr[1] && arr[1].length >= 7)
		return OpenLayers.Bounds.fromString(arr[1]);

	OSMCZ.changeQuery('osmdata:'+ toLL(OSMCZ.map.getExtent()).toBBOX());
	return 'changeQuery'; 
}
OsmData.buildQuery = function(data){
	return 'osmdata:' + data.toBBOX();
}





  function featureType(feature) {
    if (feature.geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
      return "node";
    } else {
      return "way";
    }
  }

  function featureName(feature) {
    if (feature.attributes['name:cs']) {
      return feature.attributes['name:cs'];
    } else if (feature.attributes['name']) {
      return feature.attributes['name'];
    } else {
      return feature.osm_id;
    }
  }

