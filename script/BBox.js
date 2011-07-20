

//--------------------------------- BBox : DataPanel ------------------------
var BBox = function(){
	this.setTitle("BBOX");
	this.setId();

  //the layer
  this.layer = new OpenLayers.Layer.Vector("BBox",{
	      styleMap: new OpenLayers.StyleMap({
	        'default': new OpenLayers.Style({}, {rules: [
							new OpenLayers.Rule({
					      symbolizer: {
					        Polygon: { fillColor: '#ff0000', strokeColor: '#ff0000', strokeWidth: 1, fillOpacity: 0, graphicZIndex: 1 },
					        Point: 	{strokeWidth: 1, pointRadius: 6, strokeColor: '#000', fillOpacity: 0, cursor: 'pointer', graphicZIndex: 10 }
					      }
					    })
						]}),
	        'select': { fillOpacity: '0'},
	      }),
	      rendererOptions: {zIndexing: true}
	});
  OSMCZ.map.addLayer(this.layer);
 
 	//drag control
  this.control = new OpenLayers.Control.DragFeature(this.layer,{
		geometryTypes: "OpenLayers.Geometry.Point",
		onDrag: OpenLayers.Function.bind(this.dragPoint, this),
		onComplete: OpenLayers.Function.bind(this.dragEnd, this),
		renderIntent: "select"
	});
	
  OSMCZ.map.addControl(this.control);
	this.control.activate()

  this.layer.setZIndex(OSMCZ.map.Z_INDEX_BASE.Feature); //todo: standard layers have position
	

	//html in panel
	this.$().append("<p>bbox: <small>(left,bottom,right,top)</small>"
		+"<br><input type='text' style='font-size:90%;width:99%;' class='bbox' onfocus='this.select()'>"
		+"<br><input type='button' class='osmczbutton' data-action='bboxChanged' value='update'>"
		
		+"<p>point1: <small>(lat,lon)</small>"
		+"<br><input type='text' style='font-size:90%;width:180px;' class='point1'>"
		
		+"<p>point2:"
		+"<br><input type='text' style='font-size:90%;width:180px;' class='point2'>"
		+"<br><input type='button' class='osmczbutton' data-action='pointsChanged' value='update'>"
		
		+"<p class='small'>Plocha: <span class='geoarea'> </span>m<sup>2</sup>"
		+"<br>Obvod: <span class='geolength'> </span>m<sup>2</sup>"

		+"<p><input type='button' class='osmczbutton' data-action='enableBoxSelector' value='Nakreslit obdelník'>"
		
	);
	
 
}
BBox.prototype = new DataPanel();
BBox.prototype.layer = null;
BBox.prototype.control = null;
BBox.prototype.rectangle = null;
BBox.prototype.setData = function(data){
	this.Panel.setData.call(this, data);    // Call super-class method (if desired)
	//this.data = data;
	
	this.layer.removeAllFeatures();

  this.layer.addFeatures([
		new OpenLayers.Feature.Vector(fromLL(new OpenLayers.Geometry.Point(this.data.left, this.data.top)), {lt:true}),
		new OpenLayers.Feature.Vector(fromLL(new OpenLayers.Geometry.Point(this.data.right, this.data.bottom)), {lt:false})
		]);

  this.rectangle = new OpenLayers.Feature.Vector(fromLL(this.data.toGeometry())); //todo: returns Polygon, LinearRing could be better
  this.layer.addFeatures(this.rectangle);

	this.updateInputs();
	
}

BBox.prototype.updateInputs = function(){
	this.$().find('.bbox').val(this.data.toBBOX());
	this.$().find('.point1').val(this.data.top.toFixed(6)+","+this.data.left.toFixed(6));
	this.$().find('.point2').val(this.data.bottom.toFixed(6)+","+this.data.right.toFixed(6));
	this.$().find('.geoarea').html(this.data.toGeometry().getGeodesicArea().toFixed(1));
	this.$().find('.geolength').html(this.data.toGeometry().getGeodesicLength().toFixed(1));
}
BBox.prototype.handle_pointsChanged = function(obj){
	var point1 = parseCoords(this.$().find('.point1').val());
	var point2 = parseCoords(this.$().find('.point2').val());
	if(point1 && point2){
		this.setData(new OpenLayers.Bounds(point1.lon, point2.lat, point2.lon, point1.lat));
		this.sanitizeData();
		this.updateInputs();
	}
}
BBox.prototype.handle_bboxChanged = function(obj){
	var bbox = this.$().find('.bbox').val();
	this.setData(OpenLayers.Bounds.fromString(bbox));
	this.sanitizeData();
	this.updateInputs();
}
/**
 * Method: dragPoint
 * Called by the drag feature control with each drag move of a vertex.
 *
 * Parameters:
 * vertex - {<OpenLayers.Feature.Vector>} The vertex being dragged.
 * pixel - {<OpenLayers.Pixel>} Pixel location of the mouse event.
 */
BBox.prototype.dragPoint = function(vertex, pixel){
	if(vertex.attributes.lt){
		this.data.left = toLL(vertex.geometry).x;
		this.data.top = toLL(vertex.geometry).y;
	}
	else {
		this.data.right = toLL(vertex.geometry).x;
		this.data.bottom = toLL(vertex.geometry).y;
	}
	this.updateInputs();

  this.layer.removeFeatures(this.rectangle);
  this.rectangle = new OpenLayers.Feature.Vector(fromLL(this.data.toGeometry()));

  this.layer.addFeatures(this.rectangle);
	//this.layer.drawFeature(this.rectangle);//redraw();
}
BBox.prototype.dragEnd = function(vertex, pixel){
	//$.d(this.data.toBBOX());
	//this.layer.redraw();
	this.sanitizeData();
}

BBox.prototype.sanitizeData = function(){
	if(this.data.top < this.data.bottom){
		var t = this.data.top;
		this.data.top = this.data.bottom;
		this.data.bottom = t;
	}
	
	if(this.data.right < this.data.left){
		var t = this.data.right;
		this.data.right = this.data.left;
		this.data.left = t;
	} 
	
	this.setData(this.data);
}


BBox.prototype.handle_enableBoxSelector = function(obj){
	obj = $(obj);
	OSMCZ.boxSelectControl.handler.callbacks.done = OpenLayers.Function.bind(this.boxSelector_endDrag, this);
	OSMCZ.boxSelectControl.activate();
	obj.attr('data-action', 'disableBoxSelector');
	obj.attr('value','Zrušit výběr');
	this.lastObj = obj;
}
BBox.prototype.boxSelector_endDrag = function(bsbounds){
	OSMCZ.boxSelectControl.deactivate();
	this.lastObj.attr('data-action', 'enableBoxSelector');
	this.lastObj.attr('value', 'Nakreslit obdelník');

	var data = toLL(bsbounds.getBounds());
	this.setData(data);
	//this.setQuery(OsmData.buildQuery(data));
}
BBox.prototype.handle_disableBoxSelector = function(obj){
	OSMCZ.boxSelectControl.deactivate();
	$(obj).attr('data-action', 'enableBoxSelector');
	$(obj).attr('value', 'Nakreslit obdelník');
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

