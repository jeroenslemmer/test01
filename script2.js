var box = document.getElementById('box');
box.style.top = '200px';
box.style.left = '400px';
var i = 0;
function move(){
	var left = parseInt(box.style.left.replace('px',''));
	if (left > 1200) {
		left = 0;
	}
	var left = (left + 4)  + 'px';
	console.log(left);
	box.style.left = left;
	//console.log(b

}

	var box = document.getElementById('box');
	console.dir(box.style);

setInterval(move,5);