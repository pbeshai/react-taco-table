# react-taco-table

A react component for creating tables configured by a set of columns.

## Set up
1. Install dependencies with `npm install`

## Building
1. To build files for production, run `grunt`

## Documentation
1. To generate the documentation, run `npm run docs`. They will appear in `/docs`.

# Features Roadmap

- [x] sort
- [x] th classes
- [x] td classes
- [x] fixed widths
- [x] striping
- [x] anything as a th (component, string)
- [x] formatting
- [x] value, sort value, render
- [x] row specific formatting
- [x] row highlighting
- [x] column hover
- [x] highlighting a max or min value
- [ ] column grouping
- [ ] group headers
- [ ] sort indicators

## Stretch features
- [ ] search within table to filter rows?
- [ ] auxiliary data section at bottom of table
- [ ] loading view
- [ ] selecting rows
- [ ] fixed headers
- [ ] fixed columns
- [ ] repeat headers every N
- [ ] CSV export
- [ ] heatmap
- [ ] paging
- [ ] showing row numbers on hover
- [ ] ImmutableJS support?
- [ ] hiding rows below threshold
- [ ] hiding cells below threshold
- [ ] expandable rows?


# Columns

Columns should support the following properties.

Here `Renderable` means anything React can render (e.g., React.Component, String, etc.).


| Property | Type | Required | Description |
| -------- | ---- | -------- | ----------- |
| id | String | Yes | The id of the column. Typically corresponds to a key in the rowData object. |
| className | String |  | The class name to be applied to both `<td>` and `<th>` |
| firstSortDirection | Boolean |  | The direction which this column gets sorted by on first click |
| header | Renderable |  | What is rendered in the column header. If not provided, uses the columnId. |
| renderer | Function |  | `function (cellData, columnDefinition, rowData, rowNumber, tableData, columnDefinitions)`<br>The function that renders the value in the table. Can return anything React can render. |
| rendererOptions | Object |  | Object of options that can be read by the renderer |
| simpleRenderer | Function |  | `function (cellData, columnDefinition, rowData, rowNumber, tableData, columnDefinitions)`<br>The function that render the cell's value in a simpler format. Must return a String or Number. |
| sortValue | Function |  | `function (cellData, rowData)`<br>Function to use when sorting instead of `value`. |
| summarize | Function |  | `function (columnDefinition, tableData, columnDefinitions)`<br>Produces an object representing a summary of the column (e.g., min and max) to be used in the | 
| tdClassName | Function, String |  | `function (cellData, columnSummary, columnDefinition, rowData, rowNumber, tableData, columnDefinitions)`<br>A function that returns a class name based on the cell data and column summary or other information. If a string is provided, it is used directly as the class name. |
| tdStyle | Function, Object |  | `function (cellData, columnSummary, columnDefinition, rowData, rowNumber, tableData, columnDefinitions)`<br>A function that returns the style to be applied to the cell. If an object is provided, it is used directly as the style attribute. |
| thClassName | String |  | The class name to be applied to `<th>` only |
| type | String |  | The `DataType` of the column - number, string, etc |
| value | String, Function |  | `function (rowData, rowNumber, tableData, columnDefinitions)`<br>Function to produce cellData's value. If a String, reads that as a key into the rowData object. If not provided, columnId is used as a key into the rowData object. |
| width | String, Number |  | The value to set for the style `width` property on the column. |



