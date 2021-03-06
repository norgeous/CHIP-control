import React, { Component, PropTypes } from 'react'
import io                              from 'socket.io-client'
import moment                          from 'moment'
import { Line }                        from 'react-chartjs-2'

class Graph extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      temperature: [],
      voltage: [],
      amps1: [],
      amps2: []
    }
  }

  componentDidMount() {
    const me = this

    let socket = io('http://'+window.location.hostname+':38917')
    //let socket = io('http://192.168.1.102:38917')
    
    socket.on('history', o => {
      //console.log('history', o)
      me.setState({
        temperature: o.temperature.record,
        voltage: o.voltage.record,
        amps1: o.amps1.record,
        amps2: o.amps2.record
      })
    })

    socket.on('temperature', o => {me.setState({temperature: me.state.temperature.concat([o])})})
    socket.on('voltage', o => {me.setState({voltage: me.state.voltage.concat([o])})})
    socket.on('amps1', o => {me.setState({amps1: me.state.amps1.concat([o])})})
    socket.on('amps2', o => {me.setState({amps2: me.state.amps2.concat([o])})})

  }
  
  render() {

    const { temperature, voltage, amps1, amps2 } = this.state

    const data = {
      datasets: [{
          type: 'line',
          label: 'Temperature (C)',
          data: temperature,
          yAxisID: 'temperature',
          backgroundColor: "red",
          borderColor: "red"
        }]
    }

    const options = {
      responsive: true,
      tooltips: {
        mode: 'nearest',
        intersect: false,
        callbacks: {
          title: function(tooltipItem, data) {
            return moment(tooltipItem[0].xLabel).format('Do MMMM Y - hh:mm A')
          }
        }
      },
      elements: {
        line: {
          fill: false
        }
      },
      scales: {
        xAxes: [
          {
            type: 'time',
            position: 'bottom',
            gridLines: {
              display: false
            }
          }
        ],
        yAxes: [
          {
            type: 'linear',
            position: 'left',
            id: 'temperature',
            ticks: {
              suggestedMin: 0,
              suggestedMax: 100
            },
            gridLines: {
              display: false
            }
          }
        ]
      }
    }


    const data2 = {
      datasets: [{
          type:'line',
          label: 'Voltage (V)',
          data: voltage,
          yAxisID: 'voltage',
          backgroundColor: "violet",
          borderColor: "violet"
        },{
          type: 'line',
          label: 'Current In (mA)',
          data: amps1,
          yAxisID: 'amps',
          backgroundColor: "indigo",
          borderColor: "indigo"
        },{
          type: 'line',
          label: 'Current Out (mA)',
          data: amps2,
          yAxisID: 'amps',
          backgroundColor: "orange",
          borderColor: "orange"
        }]
    }

    const options2 = {
      responsive: true,
      tooltips: {
        mode: 'nearest',
        intersect: false,
        callbacks: {
          title: function(tooltipItem, data) {
            return moment(tooltipItem[0].xLabel).format('Do MMMM Y - hh:mm A')
          }
        }
      },
      elements: {
        line: {
          fill: false
        }
      },
      scales: {
        xAxes: [
          {
            type: 'time',
            position: 'bottom',
            gridLines: {
              display: false
            }
          }
        ],
        yAxes: [
          {
            type: 'linear',
            position: 'left',
            id: 'voltage',
            ticks: {
              suggestedMin: 3,
              suggestedMax: 4.4
            },
            gridLines: {
              display: false
            }
          },
          {
            type: 'linear',
            position: 'right',
            id: 'amps',
            ticks: {
              suggestedMin: 0,
              suggestedMax: 300
            },
            gridLines: {
              display: false
            }
          }
        ]
      }
    }

    return (
      <div className="Graph">
        temperature: {temperature.length}<br/>
        voltage: {voltage.length}<br/>
        amps1: {amps1.length}<br/>
        amps2: {amps2.length}<br/>
        <div style={{width:'50%',float:'left',padding:'40px'}}><Line data={data} options={options} /></div>
        <div style={{width:'50%',float:'left',padding:'40px'}}><Line data={data2} options={options2} /></div>
      </div>
    )
  }

}

export default Graph
