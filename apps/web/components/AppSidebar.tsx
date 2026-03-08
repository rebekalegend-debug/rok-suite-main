'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  Swords,
  BookOpen,
  FlaskConical,
  Home,
  Trophy,
  Crown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Shield,
  ScrollText,
  Radar,
  ArrowUpDown,
  Crosshair,
  Map,
  BarChart3,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
interface NavItem {
  labelKey: string;
  href: string;
  icon: React.ReactNode;
  badgeKey?: string;
  badgeColor?: string;
  hoverColor?: string;
  hoverBg?: string;
  activeColor?: string;
  activeBg?: string;
}

interface NavSection {
  titleKey?: string;
  titleColor?: string;
  items: NavItem[];
}

interface AppSidebarProps {
  children: React.ReactNode;
}

export function AppSidebar({ children }: AppSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
 const touchStartX = useRef<number | null>(null);
const touchStartY = useRef<number | null>(null);
  
  const t = useTranslations('nav');
  const t2 = useTranslations('common');

  const navSections: NavSection[] = [
    {
      // Kingdom section (no title, top level)
      items: [
       {
  labelKey: 'home',
  href: '/',
  icon: <Home size={20} className="text-red-500" />,
  hoverColor: 'group-hover:text-red-500',
  hoverBg: 'hover:bg-red-500/10',
  activeColor: 'text-white',
  activeBg: 'bg-gradient-to-r from-red-500 to-rose-500'
},
  {
  labelKey: 'calendar',
  href: '/calendar',
  icon: <Calendar size={20} className="text-orange-500" />,
  hoverColor: 'group-hover:text-orange-500',
  hoverBg: 'hover:bg-orange-500/10',
  activeColor: 'text-white',
  activeBg: 'bg-gradient-to-r from-orange-500 to-amber-500'
},
       // { labelKey: 'rosters', href: '/rosters', icon: <Users size={20} />, hoverColor: 'group-hover:text-sky-500', hoverBg: 'hover:bg-sky-500/10', activeColor: 'text-white', activeBg: 'bg-gradient-to-r from-sky-500 to-blue-500' },
       // { labelKey: 'recognition', href: '/recognition', icon: <Crown size={20} />, hoverColor: 'group-hover:text-violet-500', hoverBg: 'hover:bg-violet-500/10', activeColor: 'text-white', activeBg: 'bg-gradient-to-r from-violet-500 to-purple-500' },
       // { labelKey: 'aooPlanner', href: '/aoo-strategy', icon: <Swords size={20} />, hoverColor: 'group-hover:text-emerald-500', hoverBg: 'hover:bg-emerald-500/10', activeColor: 'text-white', activeBg: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
    
     //    { labelKey: 'mge', href: '/mge', icon: <Shield size={20} />, hoverColor: 'group-hover:text-amber-500', hoverBg: 'hover:bg-amber-500/10', activeColor: 'text-white', activeBg: 'bg-gradient-to-r from-amber-500 to-yellow-500' },
      // { labelKey: 'migrationTracker', href: '/kingdom/migration-tracker', icon: <Radar size={20} />, hoverColor: 'group-hover:text-teal-500', hoverBg: 'hover:bg-teal-500/10', activeColor: 'text-white', activeBg: 'bg-gradient-to-r from-teal-500 to-cyan-500' },
     //   { labelKey: 'wanted', href: '/kingdom/wanted', icon: <Crosshair size={20} />, hoverColor: 'group-hover:text-red-500', hoverBg: 'hover:bg-red-500/10', activeColor: 'text-white', activeBg: 'bg-gradient-to-r from-red-500 to-rose-500' },
 {
  labelKey: 'kvkMap',
  href: '/kvk-map',
  icon: <Map size={20} className="text-yellow-500" />,
  hoverColor: 'group-hover:text-yellow-500',
  hoverBg: 'hover:bg-yellow-500/10',
  activeColor: 'text-white',
  activeBg: 'bg-gradient-to-r from-yellow-500 to-amber-500'
},
{
  labelKey: 'rokMail',
  href: '/rok-mail',
  icon: <ScrollText size={20} className="text-blue-500" />,
  hoverColor: 'group-hover:text-blue-500',
  hoverBg: 'hover:bg-blue-500/10',
  activeColor: 'text-white',
  activeBg: 'bg-gradient-to-r from-blue-500 to-indigo-500'
},
        
   {
  labelKey: 'kingdomStats',
  href: '/kingdom/kingdom-stats',
  icon: <BarChart3 size={20} className="text-green-500" />,
  hoverColor: 'group-hover:text-green-500',
  hoverBg: 'hover:bg-green-500/10',
  activeColor: 'text-white',
  activeBg: 'bg-gradient-to-r from-green-500 to-emerald-500'
},
      ],
    },

{
  titleKey: 'breakers',
  titleColor: 'text-red-500',
  items: [
   
        { 
      labelKey: 'wanted',
      href: '/kingdom/wanted',
      icon: <Crosshair size={20} />,
      hoverColor: 'group-hover:text-red-500',
      hoverBg: 'hover:bg-red-500/10',
      activeColor: 'text-white',
      activeBg: 'bg-gradient-to-r from-red-500 to-rose-500'
    },
    
    {
  labelKey: 'migrationTracker',
  href: '/kingdom/migration-tracker',
  icon: <Radar size={20} className="text-orange-500" />,
  hoverColor: 'group-hover:text-orange-500',
  hoverBg: 'hover:bg-orange-500/10',
  activeColor: 'text-white',
  activeBg: 'bg-gradient-to-r from-orange-500 to-red-500'
},

  ],
},


    
    {
      titleKey: 'rokstats',
      titleColor: 'text-amber-500',
      items: [
        { labelKey: 'stats', href: 'https://app.rokstats.online/kvk/ranking', icon: <Trophy size={20} />, hoverColor: 'group-hover:text-amber-500', hoverBg: 'hover:bg-amber-500/10', activeColor: 'text-white', activeBg: 'bg-gradient-to-r from-amber-500 to-orange-500' },
  
      ],
    },
    {
      titleKey: 'resources',
      titleColor: 'text-cyan-500',
      items: [
       // { labelKey: 'guide', href: '/guide', icon: <BookOpen size={20} />, hoverColor: 'group-hover:text-cyan-500', hoverBg: 'hover:bg-cyan-500/10', activeColor: 'text-white', activeBg: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
        {
          labelKey: 'betaTools',
          href: '/beta-tools',
          icon: <FlaskConical size={20} className="text-blue-500" />,
          badgeKey: 'wipBadge',
          badgeColor: 'bg-[#ffb547]/20 text-[#ffb547]',
          hoverColor: 'group-hover:text-blue-500',
         hoverBg: 'hover:bg-blue-500/10',
  activeColor: 'text-white',
           activeBg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
        },
      ],
    },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);
useEffect(() => {
  const EDGE_SIZE = 120;
  const OPEN_THRESHOLD = 60;
  const CLOSE_THRESHOLD = 60;

  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
  };

  const onTouchMove = (e: TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const t = e.touches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = Math.abs(t.clientY - touchStartY.current);

    if (dy > 40) return;

    if (!isMobileOpen && dx > OPEN_THRESHOLD) {
      setIsMobileOpen(true);
      touchStartX.current = null;
      touchStartY.current = null;
    }

    if (isMobileOpen && dx < -CLOSE_THRESHOLD) {
      setIsMobileOpen(false);
      touchStartX.current = null;
      touchStartY.current = null;
    }
  };

  const onTouchEnd = () => {
    touchStartX.current = null;
    touchStartY.current = null;
  };

  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', onTouchEnd);

  return () => {
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
  };
}, [isMobileOpen]);
  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    // Special case: /guide/alliance should not highlight /guide
    if (href === '/guide' && pathname.startsWith('/guide/alliance')) return false;
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[var(--border)] ${isCollapsed ? 'justify-center' : ''}`}>
       <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30 flex-shrink-0">
  <Shield className="w-5 h-5 text-white" />
</div>
        {!isCollapsed && (
          <div className="min-w-0">
   <h1 className="text-lg font-semibold text-white/95 truncate">
  {t('siteTitle')}
</h1>
  <div className="text-[10px] text-pink-300/70 leading-tight flex flex-col">
  <span>{t('siteSubtitle1')}</span>
  <span>{t('siteSubtitle2')}</span>
</div>
  </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={sectionIndex > 0 ? 'mt-4' : ''}>
            {/* Section title */}
            {section.titleKey && !isCollapsed && (
              <div className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-wider ${section.titleColor || 'text-[var(--text-muted)]'}`}>
                {t(section.titleKey)}
              </div>
            )}
            {section.titleKey && isCollapsed && (
              <div className="h-px mx-3 my-2 bg-[var(--border)]" />
            )}

            {/* Section items */}
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                      active
                        ? `${item.activeBg || 'bg-[#4318ff]'} ${item.activeColor || 'text-white'} shadow-lg`
                        : `text-[var(--text-secondary)] ${item.hoverBg || 'hover:bg-[var(--background-secondary)]'}`
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? t(item.labelKey) : undefined}
                  >
                    <span className={`flex-shrink-0 ${active ? (item.activeColor || 'text-white') : `${item.hoverColor?.replace('group-hover:', '') || 'text-pink-400'} opacity-80 group-hover:opacity-100`}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <>
                        <span className={`flex-1 truncate ${!active && item.hoverColor ? item.hoverColor : ''}`}>{t(item.labelKey)}</span>
                        {item.badgeKey && (
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${item.badgeColor}`}>
                            {t(item.badgeKey)}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className={`px-3 py-4 border-t border-[var(--border)] space-y-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
       
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <span className="text-xs text-[var(--text-muted)]">{t2('theme')}</span>
          )}
          <ThemeToggle />
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Desktop Sidebar */}
      <aside
      className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-gradient-to-b from-[#ffe4ef] via-[#fff3f8] to-[#fff1dc] border-r border-pink-200/40 transition-all duration-300 z-40 ${
          isCollapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        <SidebarContent />

        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[var(--background-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)]/20 transition-colors shadow-sm"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[var(--background-card)] border-b border-[var(--border)] flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
           <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30 flex-shrink-0">
  <Shield className="w-5 h-5 text-white" />
</div>
            <span className="text-sm font-semibold text-[var(--foreground)]">{t('siteTitle')}</span>
          </div>
        </div>
       <div className="flex items-center gap-1">
  <ThemeToggle />
</div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
    className={`lg:hidden fixed left-0 top-0 h-screen w-64
bg-[var(--background-secondary)]
border-r border-pink-300/40 dark:border-purple-500/20
shadow-[inset_-1px_0_0_rgba(244,114,182,0.2)]
z-50 transform transition-transform duration-300 flex flex-col ${
  isMobileOpen ? 'translate-x-0' : '-translate-x-full'
}`}
      >
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)] transition-colors"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
        } pt-14 lg:pt-0`}
      >
        {children}
      </main>
    </div>
  );
}
