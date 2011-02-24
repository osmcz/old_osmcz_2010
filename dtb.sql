-- Adminer 2.3.2 dump
SET NAMES utf8;
SET foreign_key_checks = 0;
SET time_zone = 'SYSTEM';
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `osmcz_layers`;
CREATE TABLE `osmcz_layers` (
  `id` varchar(10) collate utf8_czech_ci NOT NULL default '',
  `name` varchar(50) collate utf8_czech_ci NOT NULL default '',
  `order` float NOT NULL default '200',
  `url` varchar(255) collate utf8_czech_ci NOT NULL,
  `tags` varchar(255) collate utf8_czech_ci NOT NULL,
  `isBaseLayer` tinyint(1) NOT NULL default '0',
  `opacity` float NOT NULL default '1',
  `html` text collate utf8_czech_ci NOT NULL,
  `wms_params` text collate utf8_czech_ci NOT NULL,
  `wms_layers` text collate utf8_czech_ci NOT NULL,
  `notes` text collate utf8_czech_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

INSERT INTO `osmcz_layers` (`id`, `name`, `order`, `url`, `tags`, `isBaseLayer`, `opacity`, `html`, `wms_params`, `wms_layers`, `notes`) VALUES
('mpnk',	'Mapnik',	1,	'http://[a,b,c].tile.openstreetmap.org/${z}/${x}/${y}.png',	'general,_default',	1,	1,	'<big>Main Mapnik</big>\r\n<p><img src=\'etc/map/world.png\'> 10 minut\r\n<p class=\'attr\'>cc-by-sa <a href=\'http://www.openstreetmap.org/\'>OSM</a>\r\n<p><a href=\'http://wiki.osm.org/wiki/Mapnik\'>wiki</a> ~ <a href=\'http://www.mapnik.org/\'>mapnik.org</a>',	'',	'',	''),
('osma',	'T@H',	1.1,	'http://[a,b,c].tah.openstreetmap.org/Tiles/tile/${z}/${x}/${y}.png',	'general',	1,	1,	'<big>Osmarender</big>\r\n<p><img src=\'etc/map/world.png\'> 10 minut\r\n<p class=\'attr\'>cc-by-sa <a href=\'http://www.openstreetmap.org/\'>OSM</a>\r\n<p><a href=\'http://wiki.osm.org/wiki/Osmarender\'>wiki</a> ~ <a href=\'http://www.informationfreeway.org/\'>Tiles @ Home</a>',	'',	'',	''),
('cycle',	'Cycle',	1.3,	'http://[a,b,c].tile.opencyclemap.org/cycle/${z}/${x}/${y}.png',	'bike,_default',	1,	1,	'<big>OpenCycleMap</big>\r\n<p><img src=\'etc/map/world.png\'> 1 týden\r\n<p class=\'attr\'>cc-by-sa <a href=\'http://www.openstreetmap.org/\'>OSM</a>\r\n<p><a href=\'http://wiki.osm.org/wiki/OpenCycleMap\'>info</a> ~ <a href=\'http://opencyclemap.org/\'>opencyclemap.org</a>',	'',	'',	''),
('otmb',	'OTM',	10,	'http://opentrackmap.no-ip.org/tiles/${z}/${x}/${y}.png',	'hike,bike',	0,	0,	'<big>OpenTrackMap baked</big>\r\n<p><img src=\'etc/map/cr.png\'> občas - 23.1.\r\n<p class=\'attr\'>cc-by-sa <a href=\'http://www.openstreetmap.org/\'>OSM</a>\r\n<p><a href=\'http://wiki.osm.org/wiki/OpenTrackMap\'>info</a> ~ <a href=\'http://opentrackmap.no-ip.org/\'>www</a> ~ <a href=\'http://blackhex.no-ip.org/\'>Radek Bartoň</a>',	'',	'',	''),
('otmt',	'OTMt',	10.1,	'http://opentrackmap.no-ip.org/tracks/${z}/${x}/${y}.png',	'hike,bike',	0,	0.8,	'<big>OpenTrackMap tracks</big>\r\n<p><img src=\'etc/map/cr.png\'> občas - 23.1.\r\n<p class=\'attr\'>cc-by-sa <a href=\'http://www.openstreetmap.org/\'>OSM</a>\r\n<p><a href=\'http://wiki.osm.org/wiki/OpenTrackMap\'>info</a> ~ <a href=\'http://opentrackmap.no-ip.org/\'>www</a> ~ <a href=\'http://blackhex.no-ip.org/\'>Radek Bartoň</a>',	'',	'',	''),
('cont',	'Vrstevnice',	10.5,	'http://opentrackmap.no-ip.org/contours/${z}/${x}/${y}.png',	'general,hike,bike',	0,	1,	'<big>Vrstevnice z OTM</big>\r\n<p><img src=\'etc/map/cr.png\'> občas - 23.1.\r\n<p class=\'attr\'>pd <a href=\'http://www.openstreetmap.org/\'>SRTM</a>\r\n<p><a href=\'http://wiki.osm.org/wiki/OpenTrackMap\'>info</a> ~ <a href=\'http://opentrackmap.no-ip.org/\'>www</a> ~ <a href=\'http://blackhex.no-ip.org/\'>Radek Bartoň</a>',	'',	'',	''),
('hill',	'Hillshade',	10.5,	'http://opentrackmap.no-ip.org/hillshade/${z}/${x}/${y}.png',	'general,hike,bike',	0,	0.6,	'<big>Hillshade z OTM</big>\r\n<p class=\'attr\'>pd <a href=\'http://\'>SRTM</a>\r\n<p><a href=\'http://wiki.osm.org/wiki/OpenTrackMap\'>info</a> ~ <a href=\'http://opentrackmap.no-ip.org/\'>www</a> ~ <a href=\'http://blackhex.no-ip.org/\'>Radek Bartoň</a>',	'',	'',	''),
('otmd',	'OTMd',	10.1,	'http://opentrackmap.no-ip.org/tracks/${z}/${x}/${y}.png',	'hike',	0,	0.8,	'<big>OpenTrackMap tracks-debug</big>\r\n<p><img src=\'etc/map/cr.png\'> občas - 23.1.\r\n<p class=\'attr\'>cc-by-sa <a href=\'http://www.openstreetmap.org/\'>OSM</a>\r\n<p><a href=\'http://wiki.osm.org/wiki/OpenTrackMap\'>info</a> ~ <a href=\'http://opentrackmap.no-ip.org/\'>www</a> ~ <a href=\'http://blackhex.no-ip.org/\'>Radek Bartoň</a>',	'',	'',	''),
('uhul',	'ÚHUL',	50,	'http://www.localhost/osmcz/uhul_tile.php/${z}/${x}/${y}.png',	'ortofoto,_default',	1,	1,	'<big>ÚHUL Ortofoto</big>\r\n<p><img src=\'etc/map/cr.png\'> bez aktualizace\r\n<p class=\'attr\'>&copy; <a href=\'http://www.uhul.cz/\'>ÚHUL</a> 2001\r\n<p><a href=\'http://wiki.osm.org/wiki/WikiProject_Czechia/freemap\'>info</a> ~ <a href=\'http://opentrackmap.no-ip.org/\'>www</a>',	'',	'',	''),
('cuzk',	'ČÚZK',	100,	'http://wms.cuzk.cz/wms.asp',	'other',	0,	0.6,	'<big>ČÚZK KM</big>',	'{\r\nlayers: \'RST_KN,RST_KMD,RST_PK,obrazy_parcel,hranice_parcel,dalsi_p_mapy,omp,prehledka_kat_uz,prehledka_kraju-linie\',\r\ntransparent: true\r\n}',	'{\r\nRST_KN_I: \'rastrové mapy KN inverzní (KM-D)\',\r\nRST_KN: \'rastrové mapy KN (KM-D)\',\r\nRST_KMD: \'vektorová mapa KN (DKM)\',\r\nRST_PK: \'mapy pozemkového katastru\',\r\ndalsi_p_mapy: \'další prvky mapy z DKM\',\r\nhranice_parcel: \'hranice parcel z DKM\',\r\nobrazy_parcel: \'obrazy parcel z DKM\',\r\nomp: \'vektorová složka orientační mapy parcel\',\r\nDEF_BUDOVY: \'definiční body budov (vč. čísel popisných, červeně)\',\r\nprehledka_kat_uz: \'hranice katastrálních území\',\r\n\'prehledka_kraju-linie\': \'hranice krajů\'\r\n}',	''),
('piste',	'Piste',	20,	'http://tiles.openpistemap.org/nocontours/${z}/${x}/${y}.png',	'ski',	1,	1,	'<big>OpenPisteMap</big>',	'',	'',	''),
('wpde',	'hikebike',	200,	'http://toolserver.org/tiles/hikebike/${z}/${x}/${y}.png',	'hike',	0,	0,	'https://wiki.toolserver.org/view/OpenStreetMap\r\n<br>http://toolserver.org/~cmarqu/\r\n<br>\r\n<br>http://toolserver.org/~cmarqu/hill/\r\n<br>http://toolserver.org/~cmarqu/opentiles.com/cmarqu/tiles_contours_8/\r\n',	'',	'',	''),
('light',	'Light=yes',	200,	'http://toolserver.org/tiles/lighting/${z}/${x}/${y}.png',	'other',	0,	0.5,	'',	'',	'',	''),
('haiti',	'Haiti Live',	200,	'http://live.openstreetmap.nl/haiti/${z}/${x}/${y}.png',	'other',	0,	1,	'',	'',	'',	''),
('pcont',	'Contours',	20,	'http://tiles.openpistemap.org/contours-only/${z}/${x}/${y}.png',	'ski',	0,	1,	'<big>OpenPisteMap Contours</big>',	'',	'',	''),
('phill',	'Hillshade',	20,	'http://tiles2.openpistemap.org/landshaded/${z}/${x}/${y}.png',	'ski',	0,	1,	'<big>OpenPisteMap Hillshade</big>',	'',	'',	''),
('lonvia',	'Lonvia',	13,	'http://osm.lonvia.de/hiking/${z}/${x}/${y}.png',	'hike',	0,	1,	'<big>Lonvia\'s Hiking Map</big>\r\n<p>Overlay\r\n<p>http://osm.lonvia.de/world_hiking.html\r\n<p>http://osm.lonvia.de/hiking/about.html',	'',	'',	''),
('wrkb',	'WRK base',	14,	'http://base[,2].wanderreitkarte.de/base/${z}/${x}/${y}.png',	'hike',	0,	0.6,	'<big>wanderreitkarte.de podklad</big>\r\n<p>http://wanderreitkarte.de/hills/${z}/${x}/${y}.png\r\n<p>http://www.wanderreitkarte.de/hills/${z}/${x}/${y}.png\r\n',	'',	'',	''),
('wrk',	'WRK topo',	14.01,	'http://topo[,2].wanderreitkarte.de/topo/${z}/${x}/${y}.png',	'hike,ortofoto',	0,	1,	'<big>wanderreitkarte.de podklad</big>\r\n<p>http://wanderreitkarte.de/hills/${z}/${x}/${y}.png\r\n<p>http://www.wanderreitkarte.de/hills/${z}/${x}/${y}.png\r\n',	'',	'',	'');

