import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, PlayCircle, FileText, CheckCircle, Circle } from 'lucide-react';
import api from '../services/api';

function StudentCourseLearn() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingComplete, setMarkingComplete] = useState(false);

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      } else if (url.includes('watch?v=')) {
        videoId = url.split('watch?v=')[1].split('&')[0];
      } else if (url.includes('embed/')) {
        return url;
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    return url;
  };

  const isYouTube = (url) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        const [courseRes, progressRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get('/progress')
        ]);
        
        const courseData = courseRes.data.data;
        setCourse(courseData);
        
        // Find progress for this specific course
        const currentProgress = progressRes.data.data.find(p => p.course._id === id || p.course === id);
        setProgress(currentProgress);
        
        // Set first lesson as active by default if modules exist
        if (courseData.modules && courseData.modules.length > 0) {
          // Find first uncompleted lesson if progress exists, otherwise just first lesson
          let foundLesson = null;
          
          if (currentProgress && currentProgress.completedLessons.length > 0) {
            for (const module of courseData.modules) {
              if (!module.lessons) continue;
              for (const lesson of module.lessons) {
                if (!currentProgress.completedLessons.includes(lesson._id)) {
                  foundLesson = lesson;
                  break;
                }
              }
              if (foundLesson) break;
            }
          }
          
          // If no uncompleted lesson found (or no progress), just default to very first lesson
          if (!foundLesson && courseData.modules[0].lessons && courseData.modules[0].lessons.length > 0) {
            foundLesson = courseData.modules[0].lessons[0];
          }
          
          setActiveLesson(foundLesson);
        }
      } catch (err) {
        setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseAndProgress();
  }, [id]);

  const handleMarkComplete = async () => {
    if (!activeLesson || !progress) return;
    
    try {
      setMarkingComplete(true);
      const res = await api.post('/progress', { 
        courseId: id,
        lessonId: activeLesson._id
      });
      
      // Update local state to reflect completion with calculated progress from backend
      setProgress(res.data.data);
      
      // Auto-advance to next lesson if available
      advanceToNextLesson();
    } catch (err) {
      alert('Failed to mark lesson as complete.');
    } finally {
      setMarkingComplete(false);
    }
  };
  
  const advanceToNextLesson = () => {
    if (!course || !course.modules || !activeLesson) return;
    
    let foundCurrent = false;
    for (const module of course.modules) {
      if (!module.lessons) continue;
      for (const lesson of module.lessons) {
        if (foundCurrent) {
          setActiveLesson(lesson);
          return;
        }
        if (lesson._id === activeLesson._id) {
          foundCurrent = true;
        }
      }
    }
  };

  const isLessonCompleted = (lessonId) => {
    return progress && progress.completedLessons && progress.completedLessons.includes(lessonId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{error || 'Course not found.'}</h2>
        <button onClick={() => navigate('/student/courses')} className="px-4 py-2 bg-blue-600 rounded">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-950 overflow-hidden text-slate-300 font-sans">
      
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <header className="h-16 flex items-center px-4 bg-slate-900 border-b border-slate-800 shrink-0">
          <Link to={`/student/courses/${id}`} className="flex items-center text-slate-400 hover:text-white transition-colors mr-4">
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline ml-1">Back</span>
          </Link>
          <h1 className="text-lg font-bold text-white truncate">{course.title}</h1>
        </header>
        
        {/* Player Container */}
        <div className="flex-1 bg-black flex flex-col items-center justify-center p-4">
          {activeLesson ? (
            <div className="w-full max-w-5xl aspect-video bg-slate-900 rounded-lg overflow-hidden shadow-2xl border border-slate-800">
              {isYouTube(activeLesson.videoUrl) ? (
                <iframe 
                  key={activeLesson.videoUrl}
                  className="w-full h-full"
                  src={getEmbedUrl(activeLesson.videoUrl)} 
                  title={activeLesson.title}
                  allowFullScreen
                ></iframe>
              ) : activeLesson.videoUrl ? (
                <video 
                  key={activeLesson.videoUrl}
                  className="w-full h-full object-contain"
                  controls
                  src={activeLesson.videoUrl.startsWith('http') ? activeLesson.videoUrl : `http://localhost:5001${activeLesson.videoUrl}`}
                >
                  Your browser does not support the video tag.
                </video>
              ) : activeLesson.notesPdf ? (
                <iframe 
                  key={activeLesson.notesPdf}
                  className="w-full h-full bg-white"
                  src={`http://localhost:5001${activeLesson.notesPdf}`}
                  title={activeLesson.title}
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  <FileText className="w-16 h-16 mr-4" />
                  <span className="text-xl">No document uploaded</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-500 text-center">
              <p className="text-xl font-medium">Select a lesson from the curriculum</p>
            </div>
          )}
        </div>
        
        {/* Lesson Info Footer */}
        {activeLesson && (
          <div className="bg-slate-900 p-6 shrink-0 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl font-bold text-white mb-2">{activeLesson.title}</h2>
              <p className="text-slate-400 text-sm">
                {activeLesson.type === 'Video' ? `Video • ${activeLesson.duration || 0} mins` : 'Document Lesson'}
              </p>
            </div>
            
            {!isLessonCompleted(activeLesson._id) ? (
              <button 
                onClick={handleMarkComplete}
                disabled={markingComplete}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors flex items-center disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {markingComplete ? 'Marking...' : 'Mark as Complete'}
              </button>
            ) : (
              <button 
                onClick={advanceToNextLesson}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors flex items-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Completed - Next
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Sidebar Curriculum */}
      <div className="w-full md:w-80 lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-1/2 md:h-full shrink-0">
        <div className="p-5 border-b border-slate-800 shrink-0">
          <h3 className="text-lg font-bold text-white">Course Content</h3>
          {progress && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Your Progress</span>
                <span className="text-slate-300 font-medium">{progress.overallProgress || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${progress.overallProgress || 0}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {(!course.modules || course.modules.length === 0) ? (
            <div className="p-5 text-slate-500 text-sm text-center">No modules added yet.</div>
          ) : (
            <div className="divide-y divide-slate-800">
              {course.modules.map((module, mIndex) => (
                <div key={module._id || mIndex} className="bg-slate-900">
                  <div className="px-5 py-4 bg-slate-800/50">
                    <h4 className="text-sm font-bold text-slate-200">
                      Section {mIndex + 1}: {module.title}
                    </h4>
                  </div>
                  
                  <div>
                    {(!module.lessons || module.lessons.length === 0) ? (
                      <div className="px-5 py-3 text-xs text-slate-500">No lessons.</div>
                    ) : (
                      <ul className="flex flex-col">
                        {module.lessons.map((lesson, lIndex) => {
                          const isActive = activeLesson && activeLesson._id === lesson._id;
                          const isCompleted = isLessonCompleted(lesson._id);
                          
                          return (
                            <li key={lesson._id || lIndex}>
                              <button
                                onClick={() => setActiveLesson(lesson)}
                                className={`w-full text-left px-5 py-3 flex items-start transition-colors border-l-2 ${
                                  isActive ? 'bg-slate-800 border-blue-500' : 'hover:bg-slate-800/50 border-transparent'
                                }`}
                              >
                                <div className="mt-0.5 mr-3 shrink-0">
                                  {isCompleted ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                  ) : isActive ? (
                                    <PlayCircle className="w-4 h-4 text-blue-500" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm ${isActive ? 'text-white font-medium' : isCompleted ? 'text-slate-400' : 'text-slate-300'}`}>
                                    {lIndex + 1}. {lesson.title}
                                  </p>
                                  <div className="flex items-center mt-1 text-xs text-slate-500 gap-2">
                                    {lesson.type === 'Video' ? <PlayCircle className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                    <span>{lesson.duration || 0} min</span>
                                  </div>
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}

export default StudentCourseLearn;
