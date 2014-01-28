(function(){
	"use strict";
	/*global $:false */
	/*global OGRE:false */

	OGRE.TOOLS = (function(){
		var _xhr = function(request){
			request.data = request.data || {};
			request.data = $.extend(request.data, {date : new Date().getTime()});
			return $.ajax(request);
		};


		var _getJson = function(request){
			return _xhr(request)
			.pipe(function(data) {
				if(undefined === data.status){
					data = JSON.parse(JSON.parse(data));
				}
				var deferred = $.Deferred();
				if(!data || data.status != "ok") {
					deferred.reject( {	data : data, request : request } );
				}else{
					deferred.resolve( data );
				}
				return deferred;
			}, function(){
				var deferred = $.Deferred();
				deferred.reject();
				return deferred;
			});
		};

		var cleaner = {
			autoindex : {
				selector : "a:not([href='../'])",
				get : function(elem){
					return {
						name : elem.innerHTML,
						dir : null !== elem.innerHTML.match(/\//g, "")
					};
				}
			}
		};
		
		var directoryParser = function(directory, parser){
			return directory.querySelectorAll(parser.selector).map(function(item){
				return parser.get(item);
			});
		};

		var fileFinder = function(conf, asynchrony){
			_xhr(conf.request)
			.done(function (data){
				directoryParser(data, cleaner.autoindex).map(function(item){
					if(true === item.dir){
						var itemRequest = $.extend(true, {}, conf);
						itemRequest.request.url += item.name;
						fileFinder(itemRequest, asynchrony.witness());
					}else{
						 asynchrony.witness().testify((conf.request.url+item.name).split("/"));
					}
				});
			})
			.always(function(){
				asynchrony.testify();
			});
		};

		var xhrautoindex = function(conf){
			var asynchrony = OGRE.Asynchrony();
			fileFinder(conf, asynchrony.witness());
			return asynchrony;
		};

		var xhrloader = function (conf, name, asynchrony){
			var request = {
				url : conf.request.url+name,
				path : (conf.filename+"/"+conf.request.url.split("/"+conf.filename+"/")[1]+name).split("/"),
				dataType : "text"
			};
			
			return _xhr(request)
				.done(function (data){
					asynchrony.testify({
						path : this.path,
						data : data
					});
				})
				.fail(function(){
					asynchrony.testify();
				});
		};

		return {
			xhr : _xhr,

			listFiles : function(url, callback){
				var list = [];
				_xhr(url).done(function (data){
					directoryParser(data, cleaner.autoindex).map(function(item){
						list.push(url+item.name);
					});
					callback(list);
				});
			},

			getFiles : function(url, callback){
				_getJson(url).done(function(data){
					callback.call(null, data.data.sort().map(function(d){
						return url+d;
					}));
				});
			},

			Iterator : function(array, step){
				array.step = step || 1;
				array.counter = 0;
				array.hasNext = function(){
					return this.counter < this.length-this.step;
				}
				array.next = function(){
					this.counter += this.step;
					this.current = this[this.counter];
					return this;
				}
				array.current = array[array.counter];
				return array;
			},

			getArticles : function(url, destination, callback){
				var self = this;
				
				_getJson(url).done(function(data){
					var articles = [];

					for(var name in data.data){
						var article = data.data[name];
						for(var contentName in article){
							article[contentName] = article[contentName].sort();
						}
						articles.push({
							name : name,
							title : name.split("_").pop(),
							date : name.split("_").shift(),
							content : article
						});
					}
					// extract the last filename from directory path;
					callback(articles, destination);
				});
			},

			easyloader : function(parent, pictures, size){
				parent.style.backgroundSize = "cover";
				parent.style.backgroundRepeat = "no-repeat";
				parent.style.backgroundPosition = "50%";
				parent.style.width= "100%";
				parent.style.height= "100%";
				parent.style.display= "block";
				
				var deferred = $.Deferred();
				var self = this;
				var wait = 75; 
				var image = new Image();
				image.style.display = "none";
				parent.appendChild(image);
				var loader = function(i){
					var t0 = new Date().getTime();
					image.src = "http://lab.ogre.be/salutpublic/"+i.current;
					image.onload = function() {
						parent.style.backgroundImage = "url("+this.src+")";
						if(i.hasNext() && (!size || this.width * this.height < size)){
							setTimeout(function(){
								loader(i.next());
							}, Math.max(Math.min( wait, wait - (new Date().getTime() - t0)), 0));
						}else{
							this.parentNode.removeChild(this);
							deferred.resolve();	
						}
					};
				};
				loader(new self.Iterator(pictures));
				/**/
				return deferred.promise();
			}
		};
	}());
}());