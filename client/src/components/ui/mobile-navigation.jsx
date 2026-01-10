import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './button';

// Mobile navigation drawer component
export const MobileNavigationDrawer = ({ 
  isOpen, 
  onClose, 
  navigation = [], 
  user,
  onLogout,
  title = "Navigation",
  className = ""
}) => {
  const location = useLocation();

  // Close drawer when route changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="mobile-nav-overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Navigation Panel */}
      <div className={`mobile-nav-panel ${isOpen ? 'open' : 'closed'} ${className}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 touch-target"
              aria-label="Close navigation"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-4 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    location.pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  } group flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors touch-target`}
                >
                  {item.icon && <item.icon />}
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* User Info and Logout */}
          {user && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                  {user.role && (
                    <p className="text-xs text-gray-400 capitalize">
                      {user.role}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="w-full touch-target"
                onClick={onLogout}
              >
                <span className="mr-2">🚪</span>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Mobile header component with hamburger menu
export const MobileHeader = ({ 
  title, 
  onMenuClick, 
  user,
  actions = [],
  className = ""
}) => {
  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Menu button and title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 touch-target lg:hidden"
              aria-label="Open navigation menu"
            >
              <span className="text-xl">☰</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h1>
          </div>

          {/* Right side - Actions and user info */}
          <div className="flex items-center space-x-2">
            {actions.map((action, index) => (
              <div key={index}>
                {action}
              </div>
            ))}
            
            {user && (
              <div className="hidden sm:block">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Responsive breadcrumb component
export const ResponsiveBreadcrumb = ({ items = [], className = "" }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className={`mobile-padding ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            {item.href ? (
              <Link
                to={item.href}
                className="text-gray-500 hover:text-gray-700 truncate max-w-32 sm:max-w-none"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium truncate max-w-32 sm:max-w-none">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Bottom navigation for mobile (alternative to drawer)
export const MobileBottomNavigation = ({ 
  navigation = [], 
  className = "" 
}) => {
  const location = useLocation();

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 lg:hidden ${className}`}>
      <div className="flex justify-around">
        {navigation.slice(0, 5).map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`${
              location.pathname === item.href
                ? 'text-primary'
                : 'text-gray-400 hover:text-gray-600'
            } flex flex-col items-center py-2 px-1 text-xs font-medium transition-colors touch-target min-w-0`}
          >
            {item.icon && <item.icon />}
            <span className="mt-1 truncate max-w-12">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigationDrawer;
