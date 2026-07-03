import React, { useEffect, useState } from 'react';
import { Users, DollarSign, BookOpen, TrendingUp, ClipboardList, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', course: '', dueDate: '', maxMarks: 100 });
  const [creatingAssignment, setCreatingAssignment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/courses');
        const myCourses = res.data?.data || [];
        setCourses(myCourses);
        
        const assignRes = await api.get('/assignments');
        const allAssignments = assignRes.data?.data || [];
        const myAssignments = allAssignments.filter(a => myCourses.some(c => c._id === (a.course?._id || a.course)));
        setAssignments(myAssignments);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${courseId}`);
        setCourses(courses.filter(c => c._id !== courseId));
      } catch (err) {
        console.error("Failed to delete course", err);
        alert('Failed to delete course');
      }
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await api.delete(`/assignments/${assignmentId}`);
        setAssignments(assignments.filter(a => a._id !== assignmentId));
      } catch (err) {
        console.error("Failed to delete assignment", err);
        alert('Failed to delete assignment');
      }
    }
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    if (!newAssignment.course) return alert('Please enter a course name');
    
    // Lookup course by title (case-insensitive)
    const matchingCourse = courses.find(c => c.title.toLowerCase() === newAssignment.course.toLowerCase());
    
    if (!matchingCourse) {
      return alert('Course not found. Please enter a valid course name you have created.');
    }
    
    const payload = {
      ...newAssignment,
      course: matchingCourse._id
    };

    try {
      setCreatingAssignment(true);
      if (editingAssignmentId) {
        const res = await api.put(`/assignments/${editingAssignmentId}`, payload);
        const updatedAssignWithCourse = { ...res.data.data, course: matchingCourse };
        setAssignments(assignments.map(a => a._id === editingAssignmentId ? updatedAssignWithCourse : a));
      } else {
        const res = await api.post(`/courses/${matchingCourse._id}/assignments`, payload);
        const newAssignWithCourse = { ...res.data.data, course: matchingCourse };
        setAssignments([...assignments, newAssignWithCourse]);
      }
      setIsAssignmentModalOpen(false);
      setEditingAssignmentId(null);
      setNewAssignment({ title: '', description: '', course: '', dueDate: '', maxMarks: 100 });
    } catch (err) {
      console.error("Failed to save assignment", err);
      alert('Failed to save assignment');
    } finally {
      setCreatingAssignment(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Instructor Dashboard</h2>
          <p className="text-slate-500 mt-1">Overview of your courses and student engagement.</p>
        </div>
        <Link to="/instructor/create" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
          Create New Course
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-700">Total Courses</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{courses.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-700">Assignments</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{assignments.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Your Active Courses</h3>
          <Link to="/instructor/create" className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-sm font-medium transition-colors">
            + Add Course
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-medium">Course Name</th>
                <th className="px-6 py-4 font-medium">Students</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-slate-500">Loading courses...</td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-slate-500">You haven't created any courses yet.</td>
                </tr>
              ) : (
                courses.map(course => (
                  <tr key={course._id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        {course.thumbnail !== 'no-photo.jpg' && (
                           <img src={`http://localhost:5001${course.thumbnail}`} alt={course.title} className="w-10 h-10 object-cover rounded" />
                        )}
                        {course.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">{course.enrolledStudents?.length || 0}</td>
                    <td className="px-6 py-4">{course.price > 0 ? `$${course.price}` : 'Free'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${course.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 items-center">
                        <Link to={`/instructor/courses/${course._id}/manage`} className="text-blue-600 hover:underline">Manage</Link>
                        <button onClick={() => handleDeleteCourse(course._id)} className="text-red-600 hover:text-red-800" title="Delete Course">
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
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Your Assignments</h3>
          <button onClick={() => {
            setEditingAssignmentId(null);
            setNewAssignment({ title: '', description: '', course: '', dueDate: '', maxMarks: 100 });
            setIsAssignmentModalOpen(true);
          }} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded text-sm font-medium transition-colors">
            + Add Assignment
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-medium">Assignment Title</th>
                <th className="px-6 py-4 font-medium">Course</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-slate-500">Loading assignments...</td>
                </tr>
              ) : assignments.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-slate-500">You haven't created any assignments yet.</td>
                </tr>
              ) : (
                assignments.map(assignment => (
                  <tr key={assignment._id} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{assignment.title}</td>
                    <td className="px-6 py-4">{assignment.course?.title || 'Unknown Course'}</td>
                    <td className="px-6 py-4">{assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 items-center">
                        <button onClick={() => {
                          setEditingAssignmentId(assignment._id);
                          setNewAssignment({
                            title: assignment.title,
                            description: assignment.description,
                            course: assignment.course?.title || '',
                            dueDate: assignment.dueDate ? assignment.dueDate.substring(0, 10) : '',
                            maxMarks: assignment.maxMarks || 100
                          });
                          setIsAssignmentModalOpen(true);
                        }} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                        <button onClick={() => handleDeleteAssignment(assignment._id)} className="text-red-600 hover:text-red-800" title="Delete Assignment">
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
      </div>

      {isAssignmentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => {
                setIsAssignmentModalOpen(false);
                setEditingAssignmentId(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{editingAssignmentId ? 'Edit Assignment' : 'Create Assignment'}</h2>
              <form onSubmit={handleSaveAssignment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assignment Title</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500" 
                    value={newAssignment.title} 
                    onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea 
                    required 
                    rows="3"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500" 
                    value={newAssignment.description} 
                    onChange={e => setNewAssignment({...newAssignment, description: e.target.value})}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Course Name</label>
                  <input 
                    type="text"
                    required 
                    placeholder="Enter course name"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                    value={newAssignment.course}
                    onChange={e => setNewAssignment({...newAssignment, course: e.target.value})}
                    list="course-options"
                  />
                  <datalist id="course-options">
                    {courses.map(c => (
                      <option key={c._id} value={c.title} />
                    ))}
                  </datalist>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                    <input 
                      type="date" 
                      required 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500" 
                      value={newAssignment.dueDate} 
                      onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Marks</label>
                    <input 
                      type="number" 
                      required 
                      min="1"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500" 
                      value={newAssignment.maxMarks} 
                      onChange={e => setNewAssignment({...newAssignment, maxMarks: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={creatingAssignment}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-all disabled:opacity-70 flex justify-center items-center"
                  >
                    {creatingAssignment ? 'Saving...' : (editingAssignmentId ? 'Save Changes' : 'Create Assignment')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorDashboard;
