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


const data = {
  datasets: [{
      type: 'line',
      label: 'Visitor',
      data: [{
                x: 1,
                y: 0
            }, {
                x: 2,
                y: 10
            }, {
                x: 3,
                y: 5
            }, {
                x: 4,
                y: 5
            }, {
                x: 5,
                y: 50
            }],
      yAxisID: 'temperature'
    },{
      label: 'Sales',
      type:'line',
      data: [{
                x: 1,
                y: 3.5
            }, {
                x: 2,
                y: 4
            }, {
                x: 3,
                y: 3.2
            }, {
                x: 4,
                y: 3.2
            }, {
                x: 5,
                y: 3.2
            }],
      yAxisID: 'voltage'
    }]
};


const options = {
  responsive: true,
  tooltips: {
    mode: 'label'
  },
  elements: {
    line: {
      fill: false
    }
  },
  scales: {
    xAxes: [
      {
        type: 'linear',
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
          suggestedMax: 4.5
        },
        gridLines: {
          display: false
        }
      }
    ]
  }
};



    const { temperature, voltage } = this.state
    return (
      <div className="Graph">
        <Line data={data} options={options} />
      </div>
    )
  }

}

export default Graph
