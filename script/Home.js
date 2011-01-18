
//--------------------------------- Home : DataPanel ------------------------
var Home = function(){
	//není potřeba: this.Panel();
	this.setTitle("Vítejte");
	this.setId('home');
}
Home.prototype = new DataPanel();
Home.parseQuery = function (query){return (query=='');}

