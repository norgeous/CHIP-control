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
      label: 'Sales',
      type:'line',
      data: [{
                x: -5,
                y: -10
            }, {
                x: 1,
                y: 10
            }, {
                x: 15,
                y: 49
            }],
      yAxisID: 'y-axis-2'
    },{
      type: 'line',
      label: 'Visitor',
      data: [{
                x: -10,
                y: 0
            }, {
                x: 0,
                y: 10
            }, {
                x: 10,
                y: 5
            }, {
                x: 20,
                y: 5
            }, {
                x: 30,
                y: 50
            }],
      yAxisID: 'y-axis-1'
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
        display: true,
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      }
    ],
    yAxes: [
      {
        type: 'linear',
        display: true,
        position: 'left',
        id: 'y-axis-1',
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      },
      {
        type: 'linear',
        display: true,
        position: 'right',
        id: 'y-axis-2',
        gridLines: {
          display: false
        },
        labels: {
          show: true
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
