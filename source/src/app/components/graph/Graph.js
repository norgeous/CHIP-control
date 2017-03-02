import React, {
  Component,
  PropTypes
}                       from 'react';
import io from 'socket.io-client';

// let socket = io('http://localhost:3111');
let socket = io('http://192.168.1.102:3111');

class Graph extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      temperature: []
    };
  }

  componentDidMount() {
    const me = this;
    socket.on('temperature', o => {

      console.log(me.state.temperature)
      me.setState({
        temperature: me.state.temperature.concat([o])
      });

    })
  }
  
  render() {
    const { temperature } = this.state;
    return (
      <div className="Graph">
        {temperature.map((datapoint, i) =>
          <div key={i}>
            {datapoint.time}: {datapoint.value}
          </div>
        )}
      </div>
    );
  }

}

export default Graph;
