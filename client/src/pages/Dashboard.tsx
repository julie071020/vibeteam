// VibeTeam Dashboard — Main Page (Polished)
// Design: Warm Pastel Studio — Card grid with gradient stripes, stagger animations

import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Copy, Check, Users, Calendar,
  TrendingUp, BookOpen, ArrowRight, Hash,
  Zap, Clock, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { getDaysUntilDeadline, calcProgress } from '@/lib/mockData';
import { toast } from 'sonner';

const EMPTY_STATE_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663778000034/BYSmgaPo73UWjqKMPEQfgE/vibeteam-empty-state-BCrRFnHmor4m54dJB4DVdR.png';

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { currentUser, rooms, members, createRoom, joinRoom, setActiveRoom, getRoomProgress } = useApp();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const myRooms = rooms.filter(r => r.memberIds.includes(currentUser.id));

  const handleJoinRoom = () => {
    if (!joinCode.trim()) {
      toast.error('초대 코드를 입력해 주세요.');
      return;
    }
    const room = joinRoom(joinCode.trim());
    if (!room) {
      toast.error('유효하지 않은 초대 코드예요. 다시 확인해 주세요.');
      return;
    }
    toast.success(`"${room.name}"에 참여했어요! 🎉`);
    setShowJoinModal(false);
    setJoinCode('');
    setActiveRoom(room.id);
    navigate(`/room/${room.id}`);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('초대 코드가 복사되었어요!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const totalSubtasks = myRooms.reduce((acc, r) => acc + r.tasks.flatMap(t => t.subtasks).length, 0);
  const doneSubtasks = myRooms.reduce((acc, r) =>
    acc + r.tasks.flatMap(t => t.subtasks).filter(s => s.status === 'done').length, 0
  );
  const urgentRooms = myRooms.filter(r => {
    const d = getDaysUntilDeadline(r.deadline);
    return d <= 7 && d >= 0;
  });

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? '좋은 아침이에요' : greetingHour < 18 ? '안녕하세요' : '수고하셨어요';

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-0.5">{greeting},</p>
            <h1 className="text-2xl font-bold text-foreground">
              {currentUser.name} 님 👋
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {myRooms.length > 0
                ? `현재 ${myRooms.length}개의 과제 방에 참여 중이에요.`
                : '새 과제 방을 만들거나 초대 코드로 참여해 보세요.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowJoinModal(true)}
              className="btn-press font-semibold"
            >
              <Hash className="w-4 h-4 mr-1.5" />
              코드로 참여
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: <BookOpen className="w-5 h-5" />,
            label: '참여 중인 방',
            value: myRooms.length,
            gradient: 'from-violet-500 to-purple-600',
            bg: 'bg-violet-50',
            iconColor: 'text-violet-600',
            delay: 0,
          },
          {
            icon: <TrendingUp className="w-5 h-5" />,
            label: '전체 진행률',
            value: totalSubtasks > 0 ? `${Math.round((doneSubtasks / totalSubtasks) * 100)}%` : '0%',
            gradient: 'from-emerald-500 to-teal-600',
            bg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            delay: 0.05,
          },
          {
            icon: <Zap className="w-5 h-5" />,
            label: '마감 임박',
            value: urgentRooms.length,
            gradient: 'from-orange-500 to-rose-500',
            bg: 'bg-orange-50',
            iconColor: 'text-orange-600',
            delay: 0.1,
          },
          {
            icon: <Check className="w-5 h-5" />,
            label: '완료한 태스크',
            value: doneSubtasks,
            gradient: 'from-blue-500 to-indigo-600',
            bg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            delay: 0.15,
          },
        ].map(stat => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: stat.delay, ease: [0.23, 1, 0.32, 1] }}
            className="bg-card rounded-2xl p-5 shadow-sm border border-border card-hover"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <span className={stat.iconColor}>{stat.icon}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Urgent Rooms Alert */}
      <AnimatePresence>
        {urgentRooms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-orange-800">마감 임박 과제가 있어요!</p>
                <p className="text-xs text-orange-600 mt-0.5">
                  {urgentRooms.map(r => r.name).join(', ')} — 빠르게 확인해 보세요.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveRoom(urgentRooms[0].id);
                  navigate(`/room/${urgentRooms[0].id}`);
                }}
                className="text-xs font-semibold text-orange-700 hover:text-orange-900 flex items-center gap-1 flex-shrink-0"
              >
                바로가기 <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Rooms Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">내 과제 방</h2>
          <span className="text-xs text-muted-foreground">{myRooms.length}개</span>
        </div>

        {myRooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <img
              src={EMPTY_STATE_IMG}
              alt="Empty state"
              className="w-48 h-48 object-contain mb-4 opacity-80"
            />
            <h3 className="text-base font-semibold text-foreground">아직 참여한 과제 방이 없어요</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              새 과제 방을 만들거나 초대 코드로 참여해 보세요.
            </p>
            <Button variant="outline" size="sm" onClick={() => setShowJoinModal(true)}>
              <Hash className="w-4 h-4 mr-1.5" /> 코드로 참여
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {myRooms.map((room, i) => {
              const progress = getRoomProgress(room.id);
              const daysLeft = getDaysUntilDeadline(room.deadline);
              const roomMembers = members.filter(m => room.memberIds.includes(m.id));
              const isUrgent = daysLeft <= 7 && daysLeft >= 0;
              const isOverdue = daysLeft < 0;
              const allSubs = room.tasks.flatMap(t => t.subtasks);
              const doneSubs = allSubs.filter(s => s.status === 'done').length;
              const inprogressSubs = allSubs.filter(s => s.status === 'inprogress').length;

              return (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06, ease: [0.23, 1, 0.32, 1] }}
                  className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden card-hover cursor-pointer group"
                  onClick={() => {
                    setActiveRoom(room.id);
                    navigate(`/room/${room.id}`);
                  }}
                >
                  {/* Gradient stripe */}
                  <div className="vibe-card-stripe" />

                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="font-bold text-foreground text-sm leading-tight">
                          {room.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{room.subject}</p>
                      </div>
                      <Badge
                        variant={isOverdue ? 'destructive' : isUrgent ? 'default' : 'secondary'}
                        className={`text-xs flex-shrink-0 ${isUrgent && !isOverdue ? 'bg-orange-500 text-white' : ''}`}
                      >
                        {isOverdue ? '마감 초과' : `D-${daysLeft}`}
                      </Badge>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-muted-foreground">진행률</span>
                        <span className="text-xs font-bold text-foreground">{progress}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, oklch(0.72 0.12 290), oklch(0.78 0.10 30))' }}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, delay: i * 0.06 + 0.3, ease: [0.23, 1, 0.32, 1] }}
                        />
                      </div>
                    </div>

                    {/* Task summary */}
                    <div className="flex items-center gap-2 mb-4">
                      {doneSubs > 0 && (
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-semibold">
                          완료 {doneSubs}
                        </span>
                      )}
                      {inprogressSubs > 0 && (
                        <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-semibold">
                          진행 중 {inprogressSubs}
                        </span>
                      )}
                      {allSubs.length - doneSubs - inprogressSubs > 0 && (
                        <span className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground rounded-full font-semibold">
                          대기 {allSubs.length - doneSubs - inprogressSubs}
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      {/* Member avatars */}
                      <div className="flex -space-x-1.5">
                        {roomMembers.slice(0, 4).map((m, mi) => (
                          <div
                            key={m.id}
                            className="w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-[9px] font-bold text-white"
                            style={{
                              background: 'linear-gradient(135deg, oklch(0.72 0.12 290), oklch(0.78 0.10 30))',
                              zIndex: 4 - mi,
                            }}
                            title={m.name}
                          >
                            {m.avatar[0]}
                          </div>
                        ))}
                        {roomMembers.length > 4 && (
                          <div className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                            +{roomMembers.length - 4}
                          </div>
                        )}
                        <span className="ml-2 text-xs text-muted-foreground self-center">
                          {roomMembers.length}명
                        </span>
                      </div>

                      {/* Invite code */}
                      <button
                        onClick={e => { e.stopPropagation(); copyCode(room.inviteCode); }}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono bg-muted hover:bg-muted/80 px-2 py-1 rounded-md"
                      >
                        {copiedCode === room.inviteCode ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        {room.inviteCode}
                      </button>
                    </div>

                    {/* Enter button */}
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-primary group-hover:text-primary/80 transition-colors">
                        방 입장하기
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Join Room Modal */}
      <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
        <DialogContent className="animate-modal-in max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">초대 코드로 참여</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              팀원에게 받은 6자리 초대 코드를 입력하세요.
            </p>
            <Input
              placeholder="예: VT3K9X"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="text-center text-xl font-mono font-bold tracking-widest h-14"
              onKeyDown={e => { if (e.key === 'Enter' && joinCode.length === 6) handleJoinRoom(); }}
            />
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2">데모 초대 코드</p>
              <div className="flex flex-wrap gap-2">
                {['VT3K9X', 'OS7M2P', 'DB4R8W'].map(code => (
                  <button
                    key={code}
                    onClick={() => setJoinCode(code)}
                    className="font-mono text-xs px-2 py-1 bg-card rounded-md border border-border hover:border-primary hover:text-primary transition-colors"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setShowJoinModal(false)}>취소</Button>
              <Button onClick={handleJoinRoom} className="btn-press" disabled={joinCode.length < 6}>
                참여하기
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
