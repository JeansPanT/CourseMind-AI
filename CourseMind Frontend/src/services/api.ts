const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface NoteResponse {
  id?: number;
  topic: string;
  note: string; // ✅ changed from "notes" to match backend JSON
}

export interface Question {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
}


export interface TestResponse {
  topic: string;
  questions: Question[];
}

export interface DPPResponse {
  topic: string;
  questions: Question[];
}

export interface ScheduleTestRequest {
  topic: string;
  date: string;
  time: string;
}

export interface ScheduleDPPRequest {
  topic: string;
  time: string;
}

class ApiService {
  private async fetchWithErrorHandling<T>(
    url: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  // ✅ Update: notes endpoint returns an array of NoteResponse
  async generateNotes(topic: string): Promise<ApiResponse<NoteResponse[]>> {
    return this.fetchWithErrorHandling<NoteResponse[]>(
      `${API_BASE_URL}/notes?topic=${encodeURIComponent(topic)}`,
      { method: 'POST' }
    );
  }

  async generateTest(topic: string): Promise<ApiResponse<TestResponse>> {
    return this.fetchWithErrorHandling<TestResponse>(`${API_BASE_URL}/tests`, {
      method: 'POST',
      body: JSON.stringify({ topic }),
    });
  }

  async scheduleTest(
    data: ScheduleTestRequest
  ): Promise<ApiResponse<{ status: string; topic: string }>> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/tests/schedule`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelScheduledTest(): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/tests/schedule`, {
      method: 'DELETE',
    });
  }

  async generateDPP(topic: string): Promise<ApiResponse<DPPResponse>> {
  return this.fetchWithErrorHandling<DPPResponse>(`${API_BASE_URL}/dpp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic })  // <-- important: send an object, not a raw string
  });
}


  async scheduleDPP(
    data: ScheduleDPPRequest
  ): Promise<ApiResponse<{ status: string; topic: string }>> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/dpp/schedule`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelScheduledDPP(): Promise<ApiResponse<{ status: string; message: string }>> {
    return this.fetchWithErrorHandling(`${API_BASE_URL}/dpp/schedule`, {
      method: 'DELETE',
    });
  }

  async healthCheck(): Promise<ApiResponse<string>> {
    return this.fetchWithErrorHandling<string>(`${API_BASE_URL}/`, {
      method: 'GET',
    });
  }
}

export const apiService = new ApiService();
