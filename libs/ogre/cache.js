(function(){
	"use strict";
	/*global GETYOO:false */


	GETYOO.CACHE = {
		MEMORY : {},
		UTILS : (function(){
			var namespace = function(parts) {
				var object = GETYOO.CACHE.MEMORY;
				for (var i=0, len = parts.length; i < len; i++) {
					if ("" !== parts[i]){
						if(!object[parts[i]]){
							object[parts[i]] = {};
						}
						object = object[parts[i]];
					}
				}
				return object;
			};
			var load = function(){
				return JSON.parse(window.localStorage.getItem(GETYOO.CONF.CACHE.name)) || {};
			};
			var	store = function(){
				window.localStorage.setItem(GETYOO.CONF.CACHE.name, JSON.stringify(GETYOO.CACHE.MEMORY));
			};
			return {
				set : function(path, data){
					GETYOO.CACHE.MEMORY = load();
					var filename = path.pop();
					namespace(path)[filename] = data;
					store();
				},
				get : function(path){
					path = path || "";
					GETYOO.CACHE.MEMORY = load();
					var object = namespace(path.split("."));
					var ref = JSON.stringify({});
					var sobject = JSON.stringify(object);
					return ref === sobject ? false : object;
				}
			};
		}())
	};
}());