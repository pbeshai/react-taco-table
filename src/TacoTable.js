import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

const propTypes = {

};

const defaultProps = {

};

class TacoTable extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <div className="column-table">
        Taco Table.
      </div>
    );
  }
}

TacoTable.propTypes = propTypes;
TacoTable.defaultProps = defaultProps;

export default TacoTable;
