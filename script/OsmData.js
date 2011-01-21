
//--------------------------------- OsmData : DataPanel ------------------------
var OsmData = function(){
	this.setTitle("Mapová data");
	this.setId();
	
	this.$().append("<input type='button' name='' value='Načíst aktuální zobrazení'><br><input type='button' name='' value='Nakreslit obdelník'>");
}
OsmData.prototype = new DataPanel();
OsmData.prototype.layer = null;
OsmData.prototype.loadBBox = function(bounds){

}

OsmData.parseQuery = function(query){
	arr = query.split(':');
	if(arr[0] != 'osmdata') return false;
	if(arr[1] && arr[1].length >= 7)
		return OpenLayers.Bounds.fromString(arr[1]);

	OSMCZ.changeQuery('osmdata:'+ toLL(OSMCZ.map.getExtent()).toBBOX());
	return 'changeQuery'; 
}

