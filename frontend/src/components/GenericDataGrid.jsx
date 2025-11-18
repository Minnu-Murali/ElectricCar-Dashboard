import React, { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';



const GenericDataGrid = ({
  columnDefs,
  rowData,
  onView,
  onDelete,
  onGridReady,
  pagination = true,
  paginationPageSize = 20,
  onSortChanged,
  onFilterChanged,
}) => {
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      flex: 1,
      minWidth: 120,
    }),
    []
  );

 const actionsColumn = useMemo(
  () => ({
    headerName: 'Actions',
    field: 'actions',
    pinned: 'right',
    maxWidth: 180,
    cellRenderer: (params) => {
      const id = params.data.id;

      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            width: '100%',
            marginTop: '6px',
          }}
        >
          <button
            onClick={() => onView && onView(id)}
            style={{
              backgroundColor: '#223046f3',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
           
            View
          </button>
          <button
            onClick={() => onDelete && onDelete(id)}
            style={{
              backgroundColor: '#223046f3',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Delete"
          >
            <DeleteForeverIcon style={{ fontSize: '18px' }} />
          </button>
        </div>
      );
    },
  }),
  [onView, onDelete]
);


  const finalColumnDefs = useMemo(
    () => (columnDefs ? [...columnDefs, actionsColumn] : [actionsColumn]),
    [columnDefs, actionsColumn]
  );

  const handleGridReady = (params) => {
    if (onGridReady) {
      onGridReady(params);
    }
  };

  const handleSortChanged = (event) => {
    if (onSortChanged) {
      onSortChanged(event);
    }
  };

  return (
    <div className="ag-theme-alpine" style={{ width: '100%', height: '600px' }}>
      <AgGridReact
        columnDefs={finalColumnDefs}
        rowData={rowData}
        defaultColDef={defaultColDef}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        rowSelection="single"
        animateRows={true}
        onGridReady={handleGridReady}
        onSortChanged={handleSortChanged}
        onFilterChanged={onFilterChanged}
        onRowDoubleClicked={(params) => {
          if (onView) {
            onView(params.data.id);
          }
        }}
      />
    </div>
  );
};
export default GenericDataGrid;
