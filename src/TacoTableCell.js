import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import { getCellData, renderCell } from './Utils';

const propTypes = {
  /* The column definition */
  column: React.PropTypes.object.isRequired,

  /* Column group definition:
   * { header:String, columns:[colId1, colId2, ...], className:String} */
  columnGroup: React.PropTypes.object,

  /* summary information for the column */
  columnSummary: React.PropTypes.object,

  /* The column definitions */
  columns: React.PropTypes.array,

  /** Whether this column is highlighted or not */
  highlightedColumn: React.PropTypes.bool,

  /** Whether this row is highlighted or not */
  highlightedRow: React.PropTypes.bool,

  /* callback for when a column is highlighted / unhighlighted */
  onHighlight: React.PropTypes.func,

  /* Collection of plugins to run to compute cell style, cell class name, column summaries */
  plugins: React.PropTypes.array,

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

  /**
   * Computes the value of a property such as tdClassName or tdStyle
   * by also considering plugins
   */
  computeWithPlugins(property, cellData) {
    const { column, rowData, rowNumber, tableData, columns,
      highlightedColumn, highlightedRow, columnSummary, plugins } = this.props;

    let result;

    /** evaluates `maybeFunction` as a function if it is one, otherwise returns it as a value */
    function getValue(maybeFunction) {
      if (typeof maybeFunction === 'function') {
        return maybeFunction(cellData, columnSummary, column, rowData,
          highlightedColumn, highlightedRow, rowNumber, tableData, columns);
      }

      return maybeFunction;
    }

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

  computeTdClassName(cellData) {
    return this.computeWithPlugins('tdClassName', cellData);
  }

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

  render() {
    const { column, rowData, rowNumber, tableData, columns,
      onHighlight, highlightedColumn, highlightedRow, columnGroup } = this.props;
    const { className, type } = column;

    const cellData = getCellData(column, rowData, rowNumber, tableData, columns);
    const rendered = renderCell(cellData, column, rowData, rowNumber, tableData, columns);

    // attach mouse listeners for highlighting
    let onMouseEnter;
    let onMouseLeave;
    if (onHighlight) {
      onMouseEnter = this.handleMouseEnter;
      onMouseLeave = this.handleMouseLeave;
    }

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
