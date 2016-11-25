
var Client = require("ibmiotf");
//var sleep = require("sleep");
var m = require('mraa'); //require mraa
var serialport = require("serialport");
var deviceConfig = new require("./weather.json");
var deviceClient = new Client.IotfGateway(deviceConfig);
//var deviceClient = new Client.IotfDevice(deviceConfig);

var msg ;
var SerialPort = serialport.SerialPort;
var serialPort = new SerialPort("/dev/ttyUSB0", {
  baudrate: 2400,
  parser: serialport.parsers.readline("\n")
});

serialPort.on("open", function () {
  console.log('open');
  serialPort.on('data', function(data) {
	  if(data.length >= 34)
	  {
		  msg = data;
	  }
    //console.log(data);
  });
});


console.log("msg: " + msg);
var chordIndex=0;

var getTemp = function() {
	        var cel=temp.value();
		        console.log("current Temp is " + cel);
			        return cel.toFixed(4);
};

var getWindDirection = function(msg){
		var winddirection = msg.substring(1, 4);
			console.log("Wind Direction : ",winddirection);
					return winddirection;
};

var getWindSpeed = function(msg){
		var windSpeed = msg.substring(9, 12) * 0.44704;
			console.log("Wind Speed : ",windSpeed);
					return windSpeed;
};

var getTemperature = function(msg){
		var temperature = (msg.substring(13, 16) - 32.00) * 5.00 / 9.00;
			console.log("Temperature : ",temperature);
					return temperature;
};

var getRainfall = function(msg){
		var rainfall = msg.substring(21, 24) * 25.40 * 0.01;
			console.log("Wind speed : ",rainfall);
					return rainfall;
};
var getHumidity = function(msg){
		var humidity = msg.substring(25, 27);
			console.log("Humidity : ",humidity);
					return humidity;
};
var getAtmosphere = function(msg){
		var atmosphere = msg.substring(28, 34) *0.1;
			console.log("Atmosphere : ",atmosphere);
					return atmosphere;
};

deviceClient.connect();
deviceClient.log.setLevel('debug');
deviceClient.on("connect", function() {
	        console.log("successfully connected to IoTF");

		 setInterval(function() {
			                 deviceClient.publishGatewayEvent("status","json",'{"d":{"windDirection":' +getWindDirection(msg) +'}}'); 
							 deviceClient.publishGatewayEvent("status","json",'{"d":{"windSpeed":' +getWindSpeed(msg) +'}}');
							 deviceClient.publishGatewayEvent("status","json",'{"d":{"Temp":' +getTemperature(msg) +',"Rain":'+getRainfall(msg) +',"Humidity":'+getHumidity(msg)+',"Atmosphere":'+getAtmosphere(msg)+'}}');
				/*			 deviceClient.publishDeviceEvent("status","json",'{"d":{"Rainfall":' +getRainfall(msg) +'}}');
							 deviceClient.publishDeviceEvent("status","json",'{"d":{"Humidity":' +getHumidity(msg) +'}}');
							 deviceClient.publishDeviceEvent("status","json",'{"d":{"Atmosphere":' +getAtmosphere(msg) +'}}');*/ },2000);
}); 



