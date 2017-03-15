const five = require('johnny-five')
const chipio = require('chip-io')
const fs = require('fs')
const exec = require('child_process').exec
const execSync = require('child_process').execSync
const io = require('socket.io')()
const StaticServer = require('static-server')


var board = new five.Board({
  repl: false,
  debug: false,
  io: new chipio()
})

board.on('ready', function() {
  
  // add node-chip-io vars
  var statusLed = new chipio.StatusLed()
  var onboardButton = new chipio.OnboardButton()
  var thermometer = new chipio.InternalTemperature()
  var voltmeter = new chipio.BatteryVoltage()
  
  // lcd setup
  var lcd = false
  if(lcd) var lcd = new five.LCD({controller: "PCF8574T", address: 0x3f, bus: 1, rows: 2, cols: 16})
  
  // history
  var datasets = {
    temperature: { last: 0, batch: [], record: [] },
    voltage:     { last: 0, batch: [], record: [] }
  }

  //add function, records averages of timed batches of results
  function add(to, value) {
    if(value !== 0) {
      if(lcd) {
        switch(to) {
          case 'temperature':
            lcd.cursor(0,0).print(value+' C')
            break
          case 'voltage':
            lcd.cursor(1,0).print(value+' Volts')
            break
        }
      }
      var now = new Date().getTime()
      var batch_duration = 60 * 1000
      var batch_start = now - (now % batch_duration)
      datasets[to].batch.push(value)
      if(datasets[to].last !== batch_start) {
        datasets[to].last = batch_start
        var sum = datasets[to].batch.reduce(function(a, b) { return a + b })
        var average = parseFloat((sum / datasets[to].batch.length).toFixed(2))
        datasets[to].batch = []
        console.log(to, average)
        var o = {
          x: batch_start,
          y: average
        }
        datasets[to].record.push(o)
        io.emit(to, o)
      }
    }
  }

  //add thermometer / voltmeter
  thermometer.on('change', data => add('temperature', data.celsius))
  voltmeter.on('change', volts => add('voltage', volts))
  
  // one press button to shutdown
  onboardButton.on('up', function() {
    statusLed.on()
    setTimeout(function(){statusLed.off()}, 50)
    console.log('button')
    execSync('init 0')
  })

  // socket io server
  io.on('connect', client => {
    console.log('new customer', client.id)
    client.emit('history',datasets)
  })
  io.listen(38917)

  // http server
  var server = new StaticServer({
    rootPath: './../client/build',
    name: 'CHIP-control',
    port: 38916,
    cors: '*'
  })
  server.start(function () {console.log('Static server listening to', server.port)})

})
