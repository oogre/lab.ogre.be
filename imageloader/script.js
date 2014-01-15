jQuery().ready(function(){
	
	console.log("jQuery is ready");
	OGRE().ready(function(G){
		console.log("OGRE is ready");
		
	/* RESPONSIVE VERTICAL ROW */
		document.querySelectorAll('[class*="ogre-row-"]').map(function(elem){
			elem.classList.map(function(className){
				if(className.match("ogre-row-offset")){
					var setOffset = function(){
						var offset = parseInt(className.split("offset-").pop());
						var offset = offset * window.innerHeight / 12;
						elem.style.marginTop = offset + "px";	
					}
					window.addEventListener("resize", setOffset, false);
					setOffset();
				}
				else if(className.match("ogre-row-")){
					var setSize = function(){
						var size = parseInt(className.split("ogre-row-").pop());
						var size = size * window.innerHeight / 12;
						elem.style.marginBottom = size + "px";	
					}
					window.addEventListener("resize", setSize, false);
					setSize();
				}
			});
		});

	/* RESPONSIVE ANIMATION */
	
		document.querySelectorAll('.anim').map(function(elem){
			var setSpeed = function(){
				var d = window.innerWidth;
				var v = 900.0;
				var t = d / v;
				elem.style.transitionDuration = t + "s";
				elem.style.oTransitionDuration = t + "s";
				elem.style.mozTransitionDuration = t + "s";
				elem.style.webkitTransitionDuration = t + "s";
			}
			window.addEventListener("resize", setSpeed, false);
			setSpeed();
		});

	/* NAV */
		var nav = document.querySelector("#nav");
		nav.togglePosition = function(){
			this.classList.toggle("right");
			this.classList.toggle("left");
			return this;
		};
		nav.querySelectorAll("a").map(function(elem){
			elem.addEventListener("click", function(event){
				nav.togglePosition();
				transition(elem.getAttribute("href"));
			}, false);
		});

	/* CURRENT */
		var current = document.querySelector('.current');
		
		var transition = function(id){
			var out = document.querySelector('.out');
			if(out){
				out.classList.remove("smooth");
				out.classList.remove("left");
				out.classList.remove("right");
				out.classList.remove("out");
				out.classList.add("hide");
			}
			
			current.setAttribute("scrollTop", current.scrollTop);
			current.parentNode.insertBefore(document.querySelector(id), current);
			current.classList.add("smooth");
			current.classList.remove("current");
			current.classList.add("out");
			current.classList.add(nav.classList.contains("right") ? "right" : "left");

			current = document.querySelector(id);
			current.classList.add("current");
			current.classList.remove("out");
			current.classList.remove("smooth");
			current.classList.remove("right");
			current.classList.remove("left");
			current.classList.remove("hide");
			current.scrollTop = current.getAttribute("scrollTop") || 0;
		}

	/* LOAD ARCTICLES */
		OGRE.TOOLS.easyloader("source/birds/8731152245/", document.querySelector("#home li"));
		OGRE.TOOLS.easyloader("source/birds/8731158323/", document.querySelector("#home li+li"));
		OGRE.TOOLS.easyloader("source/birds/8731155201/", document.querySelector("#home li+li+li"));
		OGRE.TOOLS.easyloader("source/birds/8731154553/", document.querySelector("#home li+li+li+li"));
		OGRE.TOOLS.easyloader("source/birds/8731154017/", document.querySelector("#home li+li+li+li+li"));
		OGRE.TOOLS.easyloader("source/birds/8731159441/", document.querySelector("#home li+li+li+li+li+li"));

		OGRE.TOOLS.easyloader("source/starlight/9665887678/", document.querySelector("#archive li"));
		OGRE.TOOLS.easyloader("source/gold/8742211774/", document.querySelector("#archive li+li"));
		OGRE.TOOLS.easyloader("source/fleurs/9741355499/", document.querySelector("#archive li+li+li"));
		OGRE.TOOLS.easyloader("source/system/8309649751/", document.querySelector("#archive li+li+li+li"));
	});
});