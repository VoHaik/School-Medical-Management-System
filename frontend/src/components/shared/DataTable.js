import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  GetApp as ExportIcon
} from '@mui/icons-material';

const DataTable = ({
  title,
  data = [],
  columns = [],
  loading = false,
  selectable = false,
  sortable = true,
  searchable = true,
  filterable = false,
  exportable = false,
  pagination = true,
  actions = [],
  onRowClick,
  onSelectionChange,
  onExport,
  pageSize = 10,
  className = ''
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const handleRequestSort = (property) => {
    if (!sortable) return;
    
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredData.map((n, index) => index);
      setSelected(newSelected);
      onSelectionChange?.(newSelected.map(index => filteredData[index]));
      return;
    }
    setSelected([]);
    onSelectionChange?.([]);
  };

  const handleClick = (event, index) => {
    if (!selectable) return;
    
    const selectedIndex = selected.indexOf(index);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, index);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
    onSelectionChange?.(newSelected.map(index => filteredData[index]));
  };

  const handleMenuClick = (event, rowIndex) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowIndex(rowIndex);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowIndex(null);
  };

  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    return columns.some(column => {
      const value = row[column.key]?.toString().toLowerCase() || '';
      return value.includes(searchTerm.toLowerCase());
    });
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!orderBy) return 0;
    
    const aVal = a[orderBy];
    const bVal = b[orderBy];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedData = pagination
    ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : sortedData;

  const renderCellValue = (column, value, row) => {
    if (column.render) {
      return column.render(value, row);
    }

    switch (column.type) {
      case 'chip':
        return (
          <Chip
            label={value}
            color={column.getColor ? column.getColor(value) : 'default'}
            size="small"
          />
        );
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'datetime':
        return new Date(value).toLocaleString();
      case 'currency':
        return `$${parseFloat(value || 0).toFixed(2)}`;
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return value || '-';
    }
  };

  const isSelected = (index) => selected.indexOf(index) !== -1;

  return (
    <Paper className={`${className}`}>
      {/* Header */}
      <Box className="p-4 border-b">
        <Box className="flex items-center justify-between mb-4">
          {title && (
            <Typography variant="h6" className="font-semibold">
              {title}
            </Typography>
          )}
          <Box className="flex gap-2">
            {exportable && (
              <Button
                startIcon={<ExportIcon />}
                onClick={onExport}
                variant="outlined"
                size="small"
              >
                Export
              </Button>
            )}
          </Box>
        </Box>

        {/* Search and Filters */}
        {(searchable || filterable) && (
          <Box className="flex gap-2 mb-4">
            {searchable && (
              <TextField
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                className="flex-1"
              />
            )}
            {filterable && (
              <Button
                startIcon={<FilterIcon />}
                variant="outlined"
                size="small"
              >
                Filters
              </Button>
            )}
          </Box>
        )}

        {/* Selection Info */}
        {selectable && selected.length > 0 && (
          <Box className="mb-2">
            <Typography variant="body2" color="textSecondary">
              {selected.length} item(s) selected
            </Typography>
          </Box>
        )}
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < paginatedData.length}
                    checked={paginatedData.length > 0 && selected.length === paginatedData.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  sortDirection={orderBy === column.key ? order : false}
                  style={{ minWidth: column.minWidth }}
                >
                  {sortable && column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.key}
                      direction={orderBy === column.key ? order : 'asc'}
                      onClick={() => handleRequestSort(column.key)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell align="right">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  align="center"
                  style={{ height: 200 }}
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                  align="center"
                  style={{ height: 200 }}
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => {
                const isItemSelected = isSelected(index);
                return (
                  <TableRow
                    key={index}
                    hover
                    onClick={(event) => {
                      if (selectable) {
                        handleClick(event, index);
                      } else if (onRowClick) {
                        onRowClick(row, index);
                      }
                    }}
                    selected={isItemSelected}
                    className={onRowClick ? 'cursor-pointer' : ''}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {renderCellValue(column, row[column.key], row)}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuClick(e, index);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      )}

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {actions.map((action, actionIndex) => (
          <MenuItem
            key={actionIndex}
            onClick={() => {
              action.onClick(paginatedData[selectedRowIndex], selectedRowIndex);
              handleMenuClose();
            }}
            disabled={action.disabled}
          >
            {action.icon && <Box className="mr-2">{action.icon}</Box>}
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
};

export default DataTable;
