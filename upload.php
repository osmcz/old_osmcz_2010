<?php

$error = "";
$msg = "";

if(!empty($_FILES['file']['error']))
{
	switch($_FILES['file']['error'])
	{
		case '1':
			$error = 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
			break;
		case '2':
			$error = 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form';
			break;
		case '3':
			$error = 'The uploaded file was only partially uploaded';
			break;
		case '4':
			$error = 'No file was uploaded.';
			break;
		case '6':
			$error = 'Missing a temporary folder';
			break;
		case '7':
			$error = 'Failed to write file to disk';
			break;
		case '8':
			$error = 'File upload stopped by extension';
			break;
		default:
			$error = 'No error code avaiable';
	}
}

elseif(empty($_FILES['file']['tmp_name']) or $_FILES['file']['tmp_name'] == 'none'){
	$error = 'No file was uploaded.';
}

else {
		$newfile = "upload/1/".url2filename(substr(md5(rand()),-4)."-".$_FILES['file']['name']);

		if(filesize($_FILES['file']['tmp_name']) > 1000000){
			$error = 'File exceeding 1 MB.';
		}
		if(!in_array(substr($newfile,-4), array(".kml",".gpx",".osm"))){
			$error = 'Only kml, gpx and osm uploads.';
		}
		
		if(!$error){
			if(!move_uploaded_file($_FILES['file']['tmp_name'], $newfile)){
				$error = 'File cannot be moved, please, contact the server admin.';
			}
			else {
				$path = dirname($_SERVER['PHP_SELF']);
				if($path) $path.="/";
				$msg = "http://$_SERVER[HTTP_HOST]$path$newfile";
			}
		}
}

//json response
echo "{";
echo "error: '" . $error . "',\n";
echo "msg: '" . $msg . "'\n";
echo "}";




function url2filename($str){ //z předané $url vytáhne base-filename
  $str = basename($str);
	$a = array("á","ä","č","ď","é","ě","ë","í","ň","ó","ö","ř","š","ť","ú","ů","ü","ý","ž","Á","Ä","Č","Ď","É","Ě","Ë","Í","Ň","Ó","Ö","Ř","Š","Ť","Ú","Ů","Ü","Ý","Ž");
  $b = array("a","a","c","d","e","e","e","i","n","o","o","r","s","t","u","u","u","y","z","A","A","C","D","E","E","E","I","N","O","O","R","S","T","U","U","U","Y","Z");
  $str = str_replace($a, $b, $str);
  $str = strtolower($str); //pokud je soubor - jmeno bezdiak
	
  if(strpos($str, "?") !== false) $str = substr($str, 0, strpos($str, "?"));
  
  $str=preg_replace("/[^.a-z0-9]+/", "-", $str);
  while(substr($str,-1) == "-") $str=substr($str,0,-1);
  return $str;
}	
