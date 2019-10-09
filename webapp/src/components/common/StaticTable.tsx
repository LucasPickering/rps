import React from 'react';
import {
  makeStyles,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import clsx from 'clsx';
import { FieldType } from 'util/types';

const useLocalStyles = makeStyles({
  cell: {
    border: 'none',
  },
  titleCell: {
    fontWeight: 'bold',
  },
});

interface RowProps {
  title: string;
  value: React.ReactNode;
  align?: FieldType<React.ComponentProps<typeof TableCell>, 'align'>;
}

const Row = ({ title, value, align }: RowProps): React.ReactElement => {
  const localClasses = useLocalStyles();
  return (
    <TableRow key={title}>
      <TableCell className={clsx(localClasses.cell, localClasses.titleCell)}>
        {title}
      </TableCell>
      <TableCell className={localClasses.cell} align={align}>
        {value}
      </TableCell>
    </TableRow>
  );
};

Row.defaultProps = {
  align: 'right',
};

interface Props {
  rows: RowProps[];
}

/**
 * A table with two columns and a fixed number of rows. The left column is the
 * row header, and the right column is the associated value.
 */
const StaticTable = ({
  rows,
  ...rest
}: Props & React.ComponentProps<typeof Table>): React.ReactElement => {
  return (
    <Table {...rest}>
      <TableBody>
        {rows.map(row => (
          <Row key={row.title} {...row} />
        ))}
      </TableBody>
    </Table>
  );
};

StaticTable.defaultProps = {};

export default StaticTable;
