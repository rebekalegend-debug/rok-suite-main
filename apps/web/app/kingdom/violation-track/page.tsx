'use client';

import { AppSidebar } from '@/components/AppSidebar';
import MigrationTracker from '@/components/kingdom/MigrationTracker';

export default function ViolationTrackPage() {
  return (
    <AppSidebar>
      <MigrationTracker />
    </AppSidebar>
  );
}
