import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function StudentDashboard() {
  const [progressList, setProgressList] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [submittingAssignmentId, setSubmittingAssignmentId] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [progRes, assignRes, subRes] = await Promise.all([
        api.get('/progress'),
        api.get('/assignments'),
        api.get('/submissions/me')
      ]);
      setProgressList(progRes.data?.data || []);
      setAssignments(assignRes.data?.data || []);
      setSubmissions(subRes.data?.data || []);
    } catch (err) {
      setError('Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteProgress = async (id) => {
    if (window.confirm('Are you sure you want to unenroll from this course? This will delete your progress.')) {
      try {
        await api.delete(`/progress/${id}`);
        setProgressList(progressList.filter(p => p._id !== id));
      } catch (err) {
        console.error("Failed to unenroll", err);
        alert('Failed to unenroll from course');
      }
    }
  };

  const handleSubmission = async (e, assignmentId) => {
    e.preventDefault();
    if (!submissionFile) return alert('Please select a file to submit');
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('submission', submissionFile);
      await api.post(`/assignments/${assignmentId}/submissions`, formData);
      alert('Assignment submitted successfully!');
      setSubmittingAssignmentId(null);
      setSubmissionFile(null);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const enrolledCount = progressList.length;
  const completedCount = progressList.filter(p => p.overallProgress === 100).length;

  const enrolledCourseIds = progressList.map(p => p.course?._id).filter(Boolean);
  const myAssignments = assignments.filter(a => enrolledCourseIds.includes(a.course?._id));
  
  const pendingAssignments = myAssignments.filter(a => !submissions.some(s => s.assignment === a._id));
  const completedAssignments = myAssignments.filter(a => submissions.some(s => s.assignment === a._id));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Student Dashboard</h2>
          <p className="text-slate-500 mt-1">Track your progress and pick up where you left off.</p>
        </div>
        <Link to="/student/courses" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-colors">
          Browse More Courses
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-700">Enrolled Courses</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{enrolledCount}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-700">Completed Courses</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{completedCount}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-700">Pending Assignments</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{pendingAssignments.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800">Your Enrolled Courses</h3>
        </div>
        <div className="p-0">
          {progressList.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              You haven't enrolled in any courses yet.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {progressList.map(progress => (
                <li key={progress._id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900 mb-1">
                        {progress.course?.title || 'Unknown Course'}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>Last accessed: {new Date(progress.lastAccessed).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="w-48 mx-6">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">Progress</span>
                        <span className="text-slate-500">{progress.overallProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${progress.overallProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link 
                        to={`/student/courses/${progress.course?._id}`}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        Continue
                      </Link>
                      <button 
                        onClick={() => handleDeleteProgress(progress._id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Unenroll"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Your Assignments</h3>
        </div>
        <div className="p-0">
          {myAssignments.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No assignments available for your enrolled courses.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {myAssignments.map(assignment => {
                const submission = submissions.find(s => s.assignment === assignment._id);
                const isPending = !submission;

                return (
                  <li key={assignment._id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{assignment.title}</h4>
                        <p className="text-sm text-slate-500 mb-2">Course: {assignment.course?.title}</p>
                        <p className="text-sm text-slate-700">{assignment.description}</p>
                      </div>
                      <div>
                        {isPending ? (
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Pending</span>
                        ) : (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                            {submission.status === 'graded' ? `Graded: ${submission.marks} marks` : 'Submitted'}
                          </span>
                        )}
                      </div>
                    </div>

                    {isPending && (
                      <div className="mt-2 bg-slate-50 p-4 border border-slate-200 rounded-lg">
                        {submittingAssignmentId === assignment._id ? (
                          <form onSubmit={(e) => handleSubmission(e, assignment._id)} className="flex items-center gap-3">
                            <input 
                              type="file" 
                              required 
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => setSubmissionFile(e.target.files[0])}
                              className="text-sm border border-slate-300 rounded p-1"
                            />
                            <button 
                              type="submit" 
                              disabled={isSubmitting}
                              className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                            >
                              {isSubmitting ? 'Submitting...' : 'Upload Submission'}
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setSubmittingAssignmentId(null)}
                              className="px-4 py-1.5 bg-slate-200 text-slate-700 rounded text-sm hover:bg-slate-300"
                            >
                              Cancel
                            </button>
                          </form>
                        ) : (
                          <button 
                            onClick={() => setSubmittingAssignmentId(assignment._id)}
                            className="px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 text-sm"
                          >
                            Submit Assignment
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
