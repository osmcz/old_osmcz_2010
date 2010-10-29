var map_init = function(){
	var map = new OpenLayers.Map('map');
	
	map.addLayers([new OpenLayers.Layer.OSM("Mapnik")]);
	map.addControl(new OpenLayers.Control.LayerSwitcher());
	map.setCenter( new OpenLayers.LonLat(14.3, 50.1).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")), 
		14);
}


$(function(){

	$('#leftpanel_toggle').toggle(
		function (){
			$('#leftpanel_toggle').html('&raquo;');
			$('.leftpanel').hide();
			$('.middlepanel').css('margin-left', 0);
		},
		function (){
			$('#leftpanel_toggle').html('&laquo;');
			$('.leftpanel').show();
			$('.middlepanel').css('margin-left', 271);
		}
	);

	$('#rightpanel_toggle').toggle(
		function (){
			$('#rightpanel_toggle').html('&raquo; mapy');
			$('.rightpanel').css('width', '200px');
			$('.middlepanel').css('margin-right', 200);
		},
		function (){
			$('#rightpanel_toggle').html('&laquo; mapy');
			$('.rightpanel').css('width', '60px');
			$('.middlepanel').css('margin-right', 60);
		}
	);





	//autocomplete nominatim
	$( "#search-autocomplete" ).autocomplete({
		minLength: 2,
		source: function( request, response ) {
			$.ajax({
				url: "http://nominatim.openstreetmap.org/search",
				dataType: "jsonp",
				jsonp: 'json_callback',
				data: {
					q: request.term,
					format: "json",
					limit: 12
				},
				success: function( data ) {
					response( $.map( data, function( item ) {
						return {
							label: item.display_name,
							value: item.display_name
						}
					}));
				}
			}); //ajax
		} //source
	});


	$("#summary").sortable();
	$("#summary").disableSelection();


});















//--------------------------------- Panel common prototype -------------------
var Panel = {
	id: false,
	
	
	/** activate THIS panel
	 */	
	activate: function(){
		if(!(OSMCZ.activePanel instanceof StaticPanel)){	//předchozí není static, uložíme
			OSMCZ.lastActivePanel = OSMCZ.activePanel
		}
		OSMCZ.activePanel.hide()
		this.show();
		OSMCZ.activePanel = this;
		$('#tabchooser').text(this.getTitle()).removeClass().addClass('top_'+this.htmlId);
	},
	
	
	/** show/hide this panel, toggle active flag
	 */	
	hide: function(){$('#'+this.id).hide()},
	show: function(){$('#'+this.id).show()},
	
	
	/** setId() - init html div
	 */
	setId: function(id){	
		if(!id)
			id = 'pnl'+Math.round(Math.random()*100000); //random name?
			
		if(!document.getElementById(id)) //create new html panel?
			$('#js-panelsContainer').append('<div id="'+id+'" class="panel hidden"></div>');
		
		this.id = id;
	},
	
	
	/** setTitle(), getTitle()
	 */	
	setTitle: function (str){this.title = str;},
	getTitle: function (){return this.title;}
	
}

//--------------------------------- StaticPanel ----------------------------------
var StaticPanel = function(){}
StaticPanel.prototype = $.extend({}, Panel, {
	Panel: Panel
});


//--------------------------------- DataPanel ----------------------------------
var DataPanel = function(){}
DataPanel.prototype = $.extend({}, Panel, {
	Panel: Panel	
});










var OSMCZ = {
	lastActivePanel: null,
	activePanel: null,
	panelsById: {}, 				//assoc by htmlId
	panelsByQuery: {},
	statics: {},
	
	
	/** initialization() of UI
	 */	
	init: function(){ 
		OSMCZ.statics.summary = new Summary();
		// OSMCZ.statics.routingForm = new RoutingForm();
		// OSMCZ.statics.upload = new Upload();
		// OSMCZ.statics.export = new Export();
		// OSMCZ.statics.print = new Print();
		// OSMCZ.statics.export = new Export();
		$('.staticLink').bind('click', function(e){alert('xasgas'+this.href);OSMCZ.statics[this.href.substr(1)].activate();return false;});
		
		
		OSMCZ.handleQuery(''); 
		$('.dataLink').live('click', function(e){alert('xasgas'+this.href);OSMCZ.handleQuery(this.href.substr(1));return false;});
		//window.location.hash.substr(1) .. možnos sloučit na link
	},
	
	
	/** tabchooser() Clicked
	 */
	tabchooser: function(){
		if(OSMCZ.activePanel instanceof StaticPanel)	//funkce křížku
			OSMCZ.lastActivePanel.activate();
		else 																					//funkce "zobraz Summary"
			OSMCZ.statics.summary.activate();
	},
	
	
	/** handleQuery() - simple string
	 */	
	dataPanels: [Home, Routing], //Routing,OsmData,Coords,Address,BBox,MapUrl
	handleQuery: function (query){
		var matchedObject = false;
		
		//load from cache
		if(OSMCZ.panelsByQuery[query]){
			matchedObject = OSMCZ.panelsByQuery[query];
			return;
		}

		//find module matching the query
		if(!matchedObject){
			for (i in OSMCZ.dataPanels){
				if(data = OSMCZ.dataPanels[i].parseQuery(query)){
					matchedObject = new OSMCZ.dataPanels[i](); //setTitle, setId
					matchedObject.setData(data);
					matchedObject.setQuery(query);
					break;
				}
			}
		}
		
		//přidat do Summary,panels,panelsByQuery
		if(matchedObject){
			var p = matchedObject;
			OSMCZ.statics.summary.add(p);
			OSMCZ.panelsById[p.id] = p;
			OSMCZ.panelsByQuery[p.query] = p;
			p.activate();
		}
		else {
			alert('Nic nenalezeno');
		}
	}
}
$(OSMCZ.init);



//--------------------------------- SUMMARY : StaticPanel ------------------------
var Summary = function(){
	//není potřeba: this.Panel();
	this.setTitle("Přehled panelů");
	this.setId('summary');
	
	// 	$("#summary .item a").live("click", function(event){
	// 		alert($(this).parent().attr('id'));
	// 		return false;
	// 	});
	// 	
	// 	$("#summary .item input").live("click", function(event){
	// 		id = $(this).parent().parent().attr('id');
	// 		OSMCZ.panels[id].toggleDataLayer();
	// 		return false;
	// 	});

}
Summary.prototype = new StaticPanel();
Summary.prototype.add = function(p){
	$('#summary').append('<div class="item" id="item_'+p.id+'"><span><input type="checkbox" name="a"> <a href="#">X</a></span><a href="#'+p.getQuery()+'">'+p.getTitle()+'</a></div>');
}
Summary.prototype.remove = function(p){
	$('#item_'+p.id).remove();
}

//--------------------------------- Home : DataPanel ------------------------
var Home = function(){
	//není potřeba: this.Panel();
	this.setTitle("Vítejte");
	this.setId('home');
}
Home.prototype = new StaticPanel();
Home.parseQuery = function (query){return (query=='');}

//--------------------------------- Routing : DataPanel ------------------------
var RoutingForm = function(){
	//není potřeba: this.Panel();
	this.setTitle("Plánování trasy");
	this.setId('routingform');
}
Routing.prototype = new StaticPanel();
Routing.parseQuery = function (query){return (query=='');}


//--------------------------------- ROUTING : Panel ------------------------
var Routing = function(){
	//není potřeba: this.Panel();
	//OSMCZ.summary.add(this);
}
Routing.prototype = new Panel(); 
Routing.prototype.createForm = function (){}
Routing.prototype.findRoute = function (){}
Routing.parseQuery = function (query){ //static
		arr = query.split('>');
		if(!arr[1]) return false;
		return {from: arr[0], to: arr[1]};
}





//--------------------------------- Dtsdfadfasasadfnel ----------------------------------
//--------------------------------- DataPanel ----------------------------------
//--------------------------------- DataPanel ----------------------------------
//--------------------------------- DataPanel ----------------------------------
//--------------------------------- DataPanel ----------------------------------







var Panel = function(id){
}
Panel.prototype = {
	title: "",
	url: "",
	htmlId: false,
	active: false,
	Panel: Panel, //constructor


	setQuery: function (){},
	getQuery: function (){},
	parseQuery: function (query){},
	constructQuery: function (){},
	
	addHtml: function (){},
	addFeatures: function (){},
	
	toggleDataLayer: function (){alert(this.htmlId+' data toggled');},	
}






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










