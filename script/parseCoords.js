

function parseCoords(coords){

		var re = /^(\D*)(\d+[.,]?\d*\D+)(\d+[.,]?\d*\D+)(\d+[.,]?\d*\D+)?(\d+[.,]?\d*\D+)?(\d+[.,]?\d*\D+)?(\d+[.,]?\d*\D+)?$/; //2-6 numerical substrings
		var out = re.exec(coords+"x");
		if(!out) return false;
		
		out.shift(); //orig
		var latX = out.shift(), lonX, lonX2; //textual prefixes,suffixes
		var lat, lon;
		
		if(!out[1]) return false;
		else if(!out[2]){ // [0]=> 50.4 [1]=> 15.6
			lat = parseFloat(out[0].replace(/,/, '.'));
			lon = parseFloat(out[0+1].replace(/,/, '.'));
			lonX = out[0]; 
			lonX2 = out[1]; 
		}
		else if(!out[3]) return false;
		else if(!out[4]){ // [0]=> 50° [1]=> 05.720 E [2]=> 014° [3]=> 20.606x
			lat = parseFloat(out[0].replace(/,/, '.'));
			lat += parseFloat(out[1].replace(/,/, '.')) / 60.0;
			lon = parseFloat(out[0+2].replace(/,/, '.'));
			lon += parseFloat(out[1+2].replace(/,/, '.')) / 60.0;
			lonX = out[1];
			lonX2 = out[3];
		}
		else if(!out[5]) return false;		
		else{
			lat = parseFloat(out[0].replace(/,/, '.'));
			lat += parseFloat(out[1].replace(/,/, '.')) / 60.0;
			lat += parseFloat(out[2].replace(/,/, '.')) / 60.0 / 60.0;
			lon = parseFloat(out[0+3].replace(/,/, '.'));
			lon += parseFloat(out[1+3].replace(/,/, '.')) / 60.0;
			lon += parseFloat(out[2+3].replace(/,/, '.')) / 60.0 / 60.0;
			lonX = out[2];
			lonX2 = out[5];
		}
		
		
		//found -<num> -<num>
		if(latX.substr(-1) == '-') lat *= -1;
		if(lonX.substr(-1) == '-') lon *= -1;
		
		//no '-' found
		if(lat>0 && lon>0){
			var s1 = latX.match(/[NSEW]/i);
			var s2 = lonX.match(/[NSEW]/i);
			var s3 = lonX2.match(/[NSEW]/i);

			
			//found . X . X  -- we dont prefer this
			if(!s1 && s2 && s3){s1 = s2; s2 = s3;}

			//found X . X .
			if(s1 && s2){

				if(s1[0].toUpperCase() == 'E' || s1[0].toUpperCase() == 'W'){ // EW . NS .
					var tmp=lat; lat=lon; lon=tmp;
					var tmp=s2; s2=s1; s1=tmp;
				}

				if(s1[0].toUpperCase() == 'S') lat *= -1;  //S .   .
				if(s2[0].toUpperCase() == 'W') lon *= -1;  //  . W .
			}
		}
		
	//document.write(s1+" -- "+s2+" -- "+s3+" <br> ");
	//document.write(s1[0]+" -- "+s2[0]+" <br> ");
	//for(i=0;i<out.length;i++)document.write("<span style='border:1px black solid;padding-right:5;'>"+out[i]+"</span>");

	return {lat:lat, lon:lon};
}


// function dec2decmin($x){
//     if(is_array($x)) return dec2decmin($x[0]) . " " . dec2decmin($x[1]); 
//     return sprintf("%d° %2.3f", floor($x), ($x-floor($x))*60);
// }
// function dec2decminsec($x){
//     if(is_array($x)) return dec2decminsec($x[0]) . " " . dec2decminsec($x[1]);     
//     $deg = floor($x);
//     $min = floor(($x-$deg)*60);
//     return sprintf("%d° %d' %2.3f", $deg, $min, ((($x-$deg)*60) - $min)*60);
// }




