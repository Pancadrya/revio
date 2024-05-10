import { NextResponse } from 'next/server';
import path from 'path';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export async function POST(req: any, res: any) {
  try {
    // Parse the multipart/form-data request
    const formData = await req.formData();

    // Retrieve the uploaded file
    const audio = formData.get('audio');
    const level = formData.get('level');
    const audioName = audio.name;

    // Check if file was uploaded
    if (!audio) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 },
      );
    }

    let bitrate = '96k';
    switch (level) {
      case 'low':
        bitrate = '96k';
        break;
      case 'medium':
        bitrate = '64k';
        break;
      case 'high':
        bitrate = '48k';
        break;
    }

    const ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm',
      ),
    });

    // Write the file buffer to the FFmpeg filesystem
    await ffmpeg.writeFile(audioName, await fetchFile(audio));

    // Process the file using FFmpeg Wasm
    await ffmpeg.exec([
      '-i',
      audioName,
      '-b:a',
      bitrate,
      `compressed-${audioName}`,
    ]);

    // Get the compressed audio file
    const data = await ffmpeg.readFile(`compressed-${audioName}`);

    // Convert the compressed audio to a Blob object
    const blob = new Blob([data], { type: 'audio/mpeg' });

    // Generate a URL for the compressed audio
    const url = URL.createObjectURL(blob);

    // Destroy the FFmpeg instance
    ffmpeg.terminate();

    // Send response to the client
    return NextResponse.json(
      {
        message: 'Audio compressed successfully',
        name: `compressed-${audioName}`,
        url,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
