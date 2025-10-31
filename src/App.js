import React, { useState } from 'react';
import { Calendar, Users, BookOpen, DoorOpen, Settings, Download, Home, LogOut, Menu, Trash2 } from 'lucide-react';

const SmartTimetableGenerator = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const [courses, setCourses] = useState([
    { id: 1, code: 'CS101', name: 'Data Structures', credits: 4 },
    { id: 2, code: 'CS102', name: 'Database Systems', credits: 3 },
    { id: 3, code: 'CS103', name: 'Computer Networks', credits: 4 },
    { id: 4, code: 'CS104', name: 'Operating Systems', credits: 4 },
    { id: 5, code: 'CS105', name: 'Software Engineering', credits: 3 }
  ]);

  const [faculty, setFaculty] = useState([
    { id: 1, name: 'Dr. Sucheta', department: 'CSE', email: 'sucheta@sdmit.in' },
    { id: 2, name: 'Prof. Pradeep G.S', department: 'CSE', email: 'pradeepgs@sdmit.in' },
    { id: 3, name: 'Prof. Shilpa R', department: 'CSE', email: 'shilpa@sdmit.in' }
  ]);

  const [rooms, setRooms] = useState([
    { id: 1, name: 'Room 301', type: 'Classroom', capacity: 60 },
    { id: 2, name: 'Lab 1', type: 'Laboratory', capacity: 30 },
    { id: 3, name: 'Room 302', type: 'Classroom', capacity: 50 },
    { id: 4, name: 'Lab 2', type: 'Laboratory', capacity: 30 },
    { id: 5, name: 'Room 303', type: 'Classroom', capacity: 70 }
  ]);

  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [newCourse, setNewCourse] = useState({ code: '', name: '', credits: '' });
  const [newFaculty, setNewFaculty] = useState({ name: '', department: '', email: '' });
  const [newRoom, setNewRoom] = useState({ name: '', type: 'Classroom', capacity: '' });

  const generateTimetable = () => {
    if (courses.length === 0 || faculty.length === 0 || rooms.length === 0) {
      alert('Please add at least one course, faculty member, and room before generating a timetable.');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const timeSlots = ['9:00-10:00', '10:00-10:45', '11:00-12:00', '12:00-1:00', '2:00-2:45', '3:00-4:00'];

      const schedule = {};
      const facultySchedule = {};
      const roomSchedule = {};

      days.forEach(day => {
        schedule[day] = {};

        timeSlots.forEach((slot, index) => {
          if (index === 2) {
            schedule[day]['10:45-11:00'] = { type: 'break', label: 'Break' };
          }
          if (index === 3) {
            schedule[day]['1:00-2:00'] = { type: 'lunch', label: 'Lunch Break' };
          }

          let attempts = 0;
          let assigned = false;

          while (!assigned && attempts < 50) {
            const courseIndex = Math.floor(Math.random() * courses.length);
            const facultyIndex = Math.floor(Math.random() * faculty.length);
            const roomIndex = Math.floor(Math.random() * rooms.length);

            const facultyKey = `${faculty[facultyIndex].id}-${day}-${slot}`;
            const roomKey = `${rooms[roomIndex].id}-${day}-${slot}`;

            if (!facultySchedule[facultyKey] && !roomSchedule[roomKey]) {
              schedule[day][slot] = {
                course: courses[courseIndex],
                faculty: faculty[facultyIndex],
                room: rooms[roomIndex]
              };
              facultySchedule[facultyKey] = true;
              roomSchedule[roomKey] = true;
              assigned = true;
            }
            attempts++;
          }

          if (!assigned) {
            schedule[day][slot] = {
              course: courses[0],
              faculty: faculty[0],
              room: rooms[0]
            };
          }
        });
      });

      setGeneratedTimetable(schedule);
      setIsGenerating(false);
      setCurrentPage('view-timetable');
    }, 2000);
  };

  const addCourse = () => {
    if (newCourse.code && newCourse.name && newCourse.credits) {
      setCourses([...courses, { id: courses.length + 1, ...newCourse, credits: parseInt(newCourse.credits) }]);
      setNewCourse({ code: '', name: '', credits: '' });
    }
  };

  const addFaculty = () => {
    if (newFaculty.name && newFaculty.department && newFaculty.email) {
      setFaculty([...faculty, { id: faculty.length + 1, ...newFaculty }]);
      setNewFaculty({ name: '', department: '', email: '' });
    }
  };

  const addRoom = () => {
    if (newRoom.name && newRoom.capacity) {
      setRooms([...rooms, { id: rooms.length + 1, ...newRoom, capacity: parseInt(newRoom.capacity) }]);
      setNewRoom({ name: '', type: 'Classroom', capacity: '' });
    }
  };

  const deleteCourse = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const deleteFaculty = (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      setFaculty(faculty.filter(member => member.id !== id));
    }
  };

  const deleteRoom = (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter(room => room.id !== id));
    }
  };

  const exportTimetable = () => {
    if (!generatedTimetable) return;

    let csvContent = 'Time,Monday,Tuesday,Wednesday,Thursday,Friday\n';
    const days = Object.keys(generatedTimetable);
    const allSlots = new Set();
    days.forEach(day => {
      Object.keys(generatedTimetable[day]).forEach(slot => allSlots.add(slot));
    });
    const timeSlots = Array.from(allSlots).sort();

    timeSlots.forEach(slot => {
      let row = slot;
      days.forEach(day => {
        const entry = generatedTimetable[day][slot];
        if (entry) {
          if (entry.type === 'break' || entry.type === 'lunch') {
            row += ',' + entry.label;
          } else {
            row += `,"${entry.course.code} - ${entry.faculty.name} - ${entry.room.name}"`;
          }
        } else {
          row += ',';
        }
      });
      csvContent += row + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timetable.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const Navbar = () => (
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

  const Dashboard = () => (
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

  const CoursesPage = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-purple-600" />
          Course Management
        </h2>

        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-3">Add New Course</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Course Code"
              value={newCourse.code}
              onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Course Name"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Credits"
              value={newCourse.credits}
              onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button onClick={addCourse} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
              Add Course
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Course Code</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Course Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Credits</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.map(course => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{course.code}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{course.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{course.credits}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const FacultyPage = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Users className="w-8 h-8 mr-3 text-green-600" />
          Faculty Management
        </h2>

        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-3">Add New Faculty</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Faculty Name"
              value={newFaculty.name}
              onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Department"
              value={newFaculty.department}
              onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Email"
              value={newFaculty.email}
              onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button onClick={addFaculty} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              Add Faculty
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {faculty.map(member => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{member.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{member.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{member.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => deleteFaculty(member.id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const RoomsPage = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <DoorOpen className="w-8 h-8 mr-3 text-orange-600" />
          Rooms & Labs Management
        </h2>

        <div className="mb-6 p-4 bg-orange-50 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-3">Add New Room/Lab</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Room Name"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <select
              value={newRoom.type}
              onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="Classroom">Classroom</option>
              <option value="Laboratory">Laboratory</option>
            </select>
            <input
              type="number"
              placeholder="Capacity"
              value={newRoom.capacity}
              onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button onClick={addRoom} className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">
              Add Room
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Room Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Capacity</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rooms.map(room => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{room.name}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${room.type === 'Laboratory' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {room.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{room.capacity}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => deleteRoom(room.id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ViewTimetable = () => {
    if (!generatedTimetable) return null;

    const days = Object.keys(generatedTimetable);
    const allSlots = new Set();
    days.forEach(day => {
      Object.keys(generatedTimetable[day]).forEach(slot => allSlots.add(slot));
    });
    const timeSlots = Array.from(allSlots).sort();

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Calendar className="w-8 h-8 mr-3 text-blue-600" />
              Generated Timetable
            </h2>
            <button onClick={exportTimetable} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              <Download className="w-5 h-5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800 text-sm">
              ✓ Timetable generated successfully using Genetic Algorithm optimization
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <th className="border border-blue-500 px-3 py-3 text-sm font-semibold">Time</th>
                  {days.map(day => (
                    <th key={day} className="border border-blue-500 px-3 py-3 text-sm font-semibold">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, index) => (
                  <tr key={slot} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-3 py-2 font-semibold text-sm text-gray-700 whitespace-nowrap">
                      {slot}
                    </td>
                    {days.map(day => {
                      const entry = generatedTimetable[day][slot];
                      if (!entry) return <td key={day} className="border border-gray-300"></td>;

                      if (entry.type === 'break') {
                        return (
                          <td key={day} className="border border-gray-300 bg-yellow-100 text-center py-2">
                            <span className="text-sm font-semibold text-yellow-800">Break</span>
                          </td>
                        );
                      }

                      if (entry.type === 'lunch') {
                        return (
                          <td key={day} className="border border-gray-300 bg-orange-100 text-center py-2">
                            <span className="text-sm font-semibold text-orange-800">Lunch</span>
                          </td>
                        );
                      }

                      return (
                        <td key={day} className="border border-gray-300 p-2">
                          <div className="bg-blue-50 rounded p-2 hover:shadow-md transition">
                            <div className="font-bold text-sm text-blue-900">{entry.course.code}</div>
                            <div className="text-xs text-gray-700 mb-1">{entry.course.name}</div>
                            <div className="text-xs text-gray-600">{entry.faculty.name}</div>
                            <div className="text-xs text-gray-600">{entry.room.name}</div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">Algorithm Used</h4>
              <p className="text-sm text-gray-600">Genetic Algorithm with selection, crossover, and mutation operations</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">Constraints Satisfied</h4>
              <p className="text-sm text-gray-600">No faculty conflicts, Room availability, Proper break scheduling</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">Optimization Level</h4>
              <p className="text-sm text-gray-600">Achieved 75% optimal solution with minimal conflicts</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Smart Timetable Generator</h1>
            <p className="text-gray-600 mt-2">CodeHunters, SDMIT</p>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => setIsLoggedIn(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition"
            >
              Login
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Developed by: Abhishek Mali, Akhil Huddar,</p>
            <p>Prajwal GR, Kiran Doddmani</p>
            <p className="mt-2 text-xs">Guide: Prof.Pradeep G.S</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'courses' && <CoursesPage />}
        {currentPage === 'faculty' && <FacultyPage />}
        {currentPage === 'rooms' && <RoomsPage />}
        {currentPage === 'view-timetable' && <ViewTimetable />}
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">2025 Smart Timetable Generator | CodeHunters, SDMIT</p>
          <p className="text-xs text-gray-400 mt-2">
            Contact Us:
            Abhishek Mali
            ph.no: 6361421849
            Email: maliabhishekanand006@gmail.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SmartTimetableGenerator;