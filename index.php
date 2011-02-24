<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<title>OpenStreetMap.cz</title>
<link rel="stylesheet" href="etc/style.css" type="text/css">

<link href="lib/ui-lightness/jquery-ui-1.8.5.custom.css" rel="stylesheet" type="text/css"/>
<script src="lib/jquery-1.4.3.js" type="text/javascript"></script>
<script src="lib/jquery-ui-1.8.5.custom.min.js" type="text/javascript"></script>
<script src="lib/ol/OpenLayers.js" type="text/javascript"></script>

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
		<div><input type="text" name="q" id='search-autocomplete' class="text" onclick="$('#xxuserinput-help').toggle();"><input type="submit" value="Hledej" class="button"></div>
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
			<a href="#">překryvné vrstvy</a>
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

<p>* Mapnik<br>
* Osmarender<br>
* Cyclo<br>
* MTB<br>
* OTM<br>
* Piste<br>
* OPNV<br>
* Kybl3D<br>
* tiles (MapSurfer, CM, MQ)<br>
* GMap/Sat<br>
* Cenia,Uhul,KM<br>


	
	
			
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
	</div><!-- /rightpanel -->
	
	<div id="layer-info">
		<big>OpenTrackMap.no-ip.org</big>
		<p><img src='etc/map/cr.png'> občas - 23.1.
		<p class='attr'>cc-by-sa <a href='http://www.openstreetmap.org/'>OSM</a>
		<p><a href='http://wiki.osm.org/wiki/OpenTrackMap'>info</a> ~ <a href='http://opentrackmap.no-ip.org/'>www</a> ~ <a href='http://blackhex.no-ip.org/'>Radek Bartoň</a>
	</div>

<script type="text/javascript">
<!--

layerInfo = [
{
	name_short: 'Mapnik',
	name_slug: 'mpnk',
	tags: 'general,_default',
	html: "<big>Main Mapnik</big>"
		+ "<p><img src='etc/map/world.png'> 10 minut"
		+ "<p class='attr'>cc-by-sa <a href='http://www.openstreetmap.org/'>OSM</a>"
		+ "<p><a href='http://wiki.osm.org/wiki/Mapnik'>wiki</a> ~ <a href='http://www.mapnik.org/'>mapnik.org</a>",
	isBaseLayer: true,
	url: 'http://c.tile.openstreetmap.org/${z}/${x}/${y}.png'
},
{
	name_short: 'T@H',
	name_slug: 'osma',
	tags: 'general',
	html: "<big>Osmarender</big>"
		+ "<p><img src='etc/map/world.png'> 10 minut"
		+ "<p class='attr'>cc-by-sa <a href='http://www.openstreetmap.org/'>OSM</a>"
		+ "<p><a href='http://wiki.osm.org/wiki/Osmarender'>wiki</a> ~ <a href='http://www.informationfreeway.org/'>Tiles @ Home</a>",
	isBaseLayer: true,
	url: 'http://c.tah.openstreetmap.org/Tiles/tile/${z}/${x}/${y}.png'
},
{
	name_short: 'Cycle',
	name_slug: 'cycle',
	tags: 'bike,_default',
	html: "<big>OpenCycleMap</big>"
		+ "<p><img src='etc/map/world.png'> 1 týden"
		+ "<p class='attr'>cc-by-sa <a href='http://www.openstreetmap.org/'>OSM</a>"
		+ "<p><a href='http://wiki.osm.org/wiki/OpenCycleMap'>info</a> ~ <a href='http://opencyclemap.org/'>opencyclemap.org</a>",
	isBaseLayer: true,
	url: 'http://c.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png'	
},
{
	name_short: 'ÚHUL',
	name_slug: 'uhul',
	tags: 'ortofoto,_default',
	html: "<big>ÚHUL Ortofoto</big>"
		+ "<p><img src='etc/map/cr.png'> bez aktualizace"
		+ "<p class='attr'>&copy; <a href='http://www.uhul.cz/'>ÚHUL</a> 2001"
		+ "<p><a href='http://wiki.osm.org/wiki/WikiProject_Czechia/freemap'>info</a> ~ <a href='http://opentrackmap.no-ip.org/'>www</a>",
	isBaseLayer: true,
	url: 'http://www.localhost/osmcz/uhul_tile.php/${z}/${x}/${y}.png'
},
{
	name_short: 'OTMt',
	name_slug: 'otmt',
	tags: 'hike,bike',
	html: "<big>OpenTrackMap tracks</big>"
		+ "<p><img src='etc/map/cr.png'> občas - 23.1."
		+ "<p class='attr'>cc-by-sa <a href='http://www.openstreetmap.org/'>OSM</a>"
		+ "<p><a href='http://wiki.osm.org/wiki/OpenTrackMap'>info</a> ~ <a href='http://opentrackmap.no-ip.org/'>www</a> ~ <a href='http://blackhex.no-ip.org/'>Radek Bartoň</a>",
	isBaseLayer: false,
	url: 'http://opentrackmap.no-ip.org/tracks/${z}/${x}/${y}.png'	
},
{
	name_short: 'OTM',
	name_slug: 'otm',
	tags: 'hike,bike',
	html: "<big>OpenTrackMap baked</big>"
		+ "<p><img src='etc/map/cr.png'> občas - 23.1."
		+ "<p class='attr'>cc-by-sa <a href='http://www.openstreetmap.org/'>OSM</a>"
		+ "<p><a href='http://wiki.osm.org/wiki/OpenTrackMap'>info</a> ~ <a href='http://opentrackmap.no-ip.org/'>www</a> ~ <a href='http://blackhex.no-ip.org/'>Radek Bartoň</a>",
	isBaseLayer: true,
	url: 'http://opentrackmap.no-ip.org/tiles/${z}/${x}/${y}.png'	
},
{
	name_short: 'ČÚZK',
	name_slug: 'cuzk',
	tags: 'other,_default',
	html: "<big>ČÚZK KM</big>",
	isBaseLayer: false,
	url: "http://wms.cuzk.cz/wms.asp",
	wms_params: {layers: 'DEF_BUDOVY,RST_KN,RST_KMD,RST_PK,obrazy_parcel,hranice_parcel,dalsi_p_mapy,omp,prehledka_kat_uz,prehledka_kraju-linie',transparent: true},
	wms_layers: {
		RST_KN: 'rastrové mapy KN (KM-D)',
		RST_KMD: 'vektorová mapa KN (DKM)',
		RST_PK: 'mapy pozemkového katastru',
		dalsi_p_mapy: 'další prvky mapy z DKM',
		hranice_parcel: 'hranice parcel z DKM',
		obrazy_parcel: 'obrazy parcel z DKM',
		omp: 'vektorová složka orientační mapy parcel',
		DEF_BUDOVY: 'definiční body budov (vč. čísel popisných, červeně)',
		prehledka_kat_uz: 'hranice katastrálních území',
		'prehledka_kraju-linie': 'hranice krajů'
	}//http://wms.cuzk.cz/wms.asp?service=WMS&request=GetCapabilities
},
];
for(var i in layerInfo) $.extend(layerInfo[i], {i:i}); //extend its index



/*
#layerswitch hover
-> ukázat nastavení (opacita, isBase, layers)

rozdělit basy a overlaye
-> #js-overlaySwitcher

opravit sortable(), aby po vysortění updatnul zIndex

menu víc přes JS timeout, aby chvilkové vyjetí menu nezavřelo




*/

// compute all tags
var tagIndex = {
	all: layerInfo,
	general: [],
	hike: [],
	bike: [],
	ski: [],
	ortofoto: [],
	other: [],
	google: [],
	_default: []
};
for(i in layerInfo){
	var tags = layerInfo[i].tags.split(',');
	for(t in tags){
		if(!tagIndex[tags[t]]) tagIndex[tags[t]] = [];
		tagIndex[tags[t]].push(layerInfo[i]);
	}
}


// inject types in #allmenu-types (All, Genral, ...)
function ucfirst(s){return s[0].toUpperCase()+s.substr(1)}
var html = '';
for(tag in tagIndex)
	if(tag[0] != '_')
		html += '<div class="type" data-tag="'+tag+'">'+ucfirst(tag)+' <small>('+tagIndex[tag].length+')</small></div>';
$('#allmenu-types').append(html)


//fill default layer switcher
$('#js-layerSwitcher')
	.sortable()
	.disableSelection()
	//.append(getLayerButtons(tagIndex['_default']));

//inject layer-buttons in each .type
$('#allmenu-types')
	.find('.type')
	.each(function(i){
		var tag = $(this).attr('data-tag');
		var layers = (tag=='all') ? layerInfo : tagIndex[tag];
		
		var cols = Math.ceil(layers.length / 5);
		var rows = (cols>1) ? Math.ceil(layers.length / cols) : layers.length; 
		var style = (!i ? 'border-top:0;' : '')	+ 'width:'+(cols*54)+'px; height:'+(rows*54)+'px';
		$(this).prepend("<div class='submenu' style='"+style+"'>"+getLayerButtons(layers)+"</div>");
	});




function addLayer(l){
	if(l.wms_params){ //přidej WMSko
		l.layer = new OpenLayers.Layer.WMS.LL(l.name_short, l.url, l.wms_params, {isBaseLayer: l.isBaseLayer});
	}
	else { //přidej XYZ vrstvu
		l.layer = new OpenLayers.Layer.OSM(l.name_short, l.url, {isBaseLayer: l.isBaseLayer});
	}
	
	OSMCZ.map.addLayer(l.layer);
	if(l.isBaseLayer)
		OSMCZ.map.setBaseLayer(l.layer);
	
	
	$(getLayerButtons([l]))
		.appendTo('#js-layerSwitcher')
		.hover(layerButtonOver, layerButtonOut)
		.click(function(e){
			var l = layerInfo[ $(this).attr('data-i') ];
			if(l.isBaseLayer){
				if(OSMCZ.map.baseLayer == l.layer) //clicked the active layer
					OSMCZ.map.setBaseLayer(OSMCZ.map.layers[0]);
				else
					OSMCZ.map.setBaseLayer(l.layer);
			}
			else{
				if(l.layer.getVisibility()){
					l.layer.setVisibility(false);
					$(this).find('small').css('text-decoration','line-through');
				}
				else {
					l.layer.setVisibility(true);
					$(this).find('small').css('text-decoration','none');
				}
			}
		})
}




function getLayerButtons(layerArray){
	var htmlTemplate = '<div class="layer-button" data-i="${i}" style="background-image:url(etc/map/${name_slug}.png);"><small>${name_short}</small></div>';
	var html = '';
	for(var i in layerArray){
		html += OpenLayers.String.format(htmlTemplate, layerArray[i]);
	}
	return html;
}



//tooltip systém
var tooltipTimeout = null;
var layerButtonOver = function(e){
	var objButton = this;
	tooltipTimeout = window.setTimeout(function(){ //set tooltip timeout
		showTooltip(objButton);
	}, 1000);

	$(this).addClass('active'); //add .active
}
var layerButtonOut = function(e){
	window.clearTimeout(tooltipTimeout); //cancel timeout or hide already shown tooltip
	$('#layer-info').hide();

	$('.layer-button.active').removeClass('active'); //remove .active
}

function showTooltip(objButton){
	var name_short = $(objButton).find('small').html();
	for(i in layerInfo){
		if (name_short == layerInfo[i].name_short){
			
			$('#layer-info')
				.appendTo(objButton)
				.css({
					top: $(objButton).position().top,
					left: $(objButton).position().left-211,
					})
				.show()
				.html(layerInfo[i].html);
			
		}
	}	
}




//zpracvoání hoverů a clicků
$('.layer-button')
	.hover(layerButtonOver, layerButtonOut)
	.click(function(){
		var idx = $(this).attr('data-i');
		addLayer(layerInfo[idx]);
	})
	

/*
javascript:var a=document.getElementsByTagName('a');for(var i in a)if(a[i].href.indexOf('redir=sezn_ucit') > 1){var img=document.createElement('img');img.src=a[i].href.replace('redir=sezn_ucit','do=foto').replace('redir.php','');a[i].appendChild(img);}void(0); 
*/

//-->
</script>
	
	
	<div class="middlepanel"><div id="map"><noscript>CHYBA: Máte vypnutý JavaScript a bez něj to bohužel nepůjde :-)</noscript></div></div>
		
</div><!-- /maincontent -->

</body>
</html>
