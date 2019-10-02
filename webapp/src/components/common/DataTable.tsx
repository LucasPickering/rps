import React from 'react';
import { useTable, TableOptions, useTableState } from 'react-table';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import { tableToApiQuery } from 'util/funcs';

interface Props<D> extends TableOptions<D> {
  url: string;
}

function DataTable<D>({url,...rest}:Props<D>): React.ReactElement {
  const tableState = useTableState({ pageIndex: 0 });
  const [{ pageIndex, pageSize }] = tableState;
  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    rest,
  );

  const fullUrl = `${url}?${}`

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup, i) => (
          <TableRow key={i} {...headerGroup.getRowProps()}>
            {headerGroup.headers.map(column => (
              <TableCell key={column.id} {...column.getHeaderProps()}>
                {column.render('Header')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {rows.map(
          row =>
            prepareRow(row) || (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <TableCell key={cell.column.id} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TableCell>
                  );
                })}
              </TableRow>
            )
        )}
      </TableBody>
    </Table>
  );
}

export default DataTable;
