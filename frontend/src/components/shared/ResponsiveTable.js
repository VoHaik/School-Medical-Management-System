import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  useMediaQuery
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const MobileRow = ({ row, columns }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row[columns[0].field]}
        </TableCell>
        {columns.length > 1 && (
          <TableCell>{row[columns[1].field]}</TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {columns.slice(2).map((column) => (
                <Typography key={column.field} variant="body2" gutterBottom component="div">
                  <strong>{column.headerName}:</strong> {row[column.field]}
                </Typography>
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const CardView = ({ row, columns }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {row[columns[0].field]}
        </Typography>
        {columns.slice(1).map((column) => (
          <Typography key={column.field} variant="body2" color="text.secondary">
            <strong>{column.headerName}:</strong> {row[column.field]}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
};

const ResponsiveTable = ({ 
  columns, 
  rows, 
  title,
  viewType = 'auto' // 'auto', 'table', 'card', 'mobile'
}) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(min-width:601px) and (max-width:960px)');
  
  const getViewType = () => {
    if (viewType !== 'auto') return viewType;
    if (isMobile) return 'card';
    if (isTablet) return 'mobile';
    return 'table';
  };
  
  const currentViewType = getViewType();
  
  if (currentViewType === 'card') {
    return (
      <Box>
        {title && <Typography variant="h6" gutterBottom>{title}</Typography>}
        {rows.map((row, index) => (
          <CardView key={index} row={row} columns={columns} />
        ))}
      </Box>
    );
  }
  
  return (
    <TableContainer component={Paper}>
      {title && (
        <Box sx={{ p: 2, pb: 0 }}>
          <Typography variant="h6">{title}</Typography>
        </Box>
      )}
      <Table aria-label={title || 'table'}>
        <TableHead>
          <TableRow>
            {currentViewType === 'mobile' && <TableCell />}
            {columns.map((column, index) => {
              // For mobile view, only show first two columns in header
              if (currentViewType === 'mobile' && index > 1) return null;
              return (
                <TableCell key={column.field}>{column.headerName}</TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            if (currentViewType === 'mobile') {
              return <MobileRow key={index} row={row} columns={columns} />;
            }
            
            return (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.field}>{row[column.field]}</TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResponsiveTable;