import React, {
  Component,
  PropTypes
}                       from 'react';
import io from 'socket.io-client';
import {Chart} from 'react-d3-core';
import {LineChart} from 'react-d3-basic';

// let socket = io('http://localhost:3111');
let socket = io('http://192.168.1.102:3111');

class Graph extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      temperature: [],

    };
  }

  componentDidMount() {
    const me = this;

    socket.on('temperature', o => {
      if(me.state.temperature.length>=1000) me.state.temperature.shift();
      me.setState({
        temperature: me.state.temperature.concat([o])
      });
    });
    /*
    socket.on('temperature', o => {
      if(me.state.temperature.length>=100) me.state.temperature.shift();
      me.setState({
        temperature: me.state.temperature.concat([o])
      });
    });
*/
  }
  
  render() {
    const { temperature } = this.state;
    return (
      <div className="Graph">
        {temperature.length}
        <LineChart margins={{left: 100, right: 100, top: 50, bottom: 50}} title="test2" data={temperature} width={1000} height={250} chartSeries={[{field:'value', name:'temperature', color:'#ff7f0e'}]} x={function(d) {return d.time;}} />
        {/*temperature.map((datapoint, i) =>
          <div key={i}>
            {datapoint.time}: {datapoint.value}
          </div>
        )*/}
      </div>
    );
  }

}

export default Graph;
