// VibeTeam Layout — Sidebar + Main Content
// Design: Warm Pastel Studio — Lavender sidebar with card-first architecture

import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, LogOut, Menu, X,
  ChevronRight, Bell, Settings, Plus,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import GlobalProgressBar from '@/components/GlobalProgressBar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const LOGO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663778000034/BYSmgaPo73UWjqKMPEQfgE/vibeteam-logo-gSiBNESHmmoW6rsqRgrCJL.webp';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { icon: <LayoutDashboard className="w-4.5 h-4.5" />, label: '대시보드', href: '/' },
  { icon: <Calendar className="w-4.5 h-4.5" />, label: '내 시간표', href: '/timetable' },
];

interface LayoutProps {
  children: React.ReactNode;
  onCreateRoom?: () => void;
}

export default function Layout({ children, onCreateRoom }: LayoutProps) {
  const [location] = useLocation();
  const { currentUser, rooms, logout, setActiveRoom } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const myRooms = rooms.filter(r => r.memberIds.includes(currentUser.id));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
        <img src={LOGO} alt="VibeTeam" className="w-8 h-8" />
        <span className="text-lg font-bold text-foreground tracking-tight">VibeTeam</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <button
                onClick={() => { setSidebarOpen(false); setActiveRoom(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                {item.icon}
                {item.label}
                {item.badge && (
                  <Badge className="ml-auto text-xs h-5 px-1.5">{item.badge}</Badge>
                )}
              </button>
            </Link>
          );
        })}

        {/* Project Rooms */}
        <div className="pt-4">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              과제 방
            </span>
            <button
              onClick={onCreateRoom}
              className="w-5 h-5 rounded-md bg-sidebar-accent hover:bg-primary hover:text-primary-foreground text-muted-foreground flex items-center justify-center transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-0.5">
            {myRooms.map(room => {
              const isActive = location === `/room/${room.id}`;
              return (
                <Link key={room.id} href={`/room/${room.id}`}>
                  <button
                    onClick={() => { setSidebarOpen(false); setActiveRoom(room.id); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-150 group ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex-shrink-0" />
                    <span className="truncate flex-1 text-left">{room.name}</span>
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0" />
                  </button>
                </Link>
              );
            })}
            {myRooms.length === 0 && (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                아직 참여한 방이 없어요.
              </p>
            )}
          </div>
        </div>
      </nav>

      {/* User profile */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-sidebar-accent transition-colors">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback
              className="text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, oklch(0.72 0.12 290), oklch(0.78 0.10 30))' }}
            >
              {currentUser.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => toast.info('알림 기능은 준비 중이에요.')}
              className="p-1.5 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-sidebar border-r border-sidebar-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 lg:hidden"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-background border-b border-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <img src={LOGO} alt="VibeTeam" className="w-6 h-6" />
            <span className="font-bold text-foreground">VibeTeam</span>
          </div>
          <Avatar className="w-7 h-7">
            <AvatarFallback
              className="text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, oklch(0.72 0.12 290), oklch(0.78 0.10 30))' }}
            >
              {currentUser.avatar}
            </AvatarFallback>
          </Avatar>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <GlobalProgressBar />
      </div>
    </div>
  );
}
