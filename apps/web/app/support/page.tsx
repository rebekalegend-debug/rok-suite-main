'use client';

import { AppSidebar } from '@/components/AppSidebar';

export default function SupportPage() {
  return (
    <AppSidebar>
      <div className="min-h-screen px-6 py-12">
        
        {/* Title */}
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-pink-400 mb-2">
            Support the Queen 👑
          </h1>
          <p className="text-[var(--text-secondary)]">
            Keep the tools alive — every coffee helps 💗
          </p>
        </div>

        {/* Ko-fi iframe */}
        <div className="max-w-4xl mx-auto rounded-xl overflow-hidden border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
          
          <iframe
            id="kofiframe"
            src="https://ko-fi.com/littlequeen/?hidefeed=true&widget=true&embed=true&preview=true"
            style={{
              border: 'none',
              width: '100%',
              padding: '4px',
              background: '#0f0f0f'
            }}
            height="712"
            title="littlequeen"
          />

        </div>

      </div>
    </AppSidebar>
  );
}
