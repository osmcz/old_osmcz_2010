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




/*
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
//*/

	$("#summary").sortable();
	$("#summary").disableSelection();


});















//--------------------------------- Panel common prototype -------------------
var Panel = {
	id: false,
	data: {},
	title: "",
	
	
	/** activate THIS panel
	 */	
	activate: function(){
		OSMCZ.activate(this);
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
	setTitle: function (str){this.title = str; OSMCZ.setTitle(str);},
	getTitle: function (){return this.title;},

	/** setData(), getData()
	 */	
	setData: function (d){this.data = d;},
	getData: function (){return this.data;},
	
	/** setQuery(), getQuery()
	 */	
	setQuery: function (q){this.query = q;},
	getQuery: function (){return this.query;},
	
	
	/** html manip
	 */
	$: function (){return $(document.getElementById(this.id));},
	
		
	endof:'Panel'
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
	dataPanels: [],
	lastHash: '',
	
	/** initialization() of UI
	 */	
	init: function(){
		// statics
		OSMCZ.statics.summary = new Summary();
		OSMCZ.statics.routingform = new RoutingForm();
		// OSMCZ.statics.upload = new Upload();
		// OSMCZ.statics.export = new Export();
		// OSMCZ.statics.print = new Print();
		// OSMCZ.statics.export = new Export();
		
		// dynamics
		OSMCZ.dataPanels = [Home, Routing]; //Routing,OsmData,Coords,Address,BBox,MapUrl
		
		// Home panel
		OSMCZ.activePanel = p = new Home();
		OSMCZ.statics.summary.add(p);
		OSMCZ.panelsById[p.id] = p;
		OSMCZ.panelsByQuery[p.query] = p;
		
		// hash change 
		$(window).hashchange(function (){
			var hash = window.location.hash.substr(1);
			if(OSMCZ.lastHash != hash){
				res = OSMCZ.handleQuery(hash);
				if(res)
					OSMCZ.lastHash = hash;
			}
		});
	  $(window).hashchange();
	  
		$('.osmczlink').live('click', function(e){
			hash = $(this).attr('href').substr(1);
			res = OSMCZ.handleQuery(hash);
			if(res)
				OSMCZ.lastHash = hash;
		});		
	},
	
	
	/** tabchooser() Clicked - dvojklikem se dostat kde jsem byl
	 */
	tabchooser: function(){
		if(OSMCZ.activePanel == OSMCZ.statics.summary){ //funkce křížku
			OSMCZ.lastActivePanel.activate();
		}
		else{ 																					//funkce "zobraz Summary"
			OSMCZ.lastActivePanel = OSMCZ.activePanel;
			OSMCZ.statics.summary.activate();
		}
	},
	
	
	/** handleQuery() - simple string
	 *
	 * Tries to activate statics[query], or creates data panel which handles parseQuery()
	 */	
	handleQuery: function (query){
		OSMCZ.debug('handleQuery('+query+')');
		var matchedObject = false;
		
		//activate statics
		if(OSMCZ.statics[query]){
			OSMCZ.statics[query].activate();
			return true;
		}
		
		//load from cache, only dataPanels
		if(OSMCZ.panelsByQuery[query]){
			matchedObject = OSMCZ.panelsByQuery[query];
			matchedObject.activate();
			return true;
		}

		//find module matching the query
		if(!matchedObject){
			for (i in OSMCZ.dataPanels){
				if(data = OSMCZ.dataPanels[i].parseQuery(query)){
					matchedObject = new OSMCZ.dataPanels[i](); //does setTitle, setId
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
			OSMCZ.activate(p);
			return true;
		}
		
		OSMCZ.debug('handleQuery('+query+') == false');
		return false;
	},
	
	/** activate(panel) 
	 */
	activate: function(p){
		OSMCZ.activePanel.hide();
		p.show();
		OSMCZ.activePanel = p;
		OSMCZ.setTitle(p.getTitle());
		
		if(OSMCZ.activePanel == OSMCZ.statics.summary)
			$('#tabchooser').addClass('x_ico');
		else
			$('#tabchooser').removeClass('x_ico');
	},
	
	
	/** debug(str)
	 */	
	debug: function(str){
		$('#map').children(0).append('<small>'+str+'</small><br>');
		//$('#js-panelsContainer').append('<small>'+str+'</small><br>');
	},
	

	/** setTitle(str)  -- max cca 30 letters
	 */	
	setTitle: function(str){
		$('#tabchooser').text(str);
		//document.title = str + (str ? ' - ':'') + 'OpenStreetMap.cz';
	},
	
	
	endof: 'OSMCZ'
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
Home.prototype = new DataPanel();
Home.parseQuery = function (query){return (query=='');}

//--------------------------------- RoutingForm : StaticPanel ------------------------
var RoutingForm = function(){
	this.setTitle("Plánování trasy");
	this.setId('routingform');
}
RoutingForm.prototype = new StaticPanel();


//--------------------------------- Routing : DataPanel ------------------------
var Routing = function(){
	this.setTitle("Plánování trasy");
	this.setId();
	this.$().append($('#routingform').html());
	
}
Routing.prototype = new DataPanel(); 
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



/*



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









//*/
