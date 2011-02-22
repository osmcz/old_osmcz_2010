OpenLayers.Layer.WMS.LL = OpenLayers.Class(OpenLayers.Layer.WMS, {

    initialize: function(name, url, params, options) {

				var myoptions = {
						maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
						maxResolution: 156543.0339,
						numZoomLevels: 20,
						units: "m",
						projection: "EPSG:4326"
					};
				OpenLayers.Util.extend(myoptions,options);
    
        OpenLayers.Layer.WMS.prototype.initialize.apply(this, [name, url, params, myoptions]);
        
    },    


		getFullRequestString: function(newParams, altUrl) {
			this.params.SRS = "EPSG:4326";
		  return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(this, arguments);
		},
		
		cache: {},
		getURL: function(bounds){  //this solution too slow, must be cached (cache could grow too biggg!)
			var id = bounds.toBBOX();
			if(!this.cache[id])
		  	this.cache[id] = toLL(bounds.clone());
			return OpenLayers.Layer.WMS.prototype.getURL.apply(this, [ this.cache[id] ]);			
		},


    /**
     * Method: clone
     * Create a clone of this layer
     *
     * Returns:
     * {<OpenLayers.Layer.WMS.Untiled>} An exact clone of this layer
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.WMS.Untiled(this.name,
                                                   this.url,
                                                   this.params,
                                                   this.getOptions());
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.WMS.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here

        return obj;
    }, 

    CLASS_NAME: "OpenLayers.Layer.WMS.LL"
});
