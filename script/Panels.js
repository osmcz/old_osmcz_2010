
// Panel, StaticPanel, DataPanel prototypes


//--------------------------------- Panel common prototype -------------------
var Panel = {
	id: null,
	data: {},
	title: "",
	query: "",
	
	
	/** activate THIS panel
	 */	
	activate: function(){
		OSMCZ.activate(this);
	},
	
	
	/** show/hide this panel, toggle active flag
	 */	
	hide: function(){this.$().hide()},
	show: function(){this.$().show()},
	
	
	/** setId() - init html div
	 */
	setId: function(id){	
		if(!id)
			id = 'pnl'+Math.round(Math.random()*100000); //random name?
			
		if(!document.getElementById(id)) //create new html panel?
			$('#js-panelsContainer').append('<div id="'+id+'" class="panel hidden"></div>');
		
		this.id = id;
	},
	
	
	/** setTitle(), getTitle()
	 */	
	setTitle: function (str){this.title = str; OSMCZ.setTitle(str);},
	getTitle: function (){return this.title;},

	/** setData(), getData()
	 */	
	setData: function (d){this.data = d;},
	getData: function (){return this.data;},
	
	/** setQuery(), getQuery()
	 */	
	setQuery: function (q){
		OSMCZ.panelsByQuery[this.query] = null;
		OSMCZ.panelsByQuery[q] = this;
		this.query = q;
	},
	getQuery: function (){return this.query;},
	
	
	/** html manip
	 */
	$: function (){return $(document.getElementById(this.id));},
	//not working:  $: function (find){return find==null ? $(document.getElementById(this.id)) : $(document.getElementById(this.id), find);},

	
	/** Get/set assoc array of form values
	 */
	formValues: function(data){
		if(data == null){
			var result = {};
			this.$().find('input').each(function(k,v){
				if($(v).attr('name'))
					result[$(v).attr('name')] = $(v).val();
			});
			return result;
		}
		else {
			this.$().find('input').each(function(k,v){
				if(data[$(v).attr('name')] != null)
					$(v).val( data[$(v).attr('name')] );
			});
		}
	},

	/** Panel-wide handler for <osmczbutton>s
	 */	
	buttonClicked: function(obj){
		if(this['handle_'+obj.getAttribute('data-action')])
			return this['handle_'+obj.getAttribute('data-action')](obj);
	},
	
		
	endof:'Panel'
}



//--------------------------------- StaticPanel ----------------------------------
var StaticPanel = function(){}
StaticPanel.prototype = $.extend({}, Panel, {
	Panel: Panel,
	
	getQuery: function(){return this.id;} //final function -- data panels have query identical to htmlId
});


//--------------------------------- DataPanel ----------------------------------
var DataPanel = function(){}
DataPanel.prototype = $.extend({}, Panel, {
	Panel: Panel

});


