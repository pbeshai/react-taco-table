import React from 'react';
import { shallow, mount } from 'enzyme';

import TacoTable from '../src/TacoTable';
import SortDirection from '../src/SortDirection';
import DataType from '../src/DataType';

describe('TacoTable', function () {
  const columnMap = {
    name: {
      id: 'name',
      className: 'name-col',
      firstSortDirection: SortDirection.Ascending,
      header: 'Column Name',
      type: DataType.String,
    },
    value: {
      id: 'value',
      className: 'value-col',
      type: DataType.Number,
    },
  };
    // initialSortColumnId: 'name',
    // initialSortDirection: SortDirection.Ascending,

  it('renders a table with columns and rows', function () {
    const columns = [columnMap.name, columnMap.value];
    const data = [
      { name: 'Item 1', value: 123 },
      { name: 'Item 2', value: 12 },
      { name: 'A thing', value: 12345 },
      { name: 'Another thing', value: 1234 },
      { name: 'Thing', value: 123456 },
    ];
    const wrapper = mount(<TacoTable columns={columns} data={data} />);

    expect(wrapper.find('table')).to.have.length(1);
    expect(wrapper.find('thead > tr th')).to.have.length(2);
    expect(wrapper.find('tbody tr')).to.have.length(5);
  });

  describe('sorting', function () {
    describe('string columns', function () {
      it('sorts by the name column, in ascending order', function () {
        const columns = [columnMap.name, columnMap.value];
        const data = [
          { name: 'Item 1', value: 123 },
          { name: 'Item 2', value: 12 },
          { name: 'A thing', value: 12345 },
          { name: 'Another thing', value: 1234 },
          { name: 'Thing', value: 123456 },
        ];
        const wrapper = mount(
          <TacoTable
            columns={columns}
            data={data}
            initialSortColumnId="name"
            initialSortDirection={SortDirection.Ascending}
          />);

        const expectedRowOrder = ['A thing', 'Another thing', 'Item 1',
          'Item 2', 'Thing'];
        const currentOrder = wrapper.state('data').map(d => d.name);
        expect(currentOrder).to.deep.equal(expectedRowOrder);
      });

      it('sorts by the name column, in descending order', function () {
        const columns = [columnMap.name, columnMap.value];
        const data = [
          { name: 'Item 1', value: 123 },
          { name: 'Item 2', value: 12 },
          { name: 'A thing', value: 12345 },
          { name: 'Another thing', value: 1234 },
          { name: 'Thing', value: 123456 },
        ];
        const wrapper = mount(
          <TacoTable
            columns={columns}
            data={data}
            initialSortColumnId="name"
            initialSortDirection={SortDirection.Descending}
          />);

        const expectedRowOrder = ['A thing', 'Another thing', 'Item 1',
          'Item 2', 'Thing'].reverse();
        const currentOrder = wrapper.state('data').map(d => d.name);
        expect(currentOrder).to.deep.equal(expectedRowOrder);
      });
    });

    describe('number and number ordinal columns', function () {
      it('sorts by the value column, in ascending order', function () {
        const columns = [columnMap.name, columnMap.value];
        const data = [
          { name: 'Item 1', value: 123 },
          { name: 'Item 2', value: 12 },
          { name: 'A thing', value: 12345 },
          { name: 'Another thing', value: 1234 },
          { name: 'Thing', value: 123456 },
        ];
        const wrapper = mount(
          <TacoTable
            columns={columns}
            data={data}
            initialSortColumnId="value"
            initialSortDirection={SortDirection.Ascending}
          />);

        const expectedRowOrder = [12, 123, 1234, 12345, 123456];
        const currentOrder = wrapper.state('data').map(d => d.value);
        expect(currentOrder).to.deep.equal(expectedRowOrder);
      });

      it('sorts by the value column, in descending order', function () {
        const columns = [columnMap.name, columnMap.value];
        const data = [
          { name: 'Item 1', value: 123 },
          { name: 'Item 2', value: 12 },
          { name: 'A thing', value: 12345 },
          { name: 'Another thing', value: 1234 },
          { name: 'Thing', value: 123456 },
        ];
        const wrapper = mount(
          <TacoTable
            columns={columns}
            data={data}
            initialSortColumnId="value"
            initialSortDirection={SortDirection.Descending}
          />);

        const expectedRowOrder = [123456, 12345, 1234, 123, 12];
        const currentOrder = wrapper.state('data').map(d => d.value);
        expect(currentOrder).to.deep.equal(expectedRowOrder);
      });
    });

    it('maintains sort order on data change', function () {
      const columns = [columnMap.name, columnMap.value];
      const data = [
        { name: 'Item 1', value: 123 },
        { name: 'Item 2', value: 12 },
        { name: 'A thing', value: 12345 },
        { name: 'Another thing', value: 1234 },
        { name: 'Thing', value: 123456 },
      ];
      const wrapper = mount(
        <TacoTable
          columns={columns}
          data={data}
          initialSortColumnId="name"
          initialSortDirection={SortDirection.Ascending}
        />);

      const expectedRowOrder = ['A thing', 'Another thing', 'Item 1',
        'Item 2', 'Thing'];
      let currentOrder = wrapper.state('data').map(d => d.name);
      expect(currentOrder).to.deep.equal(expectedRowOrder);

      // check passing in same data
      wrapper.setProps({ data });
      currentOrder = wrapper.state('data').map(d => d.name);
      expect(currentOrder).to.deep.equal(expectedRowOrder);

      // check passing in new data with same values
      wrapper.setProps({ data: data.slice() });
      currentOrder = wrapper.state('data').map(d => d.name);
      expect(currentOrder).to.deep.equal(expectedRowOrder);
    });
  });
});
