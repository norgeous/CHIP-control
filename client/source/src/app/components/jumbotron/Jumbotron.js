import React, {PropTypes} from 'react';

const Jumbotron = (props) => {
  return (
    <div className="jumbotron">
      {props.children}
      hello
    </div>
  );
};

Jumbotron.propTypes = {
  children: PropTypes.node
};

export default Jumbotron;
