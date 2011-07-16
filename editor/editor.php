<?php

require "JSON.php";
$json_service = new Services_JSON(SERVICES_JSON_LOOSE_TYPE);


$maps_file = 'OSMCZ.maps.js';
$maps_file = '../script/OSMCZ.maps.js';

$maps_json = file_get_contents($maps_file);
$maps_json = preg_replace('~^[^\{]*~', '', $maps_json);
$maps = $json_service->decode($maps_json);

function expandTileUrl($url){
	if(preg_match('~\[([^\]]+)\]~', $url, $matches)){
		$arr = array();
		foreach(explode(',', $matches[1]) as $s)
			$arr[] = preg_replace('~\[([^\]]+)\]~', $s, $url);
		return $arr;
	}
	return array($url);
}

class MapsIconsModel{
	public static $db;
	public static function init(){
		if(!self::$db)
			self::$db = json_decode(file_get_contents('icons-data.json'));
	}
	public static function getIconsData($id){
		self::init();
		return self::$db[$id];
	}
	public static function setIconsData($id, $r){
		self::init();
		self::$db[$id] = $r;
		file_put_contents('icons-data.json', json_encode(self::$db));
	}
}


/*
    [mpnk] => Array
        (
            [id] => mpnk
            [name] => Mapnik
            [url] => http://[a,b,c].tile.openstreetmap.org/${z}/${x}/${y}.png
            [tags] => general,_default
            [baseLayer] => 1
            [zoom] => Array
                (
                    [min] => 0
                    [max] => 20
                )

            [opacity] => 1
            [html] => <big>Main Mapnik</big>
        )
*/

?>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="generator" content="PSPad editor, www.pspad.com">
    <title></title>
<script src="../lib/jquery-1.4.3.js" type="text/javascript"></script>

<script type="text/javascript">
<!--

var OpenLayers_String_format = function(template, context, args) {
        if(!context) {
            context = window;
        }

        // Example matching: 
        // str   = ${foo.bar}
        // match = foo.bar
        var replacer = function(str, match) {
            var replacement;

            // Loop through all subs. Example: ${a.b.c}
            // 0 -> replacement = context[a];
            // 1 -> replacement = context[a][b];
            // 2 -> replacement = context[a][b][c];
            var subs = match.split(/\.+/);
            for (var i=0; i< subs.length; i++) {
                if (i == 0) {
                    replacement = context;
                }

                replacement = replacement[subs[i]];
            }

            if(typeof replacement == "function") {
                replacement = args ?
                    replacement.apply(null, args) :
                    replacement();
            }

            // If replacement is undefined, return the string 'undefined'.
            // This is a workaround for a bugs in browsers not properly 
            // dealing with non-participating groups in regular expressions:
            // http://blog.stevenlevithan.com/archives/npcg-javascript
            if (typeof replacement == 'undefined') {
                return 'undefined';
            } else {
                return replacement; 
            }
        };

        return template.replace(/\$\{([\w.]+?)\}/g, replacer);
    }


var tileurl = 'http://a.tile.openstreetmap.org/${z}/${x}/${y}.png';

function setTileurl(s,id){
	tileurl = s.replace(/\[([^,\]]*)[^\]]*\]/, '$1'); //pick the first server
	move(0,0,0);
	$('#mapviewer-id').html(id);
}

function move(dz,dx,dy){
	var cur = $('#mapviewer-zxy').val().split('/');
	var z = parseInt(cur[0])+dz;
	var x = parseInt(cur[1])+dx;
	var y = parseInt(cur[2])+dy;
	if(dz>0){x*=2; y*=2;} //zoom +
	if(dz<0){x=Math.floor(x/2); y=Math.floor(y/2);} //zoom -

	src = OpenLayers_String_format(tileurl, {x: x, y:y, z:z}); //replace xyz
	$('#mapviewer').attr('src','x');
	$('#mapviewer').attr('src',src);
	$('#mapviewer-zxy').val(z+'/'+x+'/'+y);
}

function download(){

}

var mousedown;

$(function(){ 
	$('#mapviewer-table th').attr('unselectable','on').css('MozUserSelect','none');
	move(0,0,0); 
	
	$('#mapviewer').mousedown(function(e){
 		mousedown = {x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop}
	})
	.mouseup(function(){
 		var c = {x: e.pageX - this.offsetLeft, y: e.pageY - this.offsetTop}
		var size = Math.max(mousedown.x-c.x, mousedown.y-c.y);
		if(size<5) size = 50;
		
		
		$('#mapviewer-preview').attr('src', $(this).attr('src')); 
	});
	
});

-->
</script>
<style type="text/css">
<!--
#mapviewer-table th:hover{background:#ccc;}
#mapviewer-table th{cursor:pointer;}
//-->
</style>
  </head>
  <body>

<h1>OSMCZ layer editor</h1>
<p>Layer script file: <?php echo $maps_file; ?>



<div style='position:fixed;right:0;top:3;width:300px;'>
ID: <span id='mapviewer-id'>-</span><br>
Z/X/Y: <input value='15/17697/11101' id='mapviewer-zxy' onkeyup='move(0,0,0)'>
<table border="0" id='mapviewer-table'>
<tr><th onclick='move(1,0,0)'>+<th onclick='move(0,0,-1)'>^<th onclick='move(-1,0,0)'>-
<tr><th onclick='move(0,-1,0)'>&nbsp;&lt;<th><img src='' width='256' height='256' id='mapviewer'>
		<th onclick='move(0,1,0)'>&gt;&nbsp;
<tr><th onclick='move(0,0,1)' colspan='3'>\/
</table>

<p>x,y,px: <input value='0,0 50px' id='icon-pos' onkeyup='move(0,0,0)'><br>

<p><input type='button' value='save' onclick='save()'>

<p>preview: <img id='mapviewer-preview' width='50' height='50'>

</div>


<?php

foreach($maps as $key => $r){
	
	echo "<h3>$r[name]</h3>";
	
	echo "Tile url: <input value='$r[url]' size='80' onclick='setTileurl(this.value,\"$r[id]\")'>";
	$arr = expandTileUrl($r['url']);

	
}


?>


