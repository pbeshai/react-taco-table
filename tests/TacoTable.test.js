import React from 'react';
import { mount } from 'enzyme';
import sinonChai from 'sinon-chai';
import chai from 'chai';
chai.use(sinonChai);

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
    score: {
      id: 'score',
      value: 'value',
      className: 'score-col',
      type: DataType.Number,
      firstSortDirection: SortDirection.Descending,
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

    it('sorts on header click', function () {
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
        />);

      const initialOrder = ['Item 1', 'Item 2', 'A thing', 'Another thing', 'Thing'];
      const sortedNameOrder = ['A thing', 'Another thing', 'Item 1',
        'Item 2', 'Thing'];
      const sortedValueOrder = [12, 123, 1234, 12345, 123456];

      // check that it doesn't sort initially
      let currentOrder = wrapper.state('data').map(d => d.name);
      expect(currentOrder).to.deep.equal(initialOrder);

      // click the name header
      wrapper.find('th.name-col').simulate('click');
      currentOrder = wrapper.state('data').map(d => d.name);
      expect(currentOrder).to.deep.equal(sortedNameOrder);

      wrapper.find('th.name-col').simulate('click');
      currentOrder = wrapper.state('data').map(d => d.name);
      expect(currentOrder).to.deep.equal(sortedNameOrder.reverse());

      // click the value header
      wrapper.find('th.value-col').simulate('click');
      currentOrder = wrapper.state('data').map(d => d.value);
      expect(currentOrder).to.deep.equal(sortedValueOrder);

      wrapper.find('th.value-col').simulate('click');
      currentOrder = wrapper.state('data').map(d => d.value);
      expect(currentOrder).to.deep.equal(sortedValueOrder.reverse());
    });

    it('sorts stably with maintained reverse', function () {
      const columns = [columnMap.name, columnMap.value];
      const data = [
        { name: 'Item 1', value: 123 },
        { name: 'Item 3', value: 123 },
        { name: 'A thing', value: 12345 },
        { name: 'Item 2', value: 123 },
        { name: 'Thing', value: 123456 },
      ];
      const wrapper = mount(
        <TacoTable
          columns={columns}
          data={data}
        />);

      const sortedNameOrder = ['A thing', 'Item 1', 'Item 2', 'Item 3', 'Thing'];
      let currentOrder;

      // click the value header to sort by value.
      wrapper.find('th.value-col').simulate('click');
      currentOrder = wrapper.state('data').map(d => d.name);
      expect(currentOrder).to.deep.equal(['Item 1', 'Item 3', 'Item 2', 'A thing', 'Thing']);

      // click the name header to sort by name
      wrapper.find('th.name-col').simulate('click');
      currentOrder = wrapper.state('data').map(d => d.name);
      expect(currentOrder).to.deep.equal(sortedNameOrder);

      // click the value header to then sort by value. should maintain name sort
      wrapper.find('th.value-col').simulate('click');
      currentOrder = wrapper.state('data').map(d => d.name);
      expect(currentOrder).to.deep.equal(['Item 1', 'Item 2', 'Item 3', 'A thing', 'Thing']);

      // should keep this sort but make it descending
      wrapper.find('th.value-col').simulate('click');
      currentOrder = wrapper.state('data').map(d => d.name);
      expect(currentOrder).to.deep.equal(['Thing', 'A thing', 'Item 3', 'Item 2', 'Item 1']);

      // should return to the original sort
      wrapper.find('th.value-col').simulate('click');
      currentOrder = wrapper.state('data').map(d => d.name);
      expect(currentOrder).to.deep.equal(['Item 1', 'Item 2', 'Item 3', 'A thing', 'Thing']);
    });

    it('sorts calls onSort after sorting', function () {
      const columns = [columnMap.name, columnMap.value];
      const data = [
        { name: 'Item 1', value: 123 },
        { name: 'Item 3', value: 123 },
        { name: 'A thing', value: 12345 },
        { name: 'Item 2', value: 123 },
        { name: 'Thing', value: 123456 },
      ];
      const onSort = sinon.spy();
      const wrapper = mount(
        <TacoTable
          columns={columns}
          data={data}
          onSort={onSort}
        />);

      // click the value header to sort by value.
      wrapper.find('th.value-col').simulate('click');
      let sortedData = wrapper.state('data');
      expect(onSort).to.have.been.calledOnce;
      expect(onSort).to.have.been.calledWith('value', SortDirection.Ascending, sortedData);

      // click the value header to sort by value.
      wrapper.find('th.value-col').simulate('click');
      sortedData = wrapper.state('data');
      expect(onSort).to.have.been.calledTwice;
      expect(onSort).to.have.been.calledWith('value', SortDirection.Descending, sortedData);

      // click the name header to sort by name.
      wrapper.find('th.name-col').simulate('click');
      sortedData = wrapper.state('data');
      expect(onSort).to.have.been.calledThrice;
      expect(onSort).to.have.been.calledWith('name', SortDirection.Ascending, sortedData);
    });

    it('sorts using first sort', function () {
      const columns = [columnMap.name, columnMap.value, columnMap.score];
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
        />);

      const sortedValueOrder = [12, 123, 1234, 12345, 123456];

      // click the score header (value with first sort desc)
      wrapper.find('th.score-col').simulate('click');
      const currentOrder = wrapper.state('data').map(d => d.value);
      expect(currentOrder).to.deep.equal(sortedValueOrder.reverse());
    });
  });
});
