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
  <div className="w-full max-w-[420px] overflow-hidden rounded-2xl flex justify-center">
      
<iframe
  src="https://ko-fi.com/littlequeen/?hidefeed=true&widget=true&embed=true&preview=true"
  className="border-0 w-full max-w-[426px] md:w-[440px]"
  style={{
    height: '575px',
    marginLeft: 'auto',
    marginRight: 'auto',
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
