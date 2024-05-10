'use client';

import { Metadata } from 'next';
import React, { DragEventHandler, useState } from 'react';

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [compressionLevel, setCompressionLevel] = useState('');
  const [compressedAudio, setcompressedAudio] = useState('');
  const [compressedAudioName, setCompressedAudioName] = useState<string | null>(
    null,
  );
  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleFileChange = (event: { target: any }) => {
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

  const handleDragOver = (event: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop: DragEventHandler<HTMLLabelElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];

    if (file.type.startsWith('audio/')) {
      setSelectedFileName(file.name);
      setSelectedFile(file);
    } else {
      alert('Please drop an audio file.');
    }
  };

  const handleCompress = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();

    formData.append('audio', selectedFile);
    formData.append('level', compressionLevel);

    try {
      const response = await fetch(API + '/audio/compress', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to compress audio');
      }

      const responseData = await response.json();
      const audioName = responseData.name;
      const audioUrl = responseData.url;

      setCompressedAudioName(audioName);
      setcompressedAudio(audioUrl);
    } catch (error) {
      console.error('Error compressing audio:', error);
      alert('Error compressing audio. Please try again.');
    }
  };

  const handleDownload = () => {
    // Check if imageUrl is available
    if (compressedAudio) {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = compressedAudio;
      link.download = `${compressedAudioName}`; // Set the desired filename
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
    if (compressedAudio) {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = '/dashboard/audio-compressor';
      link.click();
    } else {
      // Handle case when imageUrl is not available
      console.error('Refresh Error');
    }
  };

  return (
    <>
      <p className="mb-3 text-xl font-medium">Audio Compressor</p>
      <div className="mb-6 flex w-full items-center justify-center">
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
              {selectedFileName
                ? selectedFileName
                : 'Audio files only (mpeg or mp3)'}
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            name="audio"
            formEncType="multipart/form-data"
            accept="audio/mpeg"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      <label
        htmlFor="height"
        className="text-md mb-3 block font-medium text-gray-900"
      >
        Select Compression Level
      </label>
      <div className="mb-6 flex items-end justify-start">
        <label htmlFor=""></label>
        <button
          className={`mx-1 flex items-center rounded-lg px-4 py-2 ${
            compressionLevel === 'low'
              ? 'border-2 border-blue-300 bg-blue-100 text-blue-800'
              : 'bg-blue-50 text-blue-800'
          }`}
          onClick={() => setCompressionLevel('low')}
          style={{ height: '30px' }}
          disabled={!selectedFileName}
        >
          Low
        </button>
        <button
          className={`mx-1 flex items-center rounded-lg px-4 py-4 ${
            compressionLevel === 'medium'
              ? 'border-2 border-blue-300 bg-blue-100 text-blue-800'
              : 'bg-blue-50 text-blue-800'
          }`}
          onClick={() => setCompressionLevel('medium')}
          style={{ height: '50px' }}
          disabled={!selectedFileName}
        >
          Medium
        </button>
        <button
          className={`mx-1 flex items-center rounded-lg px-4 py-8 ${
            compressionLevel === 'high'
              ? 'border-2 border-blue-300 bg-blue-100 text-blue-800'
              : 'bg-blue-50 text-blue-800'
          }`}
          onClick={() => setCompressionLevel('high')}
          style={{ height: '80px' }}
          disabled={!selectedFileName}
        >
          High
        </button>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
        disabled={!selectedFileName}
        onClick={handleCompress}
      >
        Compress
      </button>

      <br />
      <br />
      {selectedFile && (
        <>
          <p className="mb-3 mt-8 text-xl font-medium">Original Audio</p>
          <audio controls src={URL.createObjectURL(selectedFile)} />
        </>
      )}
      <br />
      {compressedAudio && (
        <>
          <p className="mb-3 text-xl font-medium">Compressed Audio</p>
          <audio controls src={compressedAudio} />
          <button
            className="mr-3 mt-6 w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
            disabled={!compressedAudio}
            onClick={handleDownload}
          >
            Download
          </button>
          <button
            className="mt-6 w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
            disabled={!compressedAudio}
            onClick={handleRefresh}
          >
            Compress Another Audio
          </button>
        </>
      )}
      <br />
    </>
  );
}
