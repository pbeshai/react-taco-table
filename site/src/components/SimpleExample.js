import React from 'react';
import { TacoTable, DataType, SortDirection, Formatters,
  Summarizers, TdClassNames } from 'react-taco-table';

import data from '../data/spelling.json';
import './SimpleExample.scss';


const columns = [
  {
    id: 'speller',
    type: DataType.String,
    header: 'Speller',
    renderer(cellData, { column, rowData }) {
      return <a href={rowData.url} target="_blank">{cellData}</a>;
    },
  },
  {
    id: 'year',
    type: DataType.NumberOrdinal,
    header: 'Year',
  },
  {
    id: 'round',
    type: DataType.NumberOrdinal,
    header: 'Round',
  },
  {
    id: 'affiliation',
    type: DataType.String,
    header: 'Affiliation',
  },
  {
    id: 'word',
    type: DataType.String,
    header: 'Word',
  },
  {
    id: 'spelledWord',
    type: DataType.String,
    header: 'Spelling',
    tdClassName(cellData, { columnSummary, column, rowData }) {
      if (rowData.error) {
        return 'error-word';
      }
      return 'correct-word';
    },
  },
  {
    id: 'value',
    type: DataType.Number,
    header: 'Mystery',
    renderer: Formatters.decFormat(1),
    firstSortDirection: SortDirection.Descending,
    summarize: Summarizers.minMaxSummarizer,
    tdStyle(cellData, { columnSummary }) {
      if (cellData === columnSummary.min) {
        return { color: 'red' };
      } else if (cellData === columnSummary.max) {
        return { color: 'green' };
      }

      return undefined;
    },
    tdClassName: TdClassNames.minMaxClassName,
  },
];

/** use a class instead of a function to get hot-reloading */
class SimpleExample extends React.Component {
  render() {
    return (
      <TacoTable
        className="simple-example"
        columns={columns}
        columnHighlighting
        data={data}
        striped
        sortable
      />
    );
  }
}

export default SimpleExample;
