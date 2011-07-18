/*

#overlaySwitcher
opravit sortable(), aby po vysortění updatnul zIndex

togglovoátko panelu by mělo fakt schovávat

nástroj na editaci osmcz_layers, všechny vrstvy jen jeden obrázek automaticky generovaný
- jeden velký obrázek s ikonkama -> ukázat z něj jen kousek
- ukládat JSON :) ne mysql

nafaktorovat to do OSMCZ.layerChooser?, přejmenovat idčka, classy
		OSMCZ.maps 
		OSMCZ.mapSources
		OSMCZ.sources
		OSMCZ.layerInfo
		OSMCZ.mapInfo 


mpnk: {
			id: 'mpnk',
			name: 'Mapnik',
			url: ['http://a.tile.openstreetmap.org/${z}/${x}/${y}.png','http://b.tile.openstreetmap.org/${z}/${x}/${y}.png','http://c.tile.openstreetmap.org/${z}/${x}/${y}.png'],
			tags: 'general,_default',
			baseLayer: 1,
			zoom: {min: 0, max: 20},
			opacity: 1,
			html: "<big>Main Mapnik</big>\n<p><img src='etc/map/world.png'> 10 minut\n<p class='attr'>cc-by-sa <a href='http://www.openstreetmap.org/'>OSM</a>\n<p><a href='http://wiki.osm.org/wiki/Mapnik'>wiki</a> ~ <a href='http://www.mapnik.org/'>mapnik.org</a>",
	--------
			layer: <OpenLayers.Layer>
},

*/


function ucfirst(s){return s[0].toUpperCase()+s.substr(1)}


OSMCZ.layers = {
	// computed from all tags
	tagIndex: {
		all: [],
		general: [],
		hike: [],
		bike: [],
		ski: [],
		ortofoto: [],
		other: [],
		google: [],
		_default: []
	},
	
	init_mapsJson: function(){
		//compute the OSMCZ.layers.tagIndex
		for(var i in OSMCZ.maps){ 
			var tags = OSMCZ.maps[i].tags.split(',');
			for(var t in tags){
				if(!OSMCZ.layers.tagIndex[tags[t]])
					OSMCZ.layers.tagIndex[tags[t]] = [];
				OSMCZ.layers.tagIndex[tags[t]].push(OSMCZ.maps[i]);
			}
			OSMCZ.layers.tagIndex.all.push(OSMCZ.maps[i]);
		}
		
		//alter OSMCZ.maps
		var urlRegExp = /\[([^\]]+)\]/;
		var offset = 1;
		for(var k in OSMCZ.maps){
			OSMCZ.maps[k].iconStyle = 'background-position: center '+ (-52*(offset++)+2) +'px';

			//expanding [..] in url in array of full urls
			var url = OSMCZ.maps[k].url;
			var matches = urlRegExp.exec(url); //matching [a,b]
			if(matches){
				var arr = matches[1].split(','); //arr contains a,b
				for(var i in arr) arr[i] = url.replace(urlRegExp, arr[i]); //full url
				OSMCZ.maps[k].url = arr;
			}
		}
	},
	
	
	init_layerSwitcher: function(){
		// inject type buttons in #allmenu-types (All, General, ...)
		var html = '';
		for(tag in OSMCZ.layers.tagIndex)
			if(tag[0] != '_')
				html += '<div class="type" data-tag="'+tag+'">'+ucfirst(tag)+' <small>('+OSMCZ.layers.tagIndex[tag].length+')</small></div>';
		
		$('#allmenu-types').append(html)
		
		
		//inject .layer-buttons in each .type (mapname with small icon)
		$('#allmenu-types')
			.find('.type')
			.each(function(i){
				var tag = $(this).attr('data-tag');
				var layers = OSMCZ.layers.tagIndex[tag];
				
				var cols = Math.round(Math.sqrt(layers.length));
				var rows = Math.ceil(layers.length / cols);
		 
				var style = (!i ? 'border-top:0;' : '')	+ 'width:'+(cols*54)+'px; height:'+(rows*54)+'px';
				$(this).prepend("<div class='submenu' style='"+style+"'>"+OSMCZ.layers.getLayerButtonsHtml(layers)+"</div>");
			});
		
		
			//propagate OpenLayers events to our layerswitcher
			OSMCZ.map.events.on({
				"changelayer": function(e){
					if(e.property == 'visibility')
						e.layer.osmcz_layerbutton
							.toggleClass('layer-disabled', !e.layer.getVisibility())
							.toggleClass('layer-out-of-range', !e.layer.inRange);
				}
			});
		
			//fill layer switcher with layers tagged _default 
			//OSMCZ.layers.addLayer(OSMCZ.maps['mpnk']);
			OSMCZ.layers.addLayer(OSMCZ.maps['uhul']);
			//OSMCZ.layers.addLayer(OSMCZ.maps['otmt']);
			//for(var i in OSMCZ.layers.tagIndex['_default']) OSMCZ.layers.addLayer(OSMCZ.layers.tagIndex['_default'][i]);


			//handle hover and click in submenu for .layer-button
			$('#allmenu .layer-button')
				.click(function(e){
					if(e.target != this && e.target.tagName != 'SMALL') return true; //disable this event on #layer-info
					var l = OSMCZ.maps[ $(this).attr('data-id') ];
					OSMCZ.layers.addLayer(l);
				})
				.mouseleave(OSMCZ.layers.hideTooltip)
				.find('small').mouseenter(OSMCZ.layers.showTooltip);
	},
	
	
	//add layer to our layerswitcher + to OL map
	addLayer: function(l){
		if(l.layer){
			alert('Layer '+l.name+' already added.');
			return false;	
		}
		
		var options = {
			isBaseLayer: false, //careful, we handle l.baseLayer separately 
			opacity: l.opacity,
			transitionEffect: 'resize',
	  	maxResolution: 156543.0339/Math.pow(2,l.zoom.min),
			numZoomLevels: l.zoom.max-l.zoom.min
		}; 
		
		//create new OpenLayers layer (WMS, XYZ, special,..)
		if(l.wms_params)
			l.layer = new OpenLayers.Layer.WMS.LL(l.name, l.url, l.wms_params, options);
		else if(l.id == 'google'){
			l.layer = new OpenLayers.Layer.Google(
			        "Google Satellite",
			        {type: google.maps ? google.maps.MapTypeId.SATELLITE : false, numZoomLevels: 22, isBaseLayer: false}
	    			);
		}
		else
			l.layer = new OpenLayers.Layer.OSM(l.name, l.url, options);
		OSMCZ.map.addLayer(l.layer);
		
		//prepare new .layer-button to place in our layerswitcher
		var obj = $(OSMCZ.layers.getLayerButtonsHtml([l])); 
		obj.appendTo('#js-layerSwitcher'); //todo:  l.baseLayer ? '#js-layerSwitcher' : '#js-overlaySwitcher')
		obj.addClass('switcher');
		
		// show / hide the OL layer
		obj.click(function(e){
				if(e.target != this && e.target.tagName != 'SMALL') return true; //disable this event on #layer-info
	
				//just dragged
				if ($(this).hasClass('noclick')) {
					$(this).removeClass('noclick');
					return true;
				}
				
				var l = OSMCZ.maps[ $(this).attr('data-id') ];
				l.layer.setVisibility(! l.layer.getVisibility());
			})
		
		//tooltip system
		obj.mouseleave(OSMCZ.layers.hideTooltip)
		obj.find('small').mouseenter(OSMCZ.layers.showTooltip);
	
		//drag&drop z-index sorting
		$('#js-layerSwitcher').sortable({
			appendTo: '#js-layerSwitcher',
			//axis: 'y',
			//containment: 'parent',
			//cursorAt: 'top',
			//handle: 'small',
			//revert: true,
			stop: function(event, ui){
				$('#js-layerSwitcher .layer-button').each(function(i, obj1){  //todo,fixme,hack: staré .layer-buttony jsou display:none
					var l = OSMCZ.maps[ $(obj1).attr('data-id') ];
					if(l)
						l.layer.setZIndex(i);
				});
			},
			start: function(event, ui) {
				$(ui.item).addClass('noclick');
			},
		})//todo:.disableSelection()
		
		l.layer.osmcz_layerbutton = obj;
	},
	
	
	
	//get html for an array of layers (porition of OSMCZ.maps fileds)
	getLayerButtonsHtml: function (layerArray){
		var htmlTemplate = '<div class="layer-button" data-id="${id}" style="${iconStyle}"><small>${name}</small></div>';
		var html = '';
		for(var i in layerArray)
			html += OpenLayers.String.format(htmlTemplate, layerArray[i]);
		return html;
	},
	
	
	
	//tooltip systém
	hideTooltip: function (){
		$('#layer-info').hide()
	},
	
	showTooltip: function (){
		var objButton = this.parentNode;
		var l = OSMCZ.maps[ $(objButton).attr('data-id') ];
		
		//add html for settings-form, when tooltip is in layerswitcher
		var settings = '';
		if($(objButton).hasClass('switcher')){
			settings = '<p class="topline"><input type="button" value="odebrat" class="fright">'
							 + 'Výplň: <input type="text" size="2" value="'+(l.layer.opacity*100)+'" title="up/down keys">%'
			
			if(l.wms_layers){
				settings += '<p>WMS: <select multiple="multiple" size="4" style="width:100%"></select>';
			}
		}
		
		var obj = $('#layer-info');
		obj.appendTo(objButton) //move
			.css({
				top: $(objButton).position().top,
				left: $(objButton).position().left-211, //width of #layer-info
				})
			.html(l.html + settings)
			.show()
			.mouseleave(OSMCZ.layers.hideTooltip)
			
			.find('input[type=text]') //opacity field controled by keys
				.keyup(function(e){
					var opa = parseInt($(this).val());
					if(opa > 0 && e.keyCode == 40 ){ //left 37, down 40
						opa = Math.max(opa-10, 0);
						$(this).val(opa);
					}
					else if(opa < 100 && e.keyCode == 38){ //up 38, right 39
						opa = Math.min(opa+10, 100);
						$(this).val(opa);
					}
					
					if(opa == 0) //hide
						l.layer.setVisibility(false);
					else
						l.layer.setVisibility(true);
					
					l.layer.setOpacity(opa/100);
				});
				
			obj.find('input[type=button]') //remove button
				.click(function(){
					OSMCZ.map.removeLayer(l.layer);
					l.layer = null;
					$(objButton)
						.attr('data-id', '-1')
						.mouseleave()
						.hide(); //todo,fixme,hack: why doesnt remove() work here??
				});
			
			//special wms configuration form handling
			if(l.wms_layers){
				var select = obj.find('select');
				for(var x in l.wms_layers){
					var a = $('<option/>').html(x).attr('title',l.wms_layers[x]);
					select.append(a);
				}
				select.change(function(){
					l.layer.params.LAYERS = $(this).val().join(',');
				});
				select.val(l.layer.params.LAYERS.split(','));
			}
	}


}
