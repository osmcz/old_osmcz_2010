
//--------------------------------- OsmData : DataPanel ------------------------
var OsmData = function(){
	this.setTitle("Mapová data");
	this.setId();
	this.setTitle(this.id);
	
	this.$().append("<p>Zde je možno zobrazit geometrii mapových dat - body, cesty, relace. Po kliknutí se ukážou detaily. Čím větší oblast je zvolena, tím déle trvá stažení dat, nezatěžujte zbytečně server dotazy nad několik desítek prvků."
			+"<p><input type='button' name='showCurrent' class='osmczbutton' value='Načíst aktuální zobrazení'>"
			+"<p><input type='button' name='enableBoxSelector' class='osmczbutton' value='Nakreslit obdelník'>");
	
	
	var panel = this;
	
	//listen mouseover on <osmczbutton>s
	this.$().find('.osmczbutton').live('mouseover', function(e){
	
		var feature = panel.layer.features[$(this).attr('data-fid')];
		if(!feature) return false; //we dont care about showCurrent and enableBoxSelecto 
		
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
	
	this.$().append("<p><br><b>Vybraná oblast:</b>"
			+"<p><a href='#bbox:"+data.toBBOX()+"'>BBOX</a>  <input type='text' value='"+data.toBBOX()+"' style='font-size:90%' onfocus='this.select()'> <input type='checkbox' name='showBbox' class='osmczbutton'>"
			+"<p><label><input type='checkbox' name='showLayer' class='osmczbutton' checked='checked'> zobrazit mapu</label>"
			);
			
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
	else if(objName == 'showBbox'){
		if(!obj[0].checked){ //called after changed the checked
			this.layer.removeFeatures(this.box);
		}
		else {
			if(!this.box)
				this.box = new OpenLayers.Feature.Vector(fromLL(this.data).toGeometry(), {}, {
					strokeWidth: 2,
					strokeColor: '#ee9900',
					fill: false
				});
			
			this.layer.addFeatures(this.box);
		
		}
		return true;
	}

}
OsmData.prototype.box = null;

OsmData.prototype.endDrag = function(bounds){
	OSMCZ.boxSelectControl.deactivate();
	this.lastObj.attr('name', 'enableBoxSelector');
	this.lastObj.attr('value', 'Nakreslit obdelník');

	//data = toLL(bounds.getBounds());
	//this.setData(data);
	//this.setQuery(OsmData.buildQuery(data));
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

	extent = OpenLayers.Layer.Vector.prototype.getDataExtent.call({features: browseFeatureList});
  OSMCZ.map.setCenter(extent.getCenterLonLat()); 

  
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






/*


<div>
  <div style="text-align: center;">
    <p style="margin-top: 10px; margin-bottom: 20px;">
      <a style="display: none;" id="browse_select_view" href="#">Ukázat data k zobrazené mapě</a>
      <br>
      <a id="browse_select_box" href="#">Ručně vybrat jinou oblast</a>  
    </p>
  </div>

  <div id="browse_status" style="text-align: center; display: none;"></div>
  <div id="browse_content"><div style="text-align: center; margin-bottom: 20px;"><a href="#">Zobrazit seznam objektů</a></div><table class="browse_heading" width="100%"><tr><td>County Road 35</td><td align="right"><a href="/browse/way/8759286">Detaily</a></td></tr></table><div class="browse_details"><ul><li><b>highway</b>: residential</li><li><b>name</b>: County Road 35</li><li><b>name_1</b>: Crary Mills-Eben Rd</li><li><b>name_2</b>: County Road 66</li><li><b>tiger:cfcc</b>: A41</li><li><b>tiger:county</b>: St. Lawrence, NY</li><li><b>tiger:name_base</b>: County Road 35</li><li><b>tiger:name_base_1</b>: Crary Mills-Eben</li><li><b>tiger:name_base_2</b>: County Road 66</li><li><b>tiger:name_type_1</b>: Rd</li><li><b>tiger:separated</b>: no</li><li><b>tiger:source</b>: tiger_import_dch_v0.6_20070829</li><li><b>tiger:tlid</b>: 155179332</li><li><b>tiger:upload_uuid</b>: bulk_upload.pl-f924af11-2b11-40e3-a545-e3041c449159</li><li><b>tiger:zip_left</b>: 13676</li><li><b>tiger:zip_right</b>: 13617</li></ul></div><table class="browse_heading" width="100%"><tr><td>Historie pro County Road 35</td><td align="right"><a href="/browse/way/8759286/history">Detaily</a></td></tr></table><div class="browse_details"><ul><li>Upravil RussNelson dne 2010-06-28T05:33:01Z</li><li>Upravil RussNelson dne 2009-10-04T23:45:00Z</li><li>Upravil DaveHansenTiger dne 2007-10-10T12:35:07Z</li></ul></div></div>

</div>

*/



function onFeatureSelect(feature) {
  // Unselect previously selected feature

  // Redraw in selected style

      
  // Create a link back to the object list
  var div = document.createElement("div");
  div.style.textAlign = "center";
  div.style.marginBottom = "20px";
  $("browse_content").appendChild(div);
  var link = document.createElement("a");
  link.href = "#";
  link.onclick = loadObjectList;
  link.appendChild(document.createTextNode("Zobrazit seznam objektů"));
  div.appendChild(link);

  var table = document.createElement("table");
  table.width = "100%";
  table.className = "browse_heading";
  $("browse_content").appendChild(table);

  var tr = document.createElement("tr");
  table.appendChild(tr);

  var heading = document.createElement("td");
  heading.appendChild(document.createTextNode(featureNameSelect(feature)));
  tr.appendChild(heading);

  var td = document.createElement("td");
  td.align = "right";
  tr.appendChild(td);

  var type = featureType(feature);
  var link = document.createElement("a");   
  link.href = "/browse/" + type + "/" + feature.osm_id;
  link.appendChild(document.createTextNode("Detaily"));
  td.appendChild(link);

  var div = document.createElement("div");
  div.className = "browse_details";

  $("browse_content").appendChild(div);

  // Now the list of attributes
  var ul = document.createElement("ul");
  for (var key in feature.attributes) {
    var li = document.createElement("li");
    var b = document.createElement("b");
    b.appendChild(document.createTextNode(key));
    li.appendChild(b);
    li.appendChild(document.createTextNode(": " + feature.attributes[key]));
    ul.appendChild(li);
  }
      
  div.appendChild(ul);
      
  var link = document.createElement("a");   
  link.href =  "/browse/" + type + "/" + feature.osm_id + "/history";
  link.appendChild(document.createTextNode("Zobrazit historii"));
  link.onclick = OpenLayers.Function.bind(loadHistory, {
    type: type, feature: feature, link: link
  });
      
  div.appendChild(link);

  // Stash the currently drawn feature
  browseActiveFeature = feature; 
}   

function loadHistory() {
  this.link.href = "";
  this.link.innerHTML = "Čekejte...";

  new Ajax.Request("/api/0.6/" + this.type + "/" + this.feature.osm_id + "/history", {
    onComplete: OpenLayers.Function.bind(displayHistory, this)
  });

  return false;
}

function displayHistory(request) {
  if (browseActiveFeature.osm_id != this.feature.osm_id || $("browse_content").firstChild == browseObjectList)  { 
      return false;
  } 

  this.link.parentNode.removeChild(this.link);

  var doc = request.responseXML;

  var table = document.createElement("table");
  table.width = "100%";
  table.className = "browse_heading";
  $("browse_content").appendChild(table);

  var tr = document.createElement("tr");
  table.appendChild(tr);

  var heading = document.createElement("td");
  heading.appendChild(document.createTextNode(i18n("Historie pro [[feature]]", { feature: featureNameHistory(this.feature) })));
  tr.appendChild(heading);

  var td = document.createElement("td");
  td.align = "right";
  tr.appendChild(td);

  var link = document.createElement("a");   
  link.href = "/browse/" + this.type + "/" + this.feature.osm_id + "/history";
  link.appendChild(document.createTextNode("Detaily"));
  td.appendChild(link);

  var div = document.createElement("div");
  div.className = "browse_details";

  var nodes = doc.getElementsByTagName(this.type);
  var history = document.createElement("ul");  
  for (var i = nodes.length - 1; i >= 0; i--) {
    var user = nodes[i].getAttribute("user") || "anonym";
    var timestamp = nodes[i].getAttribute("timestamp");
    var item = document.createElement("li");
    item.appendChild(document.createTextNode(i18n("Upravil [[user]] dne [[timestamp]]", { user: user, timestamp: timestamp })));
    history.appendChild(item);
  }
  div.appendChild(history);

  $("browse_content").appendChild(div); 
}

