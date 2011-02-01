//http://dl.dropbox.com/u/534786/jquery.text-overflow.js

(function($) {
	$.fn.ellipsis = function(enableUpdating){
// 		var s = document.documentElement.style;
// 		if (!('textOverflow' in s || 'OTextOverflow' in s)) {
// 			return this.each(function(){
// 				var el = $(this);
// 					
// 					el.css({'white-space':'nowrap', 'color':'red'});
// 
// 					el.hover(function(){
// 						x = $(this);
// 						x.css({'color':'green'});
// 						
// 						var span = el.wrap('<span />').css({  //nový naklonovaný element
//                         'position': 'absolute',
//                         'width': 'auto',
//                         'overflow': 'visible',
//                         'z-index': '100000',
//                         'background': '#fff'
//                     });
//                     
// 						}, function(){});
// 					
// 			});
// 		} else return this;
return this;
	};
})(jQuery);
