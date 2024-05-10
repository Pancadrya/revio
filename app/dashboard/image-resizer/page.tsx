'use client';

import { Console } from 'console';
import { resolveSoa } from 'dns';
import React, { useState, useEffect } from 'react';

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [resizedImageName, setResizedImageName] = useState<string | null>(null);
  const [resizedImageUrl, setResizedImageUrl] = useState<string | null>(null);
  const API = process.env.NEXT_PUBLIC_API_URL;

  if (!API) {
    throw new Error('API URL is not defined in environment variables');
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      setSelectedFileName(input.files[0].name);
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      setSelectedFileName('');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];

    if (file.type.startsWith('image/')) {
      setSelectedFileName(file.name);
      setSelectedFile(file);
    } else {
      alert('Please drop an image file.');
    }
  };

  const handleResize = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!selectedFile) return;

    if (
      parseInt(width) < 1 ||
      parseInt(width) > 1024 ||
      parseInt(height) < 1 ||
      parseInt(height) > 1024
    ) {
      alert('Not suitable width or height. Please try again.');
      return;
    }

    const formData = new FormData();

    formData.append('image', selectedFile);
    formData.append('width', width);
    formData.append('height', height);

    try {
      const response = await fetch(API + '/image/resize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to resize image');
      }

      const responseData = await response.json();
      const imageName = responseData.name;
      const imageUrl = responseData.url;

      setResizedImageName(imageName);
      setResizedImageUrl(imageUrl);
    } catch (error) {
      console.error('Error resizing image:', error);
      alert('Error resizing image. Please try again.');
    }
  };

  const handleDownload = () => {
    // Check if imageUrl is available
    if (resizedImageUrl) {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = resizedImageUrl;
      link.download = `${resizedImageName}`; // Set the desired filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Handle case when imageUrl is not available
      console.error('Image URL is not available');
    }
  };

  const handleRefresh = () => {
    // Check if imageUrl is available
    if (resizedImageUrl) {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = '/dashboard/image-resizer';
      link.click();
    } else {
      // Handle case when imageUrl is not available
      console.error('Refresh Error');
    }
  };

  return (
    <>
      <p className="mb-3 text-xl font-medium">Image Resizer</p>
      <div className="mb-5 flex w-full items-center justify-center">
        <label
          htmlFor="dropzone-file"
          className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100"
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <svg
              className="mb-4 h-8 w-8 text-blue-500 dark:text-blue-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-blue-500 dark:text-blue-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-blue-500 dark:text-blue-400">
              {selectedFileName ? selectedFileName : 'Image files only'}
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      <form>
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="width"
              className="text-md mb-2 block font-medium text-gray-900"
            >
              Width
            </label>
            <input
              type="number"
              id="width"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Min. 0 - Max. 1024"
              required
              disabled={!selectedFile}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="height"
              className="text-md mb-2 block font-medium text-gray-900"
            >
              Height
            </label>
            <input
              type="number"
              id="height"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Min. 0 - Max. 1024"
              required
              disabled={!selectedFile}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
          disabled={!selectedFile || !width || !height}
          onClick={handleResize}
        >
          Resize
        </button>
      </form>

      <br />

      {selectedFile && (
        <>
          <p className="mb-3 mt-6 text-xl font-medium">Original Image</p>
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Selected Image"
            style={{ maxWidth: '50%' }}
          />
        </>
      )}
      <br />
      {resizedImageUrl && (
        <>
          <p className="mb-3 mt-6 text-xl font-medium">Resized Image</p>
          <img
            src={resizedImageUrl}
            alt="Resized Image"
            style={{ maxWidth: '50%' }}
          />
          <button
            className="mr-3 mt-6 w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
            disabled={!resizedImageUrl}
            onClick={handleDownload}
          >
            Download
          </button>
          <button
            className="mt-6 w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
            disabled={!resizedImageUrl}
            onClick={handleRefresh}
          >
            Resize Another Image
          </button>
        </>
      )}
    </>
  );
}
