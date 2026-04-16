import React from 'react';
import { Menu, Search, UserPlus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header({ setIsMobileOpen, searchQuery, setSearchQuery }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard';
    if (location.pathname.startsWith('/students/new')) return 'Add Student';
    if (location.pathname.startsWith('/students/edit')) return 'Edit Student';
    if (location.pathname.startsWith('/students')) return 'Student Directory';
    return '';
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 lg:p-6 shrink-0 bg-gray-100">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden text-gray-600"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl lg:text-2xl font-bold">{getPageTitle()}</h1>
      </div>

      {location.pathname === '/students' && (
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or ADM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-[250px] pl-9 pr-2 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <button
            onClick={() => navigate('/students/new')}
            className="px-3 py-1.5 rounded border border-transparent bg-blue-600 text-white text-xs font-medium cursor-pointer hover:bg-blue-700 transition-colors flex items-center gap-1 whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4 hidden sm:block" /> Add Student
          </button>
        </div>
      )}
    </header>
  );
}
