(function(){
	"use strict";
	/*global $:false */

	/*
		HIGH ASYNCHRONOUS TESTIMONY
		ASYNCHRONNY
	*/

	OGRE.Asynchrony = function(){
		var witnessCouch = 0;
		var sentences = [];
		var sentencesArguements = [];
		var judgement = function(){
			sentences.map(function(sentence){
				return sentence.apply(null, sentencesArguements);
			});
		};

		return{
			witness : function(){
				witnessCouch ++;
				return this;
			},
			testify : function(){
				Array.prototype.push.apply(sentencesArguements, arguments);
				witnessCouch --;
				if(0 === witnessCouch){
					judgement();
				}
				return this;
			},
			done : function(fnc){
				sentences.push(fnc);
				return this;
			}
		};
	};
}());