// VibeTeam Timetable Page — Schedule Input & Visualization
// Design: Warm Pastel Studio — Grid timetable with drag-select

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Link2, FileText, Check, Info, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { DAYS, DAY_LABELS, PERIODS, PERIOD_TIMES, Day } from '@/lib/mockData';
import { toast } from 'sonner';

const COURSE_COLORS = [
  'bg-violet-200 text-violet-800',
  'bg-pink-200 text-pink-800',
  'bg-blue-200 text-blue-800',
  'bg-emerald-200 text-emerald-800',
  'bg-amber-200 text-amber-800',
  'bg-cyan-200 text-cyan-800',
];

export default function TimetablePage() {
  const { currentUser, updateUserTimetable } = useApp();
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(
    () => new Set(currentUser.timetable.slots.map(s => `${s.day}-${s.period}`))
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'add' | 'remove'>('add');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const toggleSlot = useCallback((key: string, mode?: 'add' | 'remove') => {
    setSelectedSlots(prev => {
      const next = new Set(prev);
      const m = mode || (prev.has(key) ? 'remove' : 'add');
      if (m === 'add') next.add(key);
      else next.delete(key);
      return next;
    });
  }, []);

  const handleMouseDown = (key: string) => {
    const mode = selectedSlots.has(key) ? 'remove' : 'add';
    setDragMode(mode);
    setIsDragging(true);
    toggleSlot(key, mode);
  };

  const handleMouseEnter = (key: string) => {
    if (isDragging) toggleSlot(key, dragMode);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleSave = () => {
    const slots = Array.from(selectedSlots).map(key => {
      const [day, period] = key.split('-');
      return { day, period: parseInt(period) };
    });
    updateUserTimetable(slots);
    setIsSaved(true);
    toast.success('시간표가 저장되었어요! ✅');
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file.name);
      toast.success(`"${file.name}" 업로드 완료! (데모: 실제 파싱은 준비 중이에요)`);
    } else {
      toast.error('이미지 파일만 업로드할 수 있어요.');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      toast.success(`"${file.name}" 업로드 완료! (데모: 실제 파싱은 준비 중이에요)`);
    }
  };

  const handleParseText = () => {
    if (!textInput.trim()) {
      toast.error('시간표 데이터를 입력해 주세요.');
      return;
    }
    toast.info('텍스트 파싱 기능은 준비 중이에요. 아래 그리드에서 직접 선택해 주세요.');
  };

  const handleParseUrl = () => {
    if (!urlInput.trim()) {
      toast.error('URL을 입력해 주세요.');
      return;
    }
    if (!urlInput.startsWith('http')) {
      toast.error('올바른 URL 형식을 입력해 주세요.');
      return;
    }
    toast.info('URL 파싱 기능은 준비 중이에요. 아래 그리드에서 직접 선택해 주세요.');
  };

  const occupiedCount = selectedSlots.size;
  const freeCount = DAYS.length * PERIODS.length - occupiedCount;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto" onMouseUp={handleMouseUp}>
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-foreground">내 시간표</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          에브리타임 시간표를 등록하거나, 아래 그리드에서 직접 수업 시간을 선택하세요.
        </p>
      </motion.div>

      {/* Input Methods */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Tabs defaultValue="upload">
          <TabsList className="mb-4">
            <TabsTrigger value="upload" className="gap-1.5">
              <Upload className="w-3.5 h-3.5" /> 이미지 업로드
            </TabsTrigger>
            <TabsTrigger value="url" className="gap-1.5">
              <Link2 className="w-3.5 h-3.5" /> URL 입력
            </TabsTrigger>
            <TabsTrigger value="text" className="gap-1.5">
              <FileText className="w-3.5 h-3.5" /> 텍스트 붙여넣기
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                isDragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleFileDrop}
            >
              {uploadedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="font-semibold text-foreground">{uploadedFile}</p>
                  <p className="text-sm text-muted-foreground">업로드 완료</p>
                  <Button variant="outline" size="sm" onClick={() => setUploadedFile(null)}>
                    다시 선택
                  </Button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground mb-1">
                    에브리타임 시간표 이미지를 드래그하거나 클릭하세요
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    PNG, JPG, WEBP 지원 · 최대 10MB
                  </p>
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                      <Upload className="w-4 h-4" /> 파일 선택
                    </span>
                  </label>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="url">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">에브리타임 시간표 URL</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://everytime.kr/..."
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleParseUrl} className="btn-press">불러오기</Button>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="w-3 h-3" />
                에브리타임 앱에서 '시간표 공유' 링크를 복사하여 붙여넣으세요.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="text">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">시간표 텍스트 데이터</Label>
              <Textarea
                placeholder={'에브리타임 시간표 텍스트를 붙여넣으세요.\n예: 월 1,2 데이터구조 / 화 3,4 운영체제 / ...'}
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                className="min-h-[120px] font-mono text-sm"
              />
              <Button onClick={handleParseText} className="btn-press">파싱하기</Button>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Manual Grid */}
      <motion.div
        className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-bold text-foreground">직접 선택</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              수업이 있는 시간을 클릭하거나 드래그하여 선택하세요.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary/80 inline-block" /> 수업 있음
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-muted border border-border inline-block" /> 공강
              </span>
            </div>
            <Button size="sm" onClick={handleSave} className="btn-press gap-1.5">
              {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              저장
            </Button>
          </div>
        </div>

        <div className="p-4 overflow-x-auto select-none">
          <table className="w-full border-collapse" style={{ minWidth: 480 }}>
            <thead>
              <tr>
                <th className="w-16 py-2 text-xs font-semibold text-muted-foreground text-center">교시</th>
                {DAYS.map(day => (
                  <th key={day} className="py-2 text-xs font-bold text-foreground text-center">
                    {DAY_LABELS[day]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map(period => (
                <tr key={period}>
                  <td className="py-1 pr-2 text-center">
                    <div className="text-xs font-semibold text-muted-foreground">{period}</div>
                    <div className="text-[10px] text-muted-foreground/60">{PERIOD_TIMES[period]}</div>
                  </td>
                  {DAYS.map(day => {
                    const key = `${day}-${period}`;
                    const isSelected = selectedSlots.has(key);
                    return (
                      <td key={key} className="p-0.5">
                        <div
                          className={`h-10 rounded-lg cursor-pointer transition-all duration-100 flex items-center justify-center ${
                            isSelected
                              ? 'bg-primary/80 shadow-sm'
                              : 'bg-muted hover:bg-primary/20'
                          }`}
                          onMouseDown={() => handleMouseDown(key)}
                          onMouseEnter={() => handleMouseEnter(key)}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-primary-foreground opacity-80" />
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        <div className="px-5 py-3 border-t border-border bg-muted/30 flex items-center gap-4">
          <Badge variant="secondary" className="text-xs">
            수업 {occupiedCount}교시
          </Badge>
          <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 bg-emerald-50">
            공강 {freeCount}교시
          </Badge>
          <span className="text-xs text-muted-foreground ml-auto">
            총 {DAYS.length * PERIODS.length}교시 중
          </span>
        </div>
      </motion.div>
    </div>
  );
}
