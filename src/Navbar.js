import React from 'react';
import { Calendar, Home, LogOut, Menu } from 'lucide-react';

const Navbar = ({ currentPage, setCurrentPage, setIsLoggedIn, showMenu, setShowMenu }) => (
  <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
          <Calendar className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">Smart Timetable Generator</h1>
            <p className="text-xs text-blue-100">CodeHunters, SDMIT</p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <button onClick={() => setCurrentPage('dashboard')} className="hover:bg-blue-700 px-3 py-2 rounded transition">
            <Home className="w-5 h-5" />
          </button>
          <button onClick={() => setIsLoggedIn(false)} className="hover:bg-blue-700 px-3 py-2 rounded transition flex items-center space-x-2">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        <button onClick={() => setShowMenu(!showMenu)} className="md:hidden">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </div>

    {showMenu && (
      <div className="md:hidden bg-blue-700 px-4 py-2">
        <button onClick={() => { setCurrentPage('dashboard'); setShowMenu(false); }} className="block w-full text-left py-2">Dashboard</button>
        <button onClick={() => setIsLoggedIn(false)} className="block w-full text-left py-2">Logout</button>
      </div>
    )}
  </nav>
);

export default Navbar;
