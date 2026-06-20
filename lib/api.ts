import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://carlstorm-pneumoniascan-backend.hf.space';

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
    const res = await axios.get(`${API_BASE_URL}/`);
    return res.data;
  },

  getModels: async (): Promise<ModelInfo[]> => {
    const res = await axios.get(`${API_BASE_URL}/models`);
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
    const res = await axios.post(`${API_BASE_URL}/predict`, formData, {
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
    const res = await axios.get(`${API_BASE_URL}/history`, { params });
    return res.data;
  },

  getScan: async (id: number): Promise<ScanDetail> => {
    const res = await axios.get(`${API_BASE_URL}/history/${id}`);
    return res.data;
  },

  deleteScan: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/history/${id}`);
  },
};
