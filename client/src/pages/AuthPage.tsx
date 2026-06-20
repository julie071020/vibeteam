// VibeTeam Auth Page — Login & Signup
// Design: Warm Pastel Studio — hero bg + card form

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663778000034/BYSmgaPo73UWjqKMPEQfgE/vibeteam-hero-bg-abAqYQ69UDwaqgsSxBFtGX.webp';
const LOGO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663778000034/BYSmgaPo73UWjqKMPEQfgE/vibeteam-logo-gSiBNESHmmoW6rsqRgrCJL.webp';

export default function AuthPage() {
  const { authView, setAuthView, login } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupForm>({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const ok = login(data.email, data.password);
    setIsLoading(false);
    if (!ok) {
      toast.error('학교 이메일(.ac.kr 또는 .edu)을 사용해 주세요.');
      loginForm.setError('email', { message: '유효한 학교 이메일을 입력해 주세요.' });
    }
  };

  const handleSignup = async (data: SignupForm) => {
    if (data.password !== data.confirmPassword) {
      signupForm.setError('confirmPassword', { message: '비밀번호가 일치하지 않습니다.' });
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const ok = login(data.email, data.password);
    setIsLoading(false);
    if (!ok) {
      toast.error('학교 이메일(.ac.kr 또는 .edu)을 사용해 주세요.');
    } else {
      toast.success('회원가입이 완료되었습니다! 환영해요 🎉');
    }
  };

  const DEMO_ACCOUNTS = [
    { email: 'jisoo.kim@university.ac.kr', name: '김지수' },
    { email: 'minjun.park@university.ac.kr', name: '박민준' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left: Hero Panel */}
      <div
        className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="VibeTeam" className="w-10 h-10" />
            <span className="text-2xl font-bold text-slate-700">VibeTeam</span>
          </div>
        </div>
        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <h1 className="text-4xl font-bold text-slate-700 leading-tight">
              우리 팀의 공강,<br />
              <span className="bg-gradient-to-r from-violet-500 to-pink-400 bg-clip-text text-transparent">
                한눈에 확인하세요
              </span>
            </h1>
            <p className="mt-4 text-slate-600 text-lg leading-relaxed">
              에브리타임 시간표를 등록하고,<br />
              팀원 모두의 공강 시간을 자동으로 찾아드려요.
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          >
            {[
              { icon: '📅', label: '시간표 자동 분석' },
              { icon: '🟢', label: '공강 히트맵' },
              { icon: '📋', label: '칸반 과제 관리' },
            ].map(item => (
              <div
                key={item.label}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-xs font-semibold text-slate-600">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="relative z-10 text-sm text-slate-500">
          © 2026 VibeTeam. 대학생을 위한 팀 협업 도구.
        </div>
      </div>

      {/* Right: Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-background">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <img src={LOGO} alt="VibeTeam" className="w-8 h-8" />
            <span className="text-xl font-bold text-foreground">VibeTeam</span>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-muted rounded-xl p-1 mb-8">
            {(['login', 'signup'] as const).map(view => (
              <button
                key={view}
                onClick={() => setAuthView(view)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  authView === view
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {view === 'login' ? '로그인' : '회원가입'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {authView === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground">다시 만나서 반가워요!</h2>
                  <p className="text-muted-foreground mt-1 text-sm">학교 이메일로 로그인하세요.</p>
                </div>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-semibold">학교 이메일</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@university.ac.kr"
                        className="pl-10"
                        {...loginForm.register('email', {
                          required: '이메일을 입력해 주세요.',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.(ac\.kr|edu)$/,
                            message: '학교 이메일(.ac.kr 또는 .edu)을 입력해 주세요.',
                          },
                        })}
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-xs text-destructive">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-sm font-semibold">비밀번호</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="비밀번호를 입력하세요"
                        className="pl-10 pr-10"
                        {...loginForm.register('password', { required: '비밀번호를 입력해 주세요.' })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full btn-press h-11 font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        로그인 중...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        로그인 <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>

                {/* Demo accounts */}
                <div className="mt-6 p-4 bg-secondary rounded-xl">
                  <p className="text-xs font-semibold text-secondary-foreground mb-3 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    데모 계정으로 빠르게 체험하기
                  </p>
                  <div className="space-y-2">
                    {DEMO_ACCOUNTS.map(acc => (
                      <button
                        key={acc.email}
                        type="button"
                        onClick={() => {
                          loginForm.setValue('email', acc.email);
                          loginForm.setValue('password', 'demo1234');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg bg-white/70 hover:bg-white transition-colors text-xs text-foreground font-medium"
                      >
                        {acc.name} — <span className="text-muted-foreground">{acc.email}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground">팀 협업을 시작해요!</h2>
                  <p className="text-muted-foreground mt-1 text-sm">학교 이메일로 가입하면 바로 시작할 수 있어요.</p>
                </div>
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm font-semibold">이름</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="홍길동"
                        className="pl-10"
                        {...signupForm.register('name', { required: '이름을 입력해 주세요.' })}
                      />
                    </div>
                    {signupForm.formState.errors.name && (
                      <p className="text-xs text-destructive">{signupForm.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email" className="text-sm font-semibold">학교 이메일</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="example@university.ac.kr"
                        className="pl-10"
                        {...signupForm.register('email', {
                          required: '이메일을 입력해 주세요.',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.(ac\.kr|edu)$/,
                            message: '학교 이메일(.ac.kr 또는 .edu)을 입력해 주세요.',
                          },
                        })}
                      />
                    </div>
                    {signupForm.formState.errors.email && (
                      <p className="text-xs text-destructive">{signupForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password" className="text-sm font-semibold">비밀번호</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="8자 이상"
                        className="pl-10 pr-10"
                        {...signupForm.register('password', {
                          required: '비밀번호를 입력해 주세요.',
                          minLength: { value: 8, message: '8자 이상 입력해 주세요.' },
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {signupForm.formState.errors.password && (
                      <p className="text-xs text-destructive">{signupForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-password" className="text-sm font-semibold">비밀번호 확인</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="비밀번호 재입력"
                        className="pl-10"
                        {...signupForm.register('confirmPassword', { required: '비밀번호를 다시 입력해 주세요.' })}
                      />
                    </div>
                    {signupForm.formState.errors.confirmPassword && (
                      <p className="text-xs text-destructive">{signupForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full btn-press h-11 font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        가입 중...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        가입하기 <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
