import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';

// Mobile-responsive form container
export const ResponsiveForm = ({ 
  title, 
  children, 
  onSubmit,
  className = "",
  ...props 
}) => {
  return (
    <Card className={`w-full max-w-4xl mx-auto ${className}`}>
      {title && (
        <CardHeader>
          <CardTitle className="text-responsive-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="mobile-padding">
        <form onSubmit={onSubmit} className="mobile-form-container" {...props}>
          {children}
        </form>
      </CardContent>
    </Card>
  );
};

// Mobile-responsive form field group
export const FormFieldGroup = ({ 
  label, 
  children, 
  error,
  required = false,
  className = "" 
}) => {
  return (
    <div className={`mobile-form-group ${className}`}>
      {label && (
        <Label className="text-responsive-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-sm text-red-600 mt-1 flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

// Mobile-responsive form row (side-by-side fields on larger screens)
export const FormRow = ({ children, className = "" }) => {
  return (
    <div className={`mobile-form-row ${className}`}>
      {children}
    </div>
  );
};

// Mobile-responsive form actions (buttons)
export const FormActions = ({ 
  children, 
  align = "right",
  className = "" 
}) => {
  const alignmentClasses = {
    left: "justify-start",
    center: "justify-center", 
    right: "justify-end sm:justify-end",
    between: "justify-between"
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${alignmentClasses[align]} ${className}`}>
      {children}
    </div>
  );
};

// Mobile-responsive input field with enhanced touch targets
export const ResponsiveInput = ({ 
  label, 
  error, 
  required = false,
  className = "",
  ...props 
}) => {
  return (
    <FormFieldGroup label={label} error={error} required={required}>
      <Input 
        className={`touch-target ${className}`}
        {...props}
      />
    </FormFieldGroup>
  );
};

// Mobile-responsive select field
export const ResponsiveSelect = ({ 
  label, 
  options = [], 
  error, 
  required = false,
  className = "",
  ...props 
}) => {
  return (
    <FormFieldGroup label={label} error={error} required={required}>
      <select 
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-responsive-sm p-3 border touch-target ${className}`}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormFieldGroup>
  );
};

// Mobile-responsive textarea field
export const ResponsiveTextarea = ({ 
  label, 
  error, 
  required = false,
  rows = 4,
  className = "",
  ...props 
}) => {
  return (
    <FormFieldGroup label={label} error={error} required={required}>
      <textarea 
        rows={rows}
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-responsive-sm p-3 border resize-y touch-target ${className}`}
        {...props}
      />
    </FormFieldGroup>
  );
};

// Mobile-responsive checkbox field
export const ResponsiveCheckbox = ({ 
  label, 
  error, 
  className = "",
  ...props 
}) => {
  return (
    <FormFieldGroup error={error}>
      <div className="flex items-center space-x-3">
        <input 
          type="checkbox"
          className={`h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded touch-target ${className}`}
          {...props}
        />
        {label && (
          <Label className="text-responsive-sm text-gray-700">
            {label}
          </Label>
        )}
      </div>
    </FormFieldGroup>
  );
};

// Mobile-responsive radio group
export const ResponsiveRadioGroup = ({ 
  label, 
  options = [], 
  name,
  error, 
  required = false,
  className = "",
  ...props 
}) => {
  return (
    <FormFieldGroup label={label} error={error} required={required}>
      <div className="space-y-3">
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-3">
            <input 
              type="radio"
              name={name}
              value={option.value}
              className={`h-5 w-5 text-primary focus:ring-primary border-gray-300 touch-target ${className}`}
              {...props}
            />
            <Label className="text-responsive-sm text-gray-700">
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </FormFieldGroup>
  );
};

// Mobile-responsive file input
export const ResponsiveFileInput = ({ 
  label, 
  error, 
  required = false,
  accept,
  multiple = false,
  className = "",
  ...props 
}) => {
  return (
    <FormFieldGroup label={label} error={error} required={required}>
      <input 
        type="file"
        accept={accept}
        multiple={multiple}
        className={`block w-full text-responsive-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 touch-target ${className}`}
        {...props}
      />
    </FormFieldGroup>
  );
};

export default ResponsiveForm;
