'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Wraps a plugin so that it only activates its tdStyle and tdClassName
 * when the cell is highlighted, unless a column is configured otherwise.
 *
 * ## Options
 *
 * Plugins can configure explicit overrides using the `highlight` property
 * within their column-based configuration. `highlight` can be set to `'always'`
 * to ensure the plugin is run for that column regardless of highlight.
 *
 * For example,
 * `column.plugins.heatmap.highlight = 'always'` will disable HighlightOnly
 *  for the column if HighlightOnly is applied to a plugin with id `heatmap`.
 *
 * - onRowHighlight {Boolean} set to true means apply the plugin on row highlight
 * - onColumnHighlight {Boolean} set to true means apply the plugin on column highlight
 *
 * @example
 * <TacoTable plugins={[HighlightOnly(HeatmapPlugin, { onRowHighlight: true, onColumnHighlight: true })]} ... />
 *
 * @module plugins/HighlightOnly
 */

/**
 * @param {Object} Plugin The Plugin definition (e.g. `HeatmapPlugin`)
 * @param {Object} options The options for HighlightOnly
 * @return {Object} A new plugin that wraps `Plugin`'s tdStyle and tdClassName
 */
function HighlightOnly(Plugin) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { onRowHighlight: true, onColumnHighlight: true };

  function highlightOnlyHelper(pluginFunc) {
    if (!pluginFunc) {
      return undefined;
    }

    return function highlightOnlyWrapper(cellData, props) {
      var column = props.column,
          highlightedRow = props.highlightedRow,
          highlightedColumn = props.highlightedColumn;

      // check for override setting on column

      var columnHighlightSetting = void 0;
      if (column.plugins && column.plugins[Plugin.id]) {
        columnHighlightSetting = column.plugins[Plugin.id].highlight;
      }

      // if highlighted or the column says to always run it, run the plugin
      if (options.onRowHighlight && highlightedRow || options.onColumnHighlight && highlightedColumn || columnHighlightSetting === 'always') {
        if (typeof pluginFunc === 'function') {
          return pluginFunc(cellData, props);
        }

        return pluginFunc;
      }

      // if not highlighted, do not run it.
      return undefined;
    };
  }

  var HighlightOnlyPlugin = Object.assign({}, Plugin, {
    tdStyle: highlightOnlyHelper(Plugin.tdStyle),
    tdClassName: highlightOnlyHelper(Plugin.tdClassName)
  });

  return HighlightOnlyPlugin;
}

exports.default = HighlightOnly;
