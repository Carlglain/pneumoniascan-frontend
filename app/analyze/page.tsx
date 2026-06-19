'use client';
import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, CheckCircle, Settings, BarChart2, Info } from 'lucide-react';
import { api } from '@/lib/api';
import Footer from '@/components/Footer';

export default function AnalyzePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('efficientnet');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const models = [
    {
      id: 'efficientnet',
      name: 'EfficientNet-B0',
      label: 'Primary Model · ~5.3M Parameters',
      desc: 'Lighter model (~5.3M parameters) optimised for faster inference on CPU hardware.',
      recommended: true,
    },
    {
      id: 'resnet50',
      name: 'ResNet50',
      label: 'Baseline Model · ~25.6M Parameters',
      desc: 'Deeper residual network for binary Normal vs. Pneumonia classification with higher parameter count.',
      recommended: false,
    },
  ];

  const handleFile = (f: File) => {
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(f.type)) {
      setError('Please upload a JPEG or PNG image.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      return;
    }
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.predict(file, selectedModel, true);
      localStorage.setItem('pneumoscan_result', JSON.stringify(result));
      localStorage.setItem('pneumoscan_image', preview || '');
      router.push('/results');
    } catch (err: unknown) {
      type AxiosError = { response?: { data?: { detail?: string } }; code?: string };
      const axiosErr = err && typeof err === 'object' ? (err as AxiosError) : null;
      const isNetworkError = axiosErr && !axiosErr.response;
      const message = isNetworkError
        ? 'Cannot reach the analysis server. Make sure the backend is running on port 8000.'
        : (axiosErr?.response?.data?.detail ?? 'Analysis failed. Please try again.');
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12 w-full flex-1">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight">Chest X-Ray Analysis</h1>
          <p className="text-sm sm:text-base max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            Upload a chest X-ray (JPEG or PNG, max 10MB) for Normal vs. Pneumonia classification with Grad-CAM explainability.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Upload column */}
          <div
            onClick={() => !file && fileInputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            className="border-2 border-dashed rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center p-8 min-h-[420px]"
            style={{
              borderColor: dragging
                ? '#2DD4A0'
                : file
                  ? 'rgba(45,212,160,0.4)'
                  : 'var(--border-medium)',
              backgroundColor: dragging
                ? 'rgba(45,212,160,0.05)'
                : file
                  ? 'var(--bg-surface)'
                  : 'var(--bg-surface-60)',
              cursor: file ? 'default' : 'pointer',
            }}
          >
            {preview ? (
              <div className="relative w-full flex flex-col items-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="X-ray preview"
                  className="max-h-80 object-contain rounded-lg border"
                  style={{ borderColor: 'var(--border-subtle)' }}
                />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                  className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-600 rounded-full p-1.5 transition-colors"
                >
                  <X size={14} />
                </button>
                <div className="flex items-center gap-1.5 mt-4 text-[#2DD4A0]">
                  <CheckCircle size={14} />
                  <span className="text-xs font-semibold truncate max-w-[280px]">{file?.name}</span>
                </div>
              </div>
            ) : (
              <div className="text-center flex flex-col items-center max-w-sm">
                <div className="bg-[#2DD4A0]/10 p-5 rounded-full mb-5 border border-[#2DD4A0]/20">
                  <svg className="w-10 h-10 text-[#2DD4A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Drag & drop your chest X-ray here
                </p>
                <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
                  or click to browse local files
                </p>
                <span
                  className="text-[11px] tracking-wider uppercase font-semibold px-3 py-1 rounded-full border"
                  style={{
                    backgroundColor: 'var(--bg-overlay)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                >
                  JPEG, PNG — Max 10MB
                </span>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />

          {/* Model selection column */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <Settings className="text-[#2DD4A0]" size={18} />
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Select AI Model</h2>
            </div>

            {models.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => setSelectedModel(model.id)}
                className="w-full text-left p-5 rounded-xl border transition-all relative"
                style={{
                  borderColor: selectedModel === model.id ? '#2DD4A0' : 'var(--border-subtle)',
                  backgroundColor: selectedModel === model.id ? 'rgba(45,212,160,0.05)' : 'var(--bg-surface)',
                }}
              >
                {selectedModel === model.id && (
                  <CheckCircle className="absolute top-4 right-4 text-[#2DD4A0]" size={18} />
                )}
                <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${model.recommended ? 'text-[#2DD4A0]' : 'text-[#5B9FD4]'}`}>
                  {model.label}
                </p>
                <p className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{model.name}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{model.desc}</p>
              </button>
            ))}

            <div
              className="border rounded-xl p-4 flex gap-3"
              style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'rgba(91,159,212,0.2)' }}
            >
              <Info className="text-[#5B9FD4] shrink-0 mt-0.5" size={16} />
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Selecting a model with higher parameter counts may result in slightly longer processing times during the inference phase.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!file || loading}
              className="w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: file && !loading ? '#2DD4A0' : 'var(--bg-surface)',
                color: file && !loading ? '#0A1628' : 'var(--text-muted)',
                cursor: file && !loading ? 'pointer' : 'not-allowed',
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0A1628]/30 border-t-[#0A1628] rounded-full animate-spin" />
                  <span>Analysing Image...</span>
                </>
              ) : (
                <>
                  <BarChart2 size={16} />
                  <span>Analyse Image</span>
                </>
              )}
            </button>

            {loading && (
              <p className="text-center text-xs animate-pulse" style={{ color: 'var(--text-muted)' }}>
                Processing takes 15–25 seconds on CPU
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer variant="compact" />
    </div>
  );
}
