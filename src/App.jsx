import React, { useState } from 'react';
import ExcelGrid from './components/ExcelGrid';
import './styles/ExcelGrid.css';
import './styles/global.css';

const defaultRows = 10;
const defaultCols = 8;

function createEmptyData(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => '')
  );
}

export default function App() {
  const [rows, setRows] = useState(defaultRows);
  const [cols, setCols] = useState(defaultCols);
  const [data, setData] = useState(createEmptyData(defaultRows, defaultCols));
  const [filterCol, setFilterCol] = useState(0);
  const [filterValue, setFilterValue] = useState('');
  const [filteredData, setFilteredData] = useState(null);

  // Context menu state
  const [contextMenu, setContextMenu] = useState(null);

  // Update data grid when rows/cols change
  const handleRowsChange = e => {
    const newRows = Math.max(1, parseInt(e.target.value) || 1);
    setRows(newRows);
    setData(prev =>
      Array.from({ length: newRows }, (_, i) =>
        prev[i] ? prev[i].slice(0, cols) : Array.from({ length: cols }, () => '')
      )
    );
    setFilteredData(null); // Reset filter on size change
  };

  const handleColsChange = e => {
    const newCols = Math.max(1, parseInt(e.target.value) || 1);
    setCols(newCols);
    setData(prev =>
      prev.map(row =>
        Array.from({ length: newCols }, (_, j) => row[j] || '')
      )
    );
    setFilteredData(null); // Reset filter on size change
  };

  // Filter logic
  const handleApplyFilter = () => {
    const filtered = data.filter(row =>
      (row[filterCol] || '').toLowerCase().includes(filterValue.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleClearFilter = () => {
    setFilteredData(null);
    setFilterValue('');
  };

  // For column label
  function getColumnLabel(index) {
    let label = '';
    while (index >= 0) {
      label = String.fromCharCode((index % 26) + 65) + label;
      index = Math.floor(index / 26) - 1;
    }
    return label;
  }

  // Context menu handlers
  const handleShowContextMenu = (event, type, rowIdx, colIdx) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      type,
      rowIdx,
      colIdx,
    });
  };

  const handleCloseContextMenu = () => setContextMenu(null);

  // Insert row/col logic
  const insertRow = (idx) => {
    setData(prev => {
      const newRow = Array.from({ length: cols }, () => '');
      const newData = [...prev];
      newData.splice(idx, 0, newRow);
      return newData;
    });
    setRows(r => r + 1);
    setContextMenu(null);
  };

  const insertCol = (idx) => {
    setData(prev => prev.map(row => {
      const newRow = [...row];
      newRow.splice(idx, 0, '');
      return newRow;
    }));
    setCols(c => c + 1);
    setContextMenu(null);
  };

  // Delete row/col logic
  const deleteRow = (idx) => {
    if (rows <= 1) return; // Prevent deleting last row
    setData(prev => {
      const newData = [...prev];
      newData.splice(idx, 1);
      return newData;
    });
    setRows(r => r - 1);
    setContextMenu(null);
  };

  const deleteCol = (idx) => {
    if (cols <= 1) return; // Prevent deleting last column
    setData(prev => prev.map(row => {
      const newRow = [...row];
      newRow.splice(idx, 1);
      return newRow;
    }));
    setCols(c => c - 1);
    setContextMenu(null);
  };

  // Pass these handlers to ExcelGrid
  return (
    <div className="main-bg" onClick={handleCloseContextMenu}>
      <header className="header-gradient">
        <h1>
          <span role="img" aria-label="spreadsheet"></span> Excel Grid <span style={{fontWeight:300}}></span>
        </h1>
        <p className="subtitle"></p>
      </header>
      <div className="card-container">
        <div className="controls-row">
          <label>
            Rows:&nbsp;
            <input
              type="number"
              min={1}
              value={rows}
              onChange={handleRowsChange}
              className="input-num"
            />
          </label>
          <label>
            Columns:&nbsp;
            <input
              type="number"
              min={1}
              value={cols}
              onChange={handleColsChange}
              className="input-num"
            />
          </label>
        </div>
        <div className="filter-row">
          <label>
            <span className="filter-label">Filter column:</span>
            <select
              value={filterCol}
              onChange={e => setFilterCol(Number(e.target.value))}
              className="filter-select"
            >
              {Array.from({ length: cols }).map((_, idx) => (
                <option key={idx} value={idx}>
                  {getColumnLabel(idx)}
                </option>
              ))}
            </select>
          </label>
          <input
            type="text"
            placeholder="Filter value"
            value={filterValue}
            onChange={e => setFilterValue(e.target.value)}
            className="filter-input"
          />
          <button className="btn-accent" onClick={handleApplyFilter}>Apply Filter</button>
          <button className="btn-clear" onClick={handleClearFilter} disabled={!filteredData}>Clear Filter</button>
        </div>
        <ExcelGrid
          data={filteredData !== null ? filteredData : data}
          rows={filteredData !== null ? filteredData.length : rows}
          columns={cols}
          onChange={setData}
          onShowContextMenu={handleShowContextMenu}
        />
        {contextMenu && (
          <div
            style={{
              position: 'fixed',
              top: contextMenu.y,
              left: contextMenu.x,
              background: '#fff',
              border: '1px solid #6366f1',
              borderRadius: 8,
              boxShadow: '0 2px 12px #6366f122',
              zIndex: 1000,
              minWidth: 160,
              padding: 0,
            }}
            onContextMenu={e => e.preventDefault()}
          >
            {contextMenu.type === 'row' && (
              <>
                <button className="context-btn" onClick={() => insertRow(contextMenu.rowIdx)}>Add Row Above</button>
                <button className="context-btn" onClick={() => insertRow(contextMenu.rowIdx + 1)}>Add Row Below</button>
                <button className="context-btn" onClick={() => deleteRow(contextMenu.rowIdx)}>Delete Row</button>
              </>
            )}
            {contextMenu.type === 'col' && (
              <>
                <button className="context-btn" onClick={() => insertCol(contextMenu.colIdx)}>Add Column Left</button>
                <button className="context-btn" onClick={() => insertCol(contextMenu.colIdx + 1)}>Add Column Right</button>
                <button className="context-btn" onClick={() => deleteCol(contextMenu.colIdx)}>Delete Column</button>
              </>
            )}
            {contextMenu.type === 'cell' && (
              <>
                <button className="context-btn" onClick={() => insertRow(contextMenu.rowIdx)}>Add Row Above</button>
                <button className="context-btn" onClick={() => insertRow(contextMenu.rowIdx + 1)}>Add Row Below</button>
                <button className="context-btn" onClick={() => insertCol(contextMenu.colIdx)}>Add Column Left</button>
                <button className="context-btn" onClick={() => insertCol(contextMenu.colIdx + 1)}>Add Column Right</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
