/** @module HighlightOnly
 * Wraps a plugin so that it only activates its tdStyle and tdClassName
 * when the cell is highlighted, unless a column is configured otherwise.
 */

/**
 * onRowHighlight set to true means apply the plugin on row highlight
 * onColumnHighlight set to true means apply the plugin on column highlight
 */
function HighlightOnly(Plugin, options = { onRowHighlight: true, onColumnHighlight: true }) {
  function highlightOnlyHelper(pluginFunc) {
    if (!pluginFunc) {
      return undefined;
    }

    return function highlightOnlyWrapper(cellData, summary, column, rowData,
      highlightedColumn, highlightedRow, ...args) {
      // check for override setting on column
      let columnHighlightSetting;
      if (column.plugins && column.plugins[Plugin.id]) {
        columnHighlightSetting = column.plugins[Plugin.id].highlight;
      }

      // if highlighted or the column says to always run it, run the plugin
      if ((options.onRowHighlight && highlightedRow) ||
          (options.onColumnHighlight && highlightedColumn) ||
          columnHighlightSetting === 'always') {
        return Plugin.tdStyle(cellData, summary, column, rowData,
          highlightedColumn, highlightedRow, ...args);
      }

      // if not highlighted, do not run it.
      return undefined;
    };
  }

  const HighlightOnlyPlugin = Object.assign({}, Plugin, {
    tdStyle: highlightOnlyHelper(Plugin.tdStyle),
    tdClassName: highlightOnlyHelper(Plugin.tdClassName),
  });

  return HighlightOnlyPlugin;
}

export default HighlightOnly;
