import { NextRequest, NextResponse } from 'next/server';
import { imageUploadMiddleware } from '../../multerMiddleware';
import multer from 'multer';
import sharp from 'sharp';

export async function POST(req: any, res: any) {
  return imageUploadMiddleware(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // Handle multer errors
      return NextResponse.json(
        { message: 'Error uploading file', error: err.message },
        { status: 400 },
      );
    } else if (err) {
      // Handle other errors
      return NextResponse.json(
        { message: 'Internal server error', error: err.message },
        { status: 500 },
      );
    }

    // Extract width and height parameters from the request body
    const data = await req.formData();
    const image = data.get('image');
    const width = parseInt(data.get('width')); // Ensure width is a number
    const height = parseInt(data.get('height')); // Ensure height is a number

    // Check if file was uploaded
    if (!data) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 },
      );
    }

    try {
      // Use Sharp to resize the image
      const buffer = await image.arrayBuffer();
      const imageBuffer = sharp(new Uint8Array(buffer));
      let imageName = image.name;
      const originalFormat = image.name.split('.').pop().toLowerCase();
      const supportedFormats = ['png', 'jpg', 'jpeg'];

      if (!supportedFormats.includes(originalFormat)) {
        // Convert image to PNG format
        imageName = `${imageName.split('.').slice(0, -1).join('.')}.png`;
      }

      await imageBuffer
        .png()
        .resize(width, height)
        .toFile(`./public/uploads/image/resized-${imageName}`);

      // Send the resized image back to the frontend
      return NextResponse.json(
        {
          message: 'Image resized successfully',
          name: `resized-${imageName}`,
          url: `${process.env.NEXT_PUBLIC_HOST}/uploads/image/resized-${imageName}`,
        },
        {
          status: 200,
          headers: {
            'Content-Type': 'image/png', // Adjust based on original image type
          },
        },
      );
    } catch (error) {
      console.error('Error resizing image:', error);
      return NextResponse.json(
        { message: 'Error resizing image' },
        { status: 500 },
      );
    }
  });
}
