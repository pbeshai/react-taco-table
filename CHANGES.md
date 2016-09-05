# Changes

## 0.3.0
- `onSort` callback added to TacoTable which takes `(columnId, sortDirection, sortedData)` as arguments.
- Fixed bugs regarding sorting #26, #27, #13

## 0.2.0

- Wrap extra args for many column definition properties in objects. Add in isBottomData to **tdClassName** and **tdStyle**.
  - **bottomDataRender**: `function(columnSummary, { column, rowData, tableData, columns, bottomData })`
  - **renderer**: `function (cellData, { column, rowData, rowNumber, tableData, columns })`
  - **simpleRenderer**: `function (cellData, { column, rowData, rowNumber, tableData, columns })`
  - **tdClassName**: `function (cellData, { columnSummary, column, rowData, highlightedColumn, highlightedRow, rowNumber, tableData, columns, isBottomData })`
  - **tdStyle**: `function (cellData, { columnSummary, column, rowData, highlightedColumn, highlightedRow, rowNumber, tableData, columns, isBottomData })`
  - **value**: `function (rowData, { rowNumber, tableData, columns })`
- Row click handler now has two additional arguments: rowNumber, isBottomData. `onRowClick(rowData, rowNumber, isBottomData)`
- Heatmap plugin does not render in bottom data unless `plugins.heatmap.includeBottomData` is true on the column definition.
