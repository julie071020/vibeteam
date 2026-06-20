// VibeTeam Room Page — Project Room Detail
// Design: Warm Pastel Studio — Tab-based multi-view with progress bar

import { useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  ArrowLeft, Copy, Check, Users, Calendar, Clock,
  LayoutGrid, CalendarDays, ListTodo, Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { getDaysUntilDeadline, calcProgress } from '@/lib/mockData';
import HeatmapTimetable from '@/components/HeatmapTimetable';
import KanbanBoard from '@/components/KanbanBoard';
import { toast } from 'sonner';

export default function RoomPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { rooms, members, setActiveRoom, getRoomMembers } = useApp();
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');

  const room = rooms.find(r => r.id === params.id);

  useEffect(() => {
    if (room) setActiveRoom(room.id);
    return () => setActiveRoom(null);
  }, [room?.id]);

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-muted-foreground mb-4">과제 방을 찾을 수 없어요.</p>
        <Button variant="outline" onClick={() => navigate('/')}>대시보드로 돌아가기</Button>
      </div>
    );
  }

  const roomMembers = getRoomMembers(room);
  const progress = calcProgress(room);
  const daysLeft = getDaysUntilDeadline(room.deadline);
  const isUrgent = daysLeft <= 7 && daysLeft >= 0;
  const isOverdue = daysLeft < 0;

  const allSubtasks = room.tasks.flatMap(t => t.subtasks);
  const doneCount = allSubtasks.filter(s => s.status === 'done').length;
  const inprogressCount = allSubtasks.filter(s => s.status === 'inprogress').length;

  const copyCode = () => {
    navigator.clipboard.writeText(room.inviteCode);
    setCopiedCode(true);
    toast.success('초대 코드가 복사되었어요!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Progress Bar — Top */}
      <div className="h-1 bg-muted flex-shrink-0">
        <motion.div
          className="h-full"
          style={{ background: 'linear-gradient(90deg, oklch(0.72 0.12 290), oklch(0.78 0.10 30))' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
        />
      </div>

      {/* Header */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-border bg-card">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate('/')}
            className="mt-0.5 p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-foreground truncate">{room.name}</h1>
              <Badge variant="secondary" className="text-xs flex-shrink-0">{room.subject}</Badge>
              {isOverdue ? (
                <Badge variant="destructive" className="text-xs flex-shrink-0">마감 초과</Badge>
              ) : isUrgent ? (
                <Badge className="text-xs flex-shrink-0 bg-orange-500">D-{daysLeft}</Badge>
              ) : (
                <Badge variant="outline" className="text-xs flex-shrink-0">D-{daysLeft}</Badge>
              )}
            </div>

            {/* Progress info */}
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, oklch(0.72 0.12 290), oklch(0.78 0.10 30))' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
                  />
                </div>
                <span className="text-xs font-bold text-foreground">{progress}%</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {doneCount}/{allSubtasks.length} 완료
              </span>
              {inprogressCount > 0 && (
                <span className="text-xs text-blue-500 font-medium">
                  {inprogressCount}개 진행 중
                </span>
              )}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {room.deadline}
              </div>
            </div>
          </div>

          {/* Members & Invite */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex -space-x-2">
              {roomMembers.map(m => (
                <Avatar key={m.id} className="w-7 h-7 border-2 border-card">
                  <AvatarFallback
                    className="text-[10px] font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, oklch(0.72 0.12 290), oklch(0.78 0.10 30))' }}
                  >
                    {m.avatar}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyCode}
              className="btn-press gap-1.5 font-mono text-xs"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {room.inviteCode}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-shrink-0 px-6 pt-4 border-b border-border">
            <TabsList className="h-9">
              <TabsTrigger value="schedule" className="gap-1.5 text-xs">
                <CalendarDays className="w-3.5 h-3.5" /> 공강 시간표
              </TabsTrigger>
              <TabsTrigger value="kanban" className="gap-1.5 text-xs">
                <LayoutGrid className="w-3.5 h-3.5" /> 칸반 보드
              </TabsTrigger>
              <TabsTrigger value="members" className="gap-1.5 text-xs">
                <Users className="w-3.5 h-3.5" /> 팀원 ({roomMembers.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="schedule" className="p-6 mt-0">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-4">
                  <h2 className="font-bold text-foreground">팀 공강 히트맵</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    짙은 초록색일수록 모든 팀원이 공강인 시간이에요.
                  </p>
                </div>
                <HeatmapTimetable members={roomMembers} />
              </motion.div>
            </TabsContent>

            <TabsContent value="kanban" className="p-6 mt-0">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <KanbanBoard roomId={room.id} members={roomMembers} />
              </motion.div>
            </TabsContent>

            <TabsContent value="members" className="p-6 mt-0">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-foreground">팀원 목록</h2>
                  <Button variant="outline" size="sm" onClick={copyCode} className="gap-1.5 btn-press">
                    <Share2 className="w-3.5 h-3.5" /> 초대 코드 공유
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roomMembers.map((member, i) => {
                    const memberSubtasks = room.tasks.flatMap(t =>
                      t.subtasks.filter(s => s.assigneeId === member.id)
                    );
                    const memberDone = memberSubtasks.filter(s => s.status === 'done').length;

                    return (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-card rounded-2xl border border-border p-4 shadow-sm"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback
                              className="text-sm font-bold text-white"
                              style={{ background: 'linear-gradient(135deg, oklch(0.72 0.12 290), oklch(0.78 0.10 30))' }}
                            >
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">담당 태스크</span>
                              <span className="font-semibold text-foreground">
                                {memberDone}/{memberSubtasks.length}
                              </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full progress-bar-fill"
                                style={{
                                  width: memberSubtasks.length > 0 ? `${(memberDone / memberSubtasks.length) * 100}%` : '0%',
                                  background: 'linear-gradient(90deg, oklch(0.72 0.12 290), oklch(0.78 0.10 30))',
                                }}
                              />
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs flex-shrink-0">
                            {memberSubtasks.length}개
                          </Badge>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Invite section */}
                <div className="bg-secondary rounded-2xl p-5 text-center">
                  <p className="text-sm font-semibold text-foreground mb-1">팀원을 초대하세요</p>
                  <p className="text-xs text-muted-foreground mb-3">아래 초대 코드를 팀원에게 공유하세요.</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl font-mono font-bold tracking-widest text-foreground">
                      {room.inviteCode}
                    </span>
                    <button
                      onClick={copyCode}
                      className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
