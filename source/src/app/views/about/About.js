import React, {
  PureComponent
}                     from 'react';
import AnimatedView   from '../../components/animatedView/AnimatedView';

class About extends PureComponent {
  render() {
    return(
      <AnimatedView>
        <h1>
          About
        </h1>
      </AnimatedView>
    );
  }
}

export default About;
