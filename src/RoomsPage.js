import React from 'react';
import { DoorOpen, Trash2 } from 'lucide-react';

const RoomsPage = ({ rooms, setRooms, newRoom, setNewRoom, addRoom, deleteRoom }) => {

  return (
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
};

export default RoomsPage;
