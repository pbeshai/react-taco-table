import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import TacoTableCell from './TacoTableCell';

const propTypes = {
  columns: React.PropTypes.array.isRequired,
  columnGroups: React.PropTypes.array,
  columnSummaries: React.PropTypes.array,
  className: React.PropTypes.string,
  highlighted: React.PropTypes.bool,
  highlightedColumnId: React.PropTypes.string,
  onClick: React.PropTypes.func,
  onColumnHighlight: React.PropTypes.func,
  onHighlight: React.PropTypes.func,
  plugins: React.PropTypes.array,
  rowData: React.PropTypes.object.isRequired,
  rowNumber: React.PropTypes.number,
  tableData: React.PropTypes.array,
  CellComponent: React.PropTypes.func,
};

const defaultProps = {
  columnSummaries: [],
  CellComponent: TacoTableCell,
};

/**
 * React component for rendering table rows, uses `<tr>`.
 *
 * @prop {Object[]} columns  The column definitions
 * @prop {Object[]} columnGroups  How to group columns - an array of
 *   `{ header:String, columns:[colId1, colId2, ...], className:String}`
 * @prop {Object[]} columnSummaries  An array of summaries, one for each column, matched by index
 * @prop {String} className  The class name for the row
 * @prop {Boolean} highlighted Whether this row is highlighted or not
 * @prop {String} highlightedColumnId   The ID of the highlighted column
 * @prop {Function} onClick  callback for when a row is clicked
 * @prop {Function} onColumnHighlight  callback for when a column is highlighted / unhighlighted
 * @prop {Function} onHighlight  callback for when a row is highlighted / unhighlighted
 * @prop {Object[]} plugins  Collection of plugins to run to compute cell style,
 *    cell class name, column summaries
 * @prop {Object} rowData  The data to render in this row
 * @prop {Number} rowNumber  The row number in the table
 * @prop {Object[]} tableData  The table data
 * @prop {Function} CellComponent  Allow configuration of what component to use to render cells
 * @extends React.Component
 */
class TacoTableRow extends React.Component {
  /**
   * @param {Object} props React props
   */
  constructor(props) {
    super(props);

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Uses `shallowCompare`
   * @param {Object} nextProps The next props
   * @param {Object} nextState The next state
   * @return {Boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  /**
   * Handler for when the mouse enters the `<tr>`. Calls `onHighlight(rowData)`.
   * @private
   */
  handleMouseEnter() {
    const { onHighlight, rowData } = this.props;
    onHighlight(rowData);
  }

  /**
   * Handler for when the mouse enters the `<tr>`. Calls `onHighlight(null)`.
   * @private
   */
  handleMouseLeave() {
    const { onHighlight } = this.props;
    onHighlight(null);
  }

  /**
   * Handler for when a row is clicked. Calls `onClick(rowData)`.
   * @private
   */
  handleClick() {
    const { onClick, rowData } = this.props;
    onClick(rowData);
  }

  /**
   * Main render method
   * @return {React.Component}
   */
  render() {
    const { className, columnSummaries, columns, rowData, rowNumber, tableData, CellComponent,
      plugins, onHighlight, onClick, onColumnHighlight, highlighted, highlightedColumnId,
      columnGroups } = this.props;

    // attach mouse listeners for highlighting
    let onMouseEnter;
    let onMouseLeave;
    if (onHighlight) {
      onMouseEnter = this.handleMouseEnter;
      onMouseLeave = this.handleMouseLeave;
    }

    // attach click handler
    let onClickHandler;
    if (onClick) {
      onClickHandler = this.handleClick;
    }

    return (
      <tr
        className={classNames(className, { 'row-highlight': highlighted })}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClickHandler}
      >
        {columns.map((column, i) => {
          // find the associated column group if configured
          let columnGroup;
          if (columnGroups) {
            columnGroup = columnGroups.find(group =>
              group.columns.includes(column.id));
          }

          return (
            <CellComponent
              key={i}
              column={column}
              columnGroup={columnGroup}
              columnSummary={columnSummaries[i]}
              columns={columns}
              plugins={plugins}
              rowNumber={rowNumber}
              rowData={rowData}
              tableData={tableData}
              onHighlight={onColumnHighlight}
              highlightedColumn={column.id === highlightedColumnId}
              highlightedRow={highlighted}
            />
          );
        })}
      </tr>
    );
  }
}

TacoTableRow.propTypes = propTypes;
TacoTableRow.defaultProps = defaultProps;

export default TacoTableRow;
