(function(){
	"use strict";
	/*global GETYOO:false */

	GETYOO.CONF = {
		CACHE : {
			name : "GETYOO.CACHE"
		},
		cleaner : {
			autoindex : {
				selector : "a:not([href='../'])",
				get : function(elem){
					return {
						name : elem.innerHTML,
						dir : null !== elem.innerHTML.match(/\//g, "")
					};
				}
			}
		},

		view : {
			filename : "views",
			attribut : "getyooview",
			request :{
				url : "http://gleadr.getyoo.dev/",
				dataType : "html",
			}
		},
		userDetails : {
			request :{
				url : "{GETYOO_API}requestuserbyid",
				dataType : "json",
				data: {
					userid : 8
				}
			}
		},
		saveUserDetails : {
			request :{
				url : "{GETYOO_API}adduser",
				dataType : "json",
				data: {}
			}
		},
		loguser : {
			request:{
				url:"{GETYOO_API}loguser",
				dataType : "json",
				data: {}
			}
		},
		getyoo_api : {
			request : {
				url : window.location.protocol+"//connect.getyoo-uat.net/api/",
				data : {
					token : "b6340096014ef0cbbe062d26b504c04a",
					signature : "peugeot2013"
				}
			}
		},

		init : function(){
			this.view.request.url += this.view.filename+"/";

			this.userDetails.request.url = this.userDetails.request.url.replace("{GETYOO_API}", this.getyoo_api.request.url);
			this.userDetails.request.data = $.extend(this.userDetails.request.data, this.getyoo_api.request.data);

			this.saveUserDetails.request.url = this.saveUserDetails.request.url.replace("{GETYOO_API}", this.getyoo_api.request.url);
			this.saveUserDetails.request.data = $.extend(this.saveUserDetails.request.data, this.getyoo_api.request.data);

			this.loguser.request.url = this.loguser.request.url.replace("{GETYOO_API}", this.getyoo_api.request.url);
			this.loguser.request.data = $.extend(this.loguser.request.data, this.getyoo_api.request.data);

			delete this.init;
			return this;
		}
	}.init();
}());