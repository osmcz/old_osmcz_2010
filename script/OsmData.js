
//--------------------------------- OsmData : DataPanel ------------------------
var OsmData = function(){
	this.setTitle("Mapová data");
	this.setId();
	this.setTitle(this.id);
	
	
	this.$().append("<div class='listDiv' />");
	this.listDiv = this.$().find('.listDiv');
	
	this.listDiv.append("<p>Zde je možno zobrazit geometrii mapových dat - body, cesty, relace. Po kliknutí se ukážou detaily. Čím větší oblast je zvolena, tím déle trvá stažení dat, nezatěžujte zbytečně server dotazy nad několik desítek prvků."
			+"<p><input type='button' data-action='showCurrent' class='osmczbutton' value='Načíst aktuální zobrazení'>"
			+"<p><input type='button' data-action='enableBoxSelector' class='osmczbutton' value='Nakreslit obdelník'>");
	
	
	var panel = this;
	
	//listen mouseover on <osmczbutton>s
	this.$().find('.osmczbutton').live('mouseover', function(e){
		var feature = panel.layer.features[$(this).attr('data-fid')];
		if(!feature) return false; //we are intersted only in features
		
		while(f = panel.layer.selectedFeatures.pop()) //unselect all previous
			panel.layer.drawFeature(f, 'default');
		
		panel.layer.drawFeature(feature, 'select');
		panel.layer.selectedFeatures.push(feature);
		return false;
	}).live('mouseout', function(e){
		while(f = panel.layer.selectedFeatures.pop())
			if(f != panel.selectedFeature)
				panel.layer.drawFeature(f, 'default');
		 panel.layer.selectedFeatures.push(panel.selectedFeature);
	});

}
OsmData.prototype = new DataPanel(); ///always store .data as LL (epsg:4326)

/** Vector data layer */
OsmData.prototype.layer = null;

/** Feature displaying data extent */
OsmData.prototype.dataBox = null;

/** Control for clicking the vector features */
OsmData.prototype.dataControl = null;
OsmData.prototype.setDataControl = function (obj){
	this.dataControl = obj;
	OSMCZ.map.addControl(obj);
  obj.activate();
}


OsmData.prototype.setData = function(data){
	this.Panel.setData.call(this, data);    // Call super-class method (if desired)
	
	this.listDiv.append("<p><br><b>Vybraná oblast:</b>"
			+"<p><a href='#bbox:"+data.toBBOX()+"'>BBOX</a>  <input type='text' value='"+data.toBBOX()+"' style='font-size:90%' onfocus='this.select()'> <input type='checkbox' data-action='showBbox' class='osmczbutton'>"
			+"<p><label><input type='checkbox' data-action='showLayer' class='osmczbutton' checked='checked'> zobrazit mapu</label>"
			);
			
	this.loadDataLayer();
	
}
OsmData.prototype.setQuery = function(query){
	this.Panel.setQuery.call(this, query);    // Call super-class method (if desired)
	
	OSMCZ.lastHash = window.location.hash = '#'+this.getQuery();
}

OsmData.prototype.buttonClicked = function(obj){ //panel-wide handler for <osmczbutton>s
	this.Panel.buttonClicked.call(this, obj); // Call super-class method (if desired)
	
	if(obj.getAttribute('data-fid'))
		return this.handle_featureLink(obj);
}





OsmData.prototype.handle_showLayer = function(obj){
	if(obj.checked)
		this.layer.styleMap.styles['default'] = this.layer.styleMap.styles['default2'];
	else
		this.layer.styleMap.styles['default'] = new OpenLayers.Style({fill: false, display: 'none'});
	this.layer.redraw();
}






	
	
OsmData.prototype.handle_showCurrent = function(obj){
	var data = toLL(OSMCZ.map.getExtent());
	this.setData(data);
	this.setQuery(OsmData.buildQuery(data));
}
OsmData.prototype.handle_enableBoxSelector = function(obj){
	obj = $(obj);
	OSMCZ.boxSelectControl.handler.callbacks.done = OpenLayers.Function.bind(this.endDrag, this);
	OSMCZ.boxSelectControl.activate();
	obj.attr('name', 'disableBoxSelector');
	obj.attr('value','Zrušit výběr');
	this.lastObj = obj;
}
OsmData.prototype.endDrag = function(bounds){
	OSMCZ.boxSelectControl.deactivate();
	this.lastObj.attr('name', 'enableBoxSelector');
	this.lastObj.attr('value', 'Nakreslit obdelník');

	data = toLL(bounds.getBounds());
	this.setData(data);
	this.setQuery(OsmData.buildQuery(data));
}

OsmData.prototype.handle_disableBoxSelector = function(obj){
	OSMCZ.boxSelectControl.deactivate();
	$(obj).attr('name', 'enableBoxSelector');
	$(obj).attr('value', 'Nakreslit obdelník');
}
OsmData.prototype.handle_showBbox = function(obj){
		if(obj.checked){ //called after the box is checked
			if(!this.dataBox)
				this.dataBox = new OpenLayers.Feature.Vector(fromLL(this.data).toGeometry(), {}, {
					strokeWidth: 2,
					strokeColor: '#ee9900',
					fill: false
				});
			
			OSMCZ.boxesLayer.addFeatures(this.dataBox);
		}
		else {
			OSMCZ.boxesLayer.removeFeatures(this.dataBox);
		}
		return true;
}



OsmData.prototype.loadDataLayer = function () {
	url = "http://www.openstreetmap.org/api/0.6/map?bbox=" + this.getData().toBBOX();

  if (!this.layer) {
    var style = new OpenLayers.Style();
    style.addRules([new OpenLayers.Rule({
      symbolizer: {
        Polygon: { fillColor: '#ff0000', strokeColor: '#ff0000', strokeWidth: 2, fillOpacity: '0.2', cursor: 'pointer' },
        Line: { fill: false, strokeColor: '#000000', strokeWidth: 4, strokeOpacity: '0.4', cursor: 'pointer' },
        Point: { fillColor: '#00ff00', strokeColor: '#00ff00', strokeWidth: 4, cursor: 'pointer' }
      }
    })]);

    this.layer = new OpenLayers.Layer.GML("Data", url, {
    	OSMCZ_panel: this,
      maxFeatures: 100,
      requestSuccess: this.onLayerLoaded,
      displayInLayerSwitcher: false,
      styleMap: new OpenLayers.StyleMap({
        'default': style,
        'default2': style,
        'select': { strokeColor: '#0000ff', strokeWidth: 8, strokeOpacity: '0.4', display: true },
      })
    });
    OSMCZ.map.addLayer(this.layer);
    
    this.setDataControl(new OpenLayers.Control.SelectFeature(this.layer, { onSelect: $.proxy(this.onFeatureSelect,this) }));
  } else {
    this.layer.setUrl(url);
  }
}


OsmData.prototype.onLayerLoaded = function (request){
  var doc = request.responseXML;
  if (!doc || !doc.documentElement)
    doc = request.responseText;

	//parse the incoming data
  var gml = new OpenLayers.Format.OSM({
        checkTags: true,
        interestingTagsExclude: ['source','source_ref','source:ref','history','attribution','created_by','tiger:county','tiger:tlid','tiger:upload_uuid'],
				externalProjection: OSMCZ.map.displayProjection,
				internalProjection: OSMCZ.map.projection
      });
  browseFeatureList = gml.read(doc);
	
	//generate html with feature links
	var html = "<ul class='nowrap'>";
  for (var i = 0; i < browseFeatureList.length; i++) {
    var feature = browseFeatureList[i]; 
    var type = featureType(feature);
    html += "<li>"+type+" <a href='#"+type+":"+feature.osm_id+"' data-fid='"+i+"' class='osmczbutton'>"+featureName(feature)+"</a>"; 
  }
  html += "</ul>";
  this.OSMCZ_panel.listDiv.append(html);
	
	//calculate the data extent
	extent = OpenLayers.Layer.Vector.prototype.getDataExtent.call({features: browseFeatureList});
  OSMCZ.map.setCenter(extent.getCenterLonLat());

  //add the features in layer
  if (browseFeatureList.length < 130 || window.confirm("Zobrazit na mapě >130 objektů?")){
    this.OSMCZ_panel.layer.addFeatures(browseFeatureList);
  }
}


OsmData.prototype.handle_featureLink = function(obj){
	//unselect all previous
	while(f = this.layer.selectedFeatures.pop())
		this.layer.drawFeature(f, 'default');
  
  //get clicked feature and select
  var feature = this.layer.features[$(obj).attr('data-fid')];
	this.dataControl.select(feature); //this.onFeatureSelect(feature);
  return false;
}

OsmData.prototype.onFeatureSelect = function(feature){
  OSMCZ.map.setCenter(feature.geometry.getBounds().getCenterLonLat()); //todo: only if not visible 

	this.$().find('.featureInfo').remove();
	this.listDiv.hide();
	
	this.selectedFeature = feature;
	
	var html = "<div class='featureInfo'>";
	html+="<p><span data-action='showList' class='osmczbutton'>&laquo; zpět na seznam</span>"
	html+="<ul>";
	for(key in feature.attributes){
		html+="<li><b>"+key+":</b> "+feature.attributes[key];
	}
	html+="</ul>";
	html+="<p><span data-action='showHistory' class='osmczbutton'>Zobrazit historii</span>";
	html+="<br>Zobrazit na <a href='http://osm.org/browse/"+featureType(feature)+"/"+feature.osm_id+"' onclick='window.open(this.href);return false'>osm.org</a>";
	html+="<br>V novém panelu <a href='#"+featureType(feature) + ":" + feature.osm_id+"'>"+featureType(feature) + ":" + feature.osm_id+"</a>"
	html+="</div>";
	this.$().append(html);
}
OsmData.prototype.handle_showList = function(obj){
	this.$().find('.featureInfo').remove();
	this.listDiv.show();
	this.selectedFeature = null;
	
	//scroll to selected feature position
	for(var i in this.layer.features){
		if(this.layer.features[i] == this.layer.selectedFeatures[0]){
			var offset = parseInt(this.$().find("a[data-fid="+i+"]").offset().top);
			$('#js-panelsContainer').animate({scrollTop: offset-200}, 200);
			break;
		}
	}
	
	while(f = this.layer.selectedFeatures.pop()) //unselect all previous
		this.layer.drawFeature(f, 'default');
}
OsmData.prototype.handle_showHistory = function(obj){
	$(obj).remove();
		
	OpenLayers.Request.GET({
		url: "http://www.openstreetmap.org/api/0.6/"+featureType(this.selectedFeature)+"/"+this.selectedFeature.osm_id+"/history",
		success: this.onHistoryLoaded,
		scope: this
	});

	return false;
}
OsmData.prototype.onHistoryLoaded = function(request){
	var doc = request.responseXML ?
		request.responseXML : 
		OpenLayers.Format.XML.prototype.read(request.responseText);

	var feature = this.selectedFeature;
  var nodes = doc.getElementsByTagName(featureType(feature));
	
  var html = "<p><br><b>Historie pro " +feature.osm_id +"</b>";
	html += "<ul>";
  for (var i = nodes.length - 1; i >= 0; i--) { //newest to oldest
    var user = nodes[i].getAttribute("user") || "anonym";
    var time = nodes[i].getAttribute("timestamp");

    if(user != "anonym") 
    	user = "<a href='http://www.openstreetmap.org/user/"+user+"'>"+user+"</a>";
    html += "<li>"+user+" <small>"+time+"</small>";
  }
	html += "</ul>";
	
	this.$().find('.featureInfo').append(html);	
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
    } else if (feature.geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") {
    	return "way"; // browse/way/123123
    } else {
      return "way";
    }
  }

  function featureName(feature) {
  	var interstingTags = /*'name:cs,*/'name,'
					+'highway,cycleway,barrier,cycleway,waterway,railway,'
					+'bridge,tunnel,aeroway,aerialway,power,man_made,leisure,amenity,'
					+'shop,tourism,historic,landuse,military,natural,sport,'
					+'building,boundary';
		interstingTags = interstingTags.split(',');
		
		for (var i in interstingTags){ //return interesting tag's value
			var key = interstingTags[i];
			var val = feature.attributes[key];
			if(val == 'yes') return key;
			if(val && key == 'name') return "<b>"+val+"</b>";
			if(val) return val;
		}
		
		for (var key in feature.attributes){ //otherwise return first non-source tag
			if(key.substr(0,6) != 'source')
				return key //+ "="+feature.attributes[key];
		}
    
    return feature.osm_id; //no attributes - return ID
  }
