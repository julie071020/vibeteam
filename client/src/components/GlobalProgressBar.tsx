// VibeTeam Global Progress Bar — Floating progress widget
// Design: Warm Pastel Studio — Lavender-to-peach gradient

import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { calcProgress } from '@/lib/mockData';
import { TrendingUp } from 'lucide-react';

interface GlobalProgressBarProps {
  roomId?: string;
}

export default function GlobalProgressBar({ roomId }: GlobalProgressBarProps) {
  const { rooms, currentUser } = useApp();

  const targetRooms = roomId
    ? rooms.filter(r => r.id === roomId)
    : rooms.filter(r => r.memberIds.includes(currentUser.id));

  if (targetRooms.length === 0) return null;

  const allSubtasks = targetRooms.flatMap(r => r.tasks.flatMap(t => t.subtasks));
  const doneSubtasks = allSubtasks.filter(s => s.status === 'done');
  const progress = allSubtasks.length > 0
    ? Math.round((doneSubtasks.length / allSubtasks.length) * 100)
    : 0;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="bg-card border border-border rounded-2xl shadow-lg p-4 w-52">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">전체 진행률</p>
              <p className="text-[10px] text-muted-foreground">
                {doneSubtasks.length}/{allSubtasks.length} 완료
              </p>
            </div>
            <span className="ml-auto text-lg font-bold text-foreground">{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, oklch(0.72 0.12 290), oklch(0.78 0.10 30))' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
