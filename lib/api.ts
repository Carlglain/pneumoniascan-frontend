import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://carlstorm-pneumoniascan-backend.hf.space';

const client = axios.create({ baseURL: API_BASE_URL });

client.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface PredictionResult {
  patient_id:      string;
  diagnosis:       string;
  confidence:      number;
  model_used:      string;
  raw_probability: number;
  heatmap:         string | null;
  processing_time: number;
}

export interface ModelInfo {
  id:          string;
  name:        string;
  description: string;
  parameters:  string;
  accuracy:    string;
  auc_roc:     string;
}

export interface ScanSummary {
  id:              number;
  patient_id:      string;
  created_at:      string;
  diagnosis:       string;
  confidence:      number;
  model_used:      string;
  processing_time: number;
}

export interface ScanDetail extends ScanSummary {
  raw_probability: number;
  heatmap:         string | null;
  image_data:      string | null;
}

export interface HistoryStats {
  total:           number;
  pneumonia_count: number;
  normal_count:    number;
  avg_confidence:  number;
}

export interface HistoryResponse {
  stats:       HistoryStats;
  scans:       ScanSummary[];
  page:        number;
  total_pages: number;
  total_items: number;
}

export const api = {
  healthCheck: async () => {
    const res = await client.get('/');
    return res.data;
  },

  getModels: async (): Promise<ModelInfo[]> => {
    const res = await client.get('/models');
    return res.data.models;
  },

  predict: async (
    file:      File,
    modelName: string,
    gradcam:   boolean = true,
  ): Promise<PredictionResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model_name', modelName);
    formData.append('gradcam', String(gradcam));
    const res = await client.post('/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getHistory: async (params: {
    page?:      number;
    limit?:     number;
    diagnosis?: string;
    model?:     string;
    search?:    string;
  } = {}): Promise<HistoryResponse> => {
    const res = await client.get('/history', { params });
    return res.data;
  },

  getScan: async (id: number): Promise<ScanDetail> => {
    const res = await client.get(`/history/${id}`);
    return res.data;
  },

  deleteScan: async (id: number): Promise<void> => {
    await client.delete(`/history/${id}`);
  },
};
