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
  var voltmeter = new chipio.BatteryVoltage()

  thermometer.on('change', function(data) {
    io.emit('temperature', data.celsius);
  })
  
  voltmeter.on('change', function(v) {
    io.emit('voltage', v);
  });


  onboardButton.on('up', function() {
    
    statusLed.on()
    setTimeout(function(){statusLed.off()},50)

    console.log('button')

  })

})
