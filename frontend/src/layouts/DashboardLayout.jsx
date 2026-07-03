import React, { useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Book, LayoutDashboard, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

function DashboardLayout({ role }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardPath = role === 'Student' ? '/student' : '/instructor';
  
  const isActive = (path) => {
    if (path === dashboardPath) {
      return location.pathname === dashboardPath;
    }
    return location.pathname.startsWith(path);
  };

  const linkClass = (path) => 
    `flex items-center px-2 py-2 text-sm font-medium rounded-md ${
      isActive(path)
        ? 'bg-blue-50 text-blue-700'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;

  const iconClass = (path) => 
    `mr-3 w-5 h-5 ${isActive(path) ? 'text-blue-500' : 'text-slate-400'}`;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Book className="w-6 h-6 text-blue-600 mr-2" />
          <span className="text-xl font-bold text-slate-900">SkillForge</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-1">
            <Link to={dashboardPath} className={linkClass(dashboardPath)}>
              <LayoutDashboard className={iconClass(dashboardPath)} />
              Dashboard
            </Link>
            {role === 'Student' && (
              <Link to="/student/courses" className={linkClass('/student/courses')}>
                <Book className={iconClass('/student/courses')} />
                Browse Courses
              </Link>
            )}
            {/* Add more links here */}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold uppercase overflow-hidden">
              {user?.avatar === 'no-photo.jpg' ? user?.name?.charAt(0) : <img src={`http://localhost:5001${user?.avatar}`} alt="Avatar" className="w-full h-full object-cover" />}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-700">{user?.name}</p>
              <p className="text-xs font-medium text-slate-500">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="mt-4 flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50">
            <LogOut className="mr-3 w-5 h-5 text-red-400" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-6 md:hidden">
            <button onClick={handleLogout} className="text-red-600">Logout</button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
