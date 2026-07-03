import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function StudentBrowseCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        setCourses(response.data.data);
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Browse Courses</h1>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">No courses available yet</h3>
          <p className="text-gray-500 mt-2">Instructors haven't published any courses. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course._id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center">
                  <span className="text-blue-300 text-4xl font-bold">LMS</span>
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                    {course.category || 'General'}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate" title={course.title}>
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                  {course.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span className="truncate">{course.instructor?.name || 'Unknown Instructor'}</span>
                </div>
                <Link
                  to={`/student/courses/${course._id}`}
                  className="block w-full text-center py-2 px-4 bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-700 font-medium rounded-lg transition-colors duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentBrowseCourses;
