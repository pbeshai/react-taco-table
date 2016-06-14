import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';

const propTypes = {
  /* The column definition */
  column: React.PropTypes.object.isRequired,
};

const defaultProps = {

};

class TacoTableHeader extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { column } = this.props;
    const { className, thClassName, header } = column;
    return (
      <th className={classNames(className, thClassName)}>
        {header}
      </th>
    );
  }
}

TacoTableHeader.propTypes = propTypes;
TacoTableHeader.defaultProps = defaultProps;

export default TacoTableHeader;
