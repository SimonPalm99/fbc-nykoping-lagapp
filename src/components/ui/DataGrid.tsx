/**
 * Advanced DataGrid component with sorting, filtering, pagination, and selection
 */

import React, { useState, useMemo, useCallback, useRef } from 'react';
import './DataGrid.css';

export interface Column<T = any> {
  key: keyof T;
  title: string;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: T, index: number) => React.ReactNode;
  formatter?: (value: any) => string;
  sorter?: (a: T, b: T) => number;
  filterDropdown?: React.ReactNode;
  fixed?: 'left' | 'right';
}

export interface SortInfo {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterInfo {
  [key: string]: any;
}

export interface SelectionInfo<T> {
  selectedRowKeys: (string | number)[];
  selectedRows: T[];
}

export interface DataGridProps<T = any> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  rowKey?: keyof T | ((record: T) => string | number);
  
  // Pagination
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    onChange?: (page: number, pageSize: number) => void;
  } | false;
  
  // Selection
  rowSelection?: {
    type?: 'checkbox' | 'radio';
    selectedRowKeys?: (string | number)[];
    onChange?: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void;
    onSelect?: (record: T, selected: boolean, selectedRows: T[]) => void;
    onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
    getCheckboxProps?: (record: T) => { disabled?: boolean; name?: string };
  };
  
  // Events
  onRowClick?: (record: T, index: number) => void;
  onRowDoubleClick?: (record: T, index: number) => void;
  onSort?: (sortInfo: SortInfo | null) => void;
  
  // Styling
  className?: string;
  size?: 'small' | 'medium' | 'large';
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  
  // Virtualization (for large datasets)
  virtual?: boolean;
  height?: number;
  
  // Empty state
  emptyText?: React.ReactNode;
  
  // Sticky header
  stickyHeader?: boolean;
}

export function DataGrid<T = any>({
  data,
  columns,
  loading = false,
  rowKey = 'id' as keyof T,
  pagination,
  rowSelection,
  onRowClick,
  onRowDoubleClick,
  onSort,
  className = '',
  size = 'medium',
  striped = false,
  bordered = true,
  hoverable = true,
  virtual = false,
  // height = 400, // Removed unused prop
  emptyText = 'Ingen data tillgänglig',
  stickyHeader = false
}: DataGridProps<T>) {
  const [sortInfo, setSortInfo] = useState<SortInfo | null>(null);
  const [_filters] = useState<FilterInfo>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    rowSelection?.selectedRowKeys || []
  );
  
  const tableRef = useRef<HTMLTableElement>(null);

  // Get row key
  const getRowKey = useCallback((record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] as string | number || index;
  }, [rowKey]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortInfo) return data;
    
    const { key, direction } = sortInfo;
    const column = columns.find(col => col.key === key);
    
    return [...data].sort((a, b) => {
      let result = 0;
      
      if (column?.sorter) {
        result = column.sorter(a, b);
      } else {
        const aVal = a[key as keyof T];
        const bVal = b[key as keyof T];
        
        if (aVal < bVal) result = -1;
        else if (aVal > bVal) result = 1;
        else result = 0;
      }
      
      return direction === 'desc' ? -result : result;
    });
  }, [data, sortInfo, columns]);

  // Filter data
  const filteredData = useMemo(() => {
    if (Object.keys(_filters).length === 0) return sortedData;
    
    return sortedData.filter(record => {
      return Object.entries(_filters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        
        const recordValue = record[key as keyof T];
        
        if (Array.isArray(filterValue)) {
          return filterValue.includes(recordValue);
        }
        
        if (typeof filterValue === 'string') {
          return String(recordValue).toLowerCase().includes(filterValue.toLowerCase());
        }
        
        return recordValue === filterValue;
      });
    });
  }, [sortedData, _filters]);

  // Paginated data
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    
    const { current, pageSize } = pagination;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    
    return filteredData.slice(start, end);
  }, [filteredData, pagination]);

  // Handle sort
  const handleSort = useCallback((column: Column<T>) => {
    if (!column.sortable) return;
    
    const key = String(column.key);
    let newSortInfo: SortInfo | null = null;
    
    if (!sortInfo || sortInfo.key !== key) {
      newSortInfo = { key, direction: 'asc' };
    } else if (sortInfo.direction === 'asc') {
      newSortInfo = { key, direction: 'desc' };
    } else {
      newSortInfo = null; // Remove sort
    }
    
    setSortInfo(newSortInfo);
    onSort?.(newSortInfo);
  }, [sortInfo, onSort]);

  // Handle selection
  const handleRowSelect = useCallback((record: T, selected: boolean) => {
    const key = getRowKey(record, 0);
    let newSelectedRowKeys: (string | number)[];
    
    if (rowSelection?.type === 'radio') {
      newSelectedRowKeys = selected ? [key] : [];
    } else {
      if (selected) {
        newSelectedRowKeys = [...selectedRowKeys, key];
      } else {
        newSelectedRowKeys = selectedRowKeys.filter(k => k !== key);
      }
    }
    
    setSelectedRowKeys(newSelectedRowKeys);
    
    const selectedRows = paginatedData.filter(item => 
      newSelectedRowKeys.includes(getRowKey(item, 0))
    );
    
    rowSelection?.onChange?.(newSelectedRowKeys, selectedRows);
    rowSelection?.onSelect?.(record, selected, selectedRows);
  }, [selectedRowKeys, rowSelection, paginatedData, getRowKey]);

  // Handle select all
  const handleSelectAll = useCallback((selected: boolean) => {
    const allRowKeys = paginatedData.map((record, index) => getRowKey(record, index));
    const newSelectedRowKeys = selected ? allRowKeys : [];
    
    setSelectedRowKeys(newSelectedRowKeys);
    
    const selectedRows = selected ? paginatedData : [];
    const changeRows = selected 
      ? paginatedData.filter(record => !selectedRowKeys.includes(getRowKey(record, 0)))
      : paginatedData.filter(record => selectedRowKeys.includes(getRowKey(record, 0)));
    
    rowSelection?.onChange?.(newSelectedRowKeys, selectedRows);
    rowSelection?.onSelectAll?.(selected, selectedRows, changeRows);
  }, [paginatedData, selectedRowKeys, rowSelection, getRowKey]);

  // Render cell content
  const renderCell = useCallback((column: Column<T>, record: T, index: number): React.ReactNode => {
    const value = record[column.key];
    
    if (column.render) {
      return column.render(value, record, index);
    }
    
    if (column.formatter) {
      return column.formatter(value);
    }
    
    // Convert value to string for display
    if (value === null || value === undefined) {
      return '';
    }
    
    return String(value);
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className={`data-grid loading ${className}`}>
        <div className="data-grid-loading-skeleton"></div>
      </div>
    );
  }

  // Empty state
  if (filteredData.length === 0) {
    return (
      <div className={`data-grid empty ${className}`}>
        <div className="data-grid-empty">{emptyText}</div>
      </div>
    );
  }

  // Main table rendering
  return (
    <div
      className={`data-grid ${className} ${bordered ? 'bordered' : ''} ${striped ? 'striped' : ''} ${hoverable ? 'hoverable' : ''} size-${size}${virtual ? ' virtual-scroll' : ''}`}
    >
      <table
        ref={tableRef}
        className={`data-grid-table${stickyHeader ? ' sticky-header' : ''}${virtual ? ' table-virtual' : ''}`}
      >
        <thead>
          <tr>
            {rowSelection && (
              <th className="data-grid-selection-col">
                {rowSelection.type === 'checkbox' && (
                  <input
                    type="checkbox"
                    title="Välj alla rader"
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((record, idx) =>
                        selectedRowKeys.includes(getRowKey(record, idx))
                      )
                    }
                    ref={el => {
                      if (el) {
                        el.indeterminate =
                          paginatedData.some((record, idx) =>
                            selectedRowKeys.includes(getRowKey(record, idx))
                          ) &&
                          !paginatedData.every((record, idx) =>
                            selectedRowKeys.includes(getRowKey(record, idx))
                          );
                      }
                    }}
                    onChange={e => handleSelectAll(e.target.checked)}
                  />
                )}
              </th>
            )}
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`data-grid-col${col.sortable ? ' sortable' : ''}${col.fixed ? ` fixed-${col.fixed}` : ''}${col.align ? ` align-${col.align}` : ''}${col.width ? ` col-width-${String(col.key)}` : ''}${col.minWidth ? ` col-minwidth-${String(col.key)}` : ''}${col.maxWidth ? ` col-maxwidth-${String(col.key)}` : ''}`}
                onClick={() => handleSort(col)}
              >
                <span>{col.title}</span>
                {col.sortable && (
                  <span className="sort-indicator">
                    {sortInfo?.key === String(col.key)
                      ? sortInfo.direction === 'asc'
                        ? '▲'
                        : '▼'
                      : ''}
                  </span>
                )}
                {col.filterable && col.filterDropdown && (
                  <span className="filter-dropdown">{col.filterDropdown}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((record, rowIdx) => {
            const key = getRowKey(record, rowIdx);
            const isSelected = selectedRowKeys.includes(key);

            return (
              <tr
                key={key}
                className={isSelected ? 'selected' : ''}
                onClick={() => onRowClick?.(record, rowIdx)}
                onDoubleClick={() => onRowDoubleClick?.(record, rowIdx)}
              >
                {rowSelection && (
                  <td className="data-grid-selection-col">
                    {rowSelection.type === 'radio' ? (
                      <input
                        type="radio"
                        checked={isSelected}
                        disabled={rowSelection.getCheckboxProps?.(record)?.disabled}
                        name={rowSelection.getCheckboxProps?.(record)?.name || 'data-grid-radio'}
                        title="Välj rad"
                        onChange={e => handleRowSelect(record, e.target.checked)}
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={rowSelection.getCheckboxProps?.(record)?.disabled}
                        name={rowSelection.getCheckboxProps?.(record)?.name}
                        title="Välj rad"
                        onChange={e => handleRowSelect(record, e.target.checked)}
                      />
                    )}
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`data-grid-col${col.fixed ? ` fixed-${col.fixed}` : ''}${col.align ? ` align-${col.align}` : ''}${col.width ? ` col-width-${String(col.key)}` : ''}${col.minWidth ? ` col-minwidth-${String(col.key)}` : ''}${col.maxWidth ? ` col-maxwidth-${String(col.key)}` : ''}`}
                  >
                    {renderCell(col, record, rowIdx)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {pagination && (
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          showSizeChanger={pagination.showSizeChanger}
          showQuickJumper={pagination.showQuickJumper}
          onChange={pagination.onChange ?? (() => {})}
        />
      )}
    </div>
  );
}

// Simple Pagination component
interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean | undefined;
  showQuickJumper?: boolean | undefined;
  onChange: (page: number, pageSize: number) => void;
}

function Pagination({
  current,
  pageSize,
  total,
  showSizeChanger,
  onChange
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const start = (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onChange?.(page, pageSize);
    }
  };

  const handleSizeChange = (newPageSize: number) => {
    const newPage = Math.ceil(((current - 1) * pageSize + 1) / newPageSize);
    onChange?.(newPage, newPageSize);
  };

  return (
    <div className="pagination">
      <div className="pagination-info">
        Visar {start}-{end} av {total} objekt
      </div>
      
      <div className="pagination-controls">
        <button
          disabled={current <= 1}
          onClick={() => handlePageChange(current - 1)}
        >
          Föregående
        </button>
        
        <span className="page-info">
          Sida {current} av {totalPages}
        </span>
        
        <button
          disabled={current >= totalPages}
          onClick={() => handlePageChange(current + 1)}
        >
          Nästa
        </button>
      </div>
      
      {showSizeChanger && (
        <div className="page-size-changer">
          <select
            value={pageSize}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            title="Välj antal per sida"
          >
            <option value={10}>10 / sida</option>
            <option value={20}>20 / sida</option>
            <option value={50}>50 / sida</option>
            <option value={100}>100 / sida</option>
          </select>
        </div>
      )}
    </div>
  );
}
