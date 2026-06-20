// VibeTeam App Context — Global State Management
// Design: Warm Pastel Studio

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Member, ProjectRoom, MainTask, SubTask, TaskStatus,
  MOCK_MEMBERS, MOCK_ROOMS, CURRENT_USER,
  generateInviteCode, calcProgress,
} from '@/lib/mockData';

interface AppState {
  currentUser: Member;
  members: Member[];
  rooms: ProjectRoom[];
  activeRoomId: string | null;
  isAuthenticated: boolean;
  authView: 'login' | 'signup';
}

interface AppActions {
  login: (email: string, _password: string) => boolean;
  logout: () => void;
  setAuthView: (view: 'login' | 'signup') => void;
  setActiveRoom: (id: string | null) => void;
  createRoom: (name: string, subject: string, deadline: string) => ProjectRoom;
  joinRoom: (code: string) => ProjectRoom | null;
  addMainTask: (roomId: string, title: string) => void;
  addSubTask: (roomId: string, taskId: string, title: string) => void;
  updateSubTask: (roomId: string, taskId: string, subtaskId: string, updates: Partial<SubTask>) => void;
  moveSubTask: (roomId: string, subtaskId: string, newStatus: TaskStatus) => void;
  deleteSubTask: (roomId: string, taskId: string, subtaskId: string) => void;
  updateUserTimetable: (slots: { day: string; period: number }[]) => void;
  getActiveRoom: () => ProjectRoom | null;
  getRoomMembers: (room: ProjectRoom) => Member[];
  getRoomProgress: (roomId: string) => number;
}

const AppContext = createContext<AppState & AppActions | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [currentUser, setCurrentUser] = useState<Member>(CURRENT_USER);
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  const [rooms, setRooms] = useState<ProjectRoom[]>(MOCK_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  const login = useCallback((email: string, _password: string): boolean => {
    const found = members.find(m => m.email === email);
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      return true;
    }
    // Allow any university email for demo
    if (/^[^\s@]+@[^\s@]+\.(ac\.kr|edu)$/.test(email)) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, [members]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setActiveRoomId(null);
  }, []);

  const setActiveRoom = useCallback((id: string | null) => {
    setActiveRoomId(id);
  }, []);

  const createRoom = useCallback((name: string, subject: string, deadline: string): ProjectRoom => {
    const newRoom: ProjectRoom = {
      id: `r${Date.now()}`,
      name,
      subject,
      deadline,
      inviteCode: generateInviteCode(),
      memberIds: [currentUser.id],
      tasks: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setRooms(prev => [newRoom, ...prev]);
    return newRoom;
  }, [currentUser.id]);

  const joinRoom = useCallback((code: string): ProjectRoom | null => {
    const room = rooms.find(r => r.inviteCode === code.toUpperCase());
    if (!room) return null;
    if (!room.memberIds.includes(currentUser.id)) {
      setRooms(prev => prev.map(r =>
        r.id === room.id
          ? { ...r, memberIds: [...r.memberIds, currentUser.id] }
          : r
      ));
    }
    return room;
  }, [rooms, currentUser.id]);

  const addMainTask = useCallback((roomId: string, title: string) => {
    const newTask: MainTask = {
      id: `t${Date.now()}`,
      title,
      subtasks: [],
    };
    setRooms(prev => prev.map(r =>
      r.id === roomId ? { ...r, tasks: [...r.tasks, newTask] } : r
    ));
  }, []);

  const addSubTask = useCallback((roomId: string, taskId: string, title: string) => {
    const newSub: SubTask = {
      id: `st${Date.now()}`,
      title,
      assigneeId: null,
      dueDate: null,
      status: 'todo',
    };
    setRooms(prev => prev.map(r =>
      r.id === roomId
        ? {
            ...r,
            tasks: r.tasks.map(t =>
              t.id === taskId ? { ...t, subtasks: [...t.subtasks, newSub] } : t
            ),
          }
        : r
    ));
  }, []);

  const updateSubTask = useCallback((
    roomId: string, taskId: string, subtaskId: string, updates: Partial<SubTask>
  ) => {
    setRooms(prev => prev.map(r =>
      r.id === roomId
        ? {
            ...r,
            tasks: r.tasks.map(t =>
              t.id === taskId
                ? {
                    ...t,
                    subtasks: t.subtasks.map(s =>
                      s.id === subtaskId ? { ...s, ...updates } : s
                    ),
                  }
                : t
            ),
          }
        : r
    ));
  }, []);

  const moveSubTask = useCallback((roomId: string, subtaskId: string, newStatus: TaskStatus) => {
    setRooms(prev => prev.map(r =>
      r.id === roomId
        ? {
            ...r,
            tasks: r.tasks.map(t => ({
              ...t,
              subtasks: t.subtasks.map(s =>
                s.id === subtaskId ? { ...s, status: newStatus } : s
              ),
            })),
          }
        : r
    ));
  }, []);

  const deleteSubTask = useCallback((roomId: string, taskId: string, subtaskId: string) => {
    setRooms(prev => prev.map(r =>
      r.id === roomId
        ? {
            ...r,
            tasks: r.tasks.map(t =>
              t.id === taskId
                ? { ...t, subtasks: t.subtasks.filter(s => s.id !== subtaskId) }
                : t
            ),
          }
        : r
    ));
  }, []);

  const updateUserTimetable = useCallback((slots: { day: string; period: number }[]) => {
    setCurrentUser(prev => ({
      ...prev,
      timetable: {
        ...prev.timetable,
        slots: slots.map(s => ({ day: s.day as any, period: s.period })),
      },
    }));
    setMembers(prev => prev.map(m =>
      m.id === currentUser.id
        ? { ...m, timetable: { ...m.timetable, slots: slots.map(s => ({ day: s.day as any, period: s.period })) } }
        : m
    ));
  }, [currentUser.id]);

  const getActiveRoom = useCallback((): ProjectRoom | null => {
    if (!activeRoomId) return null;
    return rooms.find(r => r.id === activeRoomId) || null;
  }, [activeRoomId, rooms]);

  const getRoomMembers = useCallback((room: ProjectRoom): Member[] => {
    return members.filter(m => room.memberIds.includes(m.id));
  }, [members]);

  const getRoomProgress = useCallback((roomId: string): number => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return 0;
    return calcProgress(room);
  }, [rooms]);

  return (
    <AppContext.Provider value={{
      currentUser, members, rooms, activeRoomId, isAuthenticated, authView,
      login, logout, setAuthView, setActiveRoom,
      createRoom, joinRoom,
      addMainTask, addSubTask, updateSubTask, moveSubTask, deleteSubTask,
      updateUserTimetable,
      getActiveRoom, getRoomMembers, getRoomProgress,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
