import { useAuth } from '../../context/AuthContext';

const ParentDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 h-96 flex flex-col justify-center items-center">
              <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.name}!</h2>
              <p className="text-gray-600">This is a placeholder for the parent dashboard.</p>
              <p className="text-gray-500 mt-2">Role: {user?.role}</p>
              
              {user?.children && user.children.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium">Children:</p>
                  <ul className="list-disc pl-5 mt-2">
                    {user.children.map((child) => (
                      <li key={child._id}>
                        {child.name} - Class: {child.classId.name} {child.classId.section}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
