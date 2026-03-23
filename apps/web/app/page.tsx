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
  Target, 
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');

const tools = [

  // 🟥 WANTED
  {
    href: '/kingdom/wanted',
    titleKey: 'tools.wanted.title',
    descriptionKey: 'tools.wanted.description',
    icon: Crosshair,

    iconColor: 'text-red-500',
    iconGlow: 'drop-shadow-[0_0_6px_rgba(239,68,68,0.45)]',

    hoverBorder: 'hover:border-red-500/40',
    hoverShadow: 'hover:shadow-red-500/10',
    iconHoverBg: 'group-hover:bg-red-500/15',
    iconHoverColor: 'group-hover:text-red-600',
  },

  // 🟠 VIOLATION
  {
    href: '/kingdom/violations',
    titleKey: 'tools.violation.title',
    descriptionKey: 'tools.violation.description',
    icon: Target, // or your icon

    iconColor: 'text-orange-500',
    iconGlow: 'drop-shadow-[0_0_6px_rgba(249,115,22,0.45)]',

    hoverBorder: 'hover:border-orange-500/40',
    hoverShadow: 'hover:shadow-orange-500/10',
    iconHoverBg: 'group-hover:bg-orange-500/15',
    iconHoverColor: 'group-hover:text-orange-600',
  },

  // 📅 CALENDAR
  {
    href: '/calendar',
    titleKey: 'tools.calendar.title',
    descriptionKey: 'tools.calendar.description',
    icon: Calendar,

    iconColor: 'text-rose-500',
    iconGlow: 'drop-shadow-[0_0_6px_rgba(244,63,94,0.45)]',

    hoverBorder: 'hover:border-rose-500/40',
    hoverShadow: 'hover:shadow-rose-500/10',
    iconHoverBg: 'group-hover:bg-rose-500/15',
    iconHoverColor: 'group-hover:text-rose-600',
  },

  // 🛡️ MGE
  {
    href: '/mge',
    titleKey: 'tools.mge.title',
    descriptionKey: 'tools.mge.description',
    icon: Shield,

    iconColor: 'text-amber-500',
    iconGlow: 'drop-shadow-[0_0_6px_rgba(251,191,36,0.45)]',

    hoverBorder: 'hover:border-amber-500/40',
    hoverShadow: 'hover:shadow-amber-500/10',
    iconHoverBg: 'group-hover:bg-amber-500/15',
    iconHoverColor: 'group-hover:text-amber-500',
  },

  // 🟢 MIGRATION
  {
    href: '/kingdom-stats',
    titleKey: 'tools.migrationTracker.title',
    descriptionKey: 'tools.migrationTracker.description',
    icon: Radar,

    iconColor: 'text-green-500',
    iconGlow: 'drop-shadow-[0_0_6px_rgba(34,197,94,0.45)]',

    hoverBorder: 'hover:border-green-500/40',
    hoverShadow: 'hover:shadow-green-500/10',
    iconHoverBg: 'group-hover:bg-green-500/15',
    iconHoverColor: 'group-hover:text-green-600',
  },

  // 📜 MAIL
  {
    href: '/rok-mail',
    titleKey: 'tools.rokMail.title',
    descriptionKey: 'tools.rokMail.description',
    icon: ScrollText,

    iconColor: 'text-pink-500',
    iconGlow: 'drop-shadow-[0_0_6px_rgba(236,72,153,0.45)]',

    hoverBorder: 'hover:border-pink-500/40',
    hoverShadow: 'hover:shadow-pink-500/10',
    iconHoverBg: 'group-hover:bg-pink-500/15',
    iconHoverColor: 'group-hover:text-pink-600',
  },

  // 🟣 MGE RANKLIST
  {
    href: '/mge/ranklist',
    titleKey: 'tools.mgeranklist.title',
    descriptionKey: 'tools.mgeranklist.description',
    icon: Trophy,

    iconColor: 'text-violet-500',
    iconGlow: 'drop-shadow-[0_0_6px_rgba(139,92,246,0.45)]',

    hoverBorder: 'hover:border-violet-500/40',
    hoverShadow: 'hover:shadow-violet-500/10',
    iconHoverBg: 'group-hover:bg-violet-500/15',
    iconHoverColor: 'group-hover:text-violet-500',
  },

  // 🟡 KvK STATS
  {
    href: 'https://app.rokstats.online/kvk/ranking',
    titleKey: 'tools.events.title',
    descriptionKey: 'tools.events.description',
    icon: Trophy,

    iconColor: 'text-amber-500',
    iconGlow: 'drop-shadow-[0_0_6px_rgba(251,191,36,0.45)]',

    hoverBorder: 'hover:border-amber-500/40',
    hoverShadow: 'hover:shadow-amber-500/10',
    iconHoverBg: 'group-hover:bg-amber-500/15',
    iconHoverColor: 'group-hover:text-amber-600',
  },

   // cofee
{
  href: '/support',
  titleKey: 'tools.coffee.title',
  descriptionKey: 'tools.coffee.description',
  icon: Crown, // 👑 VIP feel

  iconColor: 'text-pink-400',
  iconGlow: 'drop-shadow-[0_0_10px_rgba(236,72,153,0.7)]',

  hoverBorder: 'hover:border-pink-400/60',
  hoverShadow: 'hover:shadow-pink-500/20',
  iconHoverBg: 'group-hover:bg-pink-500/20',
  iconHoverColor: 'group-hover:text-pink-300',
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
  const isCoffee = tool.href.includes('ko-fi.com'); 
                return (
                  <Link key={tool.href} href={tool.href}>
                   <div
  className={`group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer h-full
  bg-[var(--background-card)] border-[var(--border)] shadow-[var(--card-shadow)]
  ${tool.hoverBorder}
  hover:bg-[var(--background-hover)] hover:-translate-y-0.5 hover:shadow-[var(--card-shadow-hover)]
  ${tool.hoverShadow}

  ${isCoffee ? `
    border-pink-500/40
 shadow-[0_0_20px_rgba(236,72,153,0.2)]
hover:shadow-[0_0_35px_rgba(236,72,153,0.35)]
    overflow-hidden
  ` : ''}

  ${isCoffee ? "hover:scale-[1.03] animate-[pulse_3s_infinite]" : ""}
`}
>
                   
{isCoffee && (
  <>
    {/* glow */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-pink-400/10" />
    </div>

   

    {/* sparkles */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-2 right-3 w-1 h-1 bg-pink-400 rounded-full animate-ping" />
      <div className="absolute bottom-3 left-4 w-1 h-1 bg-pink-300 rounded-full animate-ping delay-300" />
    </div>
  </>
)}
                    
<div className="flex items-start gap-3">
<div className={`
p-2 rounded-lg
bg-[var(--background-secondary)]
${tool.iconHoverBg}
group-hover:scale-110
transition-all duration-200
flex-shrink-0

${isCoffee ? "bg-pink-500/10" : ""}
`}>
                          <Icon
  className={`
    w-5 h-5
    ${tool.iconColor}
    ${tool.iconGlow}
    ${tool.iconHoverColor}
    transition-all duration-200
  `}
/>
                        </div>

                        <div className="flex-1 min-w-0">
                         <h3 className={`text-sm font-semibold mb-0.5 transition-all duration-200
${isCoffee ? "text-pink-300 tracking-wide" : "text-[var(--foreground)]"}
`}>
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
