

//--------------------------------- Routing : DataPanel ------------------------
var Routing = function(){
	this.setTitle("Plánování trasy");
	this.setId();
	this.$().append($('#routingform').html());
}
Routing.prototype = new DataPanel(); 
Routing.prototype.createForm = function (){}
Routing.prototype.findRoute = function (){}
Routing.prototype.setData = function(data){
	this.Panel.setData.call(this, data);    // Call super-class method (if desired)
	//this.data = data;
	
	this.formValues(this.getData());  //form inputs set according to data
	this.setTitle("Plánování trasy: "+this.getQuery()); //add query to title
}
Routing.prototype.setQuery = function(query){
	this.Panel.setQuery.call(this, query);    // Call super-class method (if desired)
	
	window.location.hash = '#'+this.getQuery();
}
Routing.prototype.submitted = function(){
	var data = this.formValues();
	panel.setQuery(Routing.buildQuery(data));
	panel.setData(data);
	return false;
}

Routing.parseQuery = function (query){ //static function
		arr = query.split('>');
		if(!arr[1]) return false;
		return {from: jQuery.trim(arr[0]), to: jQuery.trim(arr[1])};
}
Routing.buildQuery = function (data){
	return data.from + '>' + data.to;
}




/*



/// routingový constructor
function xxx(data){
	r = new Routing();
	r.setTitle("Plánování trasy");
	r.createForm();
	r.activate();
	
	if(data){
		OSMCZ.addNew(r);
		r.setTitle("Trasa: "+data.from+" -> "+data.to);
		r.remove/addToSummary()
		r.setQuery(data.query);
		r.findRoute();
	}
	else
		r.addHtml("Nápověda k Routing");

}





*/
