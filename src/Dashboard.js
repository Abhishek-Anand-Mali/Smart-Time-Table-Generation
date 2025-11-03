import React from 'react';
import { BookOpen, Users, DoorOpen, Settings } from 'lucide-react';

const Dashboard = ({ setCurrentPage, courses, faculty, rooms, generateTimetable, isGenerating }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Smart Timetable Generator</h2>
      <p className="text-gray-600 mb-6">
        An innovative solution for creating efficient timetables using Genetic Algorithms.
        This system automates the complex process of scheduling while considering constraints
        like faculty availability, room allocation, and subject priorities.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <button onClick={() => setCurrentPage('courses')} className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition">
        <BookOpen className="w-12 h-12 mb-3" />
        <h3 className="text-xl font-bold mb-2">Courses</h3>
        <p className="text-purple-100">Manage course information</p>
        <div className="mt-4 text-2xl font-bold">{courses.length}</div>
      </button>

      <button onClick={() => setCurrentPage('faculty')} className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition">
        <Users className="w-12 h-12 mb-3" />
        <h3 className="text-xl font-bold mb-2">Faculty</h3>
        <p className="text-green-100">Manage faculty members</p>
        <div className="mt-4 text-2xl font-bold">{faculty.length}</div>
      </button>

      <button onClick={() => setCurrentPage('rooms')} className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition">
        <DoorOpen className="w-12 h-12 mb-3" />
        <h3 className="text-xl font-bold mb-2">Rooms & Labs</h3>
        <p className="text-orange-100">Manage classroom spaces</p>
        <div className="mt-4 text-2xl font-bold">{rooms.length}</div>
      </button>

      <button onClick={generateTimetable} disabled={isGenerating} className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition disabled:opacity-50">
        <Settings className="w-12 h-12 mb-3" />
        <h3 className="text-xl font-bold mb-2">Generate</h3>
        <p className="text-blue-100">Create timetable</p>
        <div className="mt-4 text-sm font-bold">{isGenerating ? 'Processing...' : 'Ready'}</div>
      </button>
    </div>

    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Settings className="w-6 h-6 mr-2" />
        Key Features
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-2">✓ Genetic Algorithm Optimization</h4>
          <p className="text-sm text-gray-600">Uses advanced evolutionary algorithms for optimal scheduling</p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-2">✓ Conflict Resolution</h4>
          <p className="text-sm text-gray-600">Automatically resolves scheduling conflicts and overlaps</p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-2">✓ Resource Optimization</h4>
          <p className="text-sm text-gray-600">Maximizes utilization of faculty, rooms, and time slots</p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-2">✓ Constraint Satisfaction</h4>
          <p className="text-sm text-gray-600">Respects hard and soft constraints for valid timetables</p>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
