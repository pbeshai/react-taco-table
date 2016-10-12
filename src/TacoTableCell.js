import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import { getCellData, renderCell } from './Utils';

const propTypes = {
  column: React.PropTypes.object.isRequired,
  columnGroup: React.PropTypes.object,
  columnSummary: React.PropTypes.object,
  columns: React.PropTypes.array,
  highlightedColumn: React.PropTypes.bool,
  highlightedRow: React.PropTypes.bool,
  isBottomData: React.PropTypes.bool,
  onHighlight: React.PropTypes.func,
  plugins: React.PropTypes.array,
  rowData: React.PropTypes.object.isRequired,
  rowNumber: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
  tableData: React.PropTypes.array,
};

const defaultProps = {

};

/**
 * React component for rendering table cells, uses `<td>`.
 *
 * @prop {Object} column            The column definition
 * @prop {Object} columnGroup       Column group definition
 *   `{ header:String, columns:[colId1, colId2, ...], className:String} `
 * @prop {Object} columnSummary     summary information for the column
 * @prop {Object[]} columns            The column definitions
 * @prop {Boolean} highlightedColumn   Whether this column is highlighted or not
 * @prop {Boolean} highlightedRow      Whether this row is highlighted or not
 * @prop {Boolean} isBottomData      Whether this row is in the bottom data area or not
 * @prop {Function} onHighlight         callback for when a column is highlighted / unhighlighted
 * @prop {Object[]} plugins            Collection of plugins to run to compute cell style,
 *   cell class name, column summaries
 * @prop {Object} rowData           The data to render in this row
 * @prop {Number} rowNumber  The row number in the table (bottom-${i} for bottom data)
 * @prop {Object[]} tableData          The table data
 * @extends React.Component
 */
class TacoTableCell extends React.Component {
  /**
   * @param {Object} props React props
   */
  constructor(props) {
    super(props);

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
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
   * Handler for when the mouse enters the `<td>`. Calls `onHighlight(column.id)`.
   * @private
   */
  handleMouseEnter() {
    const { onHighlight, column } = this.props;
    onHighlight(column.id);
  }

  /**
   * Handler for when the mouse leaves the `<td>`. Calls `onHighlight(null)`.
   * @private
   */
  handleMouseLeave() {
    const { onHighlight } = this.props;
    onHighlight(null);
  }

  /**
   * Computes the value of a property such as tdClassName or tdStyle
   * by also considering plugins
   * @private
   */
  computeWithPlugins(property, cellData) {
    const { column, plugins } = this.props;

    let result;

    /** evaluates `maybeFunction` as a function if it is one, otherwise returns it as a value */
    const getValue = (maybeFunction) => {
      if (typeof maybeFunction === 'function') {
        return maybeFunction(cellData, this.props);
      }

      return maybeFunction;
    };

    // interpret plugins
    // run the td class name from each plugin
    if (plugins) {
      plugins.forEach(plugin => {
        // if the plugin has property and this column matches the column test (if provided)
        if (plugin[property] && (!plugin.columnTest || plugin.columnTest(column))) {
          const pluginResult = getValue(plugin[property]);

          if (pluginResult) {
            if (!result) {
              result = [pluginResult];
            } else {
              result.push(pluginResult);
            }
          }
        }
      });
    }

    // compute the column result
    const columnResult = getValue(column[property]);

    // combine column result and plugin results
    if (!result) {
      result = columnResult;
    } else if (columnResult) {
      result.push(columnResult);
    }

    return result;
  }

  /**
   * Computes the tdClassName value based on the prop and plugins.
   * @private
   */
  computeTdClassName(cellData) {
    return this.computeWithPlugins('tdClassName', cellData);
  }

  /**
   * Computes the tdStyle value based on the prop and plugins.
   * @private
   */
  computeTdStyle(cellData) {
    const tdStyle = this.computeWithPlugins('tdStyle', cellData);
    // combine the array into a single object if it is an array
    if (Array.isArray(tdStyle)) {
      return tdStyle.reduce((merged, style) => {
        Object.assign(merged, style);
        return merged;
      }, {});
    }

    return tdStyle;
  }

  /**
   * Main render method
   * @return {React.Component}
   */
  render() {
    const { column, rowData, rowNumber, tableData, columns,
      onHighlight, highlightedColumn, columnGroup, isBottomData, columnSummary } = this.props;
    const { className, type } = column;

    const cellData = getCellData(column, rowData, rowNumber, tableData, columns, isBottomData);

    const rendered = renderCell(cellData, column, rowData, rowNumber, tableData, columns, isBottomData,columnSummary );

    // attach mouse listeners for highlighting
    let onMouseEnter;
    let onMouseLeave;
    if (onHighlight) {
      onMouseEnter = this.handleMouseEnter;
      onMouseLeave = this.handleMouseLeave;
    }

    // compute class name and style
    const computedTdClassName = this.computeTdClassName(cellData);
    const computedTdStyle = this.computeTdStyle(cellData);

    // get classes based on column group
    let columnGroupClass;
    if (columnGroup) {
      columnGroupClass = [columnGroup.className];
      const columnGroupIndex = columnGroup.columns.indexOf(column.id);

      // first column in group
      if (columnGroupIndex === 0) {
        columnGroupClass.push('group-first');
      }

      // last column in group
      if (columnGroupIndex === columnGroup.columns.length - 1) {
        columnGroupClass.push('group-last');
      }
    }

    return (
      <td
        className={classNames(className, columnGroupClass, computedTdClassName,
          `data-type-${type}`, { 'column-highlight': highlightedColumn })}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={computedTdStyle}
      >
        {rendered}
      </td>
    );
  }
}

TacoTableCell.propTypes = propTypes;
TacoTableCell.defaultProps = defaultProps;

export default TacoTableCell;
