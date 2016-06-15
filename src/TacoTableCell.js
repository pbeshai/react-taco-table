import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import { getCellData, renderCell } from './utils';

const propTypes = {
  /* The column definition */
  column: React.PropTypes.object.isRequired,

  /* summary information for the column */
  columnSummary: React.PropTypes.object,

  /* The column definitions */
  columns: React.PropTypes.array,

  /** Whether this column is highlighted or not */
  highlightedColumn: React.PropTypes.bool,

  /* callback for when a column is highlighted / unhighlighted */
  onHighlight: React.PropTypes.func,

  /* The data to render in this row */
  rowData: React.PropTypes.object.isRequired,

  /* The row number in the table */
  rowNumber: React.PropTypes.number,

  /* The table data */
  tableData: React.PropTypes.array,
};

const defaultProps = {

};

/** TODO: Add your class def here */
class TacoTableCell extends React.Component {
  constructor(props) {
    super(props);

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  handleMouseEnter() {
    const { onHighlight, column } = this.props;
    onHighlight(column.id);
  }

  handleMouseLeave() {
    const { onHighlight } = this.props;
    onHighlight(null);
  }

  render() {
    const { column, rowData, rowNumber, tableData, columns, onHighlight,
      highlightedColumn, columnSummary } = this.props;
    const { className, tdClassName, tdStyle, type } = column;

    const cellData = getCellData(column, rowData, rowNumber, tableData, columns);
    const rendered = renderCell(cellData, column, rowData, rowNumber, tableData, columns);

    // attach mouse listeners for highlighting
    let onMouseEnter;
    let onMouseLeave;
    if (onHighlight) {
      onMouseEnter = this.handleMouseEnter;
      onMouseLeave = this.handleMouseLeave;
    }

    let computedClassName;
    if (typeof tdClassName === 'function') {
      computedClassName = tdClassName(cellData, columnSummary, column, rowData,
        rowNumber, tableData, columns);
    } else {
      computedClassName = tdClassName;
    }

    let computedStyle;
    if (typeof tdStyle === 'function') {
      computedStyle = tdStyle(cellData, columnSummary, column, rowData,
        rowNumber, tableData, columns);
    } else {
      computedStyle = tdStyle;
    }

    return (
      <td
        className={classNames(className, computedClassName, `data-type-${type}`, {
          'column-highlight': highlightedColumn,
        })}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={computedStyle}
      >
        {rendered}
      </td>
    );
  }
}

TacoTableCell.propTypes = propTypes;
TacoTableCell.defaultProps = defaultProps;

export default TacoTableCell;
