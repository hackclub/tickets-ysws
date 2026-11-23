const JPEG_SIGNATURE = Buffer.from([0xff, 0xd8, 0xff]);
const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

export interface ImageType {
  contentType: string;
  extension: string;
}

export function detectImageType(buffer: Buffer): ImageType | null {
  if (buffer.subarray(0, 3).equals(JPEG_SIGNATURE))
    return { contentType: 'image/jpeg', extension: 'jpg' };
  if (buffer.subarray(0, 8).equals(PNG_SIGNATURE))
    return { contentType: 'image/png', extension: 'png' };
  if (
    buffer.toString('latin1', 0, 4) === 'RIFF' &&
    buffer.toString('latin1', 8, 12) === 'WEBP'
  )
    return { contentType: 'image/webp', extension: 'webp' };
  return null;
}
