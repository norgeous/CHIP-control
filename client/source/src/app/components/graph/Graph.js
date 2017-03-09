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

        <br/>

        <h2>Voltage</h2>
        Received {voltage.length} values, last value: {voltage.length?voltage[voltage.length-1].value:''} Volts<br/>
        <VictoryChart width={500} height={300}>
          <VictoryAxis scale="time"/>
          <VictoryAxis dependentAxis domain={[3,4.5]}/>
          <VictoryLine
            style={{ data: { stroke: "blue", strokeWidth: 5 }}}
            data={voltage}
            x="time"
            y="value"
          />
        </VictoryChart>

        <br/>

        <h2>Test</h2>
        <svg viewBox="0 0 450 350">
          <g> 
            <VictoryAxis
              scale="time"
              standalone={false}
              style={styles.axisYears}
            /> 

            <VictoryAxis dependentAxis
              domain={[0, 60]}
              orientation="left"
              standalone={false}
              style={{ data: { stroke: "orange", strokeWidth: 5 }}}
            />
            <VictoryLine
              data={temperature}
              interpolation="monotoneX"
              scale={{x: "time", y: "linear"}}
              standalone={false}
              style={{ data: { stroke: "orange", strokeWidth: 5 }}}
            />

            <VictoryAxis dependentAxis
              domain={[3, 4.5]}
              orientation="right"
              standalone={false}
              style={{ data: { stroke: "orange", strokeWidth: 5 }}}
            />
            <VictoryLine
              data={voltage}
              interpolation="monotoneX"
              scale={{x: "time", y: "linear"}}
              standalone={false}
              style={{ data: { stroke: "orange", strokeWidth: 5 }}}
            />
          </g>
        </svg>




      </div>
    )
  }

}

export default Graph
