// VibeTeam 404 Page
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  const [, navigate] = useLocation();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-2xl font-bold text-foreground mb-2">페이지를 찾을 수 없어요</h1>
      <p className="text-muted-foreground mb-6">요청하신 페이지가 존재하지 않거나 이동되었어요.</p>
      <Button onClick={() => navigate('/')} className="btn-press gap-2">
        <Home className="w-4 h-4" /> 대시보드로 돌아가기
      </Button>
    </div>
  );
}
