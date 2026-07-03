import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ChevronLeft, Plus, Video, FileText, Upload, Trash2 } from 'lucide-react';
import api from '../services/api';

function InstructorCourseManage() {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for forms
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [activeModuleForLesson, setActiveModuleForLesson] = useState(null);
  
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [editModuleTitle, setEditModuleTitle] = useState('');
  
  const [editingLessonId, setEditingLessonId] = useState(null);
  
  const { register: regModule, handleSubmit: handleModuleSubmit, reset: resetModule } = useForm();
  const { register: regLesson, handleSubmit: handleLessonSubmit, reset: resetLesson, watch: watchLesson, setValue: setLessonValue } = useForm({
    defaultValues: { type: 'Video' }
  });
  
  const { register: regEditLesson, handleSubmit: handleEditLessonSubmit, reset: resetEditLesson, watch: watchEditLesson } = useForm();
  const editLessonType = watchEditLesson('type');
  const editVideoFile = watchEditLesson('videoFile');
  const editPdfFile = watchEditLesson('pdfFile');
  const editVideoPreview = editVideoFile && editVideoFile.length > 0 ? editVideoFile[0].name : null;
  const editPdfPreview = editPdfFile && editPdfFile.length > 0 ? editPdfFile[0].name : null;
  
  // State for Edit Course
  const [showEditForm, setShowEditForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { register: regCourse, handleSubmit: handleCourseSubmit, reset: resetCourse, watch: watchCourse } = useForm();
  const courseThumbnailFile = watchCourse('thumbnail');
  let courseThumbnailPreview = null;
  if (courseThumbnailFile && courseThumbnailFile.length > 0 && courseThumbnailFile[0] instanceof File) {
    courseThumbnailPreview = URL.createObjectURL(courseThumbnailFile[0]);
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const lessonType = watchLesson('type');
  const videoFile = watchLesson('videoFile');
  const pdfFile = watchLesson('pdfFile');
  
  const videoPreview = videoFile && videoFile.length > 0 ? videoFile[0].name : null;
  const pdfPreview = pdfFile && pdfFile.length > 0 ? pdfFile[0].name : null;

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${courseId}`);
      setCourse(res.data.data);
      resetCourse(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const onAddModule = async (data) => {
    try {
      setIsSubmitting(true);
      await api.post(`/courses/${courseId}/modules`, {
        title: data.title,
        orderIndex: course.modules ? course.modules.length : 0
      });
      resetModule();
      setShowModuleForm(false);
      fetchCourse();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add module');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdateModule = async (moduleId) => {
    try {
      setIsSubmitting(true);
      await api.put(`/modules/${moduleId}`, { title: editModuleTitle });
      setEditingModuleId(null);
      fetchCourse();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update module');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdateLesson = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('type', data.type);
      formData.append('duration', data.duration || 0);
      
      if (data.type === 'Video' && data.videoFile && data.videoFile[0]) {
        formData.append('video', data.videoFile[0]);
      } else if (data.type === 'Document' && data.pdfFile && data.pdfFile[0]) {
        formData.append('pdf', data.pdfFile[0]);
      }

      if (data.type === 'Video' && data.videoUrl) {
        formData.append('videoUrl', data.videoUrl);
      }

      await api.put(`/lessons/${editingLessonId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setEditingLessonId(null);
      fetchCourse();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update lesson');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdateCourse = async (data) => {
    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('difficulty', data.difficulty);
      formData.append('price', data.price || 0);
      formData.append('status', data.status);
      
      if (data.thumbnail && data.thumbnail.length > 0 && data.thumbnail[0] instanceof File) {
        formData.append('thumbnail', data.thumbnail[0]);
      }

      await api.put(`/courses/${courseId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Course updated successfully!');
      setShowEditForm(false);
      fetchCourse();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update course');
    } finally {
      setIsUpdating(false);
    }
  };

  const onAddLesson = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('type', data.type);
      formData.append('duration', data.duration || 0);
      
      // If it's a direct upload
      if (data.type === 'Video' && data.videoFile && data.videoFile[0]) {
        formData.append('video', data.videoFile[0]);
      } else if (data.type === 'Document' && data.pdfFile && data.pdfFile[0]) {
        formData.append('pdf', data.pdfFile[0]);
      }

      // Or if it's a URL (like YouTube)
      if (data.type === 'Video' && data.videoUrl) {
        formData.append('videoUrl', data.videoUrl);
      }

      await api.post(`/courses/${courseId}/modules/${activeModuleForLesson}/lessons`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      resetLesson();
      setActiveModuleForLesson(null);
      fetchCourse();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add lesson');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading course management...</div>;
  }

  if (!course) {
    return <div className="text-center text-red-600 py-12">Course not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link to="/instructor" className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Manage Course: {course.title}</h2>
          <p className="text-slate-500 mt-1">Build your curriculum by adding modules and video lessons.</p>
        </div>
      </div>

      {/* Edit Course Settings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Course Settings</h3>
          <button 
            onClick={() => setShowEditForm(!showEditForm)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {showEditForm ? 'Cancel Edit' : 'Edit Course'}
          </button>
        </div>
        
        {showEditForm && (
          <div className="p-6">
            <form onSubmit={handleCourseSubmit(onUpdateCourse)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">Course Title</label>
                <input
                  {...regCourse('title', { required: true })}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  rows={4}
                  {...regCourse('description', { required: true })}
                  className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Category</label>
                  <select
                    {...regCourse('category', { required: true })}
                    className="mt-1 block w-full bg-white border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Backend Engineering">Backend Engineering</option>
                    <option value="System Design">System Design</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Programming Languages">Programming Languages</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">Status</label>
                  <select
                    {...regCourse('status')}
                    className="mt-1 block w-full bg-white border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Difficulty</label>
                  <select
                    {...regCourse('difficulty')}
                    className="mt-1 block w-full bg-white border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">Price (USD)</label>
                  <input
                    type="number"
                    {...regCourse('price', { min: 0 })}
                    className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Update Thumbnail (Optional)</label>
                {courseThumbnailPreview ? (
                  <img src={courseThumbnailPreview} alt="Preview" className="w-1/2 rounded border mb-2" />
                ) : (
                  course.thumbnail !== 'no-photo.jpg' && <img src={`http://localhost:5001${course.thumbnail}`} alt="Current" className="w-1/4 rounded border mb-2" />
                )}
                <input type="file" {...regCourse('thumbnail')} accept="image/*" className="text-sm" />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Curriculum Builder */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Course Curriculum</h3>
          <button 
            onClick={() => setShowModuleForm(!showModuleForm)}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg"
          >
            <Plus className="w-4 h-4" /> Add Section
          </button>
        </div>

        {/* Add Module Form */}
        {showModuleForm && (
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <form onSubmit={handleModuleSubmit(onAddModule)} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Section Title</label>
                <input 
                  {...regModule('title', { required: true })}
                  className="w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g. Introduction to React"
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-slate-800 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-slate-700 disabled:opacity-50"
              >
                Save Section
              </button>
            </form>
          </div>
        )}

        {/* Modules List */}
        <div className="p-6 space-y-6">
          {(!course.modules || course.modules.length === 0) ? (
            <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
              No sections added yet. Click "Add Section" to start building your course.
            </div>
          ) : (
            course.modules.map((module, mIdx) => (
              <div key={module._id} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-4 py-3 flex justify-between items-center border-b border-slate-200">
                  {editingModuleId === module._id ? (
                    <div className="flex items-center gap-2 flex-1 mr-4">
                      <input 
                        type="text" 
                        value={editModuleTitle} 
                        onChange={(e) => setEditModuleTitle(e.target.value)}
                        className="flex-1 border border-slate-300 rounded shadow-sm py-1 px-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                      <button 
                        onClick={() => onUpdateModule(module._id)}
                        disabled={isSubmitting}
                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setEditingModuleId(null)}
                        className="text-xs bg-slate-200 text-slate-700 px-3 py-1.5 rounded hover:bg-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-slate-800">Section {mIdx + 1}: {module.title}</h4>
                      <button
                        onClick={() => {
                          setEditingModuleId(module._id);
                          setEditModuleTitle(module.title);
                        }}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Edit Title
                      </button>
                    </div>
                  )}
                  <button 
                    onClick={() => setActiveModuleForLesson(activeModuleForLesson === module._id ? null : module._id)}
                    className="text-xs font-medium text-slate-600 bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-50"
                  >
                    + Add Lesson
                  </button>
                </div>

                {/* Add Lesson Form */}
                {activeModuleForLesson === module._id && (
                  <div className="p-4 bg-blue-50/50 border-b border-slate-200">
                    <form onSubmit={handleLessonSubmit(onAddLesson)} className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-slate-700 mb-1">Lesson Title</label>
                          <input 
                            {...regLesson('title', { required: true })}
                            className="w-full border border-slate-300 rounded shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:border-blue-500"
                            placeholder="e.g. Component Lifecycle"
                          />
                        </div>
                        <div className="w-32">
                          <label className="block text-xs font-medium text-slate-700 mb-1">Duration (mins)</label>
                          <input 
                            type="number"
                            {...regLesson('duration')}
                            className="w-full border border-slate-300 rounded shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:border-blue-500"
                            placeholder="0"
                          />
                        </div>
                        <div className="w-32">
                          <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                          <select 
                            {...regLesson('type')}
                            className="w-full border border-slate-300 rounded shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:border-blue-500"
                          >
                            <option value="Video">Video</option>
                            <option value="Document">Document</option>
                          </select>
                        </div>
                      </div>

                      {lessonType === 'Video' ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Upload Video File (.mp4)</label>
                            <div className="flex items-center gap-3">
                              <label className="cursor-pointer bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded text-sm hover:bg-slate-50">
                                Choose File
                                <input type="file" className="hidden" {...regLesson('videoFile')} accept="video/*" />
                              </label>
                              <span className="text-xs text-slate-500">{videoPreview || 'No file chosen'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">OR</span>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">YouTube URL</label>
                            <input 
                              {...regLesson('videoUrl')}
                              className="w-full border border-slate-300 rounded shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:border-blue-500"
                              placeholder="https://youtube.com/watch?v=..."
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Upload PDF Document</label>
                          <div className="flex items-center gap-3">
                            <label className="cursor-pointer bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded text-sm hover:bg-slate-50">
                              Choose PDF
                              <input type="file" className="hidden" {...regLesson('pdfFile')} accept=".pdf" />
                            </label>
                            <span className="text-xs text-slate-500">{pdfPreview || 'No file chosen'}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        <button 
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-blue-600 text-white px-4 py-1.5 rounded font-medium text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isSubmitting ? 'Saving...' : 'Save Lesson'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Lessons List */}
                <div className="bg-white">
                  {(!module.lessons || module.lessons.length === 0) ? (
                    <div className="px-4 py-3 text-sm text-slate-500 italic">No lessons in this section.</div>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {module.lessons.map((lesson, lIdx) => (
                        <li key={lesson._id} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50">
                          <div className="w-full">
                            {editingLessonId === lesson._id ? (
                              <div className="p-4 bg-blue-50/50 rounded-lg">
                                <form onSubmit={handleEditLessonSubmit(onUpdateLesson)} className="space-y-4">
                                  <div className="flex gap-4">
                                    <div className="flex-1">
                                      <label className="block text-xs font-medium text-slate-700 mb-1">Lesson Title</label>
                                      <input 
                                        {...regEditLesson('title', { required: true })}
                                        className="w-full border border-slate-300 rounded shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:border-blue-500"
                                      />
                                    </div>
                                    <div className="w-32">
                                      <label className="block text-xs font-medium text-slate-700 mb-1">Duration (mins)</label>
                                      <input 
                                        type="number"
                                        {...regEditLesson('duration')}
                                        className="w-full border border-slate-300 rounded shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:border-blue-500"
                                      />
                                    </div>
                                    <div className="w-32">
                                      <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                                      <select 
                                        {...regEditLesson('type')}
                                        className="w-full border border-slate-300 rounded shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:border-blue-500"
                                      >
                                        <option value="Video">Video</option>
                                        <option value="Document">Document</option>
                                      </select>
                                    </div>
                                  </div>

                                  {editLessonType === 'Video' ? (
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Upload New Video (.mp4)</label>
                                        <div className="flex items-center gap-3">
                                          <label className="cursor-pointer bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded text-sm hover:bg-slate-50">
                                            Choose File
                                            <input type="file" className="hidden" {...regEditLesson('videoFile')} accept="video/*" />
                                          </label>
                                          <span className="text-xs text-slate-500">{editVideoPreview || 'No file chosen (leave empty to keep current)'}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400">OR</span>
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">YouTube URL</label>
                                        <input 
                                          {...regEditLesson('videoUrl')}
                                          className="w-full border border-slate-300 rounded shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:border-blue-500"
                                          placeholder="https://youtube.com/watch?v=..."
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <label className="block text-xs font-medium text-slate-700 mb-1">Upload New PDF</label>
                                      <div className="flex items-center gap-3">
                                        <label className="cursor-pointer bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded text-sm hover:bg-slate-50">
                                          Choose PDF
                                          <input type="file" className="hidden" {...regEditLesson('pdfFile')} accept=".pdf" />
                                        </label>
                                        <span className="text-xs text-slate-500">{editPdfPreview || 'No file chosen (leave empty to keep current)'}</span>
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex justify-end pt-2 gap-2">
                                    <button 
                                      type="button"
                                      onClick={() => setEditingLessonId(null)}
                                      className="bg-slate-200 text-slate-700 px-4 py-1.5 rounded font-medium text-sm hover:bg-slate-300"
                                    >
                                      Cancel
                                    </button>
                                    <button 
                                      type="submit"
                                      disabled={isSubmitting}
                                      className="bg-blue-600 text-white px-4 py-1.5 rounded font-medium text-sm hover:bg-blue-700 disabled:opacity-50"
                                    >
                                      {isSubmitting ? 'Saving...' : 'Save Lesson'}
                                    </button>
                                  </div>
                                </form>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                {lesson.type === 'Video' ? (
                                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                    <Video className="w-4 h-4" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                    <FileText className="w-4 h-4" />
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-medium text-slate-800">
                                    {lIdx + 1}. {lesson.title}
                                    <button
                                      onClick={() => {
                                        setEditingLessonId(lesson._id);
                                        resetEditLesson(lesson);
                                      }}
                                      className="ml-2 text-xs text-blue-600 hover:underline inline-block"
                                    >
                                      Edit Content
                                    </button>
                                  </p>
                                  <p className="text-xs text-slate-500">{lesson.type} • {lesson.duration || 0} mins</p>
                                </div>
                              </div>
                            )}
                          </div>
                          <div>
                            {/* Actions like Edit/Delete could go here */}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default InstructorCourseManage;
