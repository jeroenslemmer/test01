'use strict'

var MyColor = new (function(){
	this.random = function(distance){
		var randomChannel = function(){
			let ch = Math.min(255,Math.floor(Math.random() * (256 / distance)) * distance).toString(16);
			while (ch.length < 2) ch = '0' + ch;
			return ch;
		};
		return '#' + 	randomChannel() + randomChannel() +	randomChannel();
	}
})();

var MyMath = {
	sign: function(value){
		return (value < 0)?-1:1;
	},
	randomInt(min, range, includeZero){
		let result;
		if (range <= 0) return 0;
		while (true){
			result = min + Math.floor(Math.random() * range);
			if (includeZero || result !== 0) return result;
		}
	}
}

var stringTime = function(){
	let d = new Date();
	return d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();	
}
var animator = new (function(){
	var animations = [];
	var proceed = false;
	var speed = 1;

	var nextFrame = function(event){
		//console.log(stringTime());
		if (!proceed) return;
		let doneTargets = [];
		let a = 0;
		let animationEnded;
		while (a < animations.length){
			if (doneTargets.indexOf(animations[a].target) == -1){
				doneTargets.push(animations[a].target);
				animationEnded = animations[a].nextFrame(animations[a].target,animations[a].parameters);
				if (animationEnded){
					animations.splice(a,1);
				} else {
					a++;
				}
			} else {
				a++;
			}
		}
		//window.requestAnimationFrame(nextFrame);
		setTimeout(nextFrame,10);
	}

	this.register = function(animation){ 
		// animation = {target: Object, nextFrame: Function, parameters: Object}
		animations.push(animation);
	}

	this.registerObject = function(object){
		if (object instanceof Object && object.nextFrame instanceof Function)
			this.register({target: object, nextFrame: object.nextFrame, parameters: {}})
	}

	this.start = function(){
		proceed = true;
		window.requestAnimationFrame(nextFrame);
	}

	this.stop = function(){
		proceed = false;
	}
})();

var blackHole = {
	x: -1,
	y: -1
}

var UFO = (function(){
	let ufo = function(containerId){ // constructor
		let div = document.createElement('DIV');
		div.className = 'ball';
		let diameter = 10 + Math.floor(Math.random()*50) * 2;
		div.style.width = diameter + 'px';
		div.style.height = diameter + 'px';
		div.style.borderRadius = (diameter / 2) + 'px';
		div.style.backgroundColor = MyColor.random(32);
		div.style.opacity = 0.7;
		this.velocity = {};
		this.velocity.x = MyMath.randomInt(-10,21, false);
		this.velocity.y = MyMath.randomInt(-10,21, false);
		this.element = div;
		let box = document.getElementsByTagName('body')[0];
		box.appendChild(div);
		this.X = Math.floor(window.innerWidth/2);
		this.Y = Math.floor(window.innerHeight/2);
	};

	var lineairMove = function(target,parameters){
		let x, y, dX, dY;
		// calculate borders
		let maxX = window.innerWidth - target.element.offsetWidth;
		let maxY = window.innerHeight - target.element.offsetHeight;

		// dX and dY: position change of element
		dX = target.velocity.x;
		dY = target.velocity.y;

		// calculate planned new position
		x = target.X + dX;
		y = target.Y + dY;

		if (x <= 0){ // adjust movement to limitations near borders and invert velocities.
			dX = -1 * target.X;
			dY = dX / target.velocity.x * target.velocity.y;
			target.velocity.x = -1 * target.velocity.x;
		} else if (x > maxX){
			dX = maxX- target.X;
			dY = dX / target.velocity.x * target.velocity.y;
			target.velocity.x = -1 * target.velocity.x;		
		} else if (y <= 0){
			dY = -1 * target.Y;
			dX = dY / target.velocity.y * target.velocity.x;
			target.velocity.y = -1 * target.velocity.y;
		} else if (y > maxY){
			dY = maxY - target.Y;
			dX = dY / target.velocity.y * target.velocity.x;
			target.velocity.y = -1 * target.velocity.y;
		}
		// set final position of element
		target.X += dX;
		target.Y += dY;
	}

	var moveToBlackHole = function(target,parameters){
		let dX = (blackHole.x - target.X)/10;
		let dY = (blackHole.y - target.Y)/10;
		target.X += dX;
		target.Y += dY;
	}

	ufo.prototype.nextFrame = function(target,parameters){
		if (blackHole.x == -1) 
			lineairMove(target,parameters);
		else
			moveToBlackHole(target,parameters);

		target.element.style.left = target.X + 'px'; 
		target.element.style.top = target.Y + 'px'; 
		return false;
	}
	return ufo;
})();


var collapseSpace = function(event){
	blackHole.x = event.clientX;
	blackHole.y = event.clientY;
}

var expandSpace = function(event){
	blackHole.x = -1;
	blackHole.y = -1;	
}

document.addEventListener('DOMContentLoaded',function(){
	var body = document.getElementById('space');
	body.addEventListener('mousedown',collapseSpace);
	body.addEventListener('mouseup',expandSpace);
	for (let i = 0; i < 80; i++) animator.registerObject(new UFO());
	animator.start();
});