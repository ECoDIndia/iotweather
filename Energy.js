
var Client = require("ibmiotf");
var net = require('net');
//var sleep = require("sleep");
var deviceConfig = new require("./weather.json");
var deviceClient = new Client.IotfGateway(deviceConfig);
//var deviceClient = new Client.IotfDevice(deviceConfig);

var msg = "$HTSTEST1,HTS0001,A47C4365,A1FD4365,A0D04365,AAA54365,00000000,00000000,00000000,#";  // sample packet 
var client = new net.Socket();
client.connect(8080, '192.168.1.150', function() {
	console.log('Connected');
	client.write('REQDATA\r\n');
});

client.on('data', function(data) {
	if(data[data.length -1] == '35')
	{
		console.log('Received: ' + data);
		msg = data;
		client.destroy(); // kill client after server's response
	}
});

client.on('close', function() {
	console.log('Connection closed');
});
var chordIndex=0;

var getTemp = function() {
	        var cel=temp.value();
		        console.log("current Temp is " + cel);
			        return cel.toFixed(4);
};

var getTemperature = function(msg1){
	msg1 = msg1.toString();
	console.log("1111111111 : ",msg1);
		var res = msg1.split(',',3);
			console.log("Temperature : ",res[1]);
					return res[1];
};

var getVoltage = function(msg1){
		msg1 = msg1.toString();
		var res = msg1.split(',',10);
		var Data = res[2].substring(4,8)+res[2].substring(0,4);
		var buf = new Buffer(Data, "hex");
		var number = buf.readFloatBE(0);
			console.log("Voltage : ",number);
					return number;
};

var getCurrent = function(msg1){
		msg1 = msg1.toString();
		var res = msg1.split(',',10);
		var Data = res[3].substring(4,8)+res[3].substring(0,4);
		var buf = new Buffer(Data, "hex");
		var number = buf.readFloatBE(0);
			console.log("Current : ",number);
					return number;
};

var getFrequency = function(msg1){
		msg1 = msg1.toString();
		var res = msg1.split(',',10);
		var Data = res[4].substring(4,8)+res[4].substring(0,4);
		var buf = new Buffer(Data, "hex");
		var number = buf.readFloatBE(0);
			console.log("Frequency : ",number);
					return number;
};

var getPowerFactor = function(msg1){
		msg1 = msg1.toString();
		var res = msg1.split(',',10);
		var Data = res[5].substring(4,8)+res[5].substring(0,4);
		var buf = new Buffer(Data, "hex");
		var number = buf.readFloatBE(0);
			console.log("Power Factor : ",number);
					return number;
};

var getKwh = function(msg1){
		msg1 = msg1.toString();
		var res = msg1.split(',',10);
		var Data = res[6].substring(4,8)+res[6].substring(0,4);
		var buf = new Buffer(Data, "hex");
		var number = buf.readFloatBE(0);
			console.log("Kwh : ",number);
					return number;
};

deviceClient.connect();
//deviceClient.log.setLevel('debug');
deviceClient.on("connect", function() {
	        console.log("successfully connected to IoTF");

		 setInterval(function() {
				client.connect(8080, '192.168.1.150', function() {
				console.log('Connected');
				client.write('REQDATA\r\n');
				});
			                 deviceClient.publishGatewayEvent("status","json",'{"d":{"Voltage":' +getVoltage(msg) +'}}');
							 deviceClient.publishGatewayEvent("status","json",'{"d":{"Current":' +getCurrent(msg) +'}}');
							 deviceClient.publishGatewayEvent("status","json",'{"d":{"Frequency":' +getFrequency(msg) +'}}');
							 deviceClient.publishGatewayEvent("status","json",'{"d":{"Power Factor":' +getPowerFactor(msg) +'}}');
							 deviceClient.publishGatewayEvent("status","json",'{"d":{"Kwh":' +getKwh(msg) +'}}');
							},3000);
});
