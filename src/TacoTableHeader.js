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
    const { className, thClassName, header, id } = column;

    const contents = header == null ? id : header;

    return (
      <th className={classNames(className, thClassName)}>
        {contents}
      </th>
    );
  }
}

TacoTableHeader.propTypes = propTypes;
TacoTableHeader.defaultProps = defaultProps;

export default TacoTableHeader;
