import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';

// Mobile-responsive table component that switches to card layout on small screens
export const ResponsiveTable = ({ 
  data = [], 
  columns = [], 
  title,
  onRowClick,
  actions,
  emptyMessage = "No data available",
  className = ""
}) => {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            {emptyMessage}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        {/* Desktop Table View */}
        <div className="desktop-only">
          <div className="mobile-table-container">
            <table className="mobile-table">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      scope="col"
                      className={`text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        column.align === 'right' ? 'text-right' : 
                        column.align === 'center' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {column.header}
                    </th>
                  ))}
                  {actions && (
                    <th scope="col" className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, rowIndex) => (
                  <tr 
                    key={rowIndex}
                    className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`whitespace-nowrap text-sm ${
                          column.align === 'right' ? 'text-right' : 
                          column.align === 'center' ? 'text-center' : 'text-left'
                        }`}
                      >
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </td>
                    ))}
                    {actions && (
                      <td className="text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {actions(row)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="mobile-only">
          <div className="divide-y divide-gray-200">
            {data.map((row, index) => (
              <div 
                key={index}
                className={`p-4 ${onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                <div className="space-y-2">
                  {columns.map((column, colIndex) => (
                    <div key={colIndex} className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-500 min-w-0 flex-1">
                        {column.header}:
                      </span>
                      <span className="text-sm text-gray-900 ml-2 text-right">
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </span>
                    </div>
                  ))}
                  {actions && (
                    <div className="flex justify-end space-x-2 mt-3 pt-2 border-t border-gray-100">
                      {actions(row)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Simple responsive data list component for key-value pairs
export const ResponsiveDataList = ({ 
  data = [], 
  title,
  className = "",
  emptyMessage = "No data available"
}) => {
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            {emptyMessage}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <dl className="space-y-3 sm:space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:justify-between">
              <dt className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">
                {item.label}
              </dt>
              <dd className="text-sm text-gray-900 sm:text-right">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
};

// Responsive stats grid component
export const ResponsiveStatsGrid = ({ stats = [], className = "" }) => {
  return (
    <div className={`mobile-stat-grid ${className}`}>
      {stats.map((stat, index) => (
        <Card key={index} className={`${stat.bgColor || 'bg-white'} ${stat.borderColor || 'border-gray-200'}`}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {stat.label}
                </p>
                <p className={`text-lg sm:text-2xl font-bold ${stat.textColor || 'text-gray-900'} truncate`}>
                  {stat.value}
                </p>
                {stat.change && (
                  <p className={`text-xs ${stat.changeColor || 'text-gray-500'}`}>
                    {stat.change}
                  </p>
                )}
              </div>
              {stat.icon && (
                <div className={`${stat.iconBgColor || 'bg-gray-100'} p-2 sm:p-3 rounded-full flex-shrink-0 ml-2`}>
                  {stat.icon}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ResponsiveTable;
