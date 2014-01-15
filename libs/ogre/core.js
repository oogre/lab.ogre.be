	var OGRE;
(function(){
	"use strict";
	/*global $:false */
	/*global window:false */
	/*global NodeList:false */


	String.prototype.querySelector = function(selector){
		var htmlObject = document.createElement("div");
		htmlObject.innerHTML = this;
		return htmlObject.querySelector("div " + selector);
	};

	String.prototype.querySelectorAll = function(selector){
		var htmlObject = document.createElement("div");
		htmlObject.innerHTML = this;
		return htmlObject.querySelectorAll("div " + selector);
	};

	Array.prototype.querySelectorAll = function(selector){
		return this.map(function(elem){
			return elem.querySelectorAll(selector);
		});
	};

	NodeList.prototype.querySelectorAll = function(selector){
		return this.map(function(elem){
			return elem.querySelectorAll(selector);
		});
	};
	DOMTokenList.prototype.map = function(fnc){
		return Array.prototype.slice.call(this).map(fnc);
	};
	NodeList.prototype.map = function(fnc){
		return Array.prototype.slice.call(this).map(fnc);
	};

	Array.prototype.last = function(){
		return this[this.length-1];
	};

	Array.prototype.first = function(){
		return this[0];
	};
	NodeList.prototype.first = function(){
		return Array.prototype.slice.call(this).first();
	};
	NodeList.prototype.last = function(){
		return Array.prototype.slice.call(this).last();
	};

	Number.prototype.map = function(istart, istop, ostart, ostop) {
		return ostart + (ostop - ostart) * ((this - istart) / (istop - istart));
	};

	OGRE = function(){
		var FILE = document.querySelector("[src*='ogre']").src;

		var PATH = FILE.substr(0, FILE.length - FILE.split("/").pop().length);

		var getScript = function (name) {
			return $.getScript(("/" === name.substr(0, 1) ? "" : PATH) + "" + name);
		};

		var dependanciesLoader = function(){
			var dependancies = [];
			for(var k = arguments.length-1 ; k >= 0 ; k--){
				dependancies.push(getScript(arguments[k]));
			}
			return $.when.apply($, dependancies);
		};

		var init = (function(){
			var deferred = $.Deferred();
			dependanciesLoader("asynchronny.js", "tools.js")
				.fail(function(){
					console.log(arguments);
					window.alert("dependanciesLoader");
				})
				.done(function(){
					deferred.resolve();
				});
			return deferred.promise();
		}());

		return {
			ready : function(fnc){
				var self = this;
				init.done(function(){
					fnc(self);
				});
				return this;
			}
		};
	};
}());