
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






















var Panels = { //static
	panels: [],
	active: false,
	statics: {},
	
	addNew: function(p){
		//přidat do DICT: this.panels[panel.id]=panel;
		Panels.panels[p.id] = p;
		//přidat na začátek divu summary
	},
	remove: function(p){
		//zobraz úvod
		Panels.statics['home'].activate();
		//delete from this.summary.DOM
		//delete from this.panels
	},
	getAll: function(){					//[active] + pole
	},
	initStaticPanels: function(){ //add from initial DOM
		$('#js-panelsContainer').children().each(function(){
			id = $(this).attr('id');
			p = new Panel(id);
			Panels.statics[id] = p;
			
			p.setTitle($(this).attr('title'));
			$(this).removeAttr('title');
		});
		Panels.active = Panels.statics['home'];
	}
}
$(Panels.initStaticPanels);


//--------------------------------- Panel ----------------------------------
var Panel = function(id){
	this.setId(id);
};
Panel.prototype = {
	title: "",
	url: "",
	htmlId: false,
	active: false,

	setTitle: function (str){this.title = str; if(this.active) $('#tabchooser').text(str)},
	getTitle: function (){return this.title;},
	setQuery: function (){},
	getQuery: function (){},
	parseQuery: function (query){},
	constructQuery: function (){},
	
	showInSumm: false,
	
	setId: function (id){
		if(!document.getElementById(id)){ //non-existent panel, create new one
			id = 'pnl'+Math.round(Math.random()*100000); 
			$('#js-panelsContainer').append('<div id="'+id+'" class="panel hidden">Content not ready ('+id+')</p>');
			$('#'+id).hide();
		}
		this.htmlId = id;
	},
	getId: function (){return this.htmlId;},
	
	//** show/hide this panel, toggle active flag
	hide: function(){$('#'+this.htmlId).hide(); this.active = false;},
	show: function(){$('#'+this.htmlId).show(); this.active = true;},
	
	//** activate this panel - hide previous, show this and set "active" flags
	activate: function(){
		if(this.htmlId == 'summary'){
			if(Panels.active == this)
				return this.prevPanel.activate();
			else 
				this.prevPanel = Panels.active;
		}
	
		Panels.active.hide()
		Panels.active = this;
		this.show();
		$('#tabchooser').text(this.getTitle()).removeClass().addClass('top_'+this.htmlId);
	},
	
	addHtml: function (){},
	addFeatures: function (){},
	
	toggleDataLayer: function (){},	
}


//--------------------------------- ROUTING : Panel ------------------------
var Routing = function(data){
	this.parentClass = Panel;
	this.parentClass();
	this.data=data;
}
Routing.prototype = new Panel(); 
Routing.prototype.createForm = function (){}
Routing.prototype.findRoute = function (){a}
Routing.parseQuery = function (query){ //static
		arr = query.split('>');
		if(!arr[1]) return false;
		return {from: arr[0], to: arr[1]};
}


/// routingový constructor
function xxx(data){
	r = new Routing();
	r.setTitle("Plánování trasy");
	r.createForm();
	r.activate();
	
	if(data){
		Panels.addNew(r);
		r.setTitle("Trasa: "+data.from+" -> "+data.to);
		r.remove/addToSummary()
		r.setQuery(data.query);
		r.findRoute();
	}
	else
		r.addHtml("Nápověda k Routing");

}





/// handle Query
queryModules = [Routing];
function handleQuery(){
	query = $('search-autocomplete').value;
	
	//find module matching the query
	queryObject = false;
	for (i in queryModules){
		if(data = queryModules[i].parseQuery(query)){
			queryObject = new queryModules[i](data);
			break;
		}
	}
	
	//module matched, add panel
	if(queryObject){
		panels.addNew(queryObject);
		panels.setActive(queryObject);
	}
	else {
		alert('Nic nenalezeno')
	}
}



