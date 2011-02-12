
//--------------------------------- SUMMARY : StaticPanel ------------------------
var Summary = function(){
	//není potřeba: this.Panel();
	this.setTitle("Přehled panelů");
	this.setId('summary');
	
	this.$().sortable();
	this.$().disableSelection();

	// 	$("#summary .item a").live("click", function(event){
	// 		alert($(this).parent().attr('id'));
	// 		return false;
	// 	});
	// 	
	// 	$("#summary .item input").live("click", function(event){
	// 		id = $(this).parent().parent().attr('id');
	// 		OSMCZ.panels[id].toggleDataLayer();
	// 		return false;
	// 	});

}
Summary.prototype = new StaticPanel();
Summary.prototype.add = function(p){
	if(p.id == "home")
		$('#summary').append('<div class="item" id="item_'+p.id+'"><a href="#'+p.getQuery()+'" class="osmczlink">'+p.getTitle()+'</a></div>');
	else
		$('#summary').append('<div class="item" id="item_'+p.id+'"><span><input type="checkbox" checked="checked" data-toggleLayer="'+p.id+'" class="osmczbutton"> <a data-remove="'+p.id+'" class="osmczbutton">X</a></span><a href="#'+p.getQuery()+'" class="osmczlink">'+p.getTitle()+'</a></div>');
}


Summary.prototype.buttonClicked = function(obj){ //panel-wide handler for <osmczbutton>s  //todo:should be moved to <Panel>
	if(this['handle_'+obj.attr('data-action')])
		return this['handle_'+obj.attr('data-action')](obj);
	
	if(obj.attr('data-toggleLayer'))
		return this.handle_toggleLayer(obj);
		
	else if(obj.attr('data-remove'))
		return this.handle_remove(obj.attr('data-remove'));
}

Summary.prototype.handle_remove = function(pid){
	$('#item_'+pid).remove();
}
Summary.prototype.handle_toggleLayer = function(obj){
	var pid = obj.attr('data-toggleLayer');
	var ch = obj[0].checked;
	OSMCZ.panelsById[pid].layer.setVisibility( ch );
}


