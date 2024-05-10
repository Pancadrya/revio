import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { unlink } from 'node:fs/promises';

export async function POST(req: any, res: any) {
  try {
    // Parse the multipart/form-data request
    const formData = await req.formData();

    // Retrieve the uploaded file
    const audio = formData.get('audio');
    const level = formData.get('level');
    const audioName = audio.name;
    const encodedFileName = encodeURIComponent(audioName);

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

    // Create a Readable Stream from the Blob object
    const audioPath = path.join('public', 'uploads', 'audio', audio.name);
    const fileStream = fs.createWriteStream(audioPath);

    // Write the file buffer to the file stream
    fileStream.write(Buffer.from(await audio.arrayBuffer()));

    // Close the file stream
    fileStream.end();

    // Proses file menggunakan fluent-ffmpeg
    await new Promise<void>((resolve, reject) => {
      ffmpeg(`${process.env.NEXT_PUBLIC_HOST}/uploads/audio/${encodedFileName}`)
        .audioBitrate(bitrate)
        .output(`./public/uploads/audio/compressed-${audioName}`)
        .on('end', () => {
          resolve();
        })
        .on('error', (err: any) => {
          reject(err);
        })
        .run();
    });

    await unlink(`./public/uploads/audio/${audioName}`);

    // Kirim respons ke klien
    return NextResponse.json(
      {
        message: 'Audio compressed successfully',
        name: `compressed-${audioName}`,
        url: `${process.env.NEXT_PUBLIC_HOST}/uploads/audio/compressed-${audioName}`,
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
