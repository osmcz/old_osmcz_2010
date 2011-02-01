<?php
// set the default timezone to use. Available since PHP 5.1
date_default_timezone_set('UTC');

$url = $_GET['url'];


if(substr($url, 0, 7) == 'http://'){
	ob_start();

	$arr = (array) unserialize(file_get_contents("proxy.cache"));
	if(!isset($arr[$url])){
		$arr[$url] = file_get_contents($url);
		file_put_contents("proxy.cache", serialize($arr));
	}
	
	$error = ob_get_contents();
	if($error){
		file_put_contents("proxy.log", date('H:i:s')." error:".$error."\n", FILE_APPEND);
	}
	else{
		file_put_contents("proxy.log", date('H:i:s')." ".$url."\n", FILE_APPEND);
		echo $arr[$url];
	}
}





function send_request() {
  global $onlineresource;
  $ch = curl_init();
  $timeout = 5; // set to zero for no timeout

  // fix to allow HTTPS connections with incorrect certificates
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
  curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);

  curl_setopt ($ch, CURLOPT_URL,$onlineresource);
  curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
  curl_setopt ($ch, CURLOPT_ENCODING , "gzip, deflate");

  $file_contents = curl_exec($ch);
  curl_close($ch);
  $lines = array();
  $lines = explode("\n", $file_contents);
  if(!($response = $lines)) {
    echo "Unable to retrieve file '$service_request'";
  }
  $response = implode("",$response);
  return $response;
}

