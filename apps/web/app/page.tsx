'use client';

import Link from 'next/link';
import { AppSidebar } from '@/components/AppSidebar';
import {
  Swords,
  BookOpen,
  Github,
  ExternalLink,
  Calendar,
  FlaskConical,
  Users,
  Trophy,
  Crown,
  ScrollText,
  Shield,
  Radar,
  ArrowUpDown,
  Crosshair,
  Map,
  BarChart3,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');

  const tools = [
    {
      href: '/calendar',
      titleKey: 'tools.calendar.title',
      descriptionKey: 'tools.calendar.description',
      icon: Calendar,
      hoverBorder: 'hover:border-rose-500/40',
      hoverShadow: 'hover:shadow-rose-500/10',
      iconHoverBg: 'group-hover:bg-rose-500/15',
      iconHoverColor: 'group-hover:text-rose-500',
    },
  {
      href: '/events',
      titleKey: 'tools.events.title',
      descriptionKey: 'tools.events.description',
      icon: Trophy,
      hoverBorder: 'hover:border-amber-500/40',
      hoverShadow: 'hover:shadow-amber-500/10',
      iconHoverBg: 'group-hover:bg-amber-500/15',
      iconHoverColor: 'group-hover:text-amber-500',
    },

   
    {
      href: '/rok-mail',
      titleKey: 'tools.rokMail.title',
      descriptionKey: 'tools.rokMail.description',
      icon: ScrollText,
      hoverBorder: 'hover:border-pink-500/40',
      hoverShadow: 'hover:shadow-pink-500/10',
      iconHoverBg: 'group-hover:bg-pink-500/15',
      iconHoverColor: 'group-hover:text-pink-500',
    },
    {
      href: '/mge',
      titleKey: 'tools.mge.title',
      descriptionKey: 'tools.mge.description',
      icon: Shield,
      hoverBorder: 'hover:border-amber-500/40',
      hoverShadow: 'hover:shadow-amber-500/10',
      iconHoverBg: 'group-hover:bg-amber-500/15',
      iconHoverColor: 'group-hover:text-amber-500',
    },
    {
      href: '/kingdom/migration-tracker',
      titleKey: 'tools.migrationTracker.title',
      descriptionKey: 'tools.migrationTracker.description',
      icon: Radar,
      hoverBorder: 'hover:border-teal-500/40',
      hoverShadow: 'hover:shadow-teal-500/10',
      iconHoverBg: 'group-hover:bg-teal-500/15',
      iconHoverColor: 'group-hover:text-teal-500',
    },
   
    {
      href: '/kingdom/wanted',
      titleKey: 'tools.wanted.title',
      descriptionKey: 'tools.wanted.description',
      icon: Crosshair,
      hoverBorder: 'hover:border-red-500/40',
      hoverShadow: 'hover:shadow-red-500/10',
      iconHoverBg: 'group-hover:bg-red-500/15',
      iconHoverColor: 'group-hover:text-red-500',
    },
    {
      href: '/kvk-map',
      titleKey: 'tools.kvkMap.title',
      descriptionKey: 'tools.kvkMap.description',
      icon: Map,
      hoverBorder: 'hover:border-orange-500/40',
      hoverShadow: 'hover:shadow-orange-500/10',
      iconHoverBg: 'group-hover:bg-orange-500/15',
      iconHoverColor: 'group-hover:text-orange-500',
    },
    {
      href: '/kingdom/kingdom-stats',
      titleKey: 'tools.kingdomStats.title',
      descriptionKey: 'tools.kingdomStats.description',
      icon: BarChart3,
      hoverBorder: 'hover:border-green-500/40',
      hoverShadow: 'hover:shadow-green-500/10',
      iconHoverBg: 'group-hover:bg-green-500/15',
      iconHoverColor: 'group-hover:text-green-500',
    },
  ] as const;

  return (
    <AppSidebar>
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-20">
          {/* Hero */}
          <section className="mb-16">
            <p className="text-sm font-medium text-[var(--text-muted)] mb-3 tracking-wide uppercase">
              {t('tagline')}
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-[var(--foreground)] mb-5 tracking-tight leading-tight">
              {t('title')}
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              {t('subtitle')}
            </p>
          </section>

          {/* Tools */}
          <section className="mb-14">
            <h2 className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)] mb-5">
              {t('sections.interactiveTools')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.href} href={tool.href}>
                    <div className={`group p-4 rounded-xl bg-[var(--background-card)] border border-[var(--border)] shadow-[var(--card-shadow)] ${tool.hoverBorder} hover:bg-[var(--background-hover)] hover:-translate-y-0.5 hover:shadow-[var(--card-shadow-hover)] ${tool.hoverShadow} transition-all duration-200 cursor-pointer h-full`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-[var(--background-secondary)] ${tool.iconHoverBg} transition-colors duration-200 flex-shrink-0`}>
                          <Icon className={`w-4 h-4 text-[var(--text-muted)] ${tool.iconHoverColor} transition-colors duration-200`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-[var(--foreground)] mb-0.5 transition-colors duration-200">
                            {t(tool.titleKey)}
                          </h3>
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            {t(tool.descriptionKey)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

       

          {/* Footer */}
          <footer className="pt-8 border-t border-[var(--border)]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--text-muted)]">
                {t('footer.copyright')}
              </p>
              
              
            </div>
          </footer>
        </div>
      </div>
    </AppSidebar>
  );
}
