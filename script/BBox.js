

//--------------------------------- BBox : DataPanel ------------------------
var BBox = function(){
	this.setTitle("BBOX");
	this.setId();

  this.layer = new OpenLayers.Layer.Vector( "BBox" );
  OSMCZ.map.addLayer(this.layer);
  
  
 
  // a nice style for the transformation box - http://openlayers.org/dev/examples/transform-feature.html
  var style = new OpenLayers.Style({
      cursor: "${getCursor}",
      pointRadius: 5,
      //fillColor: "white",
      fillOpacity: 1,
      strokeColor: "black"
  });
                          
  // the layer that we want to transform features on
  this.layer = new OpenLayers.Layer.Vector("Simple Geometry", {
      styleMap: new OpenLayers.StyleMap({
          "transform": style
      })
  });
  OSMCZ.map.addLayer(this.layer);
 
  // create the TransformFeature control, using the renderIntent
  // from above
  this.control = new OpenLayers.Control.TransformFeature(this.layer, {
      renderIntent: "transform"
  });
  OSMCZ.map.addControl(this.control);


  
  this.layer.setZIndex(OSMCZ.map.Z_INDEX_BASE.Feature); //todo: standard layers have position 
}
BBox.prototype = new DataPanel();
BBox.prototype.layer = null;
BBox.prototype.control = null;
BBox.prototype.setData = function(data){
	this.Panel.setData.call(this, data);    // Call super-class method (if desired)
	//this.data = data;
	//14.298938,50.093561,14.301845,50.096507

	this.$().append(""
		+"<p><a href='#bbox:"+data.toBBOX()+"'>BBOX</a>  <input type='text' value='"+data.toBBOX()+"' style='font-size:90%' onfocus='this.select()'> <input type='checkbox' data-action='showBbox' class='osmczbutton'>"
		+"<br><span data-action='zoomToMarker' class='osmczbutton'>zoom</span>");


  var polygonFeature = new OpenLayers.Feature.Vector(fromLL(data.toGeometry()));
  this.control.setFeature(polygonFeature, {});// start with the transformation box on polygonFeature
  this.layer.addFeatures(polygonFeature);
}

BBox.prototype.handle_zoomToMarker = function(obj){
	OSMCZ.map.setCenter(fromLL(new OpenLayers.LonLat(this.data.lon, this.data.lat)));
}


BBox.regexp = /^bbox:([0-9]+.?[0-9]*),([0-9]+.?[0-9]*),([0-9]+.?[0-9]*),([0-9]+.?[0-9]*)/;
BBox.parseQuery = function (query){ //static function
	var data = BBox.regexp.exec(query);
	if(!data) return false;
	
	data.shift(); //[0] byla celý vstup
	data = OpenLayers.Bounds.fromArray(data);
	return data; 
}
BBox.buildQuery = function (data){
	return 'bbox:'+data.join(',');
}

