

//--------------------------------- Coords : DataPanel ------------------------
var Coords = function(){
	this.setTitle("Souřadnice");
	this.setId();

  this.layer = new OpenLayers.Layer.Markers( "Markers" );
  OSMCZ.map.addLayer(this.layer);
  this.layer.setZIndex(OSMCZ.map.Z_INDEX_BASE.Feature); //todo: standard layers have position 
}
Coords.prototype = new DataPanel();
Coords.prototype.layer = null;
Coords.prototype.setData = function(data){
	this.Panel.setData.call(this, data);    // Call super-class method (if desired)
	//this.data = data;


	this.$().append("<p>Souřadnice: <br>"+data.lat+","+data.lon
		+"<br><span data-action='zoomToMarker' class='osmczbutton'>zoom</span>");

  var size = new OpenLayers.Size(21,25);
  var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
  var icon = new OpenLayers.Icon('lib/ol/img/marker.png ',size,offset);
  this.layer.addMarker(new OpenLayers.Marker(fromLL(new OpenLayers.LonLat(data.lon,data.lat)),icon));
}

Coords.prototype.handle_zoomToMarker = function(obj){
	OSMCZ.map.setCenter(fromLL(new OpenLayers.LonLat(this.data.lon,this.data.lat)));
}



Coords.parseQuery = function (query){ //static function
		var c = parseCoords(query)
		if(c) return c;
		else return false;
}
Coords.buildQuery = function (data){
	return data.lat+","+data.lon;
}

