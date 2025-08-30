import React, { useRef, useState } from 'react';
import '../styles/ExcelGrid.css';

function getColumnLabel(index) {
  let label = '';
  while (index >= 0) {
    label = String.fromCharCode((index % 26) + 65) + label;
    index = Math.floor(index / 26) - 1;
  }
  return label;
}

export default function ExcelGrid({ data, rows, columns, onChange, onShowContextMenu }) {
  const [focus, setFocus] = useState({ row: 0, col: 0 });
  const [sortConfig, setSortConfig] = useState({ col: null, direction: null });
  const inputRefs = useRef([]);

  const handleInputChange = (row, col, value) => {
    const newData = data.map((r, i) =>
      i === row ? r.map((c, j) => (j === col ? value : c)) : r
    );
    if (onChange) onChange(newData);
  };

  const handleKeyDown = (e, row, col) => {
    let nextRow = row;
    let nextCol = col;
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        if (col > 0) nextCol = col - 1;
        else if (row > 0) {
          nextRow = row - 1;
          nextCol = columns - 1;
        }
      } else {
        if (col < columns - 1) nextCol = col + 1;
        else if (row < rows - 1) {
          nextRow = row + 1;
          nextCol = 0;
        }
      }
    } else if (e.key === 'ArrowRight') {
      if (col < columns - 1) nextCol = col + 1;
    } else if (e.key === 'ArrowLeft') {
      if (col > 0) nextCol = col - 1;
    } else if (e.key === 'ArrowDown') {
      if (row < rows - 1) nextRow = row + 1;
    } else if (e.key === 'ArrowUp') {
      if (row > 0) nextRow = row - 1;
    }
    setFocus({ row: nextRow, col: nextCol });
    setTimeout(() => {
      inputRefs.current[nextRow * columns + nextCol]?.focus();
    }, 0);
  };

  // Sorting handler
  const handleSort = (colIdx, direction) => {
    const sortedData = [...data].sort((a, b) => {
      const valA = a[colIdx];
      const valB = b[colIdx];

      // Treat null/undefined/empty string as blank
      const isBlankA = valA === null || valA === undefined || valA === '';
      const isBlankB = valB === null || valB === undefined || valB === '';

      // Blanks always at the end for both asc and desc
      if (isBlankA && !isBlankB) return 1;
      if (!isBlankA && isBlankB) return -1;
      if (isBlankA && isBlankB) return 0;

      // Try to sort as numbers, fallback to string
      const numA = parseFloat(valA);
      const numB = parseFloat(valB);
      if (!isNaN(numA) && !isNaN(numB)) {
        return direction === 'asc' ? numA - numB : numB - numA;
      }
      return direction === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
    setSortConfig({ col: colIdx, direction });
    if (onChange) onChange(sortedData);
  };

  return (
    <div className="excel-grid">
      <table>
        <thead>
          <tr>
            <th></th>
            {Array.from({ length: columns }).map((_, colIdx) => (
              <th
                key={colIdx}
                className={focus.col === colIdx ? 'highlight' : ''}
                style={{ position: 'relative' }}
                onContextMenu={e => onShowContextMenu && onShowContextMenu(e, 'col', null, colIdx)}
              >
                {getColumnLabel(colIdx)}
                <span style={{ marginLeft: 4 }}>
                  <button
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: 12,
                      color: sortConfig.col === colIdx && sortConfig.direction === 'asc' ? '#1a4e8a' : '#888'
                    }}
                    title="Sort Ascending"
                    onClick={() => handleSort(colIdx, 'asc')}
                  >▲</button>
                  <button
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: 12,
                      color: sortConfig.col === colIdx && sortConfig.direction === 'desc' ? '#1a4e8a' : '#888'
                    }}
                    title="Sort Descending"
                    onClick={() => handleSort(colIdx, 'desc')}
                  >▼</button>
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              <th
                className={focus.row === rowIdx ? 'highlight' : ''}
                onContextMenu={e => onShowContextMenu && onShowContextMenu(e, 'row', rowIdx, null)}
              >
                {rowIdx + 1}
              </th>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td
                  key={colIdx}
                  onContextMenu={e => onShowContextMenu && onShowContextMenu(e, 'cell', rowIdx, colIdx)}
                >
                  <input
                    ref={el => (inputRefs.current[rowIdx * columns + colIdx] = el)}
                    value={data[rowIdx][colIdx]}
                    onChange={e => handleInputChange(rowIdx, colIdx, e.target.value)}
                    onFocus={() => setFocus({ row: rowIdx, col: colIdx })}
                    onKeyDown={e => handleKeyDown(e, rowIdx, colIdx)}
                    className={
                      focus.row === rowIdx && focus.col === colIdx ? 'cell-focus' : ''
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
