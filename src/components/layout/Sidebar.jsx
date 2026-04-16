import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, X } from 'lucide-react';

import logoImage from '../../assets/logo.png';

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col py-5 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="px-6 pb-7 flex items-center justify-between">
          <div className="flex items-center">
            <img src={logoImage} alt="EduTrack Logo" className="h-18 w-auto object-contain" />
          </div>
          <button
            className="lg:hidden text-gray-500"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="list-none flex flex-col gap-1 px-3">
            <li>
              <NavLink
                to="/students"
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <Users className="w-5 h-5" />
                Student Directory
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
