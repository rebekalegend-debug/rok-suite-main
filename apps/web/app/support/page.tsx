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
<div className="flex justify-center items-center min-h-[70vh] px-3">

<div className="w-full bg-transparent max-w-[420px] rounded-2xl overflow-hidden border border-pink-500/30 shadow-[0_0_40px_rgba(236,72,153,0.25)] flex justify-center">
    
    <div className="overflow-hidden">
      
      <iframe
        src="https://ko-fi.com/littlequeen/?hidefeed=true&widget=true&embed=true&preview=true"
        className="border-0"
        style={{
          width: '426px',         
          height: '575px',         
          marginLeft: '-13px',    
          marginRight: '-13px',   
        }}
        scrolling="no"
        title="littlequeen"
      />

   
 </div>
  </div>

</div>
        
      </div>
    </AppSidebar>
  );
}
