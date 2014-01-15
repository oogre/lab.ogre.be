(function(){
	"use strict";
	/*global $:false */
	/*global GETYOO:false */


	/*/					 					/*/
	/*/			CONSTRUCTEUR			 	/*/
	/*/										/*/
	GETYOO.VIEWS = function(name, view){
		var _view = {
			name : name,
			js : [],
			html : [],
			css : [],
			data : [],
			start : function(){
				this.css.start();
				this.html.start();
				this.js.start();
				this.active = true;
				return this;
			},
			replace : function(viewname){
				this.PARENT.load(viewname);
				this.destroy();
			},
			destroy : function(){
				this.js.remove();
				this.html.remove();
				this.css.remove();
				this.active = false;
				delete this.PARENT.CHILDREN[this.name];

				for(var k in this.CHILDREN){
					GETYOO.VIEWS.LIST[k].destroy();
					delete this.CHILDREN[k];
				}
				
				return this;
			},
			load : function(viewname){
				GETYOO.VIEWS.load(this.name, viewname);
				return  this;
			},
			PARENT : {
				CHILDREN : {}
			}
		};

		_view.js.start = function(){
			this.map(function(js){
				return js.start();
			});
		};
		_view.js.remove = function(){
			this.map(function(js){
				return js.stop();
			});
		};
		_view.js.wrapper = function(script){
			var _object = null;
			return {
				stop : function(){
					if(_object && _object.stop){
						_object.stop();
					}
					_object = null;
				},
				start : function(){
					GETYOO.VIEWS.CURENTVIEW = _view;
					_object = eval(script);
				},
				getObject : function(){
					return _object;
				}
			};
		};
		
		_view.html.start = function(){
			_view.nodeHTML = document.querySelector("body").querySelector("["+GETYOO.CONF.view.attribut+"='"+name+"']");

			if(null === _view.nodeHTML){
				_view.nodeHTML = document.createElement("div");
				_view.nodeHTML.setAttribute(GETYOO.CONF.view.attribut, name);
				document.querySelector("body").appendChild(_view.nodeHTML);
			}

			$(_view.nodeHTML).before(this.join("\n")).remove();			
			_view.nodeHTML = document.querySelector("body").querySelector("["+GETYOO.CONF.view.attribut+"='"+name+"']");

		};
		_view.html.remove = function(){
			$(_view.nodeHTML).remove();
		};

		_view.css.start = function(){
			this.map(function(cssValue){
				var style = document.createElement("style");
				style.setAttribute("type", "text/css");
				style.setAttribute(GETYOO.CONF.view.attribut, name);
				style.innerHTML = cssValue;
				document.querySelector("head").appendChild(style);
			});
		};
		_view.css.remove = function(){
			document.querySelectorAll("head ["+GETYOO.CONF.view.attribut+"='"+name+"']").map(function(style){
				style.parentNode.removeChild(style);
			});
		};

		var _init = function(file){
			for(var k in file){
				if("string" !== typeof(file[k])){
					_init(file[k]);
				}else{
					switch(k.split(".").pop()){
						case "js" :
						case "json" :
							_view.js.push(_view.js.wrapper(file[k]));
						break;
						case "html" :
						case "htm" :
							_view.html.push(file[k]);
						break;
						case "css" :
							_view.css.push(file[k]);
						break;
						default :
							_view.data.push(file[k]);
						break;
					}
				}
			}
			return _view;
		};

		(function (view){
			GETYOO.VIEWS.LIST[name] = _init(view);
		}(view));
	};
	
	

	/*/					 					/*/
	/*/			LOAD VIEWS					/*/
	/*/			FROM GETYOO.VIEWS.LIST		/*/
	/*/			TO THE LOGICAL GUI TREE		/*/
	/*/										/*/

	GETYOO.VIEWS.LIST = {};
	GETYOO.VIEWS.load = function(parentview, viewname){
		if(2 > arguments.length){
			viewname = parentview;
			parentview = null;
		}
		parentview = GETYOO.VIEWS.LIST[parentview];
		if(!GETYOO.VIEWS.LIST[viewname]){
			throw new Error(viewname + " : is Unknow view\nKnown views are : " + Object.keys(GETYOO.VIEWS.LIST).join(" "));
		}
		if(parentview && parentview.CHILDREN && parentview.CHILDREN[viewname]){
			throw new Error(viewname + " : is already loaded into "+parentview.name+"\nLoaded views are : " + Object.keys(parentview.CHILDREN).join(" "));
		}

		var view = GETYOO.VIEWS.LIST[viewname].start();
		view.PARENT = parentview || GETYOO.VIEWS;
		view.PARENT.CHILDREN = view.PARENT.CHILDREN || {};
		view.PARENT.CHILDREN[viewname] = view;
		return view;
	};

}());