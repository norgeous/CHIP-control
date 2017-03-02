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
      data: {
        temperature: 0
      }
    };
  }

  componentDidMount() {    
    socket.on('server:event', data => {
      this.setState({ data });
    })
    socket.on('temperature', t => {
      this.setState({
        data: {
          currenttemperature: t
        }
      });
    })
  }
  
  render() {
    const { cityname, forecast } = this.state;
    return (
      <div className="Graph">a Graph {this.state.data.currenttemperature}
      </div>
    );
  }

}

export default Graph;
