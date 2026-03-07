'use client';

import Link from 'next/link';
import {
  Sun,
  Calculator,
  Scan,
  ArrowRight,
  FlaskConical,
} from 'lucide-react';
import { AppSidebar } from '@/components/AppSidebar';

export default function BetaToolsPage() {
  return (
    <AppSidebar>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* Header */}
          <header className="flex items-center gap-3 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[var(--border)]">
            <div className="p-2.5 rounded-lg bg-orange-500/15">
              <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold">Beta Tools</h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Experimental features
              </p>
            </div>
          </header>

          {/* Tools Grid */}
          <section>
            <div className="grid gap-4">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.href} href={tool.href}>
                    <div className="group relative p-5 rounded-xl bg-[var(--background-card)] border border-[var(--border)] shadow-[var(--card-shadow)] hover:bg-[var(--background-hover)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden">
                      <div className="relative flex items-center gap-5">

                        <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.gradient}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-semibold">
                            {tool.title}
                          </h4>
                          <p className="text-sm text-[var(--text-secondary)]">
                            {tool.description}
                          </p>
                        </div>

                        <ArrowRight className="w-5 h-5 text-[var(--text-muted)]" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

        </div>
      </div>
    </AppSidebar>
  );
}
