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
        voltage: o.voltage.record
      })
    })

    socket.on('temperature', o => {
      me.setState({
        temperature: me.state.temperature.concat([o])
      })
    })
    
    socket.on('voltage', o => {
      me.setState({
        voltage: me.state.voltage.concat([o])
      })
    })

  }
  
  render() {

    const { temperature, voltage } = this.state

const data = {
  datasets: [{
      type: 'line',
      label: 'Temperature (C)',
      data: temperature,
      yAxisID: 'temperature',
      backgroundColor: "red",
      borderColor: "red"
    },{
      type:'line',
      label: 'Voltage (V)',
      data: voltage,
      yAxisID: 'voltage',
      backgroundColor: "orange",
      borderColor: "orange"

    }]
};


const options = {
  responsive: true,
  tooltips: {
    mode: 'nearest',
    intersect: false,
    callbacks: {
      title: function(tooltipItem, data) {
        return moment(tooltipItem[0].xLabel).format('Do MMMM Y - hh:mm:ss A');
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
      },
      {
        type: 'linear',
        position: 'right',
        id: 'voltage',
        ticks: {
          suggestedMin: 3,
          suggestedMax: 4.4
        },
        gridLines: {
          display: false
        }
      }
    ]
  }
};

//console.log(temperature)

    return (
      <div className="Graph">
        {temperature.length}
        <Line data={data} options={options} />
      </div>
    )
  }

}

export default Graph
