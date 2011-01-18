
//--------------------------------- WebPage : StaticPanel ------------------------
var WebPage = function(id, title){
	this.setTitle(title);
	this.setId(id);
}
WebPage.prototype = new StaticPanel();

