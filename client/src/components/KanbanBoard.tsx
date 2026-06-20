// VibeTeam Kanban Board Component
// Design: Warm Pastel Studio — 3-column drag-and-drop kanban

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, GripVertical, Calendar, User, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { SubTask, TaskStatus, Member } from '@/lib/mockData';
import { toast } from 'sonner';

interface KanbanBoardProps {
  roomId: string;
  members: Member[];
}

const COLUMNS: { id: TaskStatus; label: string; color: string; bg: string; dot: string }[] = [
  { id: 'todo', label: '진행 전', color: 'text-slate-600', bg: 'bg-slate-50', dot: 'bg-slate-400' },
  { id: 'inprogress', label: '진행 중', color: 'text-blue-600', bg: 'bg-blue-50', dot: 'bg-blue-400' },
  { id: 'done', label: '완료', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-400' },
];

interface DragState {
  subtaskId: string;
  fromStatus: TaskStatus;
}

export default function KanbanBoard({ roomId, members }: KanbanBoardProps) {
  const { rooms, addMainTask, addSubTask, updateSubTask, moveSubTask, deleteSubTask } = useApp();
  const room = rooms.find(r => r.id === roomId);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showNewTask, setShowNewTask] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set(room?.tasks.map(t => t.id) || []));
  const [newSubtaskInputs, setNewSubtaskInputs] = useState<Record<string, string>>({});

  if (!room) return null;

  // Flatten all subtasks with their parent task info
  const allSubtasks = room.tasks.flatMap(task =>
    task.subtasks.map(sub => ({ ...sub, taskId: task.id, taskTitle: task.title }))
  );

  const getColumnSubtasks = (status: TaskStatus) =>
    allSubtasks.filter(s => s.status === status);

  const handleDragStart = (subtaskId: string, fromStatus: TaskStatus) => {
    setDragState({ subtaskId, fromStatus });
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDrop = (e: React.DragEvent, toStatus: TaskStatus) => {
    e.preventDefault();
    if (!dragState) return;
    if (dragState.fromStatus !== toStatus) {
      moveSubTask(roomId, dragState.subtaskId, toStatus);
      if (toStatus === 'done') {
        toast.success('태스크 완료! 🎉');
      }
    }
    setDragState(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDragState(null);
    setDragOverColumn(null);
  };

  const handleAddMainTask = () => {
    if (!newTaskTitle.trim()) return;
    addMainTask(roomId, newTaskTitle.trim());
    setNewTaskTitle('');
    setShowNewTask(false);
    toast.success('새 태스크가 추가되었어요!');
  };

  const handleAddSubTask = (taskId: string) => {
    const title = newSubtaskInputs[taskId]?.trim();
    if (!title) return;
    addSubTask(roomId, taskId, title);
    setNewSubtaskInputs(p => ({ ...p, [taskId]: '' }));
  };

  const toggleTask = (taskId: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  const getMemberName = (id: string | null) => {
    if (!id) return null;
    return members.find(m => m.id === id)?.name || null;
  };

  const getMemberAvatar = (id: string | null) => {
    if (!id) return null;
    return members.find(m => m.id === id)?.avatar || null;
  };

  return (
    <div className="space-y-6">
      {/* WBS Section */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-bold text-foreground">업무 분류 (WBS)</h3>
            <p className="text-xs text-muted-foreground mt-0.5">메인 태스크와 세부 업무를 관리하세요.</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowNewTask(true)}
            className="btn-press gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> 태스크 추가
          </Button>
        </div>

        <div className="p-4 space-y-3">
          {/* New task input */}
          <AnimatePresence>
            {showNewTask && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2"
              >
                <Input
                  placeholder="새 메인 태스크 이름..."
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddMainTask(); if (e.key === 'Escape') setShowNewTask(false); }}
                  autoFocus
                  className="flex-1"
                />
                <Button size="sm" onClick={handleAddMainTask} className="btn-press">추가</Button>
                <Button size="sm" variant="outline" onClick={() => setShowNewTask(false)}>취소</Button>
              </motion.div>
            )}
          </AnimatePresence>

          {room.tasks.length === 0 && !showNewTask && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              아직 태스크가 없어요. 위 버튼으로 추가해 보세요.
            </div>
          )}

          {room.tasks.map(task => {
            const isExpanded = expandedTasks.has(task.id);
            const doneCount = task.subtasks.filter(s => s.status === 'done').length;
            const total = task.subtasks.length;

            return (
              <div key={task.id} className="border border-border rounded-xl overflow-hidden">
                {/* Task header */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-muted/40 hover:bg-muted/70 transition-colors text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className="font-semibold text-sm text-foreground flex-1">{task.title}</span>
                  {total > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {doneCount}/{total}
                    </Badge>
                  )}
                </button>

                {/* Subtasks */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="divide-y divide-border">
                        {task.subtasks.map(sub => (
                          <div key={sub.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 group">
                            <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />
                            <span className={`flex-1 text-sm ${sub.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {sub.title}
                            </span>
                            {/* Assignee */}
                            <Select
                              value={sub.assigneeId || 'none'}
                              onValueChange={v => updateSubTask(roomId, task.id, sub.id, { assigneeId: v === 'none' ? null : v })}
                            >
                              <SelectTrigger className="w-28 h-7 text-xs border-0 bg-transparent hover:bg-muted">
                                <SelectValue>
                                  {sub.assigneeId ? (
                                    <span className="flex items-center gap-1">
                                      <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[9px] font-bold flex items-center justify-center">
                                        {getMemberAvatar(sub.assigneeId)?.[0]}
                                      </span>
                                      {getMemberName(sub.assigneeId)}
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground flex items-center gap-1">
                                      <User className="w-3 h-3" /> 미배정
                                    </span>
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">미배정</SelectItem>
                                {members.map(m => (
                                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {/* Due date */}
                            <input
                              type="date"
                              value={sub.dueDate || ''}
                              onChange={e => updateSubTask(roomId, task.id, sub.id, { dueDate: e.target.value || null })}
                              className="text-xs text-muted-foreground bg-transparent border-0 cursor-pointer hover:text-foreground w-28"
                            />
                            {/* Status badge */}
                            <Select
                              value={sub.status}
                              onValueChange={v => {
                                updateSubTask(roomId, task.id, sub.id, { status: v as TaskStatus });
                                if (v === 'done') toast.success('태스크 완료! 🎉');
                              }}
                            >
                              <SelectTrigger className="w-24 h-6 text-[10px] border-0 bg-transparent">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="todo">진행 전</SelectItem>
                                <SelectItem value="inprogress">진행 중</SelectItem>
                                <SelectItem value="done">완료</SelectItem>
                              </SelectContent>
                            </Select>
                            {/* Delete */}
                            <button
                              onClick={() => deleteSubTask(roomId, task.id, sub.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        {/* Add subtask */}
                        <div className="flex items-center gap-2 px-4 py-2">
                          <Plus className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          <Input
                            placeholder="세부 업무 추가..."
                            value={newSubtaskInputs[task.id] || ''}
                            onChange={e => setNewSubtaskInputs(p => ({ ...p, [task.id]: e.target.value }))}
                            onKeyDown={e => { if (e.key === 'Enter') handleAddSubTask(task.id); }}
                            className="border-0 bg-transparent text-sm h-7 p-0 focus-visible:ring-0 placeholder:text-muted-foreground/60"
                          />
                          {newSubtaskInputs[task.id] && (
                            <Button size="sm" variant="ghost" onClick={() => handleAddSubTask(task.id)} className="h-6 text-xs">
                              추가
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kanban Board */}
      <div>
        <h3 className="font-bold text-foreground mb-4">칸반 보드</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map(col => {
            const colSubtasks = getColumnSubtasks(col.id);
            const isDragTarget = dragOverColumn === col.id;

            return (
              <div
                key={col.id}
                className={`rounded-2xl border-2 transition-all duration-150 ${
                  isDragTarget
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-transparent bg-muted/40'
                }`}
                onDragOver={e => handleDragOver(e, col.id)}
                onDrop={e => handleDrop(e, col.id)}
                onDragLeave={() => setDragOverColumn(null)}
              >
                {/* Column header */}
                <div className="flex items-center gap-2 px-4 py-3">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className={`text-sm font-bold ${col.color}`}>{col.label}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {colSubtasks.length}
                  </Badge>
                </div>

                {/* Cards */}
                <div className="px-3 pb-3 space-y-2 min-h-[120px]">
                  <AnimatePresence>
                    {colSubtasks.map(sub => {
                      const assignee = members.find(m => m.id === sub.assigneeId);
                      const isDragging = dragState?.subtaskId === sub.id;

                      return (
                        <motion.div
                          key={sub.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          draggable
                          onDragStart={() => handleDragStart(sub.id, col.id)}
                          onDragEnd={handleDragEnd}
                          className={`bg-card rounded-xl border border-border p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow ${
                            isDragging ? 'kanban-dragging' : ''
                          }`}
                        >
                          <p className="text-sm font-medium text-foreground leading-snug mb-2">
                            {sub.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground mb-2 font-medium">
                            {sub.taskTitle}
                          </p>
                          <div className="flex items-center justify-between">
                            {assignee ? (
                              <div className="flex items-center gap-1.5">
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                                  style={{ background: 'linear-gradient(135deg, oklch(0.72 0.12 290), oklch(0.78 0.10 30))' }}
                                >
                                  {assignee.avatar[0]}
                                </div>
                                <span className="text-xs text-muted-foreground">{assignee.name}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground/60">미배정</span>
                            )}
                            {sub.dueDate && (
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {sub.dueDate.slice(5)}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {colSubtasks.length === 0 && (
                    <div className={`rounded-xl border-2 border-dashed border-border/50 h-20 flex items-center justify-center ${isDragTarget ? 'border-primary/50 bg-primary/5' : ''}`}>
                      <p className="text-xs text-muted-foreground/60">여기에 드래그하세요</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
