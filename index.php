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
			<!-- <p>Tento mapový portál se zaměřuje především na různé využítí map z <a href=''>OpenStreetMap</a>. Z projektu, který nabízí zdarma a bez omezení mapová data podobně jako Wikipedia encyklopedii.
			<ul>
			 <li><a href="">poradna</a></li>
			 <li><a href="">využití dat</a></li>
			 <li><a href="">jak přispět</a></li>
			</ul>
			-->
	<ol>
	<li>Nápad pravé vyběrátko map + překryvné vrstvy. Hlavně logiku a rozvržení.
	<li>HASHCHANGE: zlobí tabchooser, nenačítat dvakrát, některé nemají být &lt;a&gt;
	<li>design panelů
	</ol>
	<ul>
	<li>&lt;Routing> &lt;OsmData> 
	&lt;Coords>
&lt;Address>
&lt;BBox>
&lt;MapUrl> 
	<li>zelená ikonka s trojuhelnikem a červená se čtverečkem
	</ul>	
* Mapnik<br>
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
			<form action="#">
			<p>Soubor z počítače:<br> <input type='file' class='file'><br>
			<small>Soubory: GPX, KML, OSM (max 2MB)</small>
			<br><input type='submit' value='Nahrát'>
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
		
		
	</div><!-- /js-panelsContainer -->
	
	<div class="rightpanel">
	
	<div class="maplayer">
	<img src="etc/osm_mag_30.png" width="16" height="16"><br>
	<small>Mapnik</small>
	</div>

	<div class="mapsource">
	<img src="etc/osm_mag_30.png" width="40" height="40"><br>
	<small>Osmarender</small>
	</div>

	</div>
	
	<div class="middlepanel"><div id="map"></div></div>
		
</div><!-- /maincontent -->

</body>
</html>
