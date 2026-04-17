import React, { useEffect, useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { fetchStudents, deleteStudent, BASE_URL } from '../api/studentService';

export default function StudentList() {
  const { searchQuery } = useOutletContext();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await fetchStudents();
      // Adjust structure in case it's nested (e.g. { data: [...] } or direct array)
      const list = Array.isArray(data) ? data : (data.data || []);
      setStudents(list);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await deleteStudent(id);
      loadStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    }
  };

  // Safe search on nested attributes matching DB structure
  const filteredStudents = students.filter(
    (s) =>
      (s.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      (s.admission_number || '').toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden h-full min-h-[500px]">
      <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-white shrink-0">
        <h2 className="text-base font-bold text-gray-800">Enrolled Students</h2>
        <span className="text-[13px] font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Total: {filteredStudents.length} entries
        </span>
      </div>
      
      <div className="overflow-auto flex-1">
        <table className="w-full border-collapse text-sm min-w-[750px]">
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold border-b border-gray-200 whitespace-nowrap bg-gray-50">ADM #</th>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold border-b border-gray-200 bg-gray-50">Student Profile</th>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold border-b border-gray-200 bg-gray-50">Program details</th>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold border-b border-gray-200 bg-gray-50">Contact Info</th>
              <th className="text-left px-5 py-3 text-gray-600 font-semibold border-b border-gray-200 bg-gray-50">Manage</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-gray-500">Loading student records...</td>
              </tr>
            ) : paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12 text-gray-500">No students found matching your criteria.</td>
              </tr>
            ) : (
              paginatedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-5 py-4 border-b border-gray-100 align-middle font-medium text-gray-700 whitespace-nowrap">
                    {student.admission_number}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-100 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden shrink-0 ring-2 ring-gray-100 group-hover:ring-blue-100 transition-all">
                        {student.photo || student.photo_url ? (
                          <img 
                            src={(student.photo || student.photo_url).startsWith('http') ? (student.photo || student.photo_url) : `${BASE_URL}${student.photo || student.photo_url}`} 
                            alt={student.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-bold bg-blue-50">
                            {(student.name || '?').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{student.name}</span>
                        <span className="text-[11px] text-gray-500">{student.gender || 'Not specified'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-100 align-middle">
                    <div className="flex flex-col items-start gap-1">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">
                        {student.course}
                      </span>
                      <span className="text-[12px] text-gray-500 font-medium ml-1">Year {student.year}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-100 align-middle text-[13px] text-gray-600">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{student.email}</span>
                      <span className="text-gray-500">{student.mobile_number || student.mobile}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 border-b border-gray-100 align-middle">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/students/edit/${student.id}`)}
                        className="p-2 rounded-md border border-gray-200 bg-white text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"
                        title="Edit Record"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="p-2 rounded-md border border-gray-200 bg-white text-red-500 hover:text-red-700 hover:border-red-200 hover:bg-red-50 transition-colors shadow-sm"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="px-5 py-3.5 flex justify-between items-center text-sm font-medium text-gray-600 border-t border-gray-200 bg-gray-50/50 shrink-0">
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-md border border-gray-300 bg-white shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-blue-600 transition-colors"
        >
          Previous
        </button>
        <div className="flex gap-1.5 items-center">
          <span className="text-gray-500">Page</span>
          <span className="px-2 py-0.5 rounded bg-white border border-gray-200 font-bold min-w-[32px] text-center">{currentPage}</span>
          <span className="text-gray-500">of {totalPages}</span>
        </div>
        <button 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-4 py-2 rounded-md border border-gray-300 bg-white shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:text-blue-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
