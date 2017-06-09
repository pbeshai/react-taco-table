import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TacoTableCell from './TacoTableCell';

const propTypes = {
  columns: PropTypes.array.isRequired,
  columnGroups: PropTypes.array,
  columnSummaries: PropTypes.array,
  className: PropTypes.string,
  highlighted: PropTypes.bool,
  highlightedColumnId: PropTypes.string,
  isBottomData: PropTypes.bool,
  onClick: PropTypes.func,
  onColumnHighlight: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onHighlight: PropTypes.func,
  plugins: PropTypes.array,
  rowData: PropTypes.object.isRequired,
  rowNumber: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tableData: PropTypes.array,
  CellComponent: PropTypes.func,
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
 * @prop {Boolean} isBottomData  Whether this row is in the bottom data area or not
 * @prop {Function} onClick  callback for when a row is clicked
 * @prop {Function} onColumnHighlight  callback for when a column is highlighted / unhighlighted
 * @prop {Function} onDoubleClick  callback for when a row is double clicked
 * @prop {Function} onHighlight  callback for when a row is highlighted / unhighlighted
 * @prop {Object[]} plugins  Collection of plugins to run to compute cell style,
 *    cell class name, column summaries
 * @prop {Object} rowData  The data to render in this row
 * @prop {Number} rowNumber  The row number in the table (bottom-${i} for bottom data)
 * @prop {Object[]} tableData  The table data
 * @prop {Function} CellComponent  Allow configuration of what component to use to render cells
 * @extends React.Component
 */
class TacoTableRow extends React.PureComponent {
  /**
   * @param {Object} props React props
   */
  constructor(props) {
    super(props);

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
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
   * Handler for when a row is clicked. Calls `onClick(rowData, rowNumber, isBottomData)`.
   * @private
   */
  handleClick() {
    const { onClick, rowData, rowNumber, isBottomData } = this.props;
    onClick(rowData, rowNumber, isBottomData);
  }

  /**
   * Handler for when a row is double clicked. Calls `onDoubleClick(rowData, rowNumber, isBottomData)`.
   * @private
   */
  handleDoubleClick() {
    const { onDoubleClick, rowData, rowNumber, isBottomData } = this.props;
    onDoubleClick(rowData, rowNumber, isBottomData);
  }

  /**
   * Main render method
   * @return {React.Component}
   */
  render() {
    const { className, columnSummaries, columns, rowData, rowNumber, tableData, CellComponent,
      plugins, onHighlight, onClick, onColumnHighlight, onDoubleClick, highlighted,
      highlightedColumnId, columnGroups, isBottomData } = this.props;

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

    // attach double click handler
    let onDoubleClickHandler;
    if (onDoubleClick) {
      onDoubleClickHandler = this.handleDoubleClick;
    }

    return (
      <tr
        className={classNames(className, { 'row-highlight': highlighted })}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClickHandler}
        onDoubleClick={onDoubleClickHandler}
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
              isBottomData={isBottomData}
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
