

//--------------------------------- MapUrl : DataPanel ------------------------
var MapUrl = function(){
	this.setTitle("Soubor");
	this.setId();
}
MapUrl.prototype = new DataPanel();
MapUrl.prototype.layer = null;
MapUrl.prototype.loadend = function(){
	if(this.layer != null)
		OSMCZ.map.zoomToExtent(this.layer.getDataExtent());
	alert("x");
}
MapUrl.prototype.setData = function(data){
	this.Panel.setData.call(this, data);    // Call super-class method (if desired)
	//this.data = data;
	

	this.layer = new OpenLayers.Layer.Vector("KML", {
            strategies: [new OpenLayers.Strategy.Fixed()],
            eventListeners: { 'loadend': this.loadend },
            protocol: new OpenLayers.Protocol.HTTP({
                url: data,
                format: new OpenLayers.Format.KML({
                    extractStyles: true, 
                    extractAttributes: true,
                    maxDepth: 2
                })
            })
        });

	OSMCZ.map.addLayers([this.layer]);


}

MapUrl.parseQuery = function (query){ //static function
		if(query.substr(0,7) == "http://") return query;
		return false;
}
MapUrl.buildQuery = function (data){
	return data;
}


