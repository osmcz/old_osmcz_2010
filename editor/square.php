<?php

$im = imagecreatetruecolor(50,50);
imagesavealpha($im, true);
imagealphablending($im, false);

$tile = imagecreatefrompng($_GET['f']);
imagecopyresampled($im, $tile, 0,0, 0,0, 50,50, 50,50);
//imagecopyresampled(int dstX,Y, int srcX,Y, int dstW,H, int srcW,H)

header('Content-type: image/png');
imagepng($im);



