import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';
import DataType from './DataType';
import SortDirection from './SortDirection';

const propTypes = {
  column: React.PropTypes.object.isRequired,
  columnGroup: React.PropTypes.object,
  highlightedColumn: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  sortableTable: React.PropTypes.bool,
  sortDirection: React.PropTypes.bool,
};

const defaultProps = {
};

/**
 * React component for rendering table headers, uses `<th>`.
 *
 * @prop {Object} column          The column definition
 * @prop {Object} columnGroup     Column group definition:
 *   `{ header:String, columns:[colId1, colId2, ...], className:String}`
 * @prop {Boolean} highlightedColumn  Whether this column is highlighted or not
 * @prop {Function} onClick       Callback when clicked. Gets passed `column.id`
 * @prop {Boolean} sortableTable  Whether the table is sortable or not
 * @prop {Boolean} sortDirection  The current sort direction of this column --
 *   null or undefined if not sorted
 */
class TacoTableHeader extends React.Component {
  /**
   * @param {Object} props React props
   */
  constructor(props) {
    super(props);

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
   * Handler for when the header is clicked. Calls `onClick(column.id)`.
   * @private
   */
  handleClick() {
    const { column, onClick } = this.props;
    if (onClick) {
      onClick(column.id);
    }
  }

  /**
   * Main render method
   * @return {React.Component}
   */
  render() {
    const { column, sortableTable, highlightedColumn, columnGroup,
      sortDirection } = this.props;
    const { className, thClassName, header, id, width, type } = column;

    const contents = header == null ? id : header;

    // this is a sortable column if it is in a sortable table and it has a datatype and
    // sortValue isn't explicitly set to null (undefined is ok).
    const sortable = sortableTable && column.type !== DataType.None && column.sortValue !== null;

    let onClick;
    let sortIndicator;
    if (sortable) {
      onClick = this.handleClick;
      sortIndicator = (
        <span
          className={classNames('sort-indicator', {
            'sort-ascending': sortDirection === SortDirection.Ascending,
            'sort-descending': sortDirection === SortDirection.Descending,
          })}
        />
      );
    }

    // add in a fixed width if specified
    let style;
    if (width != null) {
      style = { width };
    }

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
      <th
        className={classNames(className, thClassName, columnGroupClass,
          `data-type-${type}`, {
            sortable,
            'column-highlight': highlightedColumn,
            'sort-ascending': sortDirection === SortDirection.Ascending,
            'sort-descending': sortDirection === SortDirection.Descending,
            sorted: sortDirection != null,
          })}
        onClick={onClick}
        style={style}
      >
        {contents}
        {sortIndicator}
      </th>
    );
  }
}

TacoTableHeader.propTypes = propTypes;
TacoTableHeader.defaultProps = defaultProps;

export default TacoTableHeader;
