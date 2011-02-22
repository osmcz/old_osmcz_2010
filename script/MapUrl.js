

//--------------------------------- MapUrl : DataPanel ------------------------
var MapUrl = function(){
	this.setTitle("Soubor");
	this.setId();
}
MapUrl.prototype = new DataPanel();
MapUrl.prototype.layer = null;
MapUrl.prototype.loadend = function(){
	OSMCZ.map.zoomToExtent(this.layer.getDataExtent());
	//OSMCZ.map.setCenter(this.layer.getDataExtent().getCenterLonLat());
	
	var bbox = toLL(this.layer.getDataExtent()).toBBOX();
	this.$().append("<p><br><b>Ohraničení trasy:</b>"
			+"<p><a href='#bbox:"+bbox+"' class='osmczlink'>BBOX</a>  <input type='text' value='"+bbox+"' style='font-size:90%' onfocus='this.select()'> <input type='checkbox' data-action='showBbox' class='osmczbutton'>"
			);
	
	
	for(var i in this.layer.features){
		var f = this.layer.features[i];
		var len = f.geometry.getGeodesicLength(OSMCZ.map.projection);
		
		this.$().append("<p>Segment"+i+": "+OSMCZ.getInKm(len));
	}
	//OSMCZ.debug2($.dump());
	
}
MapUrl.prototype.handle_showBbox = function(obj){ //todo: introduce GUI parts - controls
		if(obj.checked){ //called after the box is checked
			if(!this.dataBox)
				this.dataBox = new OpenLayers.Feature.Vector(this.layer.getDataExtent().toGeometry(), {}, {
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


MapUrl.prototype.setData = function(data){
	this.Panel.setData.call(this, data);    // Call super-class method (if desired)
	//this.data = data;

/*

	vectorLayer = new OpenLayers.Layer.GML("KML", 'http://upload.zby.cz/putak2010.kml', 
		{
		projection: OSMCZ.map.displayProjection,
		eventListeners: { 'loadend': function(){ OSMCZ.map.zoomToExtent(this.getDataExtent())  } },
		format: OpenLayers.Format.KML, 
		formatOptions: {
			style: {strokeColor: "green", strokeWidth: 5, strokeOpacity: 0.5},
			extractStyles: true, 
			maxDepth: 2,
			extractAttributes: true
		}
		});
		
	OSMCZ.map.addLayer(vectorLayer);

	
/*/
	this.layer = new OpenLayers.Layer.Vector("KML", {
						projection: OSMCZ.map.displayProjection,
            strategies: [new OpenLayers.Strategy.Fixed()],
            //eventListeners: { 'loadend': function(){ OSMCZ.map.zoomToExtent(fromLL(this.getDataExtent()))  }},
            protocol: new OpenLayers.Protocol.HTTP({
                url: data,
                format: new OpenLayers.Format.GPX({
                    extractStyles: true, 
                    extractAttributes: true,
                    maxDepth: 2
                })
            })
        });
        
  this.layer.events.register('loadend', this, this.loadend);
        

	OSMCZ.map.addLayer(this.layer);
//*/


	selectControl = new OpenLayers.Control.SelectFeature(this.layer,
		{onSelect: function (feature) 
			{
				selectedFeature = feature;
				popup = new OpenLayers.Popup.FramedCloud("chicken", 
					feature.geometry.getBounds().getCenterLonLat(),
					new OpenLayers.Size(100,150),
					"<div style='font-size:.8em'><b>Name:</b>"+feature.attributes.name+"<br><b>Description:</b>"+feature.attributes.description+"</div>",				null, true/*, onPopupClose*/);
				feature.popup = popup;
				OSMCZ.map.addPopup(popup);
			}
		 /*, onUnselect: onFeatureUnselect*/});
		
	OSMCZ.map.addControl(selectControl);
	selectControl.activate();


}





MapUrl.parseQuery = function (query){ //static function
		if(query.substr(0,7) == "http://") return query;
		return false;
}
MapUrl.buildQuery = function (data){
	return data;
}






