import React, { useState } from 'react';
import Login from './Login';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import CoursesPage from './CoursesPage';
import FacultyPage from './FacultyPage';
import RoomsPage from './RoomsPage';
import ViewTimetable from './ViewTimetable';

const SmartTimetableGenerator = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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



  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} setIsLoggedIn={setIsLoggedIn} showMenu={showMenu} setShowMenu={setShowMenu} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'dashboard' && <Dashboard courses={courses} faculty={faculty} rooms={rooms} generateTimetable={generateTimetable} isGenerating={isGenerating} setCurrentPage={setCurrentPage} />}
        {currentPage === 'courses' && <CoursesPage courses={courses} setCourses={setCourses} newCourse={newCourse} setNewCourse={setNewCourse} addCourse={addCourse} deleteCourse={deleteCourse} />}
        {currentPage === 'faculty' && <FacultyPage faculty={faculty} setFaculty={setFaculty} newFaculty={newFaculty} setNewFaculty={setNewFaculty} addFaculty={addFaculty} deleteFaculty={deleteFaculty} />}
        {currentPage === 'rooms' && <RoomsPage rooms={rooms} setRooms={setRooms} newRoom={newRoom} setNewRoom={setNewRoom} addRoom={addRoom} deleteRoom={deleteRoom} />}
        {currentPage === 'view-timetable' && <ViewTimetable generatedTimetable={generatedTimetable} exportTimetable={exportTimetable} />}
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