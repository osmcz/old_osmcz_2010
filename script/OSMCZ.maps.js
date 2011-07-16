OSMCZ.maps = {
mpnk: {
			id: 'mpnk',
			name: 'Mapnik',
			url: 'http://[a,b,c].tile.openstreetmap.org/${z}/${x}/${y}.png',
			tags: 'general,_default',
			baseLayer: 1,
			zoom: {min: 0, max: 20},
			opacity: 1,
			html: "<big>Main Mapnik</big>\n<p><img src='etc/map/world.png'> 10 minut\n<p class='attr'>cc-by-sa <a href='http://www.openstreetmap.org/'>OSM</a>\n<p><a href='http://wiki.osm.org/wiki/Mapnik'>wiki</a> ~ <a href='http://www.mapnik.org/'>mapnik.org</a>"
},
osma: {
			id: 'osma',
			name: 'T@H',
			url: 'http://[a,b,c].tah.openstreetmap.org/Tiles/tile/${z}/${x}/${y}.png',
			tags: 'general',
			baseLayer: 1,
			zoom: {min: 0, max: 20},
			opacity: 1,
			html: "<big>Osmarender</big>\n<p><img src='etc/map/world.png'> 10 minut\n<p class='attr'>cc-by-sa <a href='http://www.openstreetmap.org/'>OSM</a>\n<p><a href='http://wiki.osm.org/wiki/Osmarender'>wiki</a> ~ <a href='http://www.informationfreeway.org/'>Tiles @ Home</a>"
},
cycle: {
			id: 'cycle',
			name: 'Cycle',
			url: 'http://[a,b,c].tile.opencyclemap.org/cycle/${z}/${x}/${y}.png',
			tags: 'bike,_default',
			baseLayer: 1,
			zoom: {min: 0, max: 20},
			opacity: 1,
			html: "<big>OpenCycleMap</big>\n<p><img src='etc/map/world.png'> 1 týden\n<p class='attr'>cc-by-sa <a href='http://www.openstreetmap.org/'>OSM</a>\n<p><a href='http://wiki.osm.org/wiki/OpenCycleMap'>info</a> ~ <a href='http://opencyclemap.org/'>opencyclemap.org</a>"
},
otmb: {
			id: 'otmb',
			name: 'OTM',
			url: 'http://opentrackmap.cz/static/${z}/${x}/${y}.png',
			tags: 'hike,bike',
			baseLayer: 0,
			zoom: {min: 0, max: 18},
			opacity: 0,
			html: "<big>OpenTrackMap baked</big>\n<p><img src='etc/map/cr.png'> občas - 23.1.\n<p class='attr'>cc-by-sa <a href='http://www.openstreetmap.org/'>OSM</a>\n<p><a href='http://wiki.osm.org/wiki/OpenTrackMap'>info</a> ~ <a href='http://opentrackmap.cz/'>www</a> ~ <a href='http://blackhex.no-ip.org/'>Radek Bartoň</a>"
},
otmt: {
			id: 'otmt',
			name: 'OTMt',
			url: 'http://opentrackmap.cz/tracks/${z}/${x}/${y}.png',
			tags: 'hike,bike',
			baseLayer: 0,
			zoom: {min: 0, max: 18},
			opacity: 0.8,
			html: "<big>OpenTrackMap tracks</big>\n<p><img src='etc/map/cr.png'> občas - 23.1.\n<p class='attr'>cc-by-sa <a href='http://www.openstreetmap.org/'>OSM</a>\n<p><a href='http://wiki.osm.org/wiki/OpenTrackMap'>info</a> ~ <a href='http://opentrackmap.cz/'>www</a> ~ <a href='http://blackhex.no-ip.org/'>Radek Bartoň</a>"
},
otmd: {
			id: 'otmd',
			name: 'OTMd',
			url: 'http://opentrackmap.cz/tracks/${z}/${x}/${y}.png',
			tags: 'hike',
			baseLayer: 0,
			zoom: {min: 0, max: 18},
			opacity: 0.8,
			html: "<big>OpenTrackMap tracks-debug</big>\n<p><img src='etc/map/cr.png'> občas - 23.1.\n<p class='attr'>cc-by-sa <a href='http://www.openstreetmap.org/'>OSM</a>\n<p><a href='http://wiki.osm.org/wiki/OpenTrackMap'>info</a> ~ <a href='http://opentrackmap.cz/'>www</a> ~ <a href='http://blackhex.no-ip.org/'>Radek Bartoň</a>"
},
cont: {
			id: 'cont',
			name: 'Vrstevnice',
			url: 'http://opentrackmap.cz/contours/${z}/${x}/${y}.png',
			tags: 'general,hike,bike',
			baseLayer: 0,
			zoom: {min: 0, max: 20},
			opacity: 1,
			html: "<big>Vrstevnice z OTM</big>\n<p><img src='etc/map/cr.png'> občas - 23.1.\n<p class='attr'>pd <a href='http://www.openstreetmap.org/'>SRTM</a>\n<p><a href='http://wiki.osm.org/wiki/OpenTrackMap'>info</a> ~ <a href='http://opentrackmap.cz/'>www</a> ~ <a href='http://blackhex.no-ip.org/'>Radek Bartoň</a>"
},
hill: {
			id: 'hill',
			name: 'Hillshade',
			url: 'http://opentrackmap.cz/hillshade/${z}/${x}/${y}.png',
			tags: 'general,hike,bike',
			baseLayer: 0,
			zoom: {min: 0, max: 20},
			opacity: 0.6,
			html: "<big>Hillshade z OTM</big>\n<p class='attr'>pd <a href='http://'>SRTM</a>\n<p><a href='http://wiki.osm.org/wiki/OpenTrackMap'>info</a> ~ <a href='http://opentrackmap.cz/'>www</a> ~ <a href='http://blackhex.no-ip.org/'>Radek Bartoň</a>"
},
lonvia: {
			id: 'lonvia',
			name: 'Lonvia',
			url: 'http://osm.lonvia.de/hiking/${z}/${x}/${y}.png',
			tags: 'hike',
			baseLayer: 0,
			zoom: {min: 0, max: 20},
			opacity: 1,
			html: "<big>Lonvia's Hiking Map</big>\n<p>Overlay\n<p>http://osm.lonvia.de/world_hiking.html\n<p>http://osm.lonvia.de/hiking/about.html"
},
wrkb: {
			id: 'wrkb',
			name: 'WRKb',
			url: 'http://[base,base2].wanderreitkarte.de/base/${z}/${x}/${y}.png',
			tags: 'hike',
			baseLayer: 0,
			zoom: {min: 0, max: 20},
			opacity: 0.6,
			html: "<big>wanderreitkarte.de podklad</big>\n<p>http://wanderreitkarte.de/hills/${z}/${x}/${y}.png\n<p>http://www.wanderreitkarte.de/hills/${z}/${x}/${y}.png\n"
},
wrk: {
			id: 'wrk',
			name: 'WRK',
			url: 'http://[topo,topo2].wanderreitkarte.de/topo/${z}/${x}/${y}.png',
			tags: 'hike,ortofoto',
			baseLayer: 0,
			zoom: {min: 0, max: 20},
			opacity: 1,
			html: "<big>WanderReitKarte.de</big>\n<p>Poloprůhledný překryv pro turistiku a jezdectví, střední evropa.\n<p class='attr'>cc-by-sa <a href='http://www.openstreetmap.org/'>OSM</a>\n<p><a href='http://www.wanderreitkarte.de/'>www</a> ~ <a href='http://wiki.openstreetmap.org/wiki/DE:OSMC_Reitkarte'>wiki</a>"
},
piste: {
			id: 'piste',
			name: 'Piste',
			url: 'http://tiles.openpistemap.org/nocontours/${z}/${x}/${y}.png',
			tags: 'ski',
			baseLayer: 1,
			zoom: {min: 0, max: 20},
			opacity: 1,
			html: "<big>OpenPisteMap</big>"
},
pcont: {
			id: 'pcont',
			name: 'Contours',
			url: 'http://tiles.openpistemap.org/contours-only/${z}/${x}/${y}.png',
			tags: 'ski',
			baseLayer: 0,
			zoom: {min: 0, max: 20},
			opacity: 1,
			html: "<big>OpenPisteMap Contours</big>"
},
phill: {
			id: 'phill',
			name: 'Hillshade',
			url: 'http://tiles2.openpistemap.org/landshaded/${z}/${x}/${y}.png',
			tags: 'ski',
			baseLayer: 0,
			zoom: {min: 0, max: 20},
			opacity: 1,
			html: "<big>OpenPisteMap Hillshade</big>"
},
uhul: {
			id: 'uhul',
			name: 'ÚHUL',
			url: 'http://www.localhost/osmcz/uhul_tile.php/${z}/${x}/${y}.png',
			tags: 'ortofoto,_default',
			baseLayer: 1,
			zoom: {min: 13, max: 18},
			opacity: 1,
			html: "<big>ÚHUL Ortofoto</big>\n<p><img src='etc/map/cr.png'> bez aktualizace\n<p class='attr'>&copy; <a href='http://www.uhul.cz/'>ÚHUL</a> 2001\n<p><a href='http://wiki.osm.org/wiki/WikiProject_Czechia/freemap'>info</a> ~ <a href='http://uhul.cz/'>www</a>"
},
cuzk: {
			id: 'cuzk',
			name: 'ČÚZK',
			url: 'http://wms.cuzk.cz/wms.asp',
			tags: 'other',
			baseLayer: 0,
			zoom: {min: 0, max: 20},
			opacity: 0.6,
			html: "<big>ČÚZK KM</big>",
			wms_params: {
				layers: 'RST_KN,RST_KMD,RST_PK,obrazy_parcel,hranice_parcel,dalsi_p_mapy,omp,prehledka_kat_uz,prehledka_kraju-linie',
				transparent: true
			},
			wms_layers: {
				RST_KN_I: 'rastrové mapy KN inverzní (KM-D)',
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
			}
},
norc: {
			id: 'norc',
			name: 'StreetView',
			url: 'http://[0,1,2].gis.infrastructure.cz.norc-static.eu/mtp/${z}/${x}/${y}.png',
			tags: 'other',
			baseLayer: 0,
			zoom: {min: 0, max: 17},
			opacity: 1,
			html: "\nfunction (c, d) {\n        if (d > 17) {\n            var b = strlpad(c.x, 7);\n            var a = strlpad(c.y, 7);\n            return [\"http://\", ((c.x + c.y) % 3), resDomainName, \"/mtp/\", d, \"/\", b.substr(0, 4), \"/\", b.substr(4), \"/\", a.substr(0, 4), \"/\", a.substr(4), \".png\"].join(\"\")\n        } else {\n            return [\"http://\", ((c.x + c.y) % 3), resDomainName, \"/mtp/\", d, \"/\", c.x, \"/\", c.y, \".png\"].join(\"\")\n        }\n    };"
},
wpde: {
			id: 'wpde',
			name: 'hikebike',
			url: 'http://toolserver.org/tiles/hikebike/${z}/${x}/${y}.png',
			tags: 'hike',
			baseLayer: 0,
			zoom: {min: 0, max: 20},
			opacity: 0,
			html: "https://wiki.toolserver.org/view/OpenStreetMap\n<br>http://toolserver.org/~cmarqu/\n<br>\n<br>http://toolserver.org/~cmarqu/hill/\n<br>http://toolserver.org/~cmarqu/opentiles.com/cmarqu/tiles_contours_8/\n"
},
light: {
			id: 'light',
			name: 'Light=yes',
			url: 'http://toolserver.org/tiles/lighting/${z}/${x}/${y}.png',
			tags: 'other',
			baseLayer: 0,
			zoom: {min: 0, max: 20},
			opacity: 0.5,
			html: ""
},
haiti: {
			id: 'haiti',
			name: 'Haiti Live',
			url: 'http://live.openstreetmap.nl/haiti/${z}/${x}/${y}.png',
			tags: 'other',
			baseLayer: 0,
			zoom: {min: 0, max: 20},
			opacity: 1,
			html: ""
},
gc: {
			id: 'gc',
			name: 'Kešky',
			url: 'http://www.geocaching.com/map/beta/map.tile?x=${x}&y=${y}&z=${z}',
			tags: 'other',
			baseLayer: 0,
			zoom: {min: 0, max: 18},
			opacity: 1,
			html: "<big>Geocaching.com</big>"
},
google: {
			id: 'google',
			name: 'Google',
			url: '',
			tags: 'google',
			baseLayer: 1,
			zoom: {min: 0, max: 20},
			opacity: 1,
			html: "Experimental"
},
gsw: {
			id: 'gsw',
			name: 'StreetV',
			url: 'http://cbk[0,1,2].google.com/cbk?output=overlay&zoom=${z}&x=${x}&y=${y}&cb_client=maps_sv',
			tags: 'google,other',
			baseLayer: 0,
			zoom: {min: 0, max: 20},
			opacity: 1,
			html: "experimental Google Street View overlay"
},
mqa: {
			id: 'mqa',
			name: 'MapQuest Aerial',
			url: 'http://oatile1.mqcdn.com/naip/${z}/${x}/${y}.png',
			tags: 'ortofoto',
			baseLayer: 0,
			zoom: {min: 0, max: 12},
			opacity: 1,
			html: "It currently offers global imagery at a 30-meter resolution and up to 1-meter for the United States."
},
mtbcz: {
			id: 'mtbcz',
			name: 'MTB Mapa',
			url: 'http://cozpserver3.jinonice.cuni.cz/mtbmap/mtbmap_tiles/${z}/${x}/${y}.png',
			tags: 'cycle',
			baseLayer: 0,
			zoom: {min: 0, max: 20},
			opacity: 1,
			html: ".."
}

}
