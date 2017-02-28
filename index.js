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

setInterval(function(){
  io.emit('broadcast', {some:'value'});
},1000);



var menu = require('./scripts').menu
var say = require('./scripts').say

//execSync('echo none | tee "/sys/class/leds/chip:white:status/trigger"')
//execSync('statusled none')

var board = new five.Board({
  repl: false,
  debug: false,
  io: new chipio()
})

board.on('ready', function() {
  
  var stats = {
    press_count: 0,
    temperature: 'unknown',
    voltage: 'unknown',
  }
  var press_timeout
  var press_timeout_length = 2000
  var cmdclock

  var statusLed = new chipio.StatusLed()
  var onboardButton = new chipio.OnboardButton()

  var thermometer = new chipio.InternalTemperature()
  thermometer.on('change', function(data) {
    stats.temperature = data.celsius.toFixed(0)
  })
  
  var voltmeter = new chipio.BatteryVoltage()
  voltmeter.on('change', function(v) {
    stats.voltage = v.toFixed(1)
  });


  onboardButton.on('up', function() {
    
    statusLed.on()
    setTimeout(function(){statusLed.off()},50)

    if(typeof cmdclock === 'object' && cmdclock._idleTimeout !== -1) {

      clearTimeout(cmdclock)
      say('. cancelled')

    } else {

      clearTimeout(press_timeout)
      
      stats.press_count++
      say(stats.press_count)
      console.log(stats.press_count)
          
      press_timeout = setTimeout(function(){
        
        if(typeof menu[stats.press_count-1] !== 'undefined'){
          cmdclock = menu[stats.press_count-1].cmd(stats)
        } else {
          say('. '+stats.press_count+'. command undefined')
        }
        stats.press_count = 0
      }, press_timeout_length)
    }

  })

  say('. menu ready')

})
