interface FileResponse {
  id: string;
  name: string;
  file: string;
  uploaded_at: string;
  file_type: string;
  size: number;
  uploaded_by?: {
    id: string;
    name: string;
  };
}

export async function uploadFile(file: File): Promise<FileResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', file.name);

  const token = localStorage.getItem('token');
  console.log('Token for upload:', token ? 'Present' : 'Missing');
  
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log('Uploading file:', file.name, 'Size:', file.size);
  console.log('Headers:', headers);

  const response = await fetch('https://laboissim.onrender.com/api/files/', {
    method: 'POST',
    body: formData,
    headers,
  });

  console.log('Upload response status:', response.status);
  console.log('Upload response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Upload error:', response.status, errorText);
    throw new Error(`Failed to upload file: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  console.log('Upload result:', result);
  return result;
}

export async function getUserFiles(): Promise<FileResponse[]> {
  try {
    console.log('Attempting to fetch files from /api/files');
    
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('https://laboissim.onrender.com/api/files/', {
      headers,
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fetch files error:', response.status, errorText);
      throw new Error(`Failed to fetch files: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Files fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Network error fetching files:', error);
    throw error;
  }
}

export async function deleteFile(fileId: string): Promise<void> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`https://laboissim.onrender.com/api/files/${fileId}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Delete file error:', response.status, errorText);
    throw new Error(`Failed to delete file: ${response.status} ${errorText}`);
  }
}

export async function downloadFile(fileUrl: string, fileName: string): Promise<void> {
  try {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(fileUrl, {
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Download error:', response.status, errorText);
      throw new Error(`Failed to download file: ${response.status} ${errorText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileUrl(filePath: string): string {
  // Convert relative file path to full URL
  if (filePath.startsWith('http')) {
    return filePath;
  }
  return `https://laboissim.onrender.com${filePath}`;
}

export function getFileDownloadUrl(fileId: string): string {
  // Get the download endpoint URL for a specific file
  return `https://laboissim.onrender.com/api/files/${fileId}/download/`;
}
