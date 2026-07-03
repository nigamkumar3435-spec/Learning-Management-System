import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Upload, X } from 'lucide-react';
import api from '../services/api';

function InstructorCourseCreate() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const thumbnailFile = watch('thumbnail');
  const thumbnailPreview = thumbnailFile && thumbnailFile.length > 0 ? URL.createObjectURL(thumbnailFile[0]) : null;

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('difficulty', data.difficulty);
      formData.append('price', data.price || 0);
      
      if (data.thumbnail[0]) {
        formData.append('thumbnail', data.thumbnail[0]);
      }

      await api.post('/courses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/instructor');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create course');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Create a New Course</h2>
        <p className="text-slate-500 mt-1">Fill in the details below to publish a new course to the platform.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">Course Title</label>
          <input
            id="title"
            {...register('title', { required: 'Course title is required' })}
            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g. Advanced Distributed Systems"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">Course Description</label>
          <textarea
            id="description"
            rows={4}
            {...register('description', { required: 'Description is required' })}
            className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="What will students learn in this course?"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
            <select
              id="category"
              {...register('category', { required: 'Category is required' })}
              className="mt-1 block w-full bg-white border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              <option value="Web Development">Web Development</option>
              <option value="Backend Engineering">Backend Engineering</option>
              <option value="System Design">System Design</option>
              <option value="DevOps">DevOps</option>
              <option value="Programming Languages">Programming Languages</option>
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700">Difficulty Level</label>
            <select
              id="difficulty"
              {...register('difficulty')}
              className="mt-1 block w-full bg-white border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (USD)</label>
          <div className="mt-1 relative rounded-md shadow-sm w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price"
              {...register('price', { min: 0 })}
              className="mt-1 block w-full pl-7 border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Course Thumbnail</label>
          {thumbnailPreview ? (
            <div className="relative w-full md:w-1/2 aspect-video rounded-lg overflow-hidden border border-slate-200">
              <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-600 justify-center">
                  <label htmlFor="thumbnail" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input id="thumbnail" type="file" className="sr-only" {...register('thumbnail')} accept="image/*" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 10MB</p>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 mt-6">
          <button
            type="button"
            onClick={() => navigate('/instructor')}
            className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50 flex items-center"
          >
            {isSubmitting ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InstructorCourseCreate;
