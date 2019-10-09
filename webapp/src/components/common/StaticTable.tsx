import React from 'react';
import {
  makeStyles,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import clsx from 'clsx';

const useLocalStyles = makeStyles({
  cell: {
    border: 'none',
  },
  titleCell: {
    fontWeight: 'bold',
  },
});

interface Props {
  rows: { title: string; value: React.ReactNode }[];
}

/**
 * A table with two columns and a fixed number of rows. The left column is the
 * row header, and the right column is the associated value.
 */
const StaticTable = ({
  rows,
  ...rest
}: Props & React.ComponentProps<typeof Table>): React.ReactElement => {
  const localClasses = useLocalStyles();

  return (
    <Table {...rest}>
      <TableBody>
        {rows.map(({ title, value }) => (
          <TableRow key={title}>
            <TableCell
              className={clsx(localClasses.cell, localClasses.titleCell)}
            >
              {title}
            </TableCell>
            <TableCell className={localClasses.cell}>{value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

StaticTable.defaultProps = {};

export default StaticTable;
