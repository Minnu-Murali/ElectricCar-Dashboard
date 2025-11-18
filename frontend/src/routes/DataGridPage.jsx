import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Checkbox,
  IconButton,
  Menu,
  Tooltip,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import GenericDataGrid from '../components/GenericDataGrid';

const API_BASE = 'http://localhost:4000/api';

const DataGridPage = () => {
  const navigate = useNavigate();

  const [rowData, setRowData] = useState([]);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [brandOperator, setBrandOperator] = useState('contains');
  const [brandValue, setBrandValue] = useState('');
  const [priceOperator, setPriceOperator] = useState('greaterThan');
  const [priceValue, setPriceValue] = useState('');
  const [brandError, setBrandError] = useState(false);
  const [brandErrorText, setBrandErrorText] = useState('');

  const [columnDefs, setColumnDefs] = useState([]);
  const [visibleFields, setVisibleFields] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const columnMenuOpen = Boolean(anchorEl);

  const [brandOptions, setBrandOptions] = useState([]);

  const gridApiRef = useRef(null);

  useEffect(() => {
    if (rowData.length === 0) return;

    const sample = rowData[0];
    const fields = Object.keys(sample);

    if (visibleFields.length === 0) {
      setVisibleFields(fields);
      setColumnDefs(fields.map((f) => ({ headerName: f, field: f })));
      return;
    }

    const cols = fields
      .filter((f) => visibleFields.includes(f))
      .map((f) => ({ headerName: f, field: f }));

    setColumnDefs(cols);
  }, [rowData, visibleFields]);

  const allColumnsMeta = useMemo(() => {
    if (rowData.length === 0) return [];
    return Object.keys(rowData[0]).map((f) => ({ label: f, field: f }));
  }, [rowData]);

  const handleToggleColumn = (field) => {
    setVisibleFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const buildFilters = () => {
    const filters = {};

    if (brandOperator === 'isEmpty') {
      filters.Brand = { operator: brandOperator };
    } else if (brandValue.trim() !== '') {
      filters.Brand = { operator: brandOperator, value: brandValue.trim() };
    }

    if (priceValue.trim() !== '') {
      filters.PriceEuro = { operator: priceOperator, value: priceValue.trim() };
    }

    return filters;
  };

  const fetchData = async () => {
    const params = {
      page: 1,
      pageSize: 1000,
      search,
      filters: JSON.stringify(buildFilters()),
    };

    const res = await axios.get(`${API_BASE}/cars`, { params });
    setRowData(res.data.data);
    setTotal(res.data.total);
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  useEffect(() => {
    const unique = Array.from(
      new Set(rowData.map((r) => r.Brand).filter(Boolean))
    );
    setBrandOptions(unique);
  }, [rowData]);

  const handleApplyFilters = () => {
    if (brandOperator !== 'isEmpty' && brandValue.trim() === '') {
      setBrandError(true);
      setBrandErrorText('Brand is required');
      return;
    }
    setBrandError(false);
    setBrandErrorText('');
    fetchData();
  };

  const handleClearFilters = () => {
    setBrandOperator('contains');
    setBrandValue('');
    setPriceOperator('greaterThan');
    setPriceValue('');
    setBrandError(false);
    setBrandErrorText('');
    fetchData();
  };

  const handleExportCsv = () => {
    if (gridApiRef.current) {
      gridApiRef.current.exportDataAsCsv({ fileName: 'electric_cars.csv' });
    }
  };

  const handleGridReady = (params) => {
    gridApiRef.current = params.api;
  };

  const handleView = (id) => navigate(`/cars/${id}`);
  const handleDelete = async (id) => {
    await axios.delete(`${API_BASE}/cars/${id}`);
    fetchData();
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <TextField
          label="Search by Brand / Model / etc"
          variant="outlined"
          size="small"
          value={search}
          sx={{ width: '350px' }}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button variant="outlined" onClick={handleExportCsv}
        sx={{
    borderColor: '#223046f3',
    color: '#223046f3',
    '&:hover': {
      borderColor: '#223046f3',
      backgroundColor: 'rgba(34,48,70,0.08)'
    },
  }}>
          Export CSV
        </Button>
      </Box>
      <Box
        sx={{
          mb: 2,
          p: 2,
          border: '1px solid #223046f3',
          borderRadius: 1,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Brand op</InputLabel>
            <Select
              label="Brand op"
              value={brandOperator}
              onChange={(e) => setBrandOperator(e.target.value)}
            >
              <MenuItem value="contains">contains</MenuItem>
              <MenuItem value="equals">equals</MenuItem>
              <MenuItem value="startsWith">starts with</MenuItem>
              <MenuItem value="endsWith">ends with</MenuItem>
              <MenuItem value="isEmpty">is empty</MenuItem>
            </Select>
          </FormControl>

          <Autocomplete
            freeSolo
            disabled={brandOperator === 'isEmpty'}
            options={brandOptions}
            inputValue={brandValue}
            onInputChange={(_, v) => {
              setBrandValue(v);
              setBrandError(false);
            }}
            sx={{ minWidth: 200 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Brand"
                size="small"
                error={brandError}
                helperText={brandErrorText}
              />
            )}
          />

          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>Price op</InputLabel>
            <Select
              label="Price op"
              value={priceOperator}
              onChange={(e) => setPriceOperator(e.target.value)}
            >
              <MenuItem value="greaterThan">{'>'} greater than</MenuItem>
              <MenuItem value="lessThan">{'<'} less than</MenuItem>
              <MenuItem value="equals">= equals</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Price (€)"
            size="small"
            variant="outlined"
            value={priceValue}
            onChange={(e) => setPriceValue(e.target.value)}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            ml: 'auto',
          }}
        >
          <Button variant="contained"
          style={{backgroundColor: '#223046f3'}}
           onClick={handleApplyFilters}>
            Apply Filters
          </Button>

          <Button
  variant="outlined"
  onClick={handleClearFilters}
  sx={{
    borderColor: '#223046f3',
    color: '#223046f3',
    '&:hover': {
      borderColor: '#223046f3',
      backgroundColor: 'rgba(34,48,70,0.08)', 
    },
  }}
>
            Clear
          </Button>

          <Tooltip title="Show / Hide Columns">
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <span style={{ fontSize: '1.1rem' }}>☰</span>
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={columnMenuOpen}
          onClose={() => setAnchorEl(null)}
        >
          <Typography
            variant="subtitle2"
            sx={{ px: 2, pt: 1, pb: 1, opacity: 0.7 }}
          >
            Columns
          </Typography>

          {allColumnsMeta.map((col) => (
            <MenuItem
              key={col.field}
              onClick={() => handleToggleColumn(col.field)}
            >
              <Checkbox
                checked={visibleFields.includes(col.field)}
                disableRipple
              />
              {col.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <GenericDataGrid
        columnDefs={columnDefs}
        rowData={rowData}
        pagination={true}
        paginationPageSize={20}
        onView={handleView}
        onDelete={handleDelete}
        onGridReady={handleGridReady}
      />

      <Box sx={{ mt: 2 }}>Total records: {total}</Box>
    </Box>
  );
};

export default DataGridPage;
