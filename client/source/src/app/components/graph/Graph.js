import React, { Component, PropTypes }                                                                       from 'react'
import io                                                                                                    from 'socket.io-client'
import { VictoryContainer, VictoryChart, VictoryAxis, VictoryLine, VictoryVoronoiContainer, VictoryTooltip } from 'victory'
import moment                                                                                                from 'moment'

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
            style={{ data: { stroke: "blue", strokeWidth: 5 }, labels: {fill: "tomato"}}}
          />
        </VictoryChart>
        </div>



        <div style={{float:'left'}}>
        <h2>Combined</h2>
        attempt 1<br/>
          {/*containerComponent={<VictoryContainer responsive={false}/>}*/}
        <VictoryChart width={500} height={300}
          containerComponent={
            <VictoryVoronoiContainer dimension="x"
              labels={(d) => `${moment(d.x).format('hh:mmA')} : ${d.y}`}
              labelComponent={<VictoryTooltip flyoutStyle={{fill: "white"}}/>}
            />
          }
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
              style={{ data: { stroke: "orange", strokeWidth: (d, active) => active ? 4 : 2}, labels: {fill: "orange"} }}
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
              style={{ data: { stroke: "blue", strokeWidth: (d, active) => active ? 4 : 2}, labels: {fill: "blue"} }}
            />
          </g>
        </VictoryChart>
        </div>

          <VictoryChart
            domainPadding={{y: 2}}
            containerComponent={
              <VictoryVoronoiContainer dimension="x" responsive={false}
                style={{
                  data: { stroke: "black", strokeWidth: 2 }
                }}
                labels={(d) => `y: ${d.y}`}
                labelComponent={<VictoryTooltip cornerRadius={0} flyoutStyle={{fill: "white"}}/>}
              />
            }
          >
            <VictoryLine
              data={[
                {x: 1, y: 5, l: "one"},
                {x: 1.5, y: 5, l: "one point five"},
                {x: 2, y: 4, l: "two"},
                {x: 3, y: -2, l: "three"}
              ]}
              style={{
                data: { stroke: "tomato", strokeWidth: (d, active) => active ? 4 : 2},
                labels: {fill: "tomato"}
              }}
            />

            <VictoryLine
              data={[
                {x: 1, y: -3, l: "red"},
                {x: 2, y: 5, l: "green"},
                {x: 3, y: 3, l: "blue"}
              ]}
              style={{
                data: { stroke: "blue", strokeWidth: (d, active) => active ? 4 : 2},
                labels: {fill: "blue"}
              }}
            />

            <VictoryLine
              data={[
                {x: 1, y: 5, l: "cat"},
                {x: 2, y: -4, l: "dog"},
                {x: 3, y: -2, l: "bird"}
              ]}
              style={{
                data: { stroke: "black", strokeWidth: (d, active) => active ? 4 : 2},
                labels: {fill: "black"}
              }}
            />
</VictoryChart>


      </div>
    )
  }

}

export default Graph
