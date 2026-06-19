'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle, CheckCircle, Stethoscope, Cpu, RefreshCw,
  Info, Shield,
} from 'lucide-react';
import { PredictionResult } from '@/lib/api';
import Footer from '@/components/Footer';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [overlayOpacity, setOverlayOpacity] = useState(70);

  useEffect(() => {
    const stored = localStorage.getItem('pneumoscan_result');
    const image = localStorage.getItem('pneumoscan_image');
    if (!stored) { router.push('/analyze'); return; }
    setResult(JSON.parse(stored));
    setOriginalImage(image);
  }, [router]);

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="w-8 h-8 border-2 border-[#2DD4A0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isPneumonia = result.diagnosis.toLowerCase().includes('pneumonia');
  const displayConfidence = typeof result.confidence === 'number' ? result.confidence : parseFloat(result.confidence);
  const sessionId = `#PX-${Date.now().toString().slice(-8)}`;
  const timestamp = new Date().toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });

  const interpretation = isPneumonia
    ? 'The model has detected patterns consistent with pneumonia. Visual localization on the Grad-CAM heatmap suggests focal opacities in the lower pulmonary lobes. Please consult a qualified radiologist for confirmation.'
    : 'The model found no significant radiographic evidence of pneumonia. Lung fields appear clear and normal. Clinical correlation is recommended if acute pulmonary symptoms persist.';

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight">Diagnostic Results</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Session ID: {sessionId} &nbsp;·&nbsp; Analysis Timestamp: {timestamp}
          </p>
        </div>

        <div
          className="border rounded-xl p-4 flex items-start gap-3 mb-8"
          style={{ backgroundColor: 'var(--bg-muted)', borderColor: 'rgba(91,159,212,0.3)' }}
        >
          <Shield className="text-[#5B9FD4] shrink-0 mt-0.5" size={18} />
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            This tool is intended as a diagnostic support aid only and does not replace the clinical judgement of a qualified radiologist or physician.
          </p>
        </div>

        {/* Alert banner */}
        {isPneumonia ? (
          <div
            className="border border-red-900/50 rounded-xl p-5 flex items-start gap-4 mb-8"
            style={{ backgroundColor: 'var(--bg-alert-error)' }}
          >
            <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={22} />
            <div>
              <h3 className="text-lg font-bold text-red-400 mb-1">Pneumonia Detected</h3>
              <p className="text-sm leading-relaxed text-red-400/70">
                The automated scan has identified radiological indicators signifying presence of inflammatory fluid in the pulmonary tissue.
              </p>
            </div>
          </div>
        ) : (
          <div
            className="border border-[#2DD4A0]/30 rounded-xl p-5 flex items-start gap-4 mb-8"
            style={{ backgroundColor: 'var(--bg-alert-success)' }}
          >
            <CheckCircle className="text-[#2DD4A0] shrink-0 mt-0.5" size={22} />
            <div>
              <h3 className="text-lg font-bold text-[#2DD4A0] mb-1">No Pneumonia Detected</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Normal radiological markers identified. Routine follow-up recommended if symptoms persist.
              </p>
            </div>
          </div>
        )}

        {/* Metrics row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div
            className="border rounded-xl p-5 relative overflow-hidden"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
          >
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${isPneumonia ? 'bg-red-500' : 'bg-[#2DD4A0]'}`} />
            <p className="text-[11px] uppercase tracking-widest font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Diagnosis</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
                {isPneumonia ? 'Pneumonia' : 'Normal'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase ${isPneumonia ? 'bg-red-500/20 text-red-400' : 'bg-[#2DD4A0]/20 text-[#2DD4A0]'}`}>
                {isPneumonia ? 'High Risk' : 'Clear'}
              </span>
            </div>
            <Stethoscope className="absolute top-5 right-5" size={22} style={{ color: 'var(--border-strong)' }} />
          </div>

          <div
            className="border rounded-xl p-5 relative"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
          >
            <p className="text-[11px] uppercase tracking-widest font-bold mb-2" style={{ color: 'var(--text-muted)' }}>Confidence Score</p>
            <span className="text-2xl font-extrabold text-[#2DD4A0]">{displayConfidence.toFixed(2)}%</span>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>High Statistical Significance</p>
            <div className="absolute top-5 right-5 w-10 h-10">
              <svg className="w-full h-full -rotate-90">
                <circle cx="20" cy="20" r="16" fill="transparent" stroke="var(--ring-track)" strokeWidth="3" />
                <circle
                  cx="20" cy="20" r="16" fill="transparent"
                  stroke="#2DD4A0" strokeWidth="3"
                  strokeDasharray={100.5}
                  strokeDashoffset={100.5 - (100.5 * displayConfidence) / 100}
                />
              </svg>
            </div>
          </div>

          <div
            className="border rounded-xl p-5 relative"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
          >
            <p className="text-[11px] uppercase tracking-widest font-bold mb-2" style={{ color: 'var(--text-muted)' }}>AI Architecture</p>
            <span className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{result.model_used}</span>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              State-of-the-art CNN optimized for clinical imaging.
            </p>
            <Cpu className="absolute top-5 right-5" size={22} style={{ color: 'var(--border-strong)' }} />
          </div>
        </div>

        {/* Side-by-side images — viewer always dark for X-ray readability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div
            className="border rounded-xl p-5"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Original Chest X-Ray</span>
            </div>
            <div className="bg-[#080E16] rounded-lg overflow-hidden aspect-square flex items-center justify-center p-4 border border-white/5">
              {originalImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={originalImage} alt="Original X-ray" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-gray-600 text-sm">No image available</span>
              )}
            </div>
          </div>

          <div
            className="border rounded-xl p-5"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Grad-CAM Heatmap</span>
              <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                <span>Overlay Opacity</span>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                  className="w-16 accent-[#2DD4A0]"
                />
              </div>
            </div>
            <div className="bg-[#080E16] rounded-lg overflow-hidden aspect-square flex items-center justify-center p-4 border border-white/5 relative">
              {result.heatmap ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`data:image/png;base64,${result.heatmap}`}
                  alt="Grad-CAM heatmap"
                  className="max-h-full max-w-full object-contain"
                  style={{ opacity: overlayOpacity / 100 }}
                />
              ) : (
                <span className="text-gray-600 text-sm">Heatmap overlay not generated</span>
              )}
              {result.heatmap && (
                <div className="absolute bottom-3 right-3 bg-black/70 rounded px-2 py-1 text-[9px]">
                  <p className="text-gray-400 mb-0.5">AI Focus</p>
                  <div className="flex items-center gap-1">
                    <span className="text-blue-400">Normal</span>
                    <div className="w-12 h-1.5 rounded-full bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500" />
                    <span className="text-red-400">Critical</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interpretation guidance */}
        <div
          className="border border-l-4 border-l-[#2DD4A0] rounded-xl p-6 flex flex-col lg:flex-row lg:items-center gap-6"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Info className="text-[#2DD4A0]" size={18} />
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Interpretation Guidance</h3>
            </div>
            <p className="text-sm italic leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{interpretation}</p>
          </div>
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center gap-2 bg-[#2DD4A0] text-[#0A1628] px-6 py-3.5 rounded-lg font-bold text-sm hover:bg-[#25b88a] transition-colors shrink-0"
          >
            <RefreshCw size={16} />
            Analyse Another Image
          </Link>
        </div>
      </div>

      <Footer variant="compact" />
    </div>
  );
}
