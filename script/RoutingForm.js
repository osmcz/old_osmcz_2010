
//--------------------------------- RoutingForm : StaticPanel ------------------------
var RoutingForm = function(){
	this.setTitle("Plánování trasy");
	this.setId('routingform');
}
RoutingForm.prototype = new StaticPanel();
RoutingForm.prototype.submitted = function(){
	var query = Routing.buildQuery(this.formValues());
	OSMCZ.handleQuery(query);
	
	this.formValues({from:'', to:''});
	return false;
}
