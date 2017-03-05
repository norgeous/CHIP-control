var five = require('johnny-five')
var chipio = require('chip-io')
var fs = require('fs')
var exec = require('child_process').exec
var execSync = require('child_process').execSync
var io = require('socket.io')()

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
  
  var datasets = {
    temperature: { last: 0, batch: [], record: [] },
    voltage:     { last: 0, batch: [], record: [] }
  }

  function add(to, value) {
    if(value !== 0) {
      var now = new Date().getTime()
      var batch_duration = 60 * 1000
      var batch_start = now - (now % batch_duration)
      datasets[to].batch.push(value)
      if(datasets[to].last !== batch_start) {
        datasets[to].last = batch_start
        var sum = datasets[to].batch.reduce(function(a, b) { return a + b })
        var average = parseFloat((sum / datasets[to].batch.length).toFixed(2))
        datasets[to].batch = []
        var o = {
          time: batch_start,
          value: average
        }
        datasets[to].record.push(o)
        console.log(to, o)
        io.emit(to, o)
      }
    }
  }

  thermometer.on('change', data => add('temperature', parseFloat(data.celsius.toFixed(1))))
  voltmeter.on('change', volts => add('voltage', parseFloat(volts.toFixed(4))))
  
  onboardButton.on('up', function() {
    statusLed.on()
    setTimeout(function(){statusLed.off()}, 50)
    console.log('button')
  })

  io.on('connect', client => {
    console.log('new customer', client.id)
    client.emit('history',datasets);
  })
  
  io.listen(3111)

})
