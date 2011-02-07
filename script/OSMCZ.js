
var OSMCZ = {
	lastActivePanel: null,  //instance of <Panel>
	activePanel: null,      //instance of <Panel>
	panelsById: {}, 				//every <dataPanel>s - assoc by id => instance of <Panel>
	panelsByQuery: {},      //cache <dataPanel>s - assoc by query => instance of <Panel>
	statics: {},            //every <staticPanel> by id
	dataPanels: [],
	lastHash: '',
	map: null,
	boxSelectControl: null,
	
	
	/** initialization() of UI
	 */	
	init: function(){
		OSMCZ.init_map();
		OSMCZ.init_panels();
		OSMCZ.init_links();
	},
	
	init_map: function(){
		OpenLayers.ProxyHost = "./proxy.php?url=";
		var map = OSMCZ.map = new OpenLayers.Map('map',{
			units: 'm',
			projection: new OpenLayers.Projection("EPSG:900913"), //v metrech pro mercatora
			displayProjection: new OpenLayers.Projection("EPSG:4326"), //latlon
			controls:[
				new OpenLayers.Control.Navigation(),
				new OpenLayers.Control.PanZoomBar(),
				new OpenLayers.Control.LayerSwitcher(),
				new OpenLayers.Control.Attribution(),
				new OpenLayers.Control.Permalink(),
				new OpenLayers.Control.ScaleLine(),
				new OpenLayers.Control.OverviewMap(),
				new OpenLayers.Control.MousePosition()]
		});

		//blank layer - same projection as Mapnik
    map.addLayer(new OpenLayers.Layer("Blank",{
			isBaseLayer: true,
			maxExtent: new OpenLayers.Bounds(
			    -128 * 156543.0339,
			    -128 * 156543.0339,
			    128 * 156543.0339,
			    128 * 156543.0339
			),
			maxResolution: 156543.0339,
			numZoomLevels: 21,
			units: "m",
			projection: "EPSG:900913"
		}));
		
		//Mapnik layer
		map.addLayer(new OpenLayers.Layer.OSM("Mapnik"));
		
		//vector layer for dataBoxes and boxSelector
		OSMCZ.boxesLayer = new OpenLayers.Layer.Vector("Boxes");
    OSMCZ.map.addLayer(OSMCZ.boxesLayer);
		
		//user box selector  --> usage: OSMCZ.boxSelectControl.activate(); OSMCZ.boxSelectControl.handler.callbacks.done = OSMCZ.endDrag;
    OSMCZ.boxSelectControl = new OpenLayers.Control.DrawFeature(OSMCZ.boxesLayer, OpenLayers.Handler.Box); 
    OSMCZ.map.addControl(OSMCZ.boxSelectControl);
    
    
    //set map center
		map.setCenter( fromLL(new OpenLayers.LonLat(14.3, 50.1)), 			14);
	},
	
	init_panels: function(){
		// statics
		OSMCZ.statics.summary = new Summary();
		OSMCZ.statics.routingform = new RoutingForm();
		OSMCZ.statics.upload = new Upload();
		OSMCZ.statics.print = new Print();
		OSMCZ.statics.exportmap = new ExportMap();
		OSMCZ.statics.permalink = new Permalink();
		OSMCZ.statics.feedback = new WebPage('feedback', 'Feedback');
		
		// non-statics - shows up in Summary-Panel
		OSMCZ.dataPanels = [Home, Routing, MapUrl, OsmData]; //Routing,OsmData,Coords,Address,BBox,MapUrl
		
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
	},
	
	init_links: function(){
		//poslouchat kliknutí na map-link
		$('.osmczlink').live('click', function(e){
			hash = $(this).attr('href').substr(1);
			OSMCZ.debug('osmczlink clicked');			
			OSMCZ.handleQuery(hash);
		});
		
		//poslouchat kliknutí na button uvnitř panelu
		$('.osmczbutton').live('click', function(e){
			return OSMCZ.thisPanel(this).buttonClicked($(this));
		});

		//togglovátko na levý panel
		$('#leftpanel_toggle').toggle(
			function (){
				$('#leftpanel_toggle').html('&raquo;');
				$('body').addClass('leftpanel_toggled');
			},
			function (){
				$('#leftpanel_toggle').html('&laquo;');
				$('body').removeClass('leftpanel_toggled');
			}
		);
		
		//rozšiřovátko na pravý panel
		$('#rightpanel_toggle').toggle(
			function (){
				$('#rightpanel_toggle').html('&raquo; mapy');
				$('body').addClass('rightpanel_toggled');
			},
			function (){
				$('#rightpanel_toggle').html('&laquo; mapy');
				$('body').removeClass('rightpanel_toggled');
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
	
	
	/** changeQuery()
	 */
	changeQuery: function (query){
		OSMCZ.lastHash = window.location.hash = query;
		var queryHandled = OSMCZ.handleQuery(query);
	},
	 	
	
	
	/** handleQuery() - simple string
	 *
	 * Tries to activate statics[query], or creates data panel which handles parseQuery()
	 * Called onHashChange or to duplicate dataPanel
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
					if(data == 'changeQuery')	return true; //changing query - OK
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
		//$('body').append('<small>'+str+'</small><br>');
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
		var id = $(obj).parents('.panel').attr('id');
		if(!id)
			return alert('Unrecoverable error - thisPanel() called out of panel scope by '+$.dump(obj));
			
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



function toLL(obj){return obj.transform(OSMCZ.map.projection, OSMCZ.map.displayProjection);}
function fromLL(obj){return obj.transform(OSMCZ.map.displayProjection, OSMCZ.map.projection);}
