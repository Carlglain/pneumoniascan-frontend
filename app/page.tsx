import Link from 'next/link';
import Image from 'next/image';
import { Check, ArrowRight, FileUp, Bot, CircleCheck, Shield } from 'lucide-react';
import Footer from '@/components/Footer';

const workflowSteps = [
  {
    step: '01',
    icon: FileUp,
    title: 'Upload X-Ray',
    desc: 'Upload a JPEG or PNG chest radiograph (max 10MB) via drag-and-drop or file browse.',
  },
  {
    step: '02',
    icon: Bot,
    title: 'AI Analysis',
    desc: 'Choose EfficientNet-B0 or ResNet50 to classify the image as Normal or Pneumonia.',
  },
  {
    step: '03',
    icon: CircleCheck,
    title: 'View Results',
    desc: 'Review the diagnosis, confidence score, and Grad-CAM heatmap. Processing takes ~15–25 seconds on CPU.',
  },
];

const trustFeatures = [
  'Binary classification (Normal or Pneumonia) with a reported confidence score.',
  'Grad-CAM heatmaps highlight the image regions that influenced the model prediction.',
  'Two CNN architectures available: EfficientNet-B0 (faster) and ResNet50 (deeper).',
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#2DD4A0]/10 border border-[#2DD4A0]/30 rounded-full px-4 py-1.5 mb-6">
              <Check className="text-[#2DD4A0]" size={14} />
              <span className="text-[#2DD4A0] text-[11px] font-bold uppercase tracking-wider">
                AI-Powered Chest X-Ray Analysis
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.1] mb-6 tracking-tight">
              AI-Powered{' '}
              <span className="text-[#2DD4A0]">Pneumonia Detection</span>
              <br />
              from Chest X-Rays
            </h1>

            <p className="text-base lg:text-lg leading-relaxed mb-8 max-w-lg" style={{ color: 'var(--text-secondary)' }}>
              A decision-support tool for screening chest X-rays using deep learning.
              Upload an image, select a model, and review the classification with Grad-CAM explainability.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 bg-[#2DD4A0] text-[#0A1628] px-6 py-3.5 rounded-lg font-bold text-sm hover:bg-[#25b88a] transition-all"
              >
                Start Analysis
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 border px-6 py-3.5 rounded-lg font-bold text-sm transition-all hover:bg-[var(--bg-overlay)]"
                style={{ borderColor: 'var(--border-strong)', color: 'var(--text-primary)' }}
              >
                Learn More
              </Link>
            </div>

            <div className="flex gap-10">
              <div>
                <p className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>98.4%</p>
                <p className="text-[11px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>Sensitivity</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>15–25s</p>
                <p className="text-[11px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>Processing (CPU)</p>
              </div>
            </div>
          </div>

          {/* Hero visual — always dark since it depicts an X-ray monitor */}
          <div className="relative">
            <div
              className="rounded-2xl overflow-hidden border shadow-2xl shadow-black/50 aspect-[4/3] relative"
              style={{ backgroundColor: '#131C2E', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-90"
                style={{ backgroundImage: `linear-gradient(135deg, #1a2744 0%, #0d1525 50%, #1a2744 100%)` }}
              />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="w-full max-w-sm aspect-square rounded-lg border border-white/10 flex items-center justify-center overflow-hidden relative" style={{ backgroundColor: '#0a0f1a' }}>
                  <svg viewBox="0 0 200 200" className="w-full h-full opacity-60" fill="none">
                    <ellipse cx="70" cy="100" rx="45" ry="55" stroke="#4a9eff" strokeWidth="1" opacity="0.4" />
                    <ellipse cx="130" cy="100" rx="45" ry="55" stroke="#4a9eff" strokeWidth="1" opacity="0.4" />
                    <path d="M100 40 L100 160" stroke="#4a9eff" strokeWidth="1" opacity="0.3" />
                    <circle cx="85" cy="110" r="12" fill="#2DD4A0" opacity="0.6" />
                    <circle cx="85" cy="110" r="6" fill="#2DD4A0" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 backdrop-blur-sm border-t border-white/10 p-4" style={{ backgroundColor: 'rgba(10,15,26,0.90)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#2DD4A0] text-xs font-bold">AI Confidence: 87%</p>
                    <p className="text-gray-500 text-[10px]">Probability Pattern Found</p>
                  </div>
                  <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full w-[87%] bg-[#2DD4A0] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3" style={{ color: 'var(--text-primary)' }}>Streamlined Diagnostic Workflow</h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Three simple steps from image upload to actionable clinical insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workflowSteps.map((item) => (
            <div
              key={item.step}
              className="border rounded-xl p-6 hover:border-[#2DD4A0]/30 transition-colors"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="bg-[#2DD4A0]/10 p-3 rounded-lg border border-[#2DD4A0]/20">
                  <item.icon className="text-[#2DD4A0]" size={22} />
                </div>
                <span className="text-xs font-bold tracking-widest" style={{ color: 'var(--text-faint)' }}>STEP {item.step}</span>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-4">
            {['/image.png', '/image copy.png', '/image copy 2.png'].map((src, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl border overflow-hidden relative" style={{ borderColor: 'var(--border-subtle)' }}>
                <Image src={src} alt="Clinical imaging" fill className="object-cover" />
              </div>
            ))}
            <div
              className="aspect-[4/3] rounded-xl border border-[#2DD4A0]/30 p-5 flex flex-col justify-center"
              style={{ backgroundColor: 'var(--bg-surface)' }}
            >
              <Shield className="text-[#2DD4A0] mb-3" size={28} />
              <p className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>Clinical Disclaimer</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                This tool is a diagnostic support aid only and does not replace the judgement of a qualified radiologist or physician.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 leading-tight" style={{ color: 'var(--text-primary)' }}>
              Explainable AI for
              <br />
              Chest X-Ray Screening
            </h2>
            <ul className="space-y-4 mb-8">
              {trustFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="text-[#2DD4A0] shrink-0 mt-0.5" size={18} />
                  <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/analyze"
              className="inline-block bg-[#5B9FD4] hover:bg-[#4a8fc4] text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors"
            >
              Start Analysis
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
