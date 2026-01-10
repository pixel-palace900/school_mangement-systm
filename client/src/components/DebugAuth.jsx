import React, { useState } from 'react';
import { clearLocalAuthData, getLocalUsers } from '../api/auth';

const DebugAuth = () => {
  const [localUsers, setLocalUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);

  const handleClearLocalData = () => {
    const success = clearLocalAuthData();
    if (success) {
      alert('Local authentication data cleared successfully! Please refresh the page.');
      setLocalUsers([]);
      setShowUsers(false);
    } else {
      alert('Failed to clear local authentication data.');
    }
  };

  const handleShowLocalUsers = () => {
    const users = getLocalUsers();
    setLocalUsers(users);
    setShowUsers(true);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Debug Authentication</h2>
      
      <div className="space-y-4">
        <button
          onClick={handleShowLocalUsers}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Show Local Users
        </button>

        <button
          onClick={handleClearLocalData}
          className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Clear Local Auth Data
        </button>
      </div>

      {showUsers && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Local Users ({localUsers.length}):</h3>
          {localUsers.length === 0 ? (
            <p className="text-gray-600">No local users found</p>
          ) : (
            <div className="space-y-2">
              {localUsers.map((user, index) => (
                <div key={index} className="p-2 bg-white rounded border text-sm">
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Type:</strong> {user.userType}</div>
                  <div><strong>Name:</strong> {user.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-100 rounded text-sm">
        <p><strong>Note:</strong> This component helps debug local authentication issues. 
        If you can log in even after deleting users from the database, 
        it's because credentials are stored locally in your browser.</p>
      </div>
    </div>
  );
};

export default DebugAuth;
