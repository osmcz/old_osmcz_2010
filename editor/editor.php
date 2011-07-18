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
			self::$db = json_decode(file_get_contents('icons-data.json'), true);
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
	public static function saveIcon($id, $tileurl, $iconpos){
	  $iconpos = preg_split("/[^0-9]+/", $iconpos);
	  $x = intval($iconpos[0]);
	  $y = intval($iconpos[1]);
	  $s = intval($iconpos[2]);
	  
    $ico = imagecreatetruecolor(50,50);
    imagesavealpha($ico, true);
    imagealphablending($ico, false);
    
    $tile = imagecreatefrompng($tileurl);
    imagecopyresampled($ico, $tile, 0,0, $x,$y, 50,50, $s,$s);
    //imagecopyresampled(int dstX,Y, int srcX,Y, int dstW,H, int srcW,H)
    
    imagepng($ico, "icons/$id.png");
	}
  public static function saveCompositeIcon(){
    $maps = array('no-map'=>false) + $GLOBALS['maps'];
    
  
    $h = 50+2; //icon height+padding
    $ico = imagecreatetruecolor(50, $h*count($maps));
   
    //enable alpha channel
    imagesavealpha($ico, true);
    imagealphablending($ico, false);
    
    //set padding color to transparent
    $transparent = imagecolorallocatealpha($ico, 255,255,255, 127);
    imagefilledrectangle($ico, 0,0, imagesx($ico), imagesy($ico), $transparent);
    
    //copy all icons (first is no-map icon)
    $i=0;
    foreach($maps as $id=>$r){
      $tile = imagecreatefrompng("icons/$id.png");
      $y = $h*($i++);
      imagecopyresampled($ico, $tile, 0,$y, 0,0, 50,50, 50,50);
      //imagecopyresampled(int dstX,Y, int srcX,Y, int dstW,H, int srcW,H)
    }

    imagepng($ico, "icons.png");
	 
	}
}



if(isset($_POST['action']) && $_POST['action'] == 'create-icon'){
  $id = $_POST['id'];
  $data = array(
   "zxy" => $_POST['zxy'],
   "iconpos" => $_POST['iconpos']
  );
  
  MapsIconsModel::setIconsData($id, $data);
  MapsIconsModel::saveIcon($id, $_POST['tileurl'], $_POST['iconpos']); 

  die("ok");
}
if(isset($_GET['action']) && $_GET['action'] == 'icon-data'){
  $data = MapsIconsModel::getIconsData($_GET['id']);
  echo json_encode($data);
  die();
}

if(isset($_GET['action']) && $_GET['action'] == 'composite'){
  MapsIconsModel::saveCompositeIcon();
  header('content-type:image/png');
  readfile('icons.png');
  die();
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
<title>OSMCZ maps editor</title>
<script src="../lib/jquery-1.4.3.js" type="text/javascript"></script>
<script src="etc/jquery.Jcrop.js" type="text/javascript"></script>
<link href="etc/jquery.Jcrop.css" rel="stylesheet" type="text/css">

<script src="etc/editor.js" type="text/javascript"></script>
<script type="text/javascript">
<!--

jQuery.ajaxSetup({
	beforeSend: function(){$('#spinner').show()},
	complete: function(){$('#spinner').hide()},
	success: function(){}
});





var jcrop_api;
var tileurl = 'http://a.tile.openstreetmap.org/${z}/${x}/${y}.png';

function setTileurl(s,id){
	tileurl = s.replace(/\[([^,\]]*)[^\]]*\]/, '$1'); //pick the first server
	$('#mapviewer-id').html(id);
	
	$.getJSON('editor.php', {action: 'icon-data', id: id}, function(data){
		$('#mapviewer-zxy').val(data.zxy);
		$('#iconpos').val(data.iconpos);
		move(0,0,0);
	});
}

function move(dz,dx,dy){
	var cur = $('#mapviewer-zxy').val().split('/');
	var z = parseInt(cur[0])+dz;
	var x = parseInt(cur[1])+dx;
	var y = parseInt(cur[2])+dy;
	if(dz>0){x=x*2+1; y=y*2+1;} //zoom +
	if(dz<0){x=Math.floor(x/2); y=Math.floor(y/2);} //zoom -

	$('#mapviewer-zxy').val(z+'/'+x+'/'+y);

	src = OpenLayers_String_format(tileurl, {x:x, y:y, z:z}); //replace xyz
	$('#mapviewer,#mapviewer-preview').attr('src',src);
	if(jcrop_api){
		jcrop_api.setImage(src);
		showCrop();
	}
}

function showCrop(){
	var arr = $('#iconpos').val().split(/[^0-9]+/);
	var x = parseInt(arr[0]), y = parseInt(arr[1]), s = parseInt(arr[2]);
	$('#iconpos').val(x+','+y+' '+s+'px');
	
	
	jcrop_api.setSelect([x,y,x+s,y+s]);
}


function showPreview(c)
{
	var rx = 50 / c.w;
	var ry = 50 / c.h;

	$('#mapviewer-preview').css({
		width: Math.round(rx * 256) + 'px',
		height: Math.round(ry * 256) + 'px',
		marginLeft: '-' + Math.round(rx * c.x) + 'px',
		marginTop: '-' + Math.round(ry * c.y) + 'px'
	})
	
	$('#iconpos').val(c.x+','+c.y+' '+c.w+'px');
}




$(function(){ 
  move(0,0,0);

	$('#mapviewer').Jcrop({
		onChange: showPreview,
		onSelect: showPreview,
		aspectRatio: 1,
		bgOpacity: 1,
		sideHandles: false
	},function(){
		jcrop_api = this;
	});
	
	$('#mapviewer-table th').attr('unselectable','on').css('MozUserSelect','none');
	
});


function save(){
  $.post('editor.php', {
    action: 'create-icon',
    id: $('#mapviewer-id').html(),
    zxy: $('#mapviewer-zxy').val(),
    iconpos: $('#iconpos').val(),
    tileurl: $('#mapviewer').attr('src'),
  }, function(data){alert(data)});
}


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
<img src="etc/spinner.gif" alt="loading" border="0" height="32" width="32" id='spinner' style='display:none;position:fixed;'>

<h1>OSMCZ layer editor</h1>
<p>Layer script file: <?php echo $maps_file; ?>
<p><a href='?action=composite'>Create composite icon</a>


<div style='position:fixed;right:0;top:3;width:300px;'>
<table border="0" id='mapviewer-table'>
<tr><th onclick='move(1,0,0)'>+<th onclick='move(0,0,-1)'>^<th onclick='move(-1,0,0)'>-
<tr><th onclick='move(0,-1,0)'>&nbsp;&lt;<th><img src='' width='256' height='256' id='mapviewer'>
		<th onclick='move(0,1,0)'>&gt;&nbsp;
<tr><th onclick='move(0,0,1)' colspan='3'>\/
</table>

ID: <span id='mapviewer-id'>-</span><br>
Z/X/Y: <input value='15/17697/11101' id='mapviewer-zxy' name='zxy' onkeyup='move(0,0,0)'><br>
x,y,px: <input value='0,0 50px' id='iconpos' name='iconpos' onkeyup='showCrop()'><br>
<input type='button' value='save' onclick='save()'>

<p>preview: 

<div style="width:50px;height:50px;overflow:hidden;margin-left:5px;">
	<img id='mapviewer-preview' width='50' height='50'>
</div>


</div>


<?php

foreach($maps as $key => $r){
	
	echo "<h3>$r[name]</h3>";
	
	echo "<img src='icons/$r[id].png'>";
	echo "Tile url: <input value='$r[url]' size='80' onclick='setTileurl(this.value,\"$r[id]\")'>";
	$arr = expandTileUrl($r['url']);

	
}

?>


</body>
</html>



