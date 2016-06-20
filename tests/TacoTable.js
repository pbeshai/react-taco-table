import React from 'react';

import {
  unmountComponentAtNode,
  findDOMNode,
} from 'react-dom';

import {
  renderIntoDocument,
  findRenderedComponentWithType,
} from 'react-addons-test-utils';

import TacoTable from '../src/TacoTable';
import SortDirection from '../src/SortDirection';
import DataType from '../src/DataType';

describe('TacoTable', function () {
  let root;
  function defineTable(props) {
    const tableNode = (
      <TacoTable {...props} />
    );
    const table = renderIntoDocument(
      tableNode, root
    );
    return findRenderedComponentWithType(table, TacoTable);
  }

  const columns = [
    {
      id: 'name',
      className: 'name-col',
      firstSortDirection: SortDirection.Ascending,
      header: 'Column Name',
      type: DataType.String,
    },
    {
      id: 'value',
      className: 'value-col',
      type: DataType.Number,
    },
  ];
  const rows = [
    { name: 'Item 1', value: 123 },
    { name: 'Item 2', value: 12 },
    { name: 'A thing', value: 12345 },
    { name: 'Another thing', value: 1234 },
    { name: 'Thing', value: 123456 },
  ];
  const props = {
    columns,
    data: rows,
    initialSortColumnId: 'name',
    initialSortDirection: SortDirection.Ascending,
  };

  beforeEach(function () {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(function () {
    document.body.removeChild(root);
    unmountComponentAtNode(root);
  });

  describe('basic render', function () {
    let foundTable;
    let domTableNode;
    before(function () {
      foundTable = defineTable(props);
      domTableNode = findDOMNode(foundTable);
    });
    it('should have a table rendered', function () {
      expect(foundTable).to.be.ok;
      assert.equal(domTableNode.tagName, 'TABLE');
    });
    it('should have two columns', function () {
      assert.equal(domTableNode.querySelectorAll('thead > tr th').length, 2);
    });
    it('should have 5 rows', function () {
      assert.equal(domTableNode.querySelectorAll('tbody > tr').length, 5);
    });
  });

  describe('sorting', function () {
    describe('string columns', function () {
      it('should have sorted by the name column, in ascending order', function () {
        const propsWithSort = Object.assign({}, props, {
          initialSortColumnId: 'name',
          initialSortDirection: SortDirection.Ascending,
        });
        const foundTable = defineTable(propsWithSort);
        const expectedRowOrder = ['A thing', 'Another thing', 'Item 1',
          'Item 2', 'Thing'];
        const currentOrder = foundTable.state.data.map(d => d.name);
        assert.sameDeepMembers(currentOrder, expectedRowOrder);
      });

      it('should have sorted by the name column, in descending order', function () {
        const propsWithSort = Object.assign({}, props, {
          initialSortColumnId: 'name',
          initialSortDirection: SortDirection.Descending,
        });
        const foundTable = defineTable(propsWithSort);
        const expectedRowOrder = ['Thing', 'Item 2', 'Item 1', 'Another thing', 'A thing'];
        const currentOrder = foundTable.state.data.map(d => d.name);
        assert.sameDeepMembers(currentOrder, expectedRowOrder);
      });
    });

    describe('number and number ordinal columns', function () {
      it('should have sorted by the value column, in ascending order', function () {
        const propsWithSort = Object.assign({}, props, {
          initialSortColumnId: 'value',
          initialSortDirection: SortDirection.Ascending,
        });
        const foundTable = defineTable(propsWithSort);
        const expectedRowOrder = [12, 123, 1234, 12345, 123456];
        const currentOrder = foundTable.state.data.map(d => d.value);
        assert.sameDeepMembers(currentOrder, expectedRowOrder);
      });

      it('should have sorted by the value column, in ascending order', function () {
        const propsWithSort = Object.assign({}, props, {
          initialSortColumnId: 'value',
          initialSortDirection: SortDirection.Descending,
        });
        const foundTable = defineTable(propsWithSort);
        const expectedRowOrder = [123456, 12345, 1234, 123, 12];
        const currentOrder = foundTable.state.data.map(d => d.value);
        assert.sameDeepMembers(currentOrder, expectedRowOrder);
      });
    });
  });
});
