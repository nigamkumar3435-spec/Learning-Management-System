import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, PlayCircle, FileText, CheckCircle, X } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import api from '../services/api';

function StudentCourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, progressRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get('/progress')
        ]);
        setCourse(courseRes.data.data);
        
        // Check if student is enrolled in this course
        const enrolled = progressRes.data.data.some(p => p.course._id === id || p.course === id);
        setIsEnrolled(enrolled);
      } catch (err) {
        setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error || 'Course not found.'}
      </div>
    );
  }

  const handleEnroll = () => {
    if (course.price > 0) {
      setShowPaymentModal(true);
    } else {
      executeEnroll();
    }
  };

  const executeEnroll = async () => {
    try {
      setEnrolling(true);
      await api.post('/progress', { courseId: id });
      setIsEnrolled(true);
      setShowPaymentModal(false);
    } catch (err) {
      alert('Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
      setVerifyingPayment(false);
    }
  };

  const handlePaymentConfirm = () => {
    setVerifyingPayment(true);
    setTimeout(() => {
      executeEnroll();
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link to="/student/courses" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Courses
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-64 md:h-96 object-cover" />
        ) : (
          <div className="w-full h-64 md:h-96 bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
            <span className="text-blue-300 text-5xl font-bold">LMS Course</span>
          </div>
        )}
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full">
                  {course.category || 'General'}
                </span>
                <span className="text-gray-500 font-medium">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </span>
              </div>
              
              <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {course.description}
              </p>
              
              <div className="flex items-center text-gray-600">
                <div className="flex items-center mr-6">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 mr-3">
                    {course.instructor?.name ? course.instructor.name[0] : 'I'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{course.instructor?.name || 'Instructor'}</p>
                    <p className="text-xs text-gray-500">Course Creator</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-72 flex-shrink-0 bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {isEnrolled ? 'You are enrolled' : 'Ready to learn?'}
              </h3>
              {isEnrolled ? (
                <Link to={`/student/courses/${id}/learn`} className="block text-center w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  Continue Course
                </Link>
              ) : (
                <button 
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
              <p className="text-xs text-center text-gray-500 mt-4">
                Full lifetime access • 30-Day Money-Back Guarantee
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
        
        {(!course.modules || course.modules.length === 0) ? (
          <p className="text-gray-500 italic">No modules have been added to this course yet.</p>
        ) : (
          <div className="space-y-4">
            {course.modules.map((module, index) => (
              <div key={module._id || index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 p-4 font-semibold text-gray-900 flex justify-between items-center border-b border-gray-200">
                  <span>Module {index + 1}: {module.title}</span>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                  <div className="flex items-center text-sm text-gray-700">
                    <PlayCircle className="w-4 h-4 text-blue-500 mr-2" />
                    <span>Video Lesson</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <FileText className="w-4 h-4 text-blue-500 mr-2" />
                    <span>Reading Material</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              disabled={verifyingPayment}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Complete Payment</h2>
              <p className="text-slate-500 mb-6">Scan the QR code to pay ${course.price}</p>
              
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 inline-block">
                  <QRCodeCanvas 
                    value={`upi://pay?pa=mock@skillforge&pn=SkillForge&am=${course.price}&cu=USD`} 
                    size={200}
                    level="H"
                  />
                </div>
              </div>
              
              <p className="text-sm font-medium text-slate-700 mb-8">
                Or pay using UPI ID: <span className="text-blue-600">mock@skillforge</span>
              </p>
              
              <button
                onClick={handlePaymentConfirm}
                disabled={verifyingPayment}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-70 flex justify-center items-center"
              >
                {verifyingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Verifying Payment...
                  </>
                ) : (
                  'I have completed the payment'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentCourseDetails;
