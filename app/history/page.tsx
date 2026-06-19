'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Eye, Download, Search, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle, X, Upload, Activity,
  TrendingUp, SlidersHorizontal, Trash2,
} from 'lucide-react';
import Footer from '@/components/Footer';
import { api, ScanSummary, ScanDetail, HistoryStats } from '@/lib/api';

// ── helpers ───────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function ConfidenceBar({ value, isPneumonia }: { value: number; isPneumonia: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold w-14 shrink-0" style={{ color: 'var(--text-primary)' }}>
        {value.toFixed(1)}%
      </span>
      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: 'var(--border-subtle)' }}>
        <div
          className={`h-full rounded-full transition-all ${isPneumonia ? 'bg-red-500' : 'bg-[#2DD4A0]'}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────
function StatCard({
  label, value, sub, accent,
}: { label: string; value: string | number; sub: string; accent?: string }) {
  return (
    <div className="border rounded-xl p-5" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-3xl font-extrabold mb-1" style={{ color: accent ?? 'var(--text-primary)' }}>{value}</p>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</p>
    </div>
  );
}

// ── Scan Detail Modal ─────────────────────────────────────
function ScanModal({ scan, onClose }: { scan: ScanDetail; onClose: () => void }) {
  const [opacity, setOpacity] = useState(70);
  const [sideBySide, setSideBySide] = useState(false);
  const isPneumonia = scan.diagnosis.toLowerCase().includes('pneumonia');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const downloadHeatmap = () => {
    if (!scan.heatmap) return;
    const a = document.createElement('a');
    a.href = `data:image/png;base64,${scan.heatmap}`;
    a.download = `${scan.patient_id}_heatmap.png`;
    a.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Modal header */}
        <div className="flex items-start justify-between p-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Patient: {scan.patient_id}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{fmtDate(scan.created_at)} UTC</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-overlay)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Diagnosis banner */}
        <div className="px-6 pt-4">
          {isPneumonia ? (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <AlertTriangle className="text-red-400 shrink-0" size={16} />
              <span className="text-red-400 text-sm font-semibold">Pneumonia Detected</span>
              <span className="ml-auto text-red-400/70 text-xs">{scan.confidence.toFixed(2)}% confidence</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-[#2DD4A0]/10 border border-[#2DD4A0]/30 rounded-lg px-4 py-3">
              <CheckCircle className="text-[#2DD4A0] shrink-0" size={16} />
              <span className="text-[#2DD4A0] text-sm font-semibold">No Pneumonia Detected</span>
              <span className="ml-auto text-[#2DD4A0]/70 text-xs">{scan.confidence.toFixed(2)}% confidence</span>
            </div>
          )}
        </div>

        {/* Image viewer */}
        <div className="p-6">
          {/* Controls */}
          <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Original Chest X-Ray
            </span>
            <div className="flex items-center gap-4">
              {!sideBySide && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Overlay Opacity</span>
                  <input
                    type="range" min={10} max={100} value={opacity}
                    onChange={e => setOpacity(Number(e.target.value))}
                    className="w-20 accent-[#2DD4A0]"
                  />
                  <span className="text-[10px] w-6" style={{ color: 'var(--text-muted)' }}>{opacity}%</span>
                </div>
              )}
              <button
                onClick={() => setSideBySide(p => !p)}
                className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-colors"
                style={{
                  borderColor: sideBySide ? '#2DD4A0' : 'var(--border-subtle)',
                  color:       sideBySide ? '#2DD4A0' : 'var(--text-muted)',
                  backgroundColor: sideBySide ? 'rgba(45,212,160,0.05)' : 'transparent',
                }}
              >
                Side-by-Side
              </button>
            </div>
          </div>

          <div className={`grid gap-4 ${sideBySide ? 'grid-cols-2' : 'grid-cols-2'}`}>
            {/* Original */}
            <div className="bg-[#080E16] rounded-xl overflow-hidden aspect-square flex items-center justify-center border border-white/5 p-3">
              {scan.image_data ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`data:image/jpeg;base64,${scan.image_data}`}
                  alt="Original X-ray"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-gray-600 text-xs">No image stored</span>
              )}
            </div>

            {/* Heatmap */}
            <div className="bg-[#080E16] rounded-xl overflow-hidden aspect-square flex items-center justify-center border border-white/5 p-3 relative">
              {scan.heatmap ? (
                <>
                  {sideBySide ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`data:image/png;base64,${scan.heatmap}`}
                      alt="Grad-CAM heatmap"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="relative max-h-full max-w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {scan.image_data && (
                        <img
                          src={`data:image/jpeg;base64,${scan.image_data}`}
                          alt="Base X-ray"
                          className="max-h-56 max-w-full object-contain"
                        />
                      )}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`data:image/png;base64,${scan.heatmap}`}
                        alt="Grad-CAM overlay"
                        className="absolute inset-0 max-h-56 max-w-full object-contain w-full h-full"
                        style={{ opacity: opacity / 100 }}
                      />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-[#2DD4A0] text-[#0A1628] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Heatmap
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 rounded px-2 py-1 text-[9px]">
                    <div className="flex items-center gap-1">
                      <span className="text-blue-400">Normal</span>
                      <div className="w-10 h-1 rounded-full bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500" />
                      <span className="text-red-400">Critical</span>
                    </div>
                  </div>
                </>
              ) : (
                <span className="text-gray-600 text-xs">No heatmap available</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Model: {scan.model_used} &nbsp;·&nbsp; Processing: {scan.processing_time}s
          </div>
          <div className="flex items-center gap-2">
            {scan.heatmap && (
              <button
                onClick={downloadHeatmap}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold transition-colors"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
              >
                <Download size={13} /> Download Heatmap
              </button>
            )}
            <Link
              href="/results"
              onClick={() => {
                localStorage.setItem('pneumoscan_result', JSON.stringify({
                  patient_id:      scan.patient_id,
                  diagnosis:       scan.diagnosis,
                  confidence:      scan.confidence,
                  model_used:      scan.model_used,
                  raw_probability: scan.raw_probability,
                  heatmap:         scan.heatmap,
                  processing_time: scan.processing_time,
                }));
                if (scan.image_data) {
                  localStorage.setItem('pneumoscan_image', `data:image/jpeg;base64,${scan.image_data}`);
                }
              }}
              className="flex items-center gap-2 bg-[#2DD4A0] text-[#0A1628] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#25b88a] transition-colors"
            >
              <Activity size={13} /> Full Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────
export default function HistoryPage() {
  const [scans, setScans]         = useState<ScanSummary[]>([]);
  const [stats, setStats]         = useState<HistoryStats | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch]       = useState('');
  const [diagnosis, setDiagnosis] = useState('all');
  const [model, setModel]         = useState('all');
  const [modal, setModal]         = useState<ScanDetail | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHistory({ page, limit: 10, diagnosis, model, search });
      setScans(data.scans);
      setStats(data.stats);
      setTotalPages(data.total_pages);
      setTotalItems(data.total_items);
    } catch {
      setError('Could not load history. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [page, diagnosis, model, search]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [diagnosis, model, search]);

  const openModal = async (id: number) => {
    setModalLoading(true);
    try {
      const detail = await api.getScan(id);
      setModal(detail);
    } catch {
      /* ignore */
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await api.deleteScan(id);
    fetchHistory();
  };

  const downloadScan = async (id: number, patientId: string) => {
    try {
      const detail = await api.getScan(id);
      if (!detail.heatmap) return;
      const a = document.createElement('a');
      a.href = `data:image/png;base64,${detail.heatmap}`;
      a.download = `${patientId}_heatmap.png`;
      a.click();
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">Scan History</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Historical scan data and patient analysis records
            </p>
          </div>
          <Link
            href="/analyze"
            className="flex items-center gap-2 bg-[#2DD4A0] text-[#0A1628] px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#25b88a] transition-colors"
          >
            <Upload size={15} /> Upload Scan
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Scans"
            value={stats?.total.toLocaleString() ?? '—'}
            sub="All-time analyses"
          />
          <StatCard
            label="Pneumonia Detected"
            value={stats?.pneumonia_count.toLocaleString() ?? '—'}
            sub={stats ? `${((stats.pneumonia_count / Math.max(stats.total, 1)) * 100).toFixed(0)}% detection rate` : ''}
            accent="#f87171"
          />
          <StatCard
            label="Normal Scans"
            value={stats?.normal_count.toLocaleString() ?? '—'}
            sub="Validated by model"
            accent="#2DD4A0"
          />
          <StatCard
            label="Avg. Confidence"
            value={stats ? `${stats.avg_confidence}%` : '—'}
            sub="Global model accuracy"
            accent="#2DD4A0"
          />
        </div>

        {/* Table card */}
        <div className="border rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
          {/* Filters */}
          <div className="p-4 border-b flex flex-wrap items-center gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={14} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search Patient ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border outline-none"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div className="flex items-center gap-2 ml-auto flex-wrap">
              <SlidersHorizontal size={14} style={{ color: 'var(--text-muted)' }} />

              {/* Diagnosis filter */}
              <select
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border outline-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                <option value="all">All Diagnoses</option>
                <option value="pneumonia">Pneumonia</option>
                <option value="normal">Normal</option>
              </select>

              {/* Model filter */}
              <select
                value={model}
                onChange={e => setModel(e.target.value)}
                className="text-xs px-3 py-2 rounded-lg border outline-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                <option value="all">All Models</option>
                <option value="efficientnet">EfficientNet-B0</option>
                <option value="resnet50">ResNet50</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#2DD4A0] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <AlertTriangle className="text-red-400" size={32} />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          ) : scans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Activity size={36} style={{ color: 'var(--text-faint)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No scans found</p>
              <Link href="/analyze" className="text-[#2DD4A0] text-xs hover:underline">Upload your first scan →</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    {['Patient ID', 'Date / Time', 'Diagnosis', 'Confidence', 'Model Used', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scans.map((scan, i) => {
                    const isPneumonia = scan.diagnosis.toLowerCase().includes('pneumonia');
                    return (
                      <tr
                        key={scan.id}
                        className="border-b transition-colors"
                        style={{
                          borderColor: 'var(--border-subtle)',
                          backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--bg-overlay)',
                        }}
                      >
                        <td className="px-4 py-3 font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {scan.patient_id}
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {fmtDate(scan.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${isPneumonia ? 'text-red-400' : 'text-[#2DD4A0]'}`}>
                            {isPneumonia
                              ? <AlertTriangle size={12} />
                              : <CheckCircle size={12} />}
                            {scan.diagnosis}
                          </span>
                        </td>
                        <td className="px-4 py-3 min-w-[140px]">
                          <ConfidenceBar value={scan.confidence} isPneumonia={isPneumonia} />
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {scan.model_used}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openModal(scan.id)}
                              disabled={modalLoading}
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ color: 'var(--text-muted)' }}
                              title="View details"
                              onMouseEnter={e => (e.currentTarget.style.color = '#2DD4A0')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => downloadScan(scan.id, scan.patient_id)}
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ color: 'var(--text-muted)' }}
                              title="Download heatmap"
                              onMouseEnter={e => (e.currentTarget.style.color = '#5B9FD4')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                            >
                              <Download size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(scan.id)}
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ color: 'var(--text-muted)' }}
                              title="Delete scan"
                              onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && scans.length > 0 && (
            <div className="px-4 py-3 border-t flex items-center justify-between flex-wrap gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Showing {((page - 1) * 10) + 1}–{Math.min(page * 10, totalItems)} of {totalItems.toLocaleString()} results
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border transition-colors disabled:opacity-30"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                >
                  <ChevronLeft size={15} />
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page + i - 2;
                  if (p < 1 || p > totalPages) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="w-8 h-8 rounded-lg text-xs font-semibold border transition-colors"
                      style={{
                        borderColor:     p === page ? '#2DD4A0' : 'var(--border-subtle)',
                        backgroundColor: p === page ? 'rgba(45,212,160,0.1)' : 'transparent',
                        color:           p === page ? '#2DD4A0' : 'var(--text-secondary)',
                      }}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border transition-colors disabled:opacity-30"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer variant="compact" />

      {/* Scan detail modal */}
      {modal && <ScanModal scan={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
