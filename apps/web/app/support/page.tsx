'use client';

import { AppSidebar } from '@/components/AppSidebar';

export default function SupportPage() {
  return (
    <AppSidebar>
      <div className="min-h-screen px-6 py-12">
        
        {/* Title */}
        <div className="max-w-4xl mx-auto mb-8 text-center">
        
          <p className="text-[var(--text-secondary)]">
            Keep the tools alive — every coffee helps 💗
          </p>
        </div>

        {/* Ko-fi iframe */}
<div className="flex justify-center items-center min-h-[70vh] px-3">


    
    <div className="rounded-2xl overflow-hidden">
      
  <iframe
  src="https://ko-fi.com/littlequeen/?hidefeed=true&widget=true&embed=true&preview=true"
  className="border-0 w-full max-w-[426px] md:max-w-[426px] md:-ml-[13px] md:-mr-[13px]"
  style={{
    height: '575px',
  }}
  scrolling="no"
  title="littlequeen"
/>

   

  </div>

</div>
        
      </div>
    </AppSidebar>
  );
}
