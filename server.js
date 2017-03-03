var five = require('johnny-five')
var chipio = require('chip-io')
var fs = require('fs')
var exec = require('child_process').exec
var execSync = require('child_process').execSync
var io = require('socket.io')();

io.on('connect', function(client){
  console.log('new customer');
});
io.listen(3111);

var board = new five.Board({
  repl: false,
  debug: false,
  io: new chipio()
})

board.on('ready', function() {
  
  var statusLed = new chipio.StatusLed()
  var onboardButton = new chipio.OnboardButton()

  var thermometer = new chipio.InternalTemperature()
  var history_temperature = [];
  thermometer.on('change', function(data) {
    if(history_temperature.length<10) history_temperature.push(data.celsius);
    else {
      var sum = history_temperature.reduce(function(a, b) { return a + b; });
      var average = (sum / history_temperature.length).toFixed(2);
      io.emit('temperature', {
        time: new Date().getTime(),
        value: average
      });
      history_temperature = [];
    }
  })
  
  var voltmeter = new chipio.BatteryVoltage()
  voltmeter.on('change', function(volts) {
    io.emit('voltage', {
      time: new Date().getTime(),
      value: volts
    });
  });

  onboardButton.on('up', function() {
    
    statusLed.on()
    setTimeout(function(){statusLed.off()},50)

    console.log('button')

  })

})
