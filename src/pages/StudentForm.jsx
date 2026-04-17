import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UploadCloud } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchStudentById, saveStudent, BASE_URL } from '../api/studentService';

const studentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  course: z.string().min(1, 'Course is required'),
  year: z.string().min(1, 'Year is required'),
  date_of_birth: z.string().min(1, 'Date of Birth is required'),
  email: z.string().email('Invalid email address'),
  mobile_number: z.string().min(10, 'Mobile number must be at least 10 digits'),
  gender: z.string().min(1, 'Gender is required'),
  address: z.string().min(1, 'Address is required'),
});

export default function StudentForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [studentRecord, setStudentRecord] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [globalError, setGlobalError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(studentSchema),
  });

  useEffect(() => {
    if (isEditing) {
      loadStudentData();
    }
  }, [id]);

  const loadStudentData = async () => {
    try {
      const response = await fetchStudentById(id);
      const data = response.data || response;
      setStudentRecord(data);

      const fields = ["name", "course", "year", "email", "gender", "address"];
      fields.forEach((field) => {
        setValue(field, data[field] ? String(data[field]) : "");
      });
      // specific mapping if backend naming changes slightly
      setValue('date_of_birth', data.date_of_birth ? data.date_of_birth.split("T")[0] : "");
      setValue('mobile_number', data.mobile_number || data.mobile || "");

      if (data.photo || data.photo_url) {
        setPhotoPreview(data.photo || data.photo_url);
      }
    } catch (error) {
      console.error('Failed to load student data:', error);
      setGlobalError("Failed to load student data.");
    }
  };

  const onSubmit = async (data) => {
    try {
      setGlobalError("");
      await saveStudent(data, photoFile, id);
      navigate("/students");
    } catch (error) {
      setGlobalError(error.message || "Failed to save student");
    }
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col w-full max-w-3xl mx-auto">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-lg font-bold">{isEditing ? 'Edit Admission Record' : 'New Admission Form'}</h2>
        <p className="text-sm text-gray-500">Fill in the personal and academic details correctly.</p>
      </div>

      {globalError && (
        <div className="mb-4 bg-red-50 text-red-600 border border-red-200 p-3 rounded text-sm font-medium">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {isEditing && studentRecord && (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">Admission Number</label>
            <input
              type="text"
              value={studentRecord.admission_number || ''}
              disabled
              className="w-full p-2.5 border border-gray-200 rounded bg-gray-100 font-bold text-gray-600"
            />
          </div>
        )}
        
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-600 font-medium">Full Name</label>
          <input
            {...register('name')}
            type="text"
            placeholder="e.g. John Doe"
            className="w-full p-2.5 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
          />
          {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">Course</label>
            <select
              {...register('course')}
              className="w-full p-2.5 border border-gray-200 rounded focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="">Select Course</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mechanical Eng.">Mechanical Eng.</option>
              <option value="Data Science">Data Science</option>
              <option value="Economics">Economics</option>
              <option value="Psychology">Psychology</option>
            </select>
            {errors.course && <span className="text-xs text-red-500">{errors.course.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">Year</label>
            <select
              {...register('year')}
              className="w-full p-2.5 border border-gray-200 rounded focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="">Select Year (1-6)</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
              <option value="5">5th Year</option>
              <option value="6">6th Year</option>
            </select>
            {errors.year && <span className="text-xs text-red-500">{errors.year.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">Gender</label>
            <select
              {...register('gender')}
              className="w-full p-2.5 border border-gray-200 rounded focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <span className="text-xs text-red-500">{errors.gender.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">Date of Birth</label>
            <input
              {...register('date_of_birth')}
              type="date"
              className="w-full p-2.5 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
            />
            {errors.date_of_birth && <span className="text-xs text-red-500">{errors.date_of_birth.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">Email Address</label>
            <input
              {...register('email')}
              type="email"
              placeholder="student@edu.in"
              className="w-full p-2.5 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600 font-medium">Mobile Number</label>
            <input
              {...register('mobile_number')}
              type="tel"
              placeholder="1234567890"
              className="w-full p-2.5 border border-gray-200 rounded focus:outline-none focus:border-blue-500"
            />
            {errors.mobile_number && <span className="text-xs text-red-500">{errors.mobile_number.message}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-600 font-medium">Address</label>
          <textarea
            {...register('address')}
            rows={3}
            placeholder="Full physical address"
            className="w-full p-2.5 border border-gray-200 rounded focus:outline-none focus:border-blue-500 resize-none"
          ></textarea>
          {errors.address && <span className="text-xs text-red-500">{errors.address.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-600 font-medium">Student Photo</label>
          <div className="relative border-2 border-dashed border-gray-300 p-6 text-center rounded-lg text-sm text-gray-500 mt-1 hover:bg-gray-50 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {photoPreview ? (
              <div className="flex flex-col items-center gap-3">
                <img 
                  src={photoPreview.startsWith('blob:') || photoPreview.startsWith('http') ? photoPreview : `${BASE_URL}${photoPreview}`} 
                  alt="Preview" 
                  className="w-24 h-24 object-cover rounded shadow-md border border-gray-200" 
                />
                <span className="text-blue-600 font-medium hover:underline">Change photo</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <UploadCloud className="w-8 h-8 text-gray-400" />
                <span>Drag & drop an image or <span className="text-blue-600 font-medium">browse</span></span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => navigate("/students")}
            className="px-6 py-2.5 rounded bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2.5 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center min-w-[150px]"
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Profile' : 'Register Student'}
          </button>
        </div>
      </form>
    </div>
  );
}
