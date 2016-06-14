import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import TacoTableCell from './TacoTableCell';
const propTypes = {
  /* The column definitions */
  columns: React.PropTypes.array.isRequired,

  /* The class name for the row */
  className: React.PropTypes.string,

  /** Whether this row is highlighted or not */
  highlighted: React.PropTypes.bool,

  /* callback for when a row is highlighted / unhighlighted */
  onHighlight: React.PropTypes.func,

  /* The data to render in this row */
  rowData: React.PropTypes.object.isRequired,

  /* The row number in the table */
  rowNumber: React.PropTypes.number,

  /* The table data */
  tableData: React.PropTypes.array,

  /* Allow configuration of what component to use to render cells */
  CellComponent: React.PropTypes.func,
};

const defaultProps = {
  CellComponent: TacoTableCell,
};

class TacoTableRow extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { className, columns, rowData, rowNumber, tableData, CellComponent,
      onHighlight, highlighted } = this.props;

    // attach mouse listeners for highlighting
    let onMouseEnter;
    let onMouseLeave;
    if (onHighlight) {
      onMouseEnter = () => onHighlight(rowData);
      onMouseLeave = () => onHighlight(null);
    }

    return (
      <tr
        className={classNames(className, { 'row-highlight': highlighted })}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {columns.map((column, i) =>
          <CellComponent
            key={i}
            column={column}
            columns={columns}
            rowNumber={rowNumber}
            rowData={rowData}
            tableData={tableData}
          />
        )}
      </tr>
    );
  }
}

TacoTableRow.propTypes = propTypes;
TacoTableRow.defaultProps = defaultProps;

export default TacoTableRow;
