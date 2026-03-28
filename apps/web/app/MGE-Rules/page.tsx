import { AppSidebar } from '@/components/AppSidebar';

export default function MgeRulesPage() {
  return (
    <AppSidebar>
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-3xl font-bold">MGE Rules</h1>

        <p><b>1.</b> Follow assigned ranks strictly.</p>
        <p><b>2.</b> No unauthorized pushing.</p>
        <p><b>3.</b> Violations = penalties.</p>
      </div>
    </AppSidebar>
  );
}
