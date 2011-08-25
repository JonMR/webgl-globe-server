var socket = io.connect('http://localhost:3000');
var locationMagnitude = {};
socket.on('usage', function (data) {
	console.log(data);
	var key = data.join('');
	if (!locationMagnitude[key]) {
		locationMagnitude[key] = 0.1;
	}
	else {
		locationMagnitude[key] += 0.1;
	}
	data.push(locationMagnitude[key]);
	data.push(1);
	window.data = data;
	globe.addData(data, {format: 'legend', animated: true});
	globe.createPoints();
});
