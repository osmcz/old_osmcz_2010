<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<title>OpenStreetMap.cz</title>
<link rel="stylesheet" href="etc/style.css" type="text/css">

<link rel="stylesheet" href="lib/ol/theme/default/google.css" type="text/css">
<link href="lib/ui-lightness/jquery-ui-1.8.5.custom.css" rel="stylesheet" type="text/css"/>
<script src="lib/jquery-1.4.3.js" type="text/javascript"></script>
<script src="lib/jquery-ui-1.8.5.custom.min.js" type="text/javascript"></script>
<script src="lib/ol/OpenLayers.js" type="text/javascript"></script>

<script src="http://maps.google.com/maps/api/js?sensor=false" type="text/javascript"></script>
<!-- <script src="http://maps.google.com/maps?file=api&v=2&key=ABQIAAAA2PtytP9hkiB0DDbTQJv4chTQA76sLBiu7zxCI7yO2EOT1lduahThr0zc3t5lp7Ma5RXWtN6SZfXDjw" type="text/javascript"></script>
 -->

<?php
	$arr = array('script/OSMCZ.js', 'script/Panels.js');
	foreach(glob('script/*.js') as $f) if(!in_array($f, $arr)) $arr[] = $f;
	foreach($arr as $f) echo "<script src='$f' type='text/javascript'></script>\n";
?>

</head>
<body>

<div id="header">
	<div id="logo">
		<h1><a href="#" class='osmczlink'>OpenStreetMap.cz</a></h1>
		<p>non-public beta</p>
	</div>

	<div id="userpanel">
		<p><a href="">login with OpenStreetMap.org</a>
	</div>

	<div id="userinput">
		<form action="#" method="get" onsubmit="OSMCZ.changeQuery($('#search-autocomplete').attr('value')); return false;">
		<div><input type="text" name="q" id='search-autocomplete' class="text" onclick="$('#userinput-help').toggle();"><input type="submit" value="Hledej" class="button"></div>
		</form>
		<div id="userinput-help">
			souřadnice v libovolném formátu<br>
			url s gpx/kml/georss<br>
			node:1235677 way:61571,762317 relation:1656,122<br>
			nominatim název<br>
			bounding box
		</div>
		<p><a href="#routingform" class="osmczlink">plánování trasy</a>
		 | <a href="#upload" class="osmczlink">geo upload</a></p>
	</div>	
</div> <!-- /header -->



<div id="maintop">
	<div class="leftpanel">
		<a href="#no" id='tabchooser' onclick='OSMCZ.tabchooser();return false'>Vítejte</a>
	</div>
	<div class="rightpanel">
		<a href="#no" id="rightpanel_toggle" title="zmenšit/zvětšit panel map">&laquo; mapa</a>
	</div>
	<div class="middlepanel">
		<a href="#no" id="leftpanel_toggle" title="vysunout/zasunout levý panel">&laquo;</a>
		<div class="aright">
			<span class='likea' onclick='if(navigator.geolocation)navigator.geolocation.getCurrentPosition(function(position){OSMCZ.map.setCenter(fromLL(new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude)), 16);});'>locate me</span> &#149;
			<a href="#osmdata:14.298938,50.093561,14.301845,50.096507" class="osmczlink">osmdata</a> &#149;
			<a href="#print" class="osmczlink">tisk</a> &#149;
			<a href="#export" class="osmczlink">export</a> &#149; 
			<a href="#permalink" class="osmczlink">permalink</a> &#149;
			<a href="#" onclick='a=document.getElementById("map");if(a.style.backgroundColor=="rgb(0, 0, 0)")a.style.backgroundColor="#ffffff";else a.style.backgroundColor="#000000";return false'>barva</a>
		</div>
	</div>	
</div><!-- /maintop -->

<div id="maincontent">
	<div class="leftpanel" id='js-panelsContainer'>
		
		<div id='home' class='panel'>
			<p>Tento mapový portál se zaměřuje především na různé využítí map z <a href=''>OpenStreetMap</a>. Z projektu, který nabízí zdarma a bez omezení mapová data podobně jako Wikipedia encyklopedii.
			<ul>
			 <li><a href="">poradna</a></li>
			 <li><a href="">využití dat</a></li>
			 <li><a href="">jak přispět</a></li>
			</ul>
			
<!-- 
<p>&lt;Routing> &lt;OsmData> 
	&lt;Coords>
&lt;Address>
&lt;BBox>
&lt;MapUrl> 
<p>RoutingForm Summary Upload WebPage
<p>ExportMap MapUrl OsmData Permalink Print Home

			-->	
			
			<div class="footer">
			(c) česká komunita OpenStreetMap 2010<br>hosting walley, <a href="#feedback" class="osmczlink">feedback</a>
			</div>
		</div>
		
		<div id='routingform' class='hidden panel'>
			<form action="?" onsubmit="return OSMCZ.thisPanel(this).submitted()">
			<input type='hidden' name='form' value='routingform'> 
			<table>
			<tr><td>Odkud: <td><input type='text' name='from' class='from'>
			<tr><td>Kam: <td><input type='text' name='to' class='to'>
			</table>
			<p><input type='submit' value='Najít'>
			</form>
		</div>

		<div id='upload' class='hidden panel'>
			<form action="upload.php" method="post" enctype="multipart/form-data" onsubmit="return OSMCZ.thisPanel(this).submitted()">
			<p>Soubor z počítače:<br> <input type='file' name='file' class='file' id='upload-file'><br>
			<small>Soubory: GPX, KML, OSM (max 2MB)</small>
			<br><input type='submit' value='Nahrát'> <img src="etc/ajax-loader.gif" alt='loading...' id='upload-loading' style='display:none;vertical-align:text-bottom;'>
			</form>
			
			<p class='small'>Soubor obsahující body, linie a plochy bude zobrazen na mapě. Též lze zobrazit výškový profil, časy a délky.
			<p style='margin-top:3em'><b>Tip:</b> Pokud je soubor na webu,<br> stačí napsat adresu <small>(http://...)</small> do vyhledávacího pole nahoře  
		</div>
		
		<div id='print' class='hidden panel'>
			aktuální BBox (14.9, 15.2, ...)<br>
			upravit - nakreslit nový (datalink)<br>
			<input type='checkbox'> zamknout A4<br>
			<br>
			- tisknout mapu tak jak je (72dpi)<br>
			- zkusit podsamplovat dlaždice (150dpi)<br>
			- vyexportovat pouze mapovou část - slepit dlaždice (onserver) jako jeden obrázek<br>
			- vyexportovat pouze mapovou část - PDFko (trvá dlouho)<br>
			- časem nechat mapnika slepit i s jinou vrstvou (routing,lines,points)??
		</div>

		<div id='export' class='hidden panel'>
			aktuální BBox (14.9, 15.2, ...)<br>
			upravit - nakreslit nový (datalink)<br>
			<br>
			- vyexportovat pouze mapovou část - slepit dlaždice (onserver) jako jeden obrázek<br>
			- vyexportovat pouze mapovou část - PDFko (trvá dlouho)<br>
			- časem nechat mapnika slepit i s jinou vrstvou (routing,lines,points)??
		</div>		
		
		<div id='permalink' class='hidden panel'>
			Odkaz je možno kopírovat přímo z adresní řádky, reflektuje pouze aktuálně zobrazený panel.
			<br><br>
			Odkaz na celý aktuální stav:<br>
			<input value="">(shorten)(copy)<br>
			<br>
			
			Odkaz na aktuální stav i se skrytými panely:<br>
			<input value="">(shorten)(copy)<br>
			<br>
		</div>	
		
		
	</div><!-- /#js-panelsContainer  /.leftpanel -->
	
	<div class="rightpanel">		
		<div id='allmenu'><div id='allmenu-types'></div>&nbsp;&laquo; ALL</div>
		<div id='js-layerSwitcher'></div>
		<div id='js-overlaySwitcher' class='topline'></div>
	</div><!-- /rightpanel -->
	
	<div id="layer-info">
		<big>OpenTrackMap.no-ip.org</big>
		<p><img src='etc/map/cr.png'> občas - 23.1.
		<p class='attr'>cc-by-sa <a href='http://www.openstreetmap.org/'>OSM</a>
		<p><a href='http://wiki.osm.org/wiki/OpenTrackMap'>info</a> ~ <a href='http://opentrackmap.no-ip.org/'>www</a> ~ <a href='http://blackhex.no-ip.org/'>Radek Bartoň</a>
	</div>

<script type="text/javascript">
<!--

layerInfo = {
<?php

	mysql_connect("localhost", "root", "") or die("Could not connect to db");
	mysql_select_db("test") or die("Could not select db");
	mysql_query("SET CHARACTER SET 'utf8'");
	$result = mysql_query("select * from osmcz_layers order by `order`");
	$out = "";
	while($r = mysql_fetch_assoc($result)){
		//url expanding
		$url = "'$r[url]'";
		if(preg_match('~\[([^\]]+)\]~', $r['url'], $matches)){
			$arr = array();
			foreach(explode(',', $matches[1]) as $s)
				$arr[] = preg_replace('~\[([^\]]+)\]~', $s, $r['url']);
			$url = "['".implode("','", $arr)."']";
		}
		
		$out .= "$r[id]: {
			id: '$r[id]',
			name: '$r[name]',
			url: $url,
			tags: '$r[tags]',
			baseLayer: $r[baseLayer],
			zoom: {min: $r[zoomMin], max: $r[zoomMax]},
			opacity: $r[opacity],
			html: \"" . str_replace(array('"',"\n","\r"),array('\\"',"\\n",""), $r['html']) . '"';
		if($r['wms_params'])
			$out .= ",\nwms_params: $r[wms_params]";
		if($r['wms_layers'])
			$out .= ",\nwms_layers: $r[wms_layers]";
		$out .= "\n},\n";
	}
	echo substr($out,0,-2);
	
?>
};

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

*/

// compute all tags
var tagIndex = {
	all: [],
	general: [],
	hike: [],
	bike: [],
	ski: [],
	ortofoto: [],
	other: [],
	google: [],
	_default: []
};
for(var i in layerInfo){
	var tags = layerInfo[i].tags.split(',');
	for(var t in tags){
		if(!tagIndex[tags[t]]) tagIndex[tags[t]] = [];
		tagIndex[tags[t]].push(layerInfo[i]);
	}
	tagIndex.all.push(layerInfo[i]);
}



// inject types in #allmenu-types (All, General, ...)
function ucfirst(s){return s[0].toUpperCase()+s.substr(1)}
var html = '';
for(tag in tagIndex)
	if(tag[0] != '_')
		html += '<div class="type" data-tag="'+tag+'">'+ucfirst(tag)+' <small>('+tagIndex[tag].length+')</small></div>';

$('#allmenu-types').append(html)


//inject .layer-buttons in each .type
$('#allmenu-types')
	.find('.type')
	.each(function(i){
		var tag = $(this).attr('data-tag');
		var layers = tagIndex[tag];
		
		var cols = Math.round(Math.sqrt(layers.length));
		var rows = Math.ceil(layers.length / cols);
 
		var style = (!i ? 'border-top:0;' : '')	+ 'width:'+(cols*54)+'px; height:'+(rows*54)+'px';
		$(this).prepend("<div class='submenu' style='"+style+"'>"+getLayerButtons(layers)+"</div>");
	});


//fill default layer switcher
$(function(){
	OSMCZ.map.events.on({
		"changelayer": function(e){
			if(e.property == 'visibility')
				e.layer.osmcz_layerbutton
					.toggleClass('layer-disabled', !e.layer.getVisibility())
					.toggleClass('layer-out-of-range', !e.layer.inRange);
		}
	});

	//for(var i in tagIndex['_default']) addLayer(tagIndex['_default'][i]);
	//addLayer(layerInfo['mpnk']);
	addLayer(layerInfo['uhul']);
	//addLayer(layerInfo['otmt']);
	
});


function addLayer(l){
	if(l.layer){
		alert('Layer already added');
		return false;	
	}
	
	var options = {
		isBaseLayer: false, //careful, we handle l.baseLayer separately 
		opacity: l.opacity,
		transitionEffect: 'resize',
  	maxResolution: 156543.0339/Math.pow(2,l.zoom.min),
		numZoomLevels: l.zoom.max-l.zoom.min
	}; 
	
	if(l.wms_params)  //přidej WMSko nebo XYZ vrstvu
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
	
	
	var obj = $(getLayerButtons([l])) //.layer-button in switcher
	obj.appendTo('#js-layerSwitcher')//todo    l.baseLayer ? '#js-layerSwitcher' : '#js-overlaySwitcher')
	obj.addClass('switcher')
	
	// show / hide the layer
	obj.click(function(e){
			if(e.target != this && e.target.tagName != 'SMALL') return true; //disable this event on #layer-info

			//just dragged
			if ($(this).hasClass('noclick')) {
				$(this).removeClass('noclick');
				return true;
			}
			
			var l = layerInfo[ $(this).attr('data-id') ];
			l.layer.setVisibility(! l.layer.getVisibility());
		})
	
	//tooltip systém	
	obj.mouseleave(hideTooltip)
	obj.find('small').mouseenter(showTooltip);

	
	$('#js-layerSwitcher').sortable({
		appendTo: '#js-layerSwitcher',
		//axis: 'y',
		//containment: 'parent',
		//cursorAt: 'top',
		//handle: 'small',
		//revert: true,
		stop: function(event, ui){
			$('#js-layerSwitcher .layer-button').each(function(i, obj){  //fixme,hack: staré .layer-buttony jsou display:none
				var l = layerInfo[ $(obj).attr('data-id') ];
				if(l)
					l.layer.setZIndex(i);
			});
		},
		start: function(event, ui) {
			
			$(ui.item).addClass('noclick');
		},
	})  //.disableSelection()
	
	l.layer.osmcz_layerbutton = obj;
}




function getLayerButtons(layerArray){
	var htmlTemplate = '<div class="layer-button" data-id="${id}" style="background-image:url(etc/map/${id}.png);"><small>${name}</small></div>';
	var html = '';
	for(var i in layerArray){
		html += OpenLayers.String.format(htmlTemplate, layerArray[i]);
	}
	return html;
}



//tooltip systém
function hideTooltip(){
	$('#layer-info').hide()
}
function showTooltip(){
	var objButton = this.parentNode;
	var l = layerInfo[ $(objButton).attr('data-id') ];
	
	//add settings form, when in layerswitcher
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
		.mouseleave(hideTooltip)
		
		.find('input[type=text]')
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
		obj.find('input[type=button]')
			.click(function(){
				OSMCZ.map.removeLayer(l.layer);
				l.layer = null;
				$(objButton)
					.attr('data-id', '-1')
					.mouseleave()
					.hide(); //todo: why doesnt remove() work here??
			});
		
		
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




//handle hover and click in submenu
$('.layer-button')
	.click(function(e){
		if(e.target != this && e.target.tagName != 'SMALL') return true; //disable this event on #layer-info
		var l = layerInfo[ $(this).attr('data-id') ];
		addLayer(l);
	})
	.mouseleave(hideTooltip)
	.find('small').mouseenter(showTooltip);



//-->
</script>
	
	
	<div class="middlepanel"><div id="map"><noscript>CHYBA: Máte vypnutý JavaScript a bez něj to bohužel nepůjde :-)</noscript></div></div>
		
</div><!-- /maincontent -->

</body>
</html>
