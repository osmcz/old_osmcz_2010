


//--------------------------------- Panel common prototype -------------------
var Panel = {
	id: null,
	data: {},
	title: "",
	query: "",
	
	
	/** activate THIS panel
	 */	
	activate: function(){
		OSMCZ.activate(this);
	},
	
	
	/** show/hide this panel, toggle active flag
	 */	
	hide: function(){this.$().hide()},
	show: function(){this.$().show()},
	
	
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
	setQuery: function (q){
		OSMCZ.panelsByQuery[this.query] = null;
		OSMCZ.panelsByQuery[q] = this;
		this.query = q;
	},
	getQuery: function (){return this.query;},
	
	
	/** html manip
	 */
	$: function (){return $(document.getElementById(this.id));},
	//not working:  $: function (find){return find==null ? $(document.getElementById(this.id)) : $(document.getElementById(this.id), find);},

	
	/** Get/set assoc array of form values
	 */
	formValues: function(data){
		if(data == null){
			var result = {};
			this.$().find('input').each(function(k,v){
				if($(v).attr('name'))
					result[$(v).attr('name')] = $(v).val();
			});
			return result;
		}
		else {
			this.$().find('input').each(function(k,v){
				if(data[$(v).attr('name')] != null)
					$(v).val( data[$(v).attr('name')] );
			});
		}
	},

	
		
	endof:'Panel'
}

//--------------------------------- StaticPanel ----------------------------------
var StaticPanel = function(){}
StaticPanel.prototype = $.extend({}, Panel, {
	Panel: Panel,
	
	getQuery: function(){return this.id;} //final function -- data panels have query identical to htmlId
});


//--------------------------------- DataPanel ----------------------------------
var DataPanel = function(){}
DataPanel.prototype = $.extend({}, Panel, {
	Panel: Panel

});










var OSMCZ = {
	lastActivePanel: null,  //instance of <Panel>
	activePanel: null,      //instance of <Panel>
	panelsById: {}, 				//every <dataPanel>s - assoc by id => instance of <Panel>
	panelsByQuery: {},      //cache <dataPanel>s - assoc by query => instance of <Panel>
	statics: {},            //every <staticPanel> by id
	dataPanels: [],
	lastHash: '',
	
	/** initialization() of UI
	 */	
	init: function(){
		// statics
		OSMCZ.statics.summary = new Summary();
		OSMCZ.statics.routingform = new RoutingForm();
		OSMCZ.statics.upload = new Upload();
		OSMCZ.statics.print = new Print();
		OSMCZ.statics.export = new Export();
		OSMCZ.statics.permalink = new Permalink();
		OSMCZ.statics.feedback = new WebPage('feedback', 'Feedback');
		
		// dynamics - shows up in Summary-Panel
		OSMCZ.dataPanels = [Home, Routing]; //Routing,OsmData,Coords,Address,BBox,MapUrl
		
		// Home panel
		OSMCZ.activePanel = p = new Home();
		OSMCZ.statics.summary.add(p);
		OSMCZ.panelsById[p.id] = p;
		OSMCZ.panelsByQuery[p.query] = p;
		
		// hash change 
		$(window).hashchange(function (){
			var hash = window.location.hash.substr(1);
			if(OSMCZ.lastHash != hash){ //we dont want to handleQuery when clicked osmczlink
				OSMCZ.debug('hashChanged from ('+OSMCZ.lastHash+') to ('+hash+')');			
				OSMCZ.handleQuery(hash);
			}
		});
	  $(window).hashchange();
	  
		$('.osmczlink').live('click', function(e){
			hash = $(this).attr('href').substr(1);
			OSMCZ.debug('osmczlink clicked');			
			OSMCZ.handleQuery(hash);
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
		OSMCZ.debug('called handleQuery('+query+')');
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

		//find panel matching the query syntax
		if(!matchedObject){
			for (i in OSMCZ.dataPanels){
				if(data = OSMCZ.dataPanels[i].parseQuery(query)){
					matchedObject = new OSMCZ.dataPanels[i](); //does setTitle, setId
					matchedObject.setQuery(query);
					matchedObject.setData(data);
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
		
		OSMCZ.debug(' ^--- wasnt matched to any panel');
		return false;
	},
	
	/** activate(panel) 
	 */
	activate: function(p){
		OSMCZ.activePanel.hide();
		p.show();
		OSMCZ.activePanel = p;
		OSMCZ.lastHash = p.getQuery();
		//OSMCZ.debug("p.getQuery(): "+p.getQuery());
		
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
	
	/** Returns panel object for any children html object
	 */	
	thisPanel: function(obj){
		var id = $(obj).parent('.panel').attr('id');
		if(!id)
			return alert('Unrecoverable error - thisPanel() called out of panel scope');
			
		var panel = OSMCZ.panelsById[id];
		if(!panel)
			panel = OSMCZ.statics[id];
		
		if(!panel)
			return alert('Unrecoverable error - thisPanel() not found by id: '+id);
			
		return panel; 
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
RoutingForm.prototype.submitted = function(){
	var query = Routing.buildQuery(this.formValues());
	OSMCZ.handleQuery(query);
	
	this.formValues({from:'', to:''});
	return false;
}

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





//--------------------------------- Dtsdfadfasasadfnel ----------------------------------
//--------------------------------- DataPanel ----------------------------------
//--------------------------------- DataPanel ----------------------------------
//--------------------------------- DataPanel ----------------------------------
//--------------------------------- DataPanel ----------------------------------



//--------------------------------- Upload : StaticPanel ------------------------
var Upload = function(){
	this.setTitle("Upload geodat");
	this.setId('upload');
}
Upload.prototype = new StaticPanel();

//--------------------------------- Print : StaticPanel ------------------------
var Print = function(){
	this.setTitle("Tisk mapy");
	this.setId('print');
}
Print.prototype = new StaticPanel();


//--------------------------------- Export : StaticPanel ------------------------
var Export = function(){
	this.setTitle("Export mapy");
	this.setId('export');
}
Export.prototype = new StaticPanel();


//--------------------------------- Permalink : StaticPanel ------------------------
var Permalink = function(){
	this.setTitle("Trvalý odkaz");
	this.setId('permalink');
}
Permalink.prototype = new StaticPanel();

//--------------------------------- WebPage : StaticPanel ------------------------
var WebPage = function(id, title){
	this.setTitle(title);
	this.setId(id);
}
WebPage.prototype = new StaticPanel();



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





//funkce, která vyplní #map-ový div openlayerama
function map_init(){
	var map = new OpenLayers.Map('map');
	
	map.addLayers([new OpenLayers.Layer.OSM("Mapnik")]);
	map.addControl(new OpenLayers.Control.LayerSwitcher());
	map.setCenter( new OpenLayers.LonLat(14.3, 50.1).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")), 
		14);
}


$(function(){

	//togglovátko na levý panel
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

	//rozšiřovátko na pravý panel
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






