// VibeTeam App — Main Router & Layout
// Design: Warm Pastel Studio

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider, useApp } from "./contexts/AppContext";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import TimetablePage from "./pages/TimetablePage";
import RoomPage from "./pages/RoomPage";
import Layout from "./components/Layout";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Copy, Check, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

function CreateRoomModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { createRoom, setActiveRoom, rooms } = useApp();
  const [, navigate] = useLocation();
  const [form, setForm] = useState({ name: '', subject: '', deadline: '' });
  const [newCode, setNewCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    if (!form.name || !form.subject || !form.deadline) {
      toast.error('모든 항목을 입력해 주세요.');
      return;
    }
    const room = createRoom(form.name, form.subject, form.deadline);
    setNewCode(room.inviteCode);
    setForm({ name: '', subject: '', deadline: '' });
  };

  const handleClose = () => {
    setNewCode(null);
    setCopied(false);
    setForm({ name: '', subject: '', deadline: '' });
    onClose();
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('초대 코드가 복사되었어요!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) handleClose(); }}>
      <DialogContent className="animate-modal-in max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {newCode ? '과제 방이 생성되었어요! 🎉' : '새 과제 방 개설'}
          </DialogTitle>
        </DialogHeader>
        {newCode ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">팀원에게 아래 초대 코드를 공유하세요.</p>
            <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl">
              <span className="text-2xl font-mono font-bold tracking-widest text-foreground flex-1 text-center">{newCode}</span>
              <button onClick={() => copyCode(newCode)} className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <Button className="w-full btn-press" onClick={() => {
              const room = rooms.find(r => r.inviteCode === newCode);
              if (room) { setActiveRoom(room.id); navigate(`/room/${room.id}`); }
              handleClose();
            }}>
              방 입장하기 <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">과제명 *</Label>
              <Input placeholder="예: 캡스톤 디자인 최종 발표" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">과목명 *</Label>
              <Input placeholder="예: 캡스톤디자인" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">최종 마감일 *</Label>
              <Input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} min={new Date().toISOString().split('T')[0]} />
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleClose}>취소</Button>
              <Button onClick={handleCreate} className="btn-press"><Plus className="w-4 h-4 mr-1.5" /> 방 만들기</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function AppContent() {
  const { isAuthenticated } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <>
      <Layout onCreateRoom={() => setShowCreateModal(true)}>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/timetable" component={TimetablePage} />
          <Route path="/room/:id" component={RoomPage} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
      <CreateRoomModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AppProvider>
          <TooltipProvider>
            <Toaster position="top-right" richColors />
            <AppContent />
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
