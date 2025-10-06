interface PublicationResponse {
  id: string;
  title: string;
  abstract: string;
  posted_at: string;
  category?: 'article' | 'book_chapter' | 'memoire' | 'conference';
  // Article
  journal?: string | null;
  publication_year?: number | null;
  volume?: string | null;
  number?: string | null;
  pages?: string | null;
  // Book / Chapter
  edition?: string | null;
  publication_place?: string | null;
  publisher_name?: string | null;
  // Memoire
  author_name?: string | null;
  thesis_title?: string | null;
  thesis_year?: number | null;
  university?: string | null;
  // Conference
  presentation_title?: string | null;
  conference_title?: string | null;
  conference_year?: number | null;
  conference_location?: string | null;
  conference_pages?: string | null;
  posted_by?: {
    id: string;
    name: string;
  };
  tagged_members?: Array<{
    id: string;
    name: string;
    username: string;
  }>;
  tagged_externals?: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  attached_files?: Array<{
    id: string;
    name: string;
    file: string;
    file_type: string;
    size: number;
  }>;
  keywords?: string[];
}

interface CreatePublicationData {
  title: string;
  abstract: string;
  category: 'article' | 'book_chapter' | 'memoire' | 'conference';
  // Article
  journal?: string;
  publication_year?: number;
  volume?: string;
  number?: string;
  pages?: string;
  // Book / Chapter
  edition?: string;
  publication_place?: string;
  publisher_name?: string;
  // Memoire
  author_name?: string;
  thesis_title?: string;
  thesis_year?: number;
  university?: string;
  // Conference
  presentation_title?: string;
  conference_title?: string;
  conference_year?: number;
  conference_location?: string;
  conference_pages?: string;
  tagged_members?: string[];
  tagged_externals?: string[];
  attached_files?: string[];
  keywords?: string[];
}

interface MemberSearchResult {
  id: string;
  name: string;
  username: string;
}

interface ExternalSearchResult {
  id: string;
  name: string;
  email: string;
}

export async function createPublication(data: CreatePublicationData): Promise<PublicationResponse> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('http://localhost:8000/api/publications/', {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Create publication error:', response.status, errorText);
    throw new Error(`Failed to create publication: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function updatePublication(id: string, data: CreatePublicationData): Promise<PublicationResponse> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`http://localhost:8000/api/publications/${id}/`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Update publication error:', response.status, errorText);
    throw new Error(`Failed to update publication: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function getPublications(): Promise<PublicationResponse[]> {
  try {
    console.log('Attempting to fetch publications from /api/publications/');
    
    const response = await fetch('http://localhost:8000/api/publications/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fetch publications error:', response.status, errorText);
      throw new Error(`Failed to fetch publications: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Publications fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Network error fetching publications:', error);
    throw error;
  }
}

export async function deletePublication(publicationId: string): Promise<void> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

      const response = await fetch(`http://localhost:8000/api/publications/${publicationId}/`, {
      method: 'DELETE',
      headers,
    });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Delete publication error:', response.status, errorText);
    throw new Error(`Failed to delete publication: ${response.status} ${errorText}`);
  }
}

export async function searchMembers(query: string): Promise<MemberSearchResult[]> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`http://localhost:8000/api/publications/search_members/?q=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Search members error:', response.status, errorText);
    throw new Error(`Failed to search members: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function searchExternals(query: string): Promise<ExternalSearchResult[]> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`http://localhost:8000/api/publications/search_externals/?q=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Search externals error:', response.status, errorText);
    throw new Error(`Failed to search externals: ${response.status} ${errorText}`);
  }

  return response.json();
}
