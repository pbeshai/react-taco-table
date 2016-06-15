import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import TacoTableCell from './TacoTableCell';
const propTypes = {
  /* The column definitions */
  columns: React.PropTypes.array.isRequired,

  /* An array of summaries, one for each column, matched by index */
  columnSummaries: React.PropTypes.array,

  /* The class name for the row */
  className: React.PropTypes.string,

  /** Whether this row is highlighted or not */
  highlighted: React.PropTypes.bool,

  /** The ID of the highlighted column */
  highlightedColumnId: React.PropTypes.string,

  /* callback for when a column is highlighted / unhighlighted */
  onColumnHighlight: React.PropTypes.func,

  /* callback for when a row is highlighted / unhighlighted */
  onHighlight: React.PropTypes.func,

  /* Collection of plugins to run to compute cell style, cell class name, column summaries */
  plugins: React.PropTypes.array,

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
  columnSummaries: [],
  CellComponent: TacoTableCell,
};

/** TODO: Add your class def here */
class TacoTableRow extends React.Component {
  constructor(props) {
    super(props);

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  handleMouseEnter() {
    const { onHighlight, rowData } = this.props;
    onHighlight(rowData);
  }

  handleMouseLeave() {
    const { onHighlight } = this.props;
    onHighlight(null);
  }

  render() {
    const { className, columnSummaries, columns, rowData, rowNumber, tableData, CellComponent,
      plugins, onHighlight, onColumnHighlight, highlighted, highlightedColumnId } = this.props;

    // attach mouse listeners for highlighting
    let onMouseEnter;
    let onMouseLeave;
    if (onHighlight) {
      onMouseEnter = this.handleMouseEnter;
      onMouseLeave = this.handleMouseLeave;
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
            columnSummary={columnSummaries[i]}
            columns={columns}
            plugins={plugins}
            rowNumber={rowNumber}
            rowData={rowData}
            tableData={tableData}
            onHighlight={onColumnHighlight}
            highlightedColumn={column.id === highlightedColumnId}
          />
        )}
      </tr>
    );
  }
}

TacoTableRow.propTypes = propTypes;
TacoTableRow.defaultProps = defaultProps;

export default TacoTableRow;
