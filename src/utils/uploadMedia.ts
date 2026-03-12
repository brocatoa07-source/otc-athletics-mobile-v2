/**
 * Shared media upload utility.
 * Uses fetch(uri) → Blob → XHR so it works for images AND large videos
 * without reading the entire file into a base64 string (which OOMs on video).
 */
import { supabase } from '@/lib/supabase';

export const MEDIA_BUCKET = 'media';

// ── Content-type helpers ────────────────────────────────────────────────────

const MIME_MAP: Record<string, string> = {
  mp4:  'video/mp4',
  mov:  'video/quicktime',
  m4v:  'video/x-m4v',
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  gif:  'image/gif',
  webp: 'image/webp',
  m4a:  'audio/m4a',
  mp3:  'audio/mpeg',
  wav:  'audio/wav',
};

export function mimeFromUri(uri: string): string {
  const ext = uri.split('.').pop()?.toLowerCase() ?? '';
  return MIME_MAP[ext] ?? 'application/octet-stream';
}

// ── Core upload helper ──────────────────────────────────────────────────────

export interface UploadMediaToStorageOptions {
  uri: string;
  bucket: string;
  path: string;
  contentType?: string;
  onProgress?: (fraction: number) => void;
}

export interface UploadMediaResult {
  publicUrl: string;
  storagePath: string;
}

export async function uploadMediaToStorage(
  opts: UploadMediaToStorageOptions,
): Promise<UploadMediaResult> {
  const { uri, bucket, path, onProgress } = opts;

  if (!uri) throw new Error('No file URI provided');

  const fetchResponse = await fetch(uri);
  if (!fetchResponse.ok) throw new Error('Could not read local file for upload');
  const blob = await fetchResponse.blob();

  const contentType =
    opts.contentType ||
    (blob.type && blob.type !== 'application/octet-stream' ? blob.type : null) ||
    mimeFromUri(uri);

  onProgress?.(0.05);

  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        onProgress?.(0.05 + (e.loaded / e.total) * 0.9);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed (${xhr.status}): ${xhr.responseText}`));
    });

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

    xhr.open('POST', `${supabaseUrl}/storage/v1/object/${bucket}/${path}`);
    xhr.setRequestHeader('Content-Type', contentType);
    xhr.setRequestHeader('apikey', supabaseAnonKey);
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('x-upsert', 'true');
    xhr.send(blob);
  });

  onProgress?.(1);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { publicUrl: data.publicUrl, storagePath: path };
}

// ── Legacy wrapper ──────────────────────────────────────────────────────────

export interface UploadMediaOptions {
  fileUri: string;
  storagePath: string;
  contentType: string;
  onProgress?: (p: number) => void;
}

export async function uploadMedia(opts: UploadMediaOptions): Promise<UploadMediaResult> {
  return uploadMediaToStorage({
    uri: opts.fileUri,
    bucket: MEDIA_BUCKET,
    path: opts.storagePath,
    contentType: opts.contentType,
    onProgress: opts.onProgress,
  });
}

// ── Path builders ───────────────────────────────────────────────────────────

export function announcementPath(announcementId: string, filename: string) {
  return `announcements/${announcementId}/${filename}`;
}

export function messagePath(conversationId: string, messageId: string, filename: string) {
  return `messages/${conversationId}/${messageId}/${filename}`;
}

export function reviewPath(athleteId: string, filename: string) {
  return `reviews/${athleteId}/${Date.now()}_${filename}`;
}
