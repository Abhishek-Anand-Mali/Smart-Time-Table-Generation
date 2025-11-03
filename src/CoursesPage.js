import React from 'react';
import { BookOpen, Trash2 } from 'lucide-react';

const CoursesPage = ({ courses, setCourses, newCourse, setNewCourse, addCourse, deleteCourse }) => {

  return (
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
};

export default CoursesPage;
