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
		<div><input type="text" name="q" id='search-autocomplete' class="text" onfocus="$('#userinput-help').toggle();" onunfocus="$('#userinput-help').toggle();"><input type="submit" value="Hledej" class="button"></div>
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

			<p>Co umí tahle stránka? souřadnice, adresy, routing, upload GPX+KML, bbox, OSM data, tisk, export
			
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
	
	<div class="middlepanel"><div id="map"><noscript>CHYBA: Máte vypnutý JavaScript a bez něj to bohužel nepůjde :-)</noscript></div></div>
		
</div><!-- /maincontent -->

</body>
</html>
