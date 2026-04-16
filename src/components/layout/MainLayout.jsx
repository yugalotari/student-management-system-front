import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="font-sans bg-gray-100 text-gray-800 h-screen w-full overflow-hidden flex">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <Header 
          setIsMobileOpen={setIsMobileOpen} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        {/* Pass the search context via Outlet context if needed */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 pt-0">
          <Outlet context={{ searchQuery, setSearchQuery }} />
        </div>
      </main>
    </div>
  );
}
