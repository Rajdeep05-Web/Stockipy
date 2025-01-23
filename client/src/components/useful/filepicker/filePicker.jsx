import React, { useCallback, useState } from 'react';
import { Upload, X, FileType } from 'lucide-react';
import {useDispatch} from 'react-redux';

export function FilePicker({ accept = 'both', maxSize = 5, setFile }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileURL, setFileURL] = useState(null);

  const acceptedTypes = {
    pdf: ['application/pdf'],
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    both: ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  }[accept];

  const validateFile = (file) => {
    setError('');
    if (!acceptedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a PDF or image file.');
      return false;
    }
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }
    return true;
  };

  const handleFile = (file) => {
    if (!validateFile(file)) return;
    setFileName(file.name);
    setFileURL(URL.createObjectURL(file)); // Create a URL for the file

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result);
      reader.readAsDataURL(file);
    } else {
      setPreview('');
    }
      setFile(file);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setPreview('');
    setFileName('');
    setError('');
    setFileURL(null);
    setFile({});
  };

  const openPreview = () => {
    if (fileURL) {
      window.open(fileURL, '_blank', 'width=800,height=600');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${error ? 'border-red-500 bg-red-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!fileName && (
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept={acceptedTypes.join(',')}
            onChange={handleChange}
          />
        )}

        {!fileName && (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your file here, or click to select
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {accept === 'both' && 'PDF and images'}
              {accept === 'pdf' && 'PDF files'}
              {accept === 'image' && 'Images'} up to {maxSize}MB
            </p>
          </div>
        )}

        {fileName && (
          <div className="flex items-center justify-between bg-white p-4 rounded border">
            <div className="flex items-center space-x-3">
              {preview ? (
                <img src={preview} alt="Preview" className="w-10 h-10 object-cover rounded" />
              ) : (
                <FileType className="w-10 h-10 text-gray-400" />
              )}
              <span className="text-sm text-gray-700 truncate max-w-[200px]">
                {fileName}
              </span>
            </div>
            <button
              onClick={clearFile}
              className="p-4 hover:bg-gray-400 rounded-full"
              type="button"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {fileName && (
        <div className="mt-4 text-center">
          <button
            onClick={openPreview}
            class="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Preview File
          </button>
        </div>
      )}
    </div>
  );
}
