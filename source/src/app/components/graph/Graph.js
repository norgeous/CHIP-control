import React, {
  Component,
  PropTypes
}                       from 'react';
import io from 'socket.io-client';


import {Chart} from 'react-d3-core';
import {LineChart} from 'react-d3-basic';

import { VictoryChart, VictoryAxis, VictoryLine } from 'victory';

// let socket = io('http://localhost:3111');
let socket = io('http://192.168.1.102:3111');

class Graph extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      temperature: [],
      voltage: [],
    };
  }

  componentDidMount() {
    const me = this;

    socket.on('temperature', o => {
      if(me.state.temperature.length>=200) me.state.temperature.shift();
      me.setState({
        temperature: me.state.temperature.concat([o])
      });
    });
    
    socket.on('voltage', o => {
      if(me.state.voltage.length>=200) me.state.voltage.shift();
      me.setState({
        voltage: me.state.voltage.concat([o])
      });
    });

  }
  
  render() {
    const { temperature, voltage } = this.state;
    return (
      <div className="Graph">
        <VictoryChart width={3000} height={600}>
          <VictoryAxis />
          <VictoryAxis dependentAxis domain={[0,50]}/>
          <VictoryLine
            style={{ data: { stroke: "orange" }}}
            data={temperature}
            x="time"
            y="value"
          />
        </VictoryChart>
        {temperature.length}<br/>{temperature.length?temperature[temperature.length-1].value:''}
        <br/>
        <VictoryChart width={3000} height={600}>
          <VictoryAxis />
          <VictoryAxis dependentAxis domain={[3.2,4.2]}/>
          <VictoryLine
            style={{ data: { stroke: "blue" }}}
            data={voltage}
            x="time"
            y="value"
          />
        </VictoryChart>
        {voltage.length}<br/>{voltage.length?voltage[voltage.length-1].value:''}
        {/*<LineChart margins={{left: 100, right: 100, top: 50, bottom: 50}} title="test2" data={temperature} width={1500} height={400} chartSeries={[{field:'value', name:'Temperature', color:'#ff7f0e', area:true}]} x={function(d){return d.time;}} xScale="time" yScale="linear" yLabel="Temperature (°C)" xLabel="Time" yDomain={[35,55]}/>
        temperature.map((datapoint, i) =>
          <div key={i}>
            {datapoint.time}: {datapoint.value}
          </div>
        )*/}
      </div>
    );
  }

}

export default Graph;
