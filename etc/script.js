
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






















var OSMCZ = { //static
	activePanel: false,
	panels: {}, //assoc by htmlId
	
	addPanel: function(p){OSMCZ.panels[p.htmlId] = p},
	
	initStaticPanels: function(){ //add from initial DOM
		$('#js-panelsContainer').children().each(function(){
			id = $(this).attr('id');
			p = new Panel(id);
			p.setTitle( $(this).attr('title') );
			            $(this).removeAttr('title');
		});
		
		new Summary();
		
		OSMCZ.panels.summary.add(OSMCZ.panels['home']);
		OSMCZ.activePanel = OSMCZ.panels['home'];
	}
}
$(OSMCZ.initStaticPanels);



//--------------------------------- Panel ----------------------------------
var Panel = function(id){
	//initHtml
	if(!id)
		id = 'pnl'+Math.round(Math.random()*100000); //random name?
		
	if(!document.getElementById(id)){ //create new html panel?
		$('#js-panelsContainer').append('<div id="'+id+'" class="panel hidden"></div>');
	}
	
	this.htmlId = id;
	
	//add to main register
	OSMCZ.addPanel(this);
}
Panel.prototype = {
	title: "",
	url: "",
	htmlId: false,
	active: false,
	Panel: Panel, //constructor

	setTitle: function (str){this.title = str; if(this.active) $('#tabchooser').text(str)},
	getTitle: function (){return this.title;},
	setQuery: function (){},
	getQuery: function (){},
	parseQuery: function (query){},
	constructQuery: function (){},
	
	showInSumm: false,

	
	//** show/hide this panel, toggle active flag
	hide: function(){$('#'+this.htmlId).hide(); this.active = false;},
	show: function(){$('#'+this.htmlId).show(); this.active = true;},
	
	//** activate this panel - hide previous, show this and set "active" flags
	activate: function(){
		OSMCZ.activePanel.hide()
		OSMCZ.activePanel = this;
		this.show();
		$('#tabchooser').text(this.getTitle()).removeClass();
	},
	
	addHtml: function (){},
	addFeatures: function (){},
	
	toggleDataLayer: function (){alert(this.htmlId+' data toggled');},	
}


//--------------------------------- SUMMARY : Panel ------------------------
var Summary = function(){
	this.Panel('summary');
	this.setTitle("Přehled panelů");
	
	$("#summary .item a").live("click", function(event){
		alert($(this).parent().attr('id'));
		return false;
	});
	
	$("#summary .item input").live("click", function(event){
		id = $(this).parent().parent().attr('id');
		OSMCZ.panels[id].toggleDataLayer();
		return false;
	});

}
Summary.prototype = new Panel();
Summary.prototype.add = function(p){
	$('#summary').append('<div class="item" id="item_'+p.htmlId+'"><span><input type="checkbox" name="a"> <a href="#">X</a></span><a href="#'+p.getQuery()+'">'+p.getTitle()+'</a></div>');
}
Summary.prototype.activate = function(){
	if(OSMCZ.activePanel != this){
		this.prevPanel = OSMCZ.activePanel;
		OSMCZ.activePanel.hide()
		OSMCZ.activePanel = this;
		this.show();
		$('#tabchooser').text(this.getTitle()).removeClass().addClass('top_'+this.htmlId);
	}
	else {
		this.prevPanel.activate();
	}
}

Summary.prototype.remove = function(p){
	//OSMCZ.panels['home'].activate(); //zobraz úvod
	OSMCZ.panels[p.htmlId] = false; //delete from this.panels
	//delete from this.summary.DOM
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






//--------------------------------- ROUTING : Panel ------------------------
var Routing = function(data){
	this.Panel = Panel;
	this.Panel();
	this.data=data;
	OSMCZ.summary.add(this);
}
Routing.prototype = new Panel(); 
Routing.prototype.createForm = function (){}
Routing.prototype.findRoute = function (){a}
Routing.parseQuery = function (query){ //static
		arr = query.split('>');
		if(!arr[1]) return false;
		return {from: arr[0], to: arr[1]};
}

