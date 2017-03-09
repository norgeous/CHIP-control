import React, { Component, PropTypes }                                              from 'react'
import io                                                                           from 'socket.io-client'
import { VictoryContainer, VictoryChart, VictoryAxis, VictoryLine, VictoryTooltip } from 'victory'

let socket = io('http://'+window.location.hostname+':38917')

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
    return (
      <div className="Graph">

        <div style={{float:'left'}}>
        <h2>Temperature</h2>
        Received {temperature.length} values, last value: {temperature.length?temperature[temperature.length-1].value:''} °C<br/>
        <VictoryChart width={500} height={300}
          containerComponent={<VictoryContainer responsive={false}/>}
        >
          <VictoryAxis scale="time"/>
          <VictoryAxis dependentAxis domain={[0,60]}/>
          <VictoryLine
            style={{ data: { stroke: "orange", strokeWidth: 5 }}}
            data={temperature}
            labelComponent={<VictoryTooltip/>}
            x="time"
            y="value"
          />
        </VictoryChart>
        </div>



        <div style={{float:'left'}}>
        <h2>Voltage</h2>
        Received {voltage.length} values, last value: {voltage.length?voltage[voltage.length-1].value:''} Volts<br/>
        <VictoryChart width={500} height={300}
          containerComponent={<VictoryContainer responsive={false}/>}
        >
          <VictoryAxis scale="time"/>
          <VictoryAxis dependentAxis domain={[3.0,4.5]}/>
          <VictoryLine
            data={voltage}
            domain={{y:[3.0,4.5]}}
            x="time"
            y="value"
            style={{ data: { stroke: "blue", strokeWidth: 5 }}}
          />
        </VictoryChart>
        </div>



        <div style={{float:'left'}}>
        <h2>Combined</h2>
        attempt 1<br/>
        <VictoryChart width={500} height={300}
          containerComponent={<VictoryContainer responsive={false}/>}
        >
          <g> 
            <VictoryAxis
              standalone={false}
              domain={temperature.length?[temperature[0].time, temperature[temperature.length-1].time]:[0,0]}
              scale="time"
            /> 

            <VictoryAxis dependentAxis
              standalone={false}
              domain={[0, 60]}
              orientation="left"
              style={{ axis: { stroke: "orange", strokeWidth: 1 }}}
            />
            <VictoryLine
              standalone={false}
              data={temperature}
              domain={{y:[0,60]}}
              x="time"
              y="value"
              style={{ data: { stroke: "orange", strokeWidth: 3 }}}
            />

            <VictoryAxis dependentAxis
              standalone={false}
              domain={[3.0, 4.5]}
              orientation="right"
              style={{ axis: { stroke: "blue", strokeWidth: 1 }}}
            />
            <VictoryLine
              standalone={false}
              data={voltage}
              domain={{y:[3.0,4.5]}}
              x="time"
              y="value"
              style={{ data: { stroke: "blue", strokeWidth: 3 }}}
            />
          </g>
        </VictoryChart>
        </div>




      </div>
    )
  }

}

export default Graph
