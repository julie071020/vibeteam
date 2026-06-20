// VibeTeam Mock Data & Types
// Design: Warm Pastel Studio — Lavender + Peach + Sage

export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
export const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export const DAY_LABELS: Record<Day, string> = {
  Mon: '월', Tue: '화', Wed: '수', Thu: '목', Fri: '금',
};
export const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const PERIOD_TIMES: Record<number, string> = {
  1: '09:00', 2: '10:00', 3: '11:00', 4: '12:00',
  5: '13:00', 6: '14:00', 7: '15:00', 8: '16:00', 9: '17:00',
};

export interface TimetableSlot {
  day: Day;
  period: number;
  courseName?: string;
}

export interface UserTimetable {
  userId: string;
  slots: TimetableSlot[]; // occupied slots (classes)
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  timetable: UserTimetable;
}

export type TaskStatus = 'todo' | 'inprogress' | 'done';

export interface SubTask {
  id: string;
  title: string;
  assigneeId: string | null;
  dueDate: string | null;
  status: TaskStatus;
}

export interface MainTask {
  id: string;
  title: string;
  subtasks: SubTask[];
}

export interface ProjectRoom {
  id: string;
  name: string;
  subject: string;
  deadline: string;
  inviteCode: string;
  memberIds: string[];
  tasks: MainTask[];
  createdAt: string;
}

// Mock members
export const MOCK_MEMBERS: Member[] = [
  {
    id: 'u1',
    name: '김지수',
    email: 'jisoo.kim@university.ac.kr',
    avatar: 'KJ',
    color: 'oklch(0.72 0.12 290)',
    timetable: {
      userId: 'u1',
      slots: [
        { day: 'Mon', period: 1, courseName: '데이터구조' },
        { day: 'Mon', period: 2, courseName: '데이터구조' },
        { day: 'Tue', period: 3, courseName: '운영체제' },
        { day: 'Tue', period: 4, courseName: '운영체제' },
        { day: 'Wed', period: 1, courseName: '알고리즘' },
        { day: 'Wed', period: 2, courseName: '알고리즘' },
        { day: 'Thu', period: 5, courseName: '영어회화' },
        { day: 'Fri', period: 3, courseName: '캡스톤' },
        { day: 'Fri', period: 4, courseName: '캡스톤' },
      ],
    },
  },
  {
    id: 'u2',
    name: '박민준',
    email: 'minjun.park@university.ac.kr',
    avatar: 'PM',
    color: 'oklch(0.78 0.10 30)',
    timetable: {
      userId: 'u2',
      slots: [
        { day: 'Mon', period: 3, courseName: '컴퓨터네트워크' },
        { day: 'Mon', period: 4, courseName: '컴퓨터네트워크' },
        { day: 'Tue', period: 1, courseName: '선형대수' },
        { day: 'Tue', period: 2, courseName: '선형대수' },
        { day: 'Wed', period: 5, courseName: '소프트웨어공학' },
        { day: 'Wed', period: 6, courseName: '소프트웨어공학' },
        { day: 'Thu', period: 3, courseName: '데이터베이스' },
        { day: 'Thu', period: 4, courseName: '데이터베이스' },
        { day: 'Fri', period: 1, courseName: '캡스톤' },
        { day: 'Fri', period: 2, courseName: '캡스톤' },
      ],
    },
  },
  {
    id: 'u3',
    name: '이서연',
    email: 'seoyeon.lee@university.ac.kr',
    avatar: 'LS',
    color: 'oklch(0.72 0.10 150)',
    timetable: {
      userId: 'u3',
      slots: [
        { day: 'Mon', period: 5, courseName: '인공지능' },
        { day: 'Mon', period: 6, courseName: '인공지능' },
        { day: 'Tue', period: 5, courseName: '확률통계' },
        { day: 'Tue', period: 6, courseName: '확률통계' },
        { day: 'Wed', period: 3, courseName: '컴파일러' },
        { day: 'Wed', period: 4, courseName: '컴파일러' },
        { day: 'Thu', period: 1, courseName: '데이터베이스' },
        { day: 'Thu', period: 2, courseName: '데이터베이스' },
        { day: 'Fri', period: 5, courseName: '캡스톤' },
        { day: 'Fri', period: 6, courseName: '캡스톤' },
      ],
    },
  },
  {
    id: 'u4',
    name: '최도현',
    email: 'dohyun.choi@university.ac.kr',
    avatar: 'CD',
    color: 'oklch(0.70 0.12 60)',
    timetable: {
      userId: 'u4',
      slots: [
        { day: 'Mon', period: 7, courseName: '컴퓨터비전' },
        { day: 'Mon', period: 8, courseName: '컴퓨터비전' },
        { day: 'Tue', period: 7, courseName: '머신러닝' },
        { day: 'Tue', period: 8, courseName: '머신러닝' },
        { day: 'Wed', period: 7, courseName: '컴파일러' },
        { day: 'Wed', period: 8, courseName: '컴파일러' },
        { day: 'Thu', period: 6, courseName: '영어회화' },
        { day: 'Fri', period: 7, courseName: '캡스톤' },
        { day: 'Fri', period: 8, courseName: '캡스톤' },
      ],
    },
  },
];

// Mock project rooms
export const MOCK_ROOMS: ProjectRoom[] = [
  {
    id: 'r1',
    name: '캡스톤 디자인 프로젝트',
    subject: '캡스톤디자인',
    deadline: '2026-06-30',
    inviteCode: 'VT3K9X',
    memberIds: ['u1', 'u2', 'u3', 'u4'],
    createdAt: '2026-03-02',
    tasks: [
      {
        id: 't1',
        title: '자료 조사',
        subtasks: [
          { id: 'st1', title: '선행 연구 논문 5편 수집', assigneeId: 'u1', dueDate: '2026-06-10', status: 'done' },
          { id: 'st2', title: '경쟁 서비스 분석 보고서', assigneeId: 'u2', dueDate: '2026-06-12', status: 'done' },
          { id: 'st3', title: '사용자 인터뷰 설계', assigneeId: 'u3', dueDate: '2026-06-15', status: 'inprogress' },
        ],
      },
      {
        id: 't2',
        title: 'PPT 작성',
        subtasks: [
          { id: 'st4', title: '표지 및 목차 슬라이드', assigneeId: 'u4', dueDate: '2026-06-20', status: 'inprogress' },
          { id: 'st5', title: '기술 구현 섹션 작성', assigneeId: 'u1', dueDate: '2026-06-22', status: 'todo' },
          { id: 'st6', title: '결론 및 기대효과 섹션', assigneeId: 'u2', dueDate: '2026-06-24', status: 'todo' },
        ],
      },
      {
        id: 't3',
        title: '발표 준비',
        subtasks: [
          { id: 'st7', title: '발표 스크립트 작성', assigneeId: 'u3', dueDate: '2026-06-26', status: 'todo' },
          { id: 'st8', title: '리허설 진행', assigneeId: null, dueDate: '2026-06-28', status: 'todo' },
        ],
      },
    ],
  },
  {
    id: 'r2',
    name: '운영체제 팀 과제',
    subject: '운영체제',
    deadline: '2026-06-20',
    inviteCode: 'OS7M2P',
    memberIds: ['u1', 'u2'],
    createdAt: '2026-05-15',
    tasks: [
      {
        id: 't4',
        title: '프로세스 스케줄링 구현',
        subtasks: [
          { id: 'st9', title: 'FCFS 알고리즘 코드', assigneeId: 'u1', dueDate: '2026-06-18', status: 'done' },
          { id: 'st10', title: 'Round Robin 구현', assigneeId: 'u2', dueDate: '2026-06-19', status: 'inprogress' },
        ],
      },
    ],
  },
  {
    id: 'r3',
    name: '데이터베이스 설계 과제',
    subject: '데이터베이스',
    deadline: '2026-07-05',
    inviteCode: 'DB4R8W',
    memberIds: ['u2', 'u3'],
    createdAt: '2026-05-20',
    tasks: [
      {
        id: 't5',
        title: 'ERD 설계',
        subtasks: [
          { id: 'st11', title: '요구사항 분석', assigneeId: 'u3', dueDate: '2026-06-25', status: 'todo' },
          { id: 'st12', title: 'ERD 다이어그램 작성', assigneeId: 'u2', dueDate: '2026-06-28', status: 'todo' },
        ],
      },
    ],
  },
];

// Current logged-in user (mock)
export const CURRENT_USER: Member = MOCK_MEMBERS[0];

// Timetable merge algorithm
export function mergeTimetables(members: Member[]): Record<string, number> {
  const result: Record<string, number> = {};
  const total = members.length;

  DAYS.forEach(day => {
    PERIODS.forEach(period => {
      const key = `${day}-${period}`;
      const busyCount = members.filter(m =>
        m.timetable.slots.some(s => s.day === day && s.period === period)
      ).length;
      // freeCount = total - busyCount
      result[key] = total - busyCount;
    });
  });

  return result;
}

// Compute heatmap level (0-4) based on free count out of total
export function getHeatmapLevel(freeCount: number, total: number): 0 | 1 | 2 | 3 | 4 {
  if (total === 0) return 0;
  const ratio = freeCount / total;
  if (ratio === 1) return 4;
  if (ratio >= 0.75) return 3;
  if (ratio >= 0.5) return 2;
  if (ratio >= 0.25) return 1;
  return 0;
}

// Generate invite code
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// Calculate progress
export function calcProgress(room: ProjectRoom): number {
  const allSubtasks = room.tasks.flatMap(t => t.subtasks);
  if (allSubtasks.length === 0) return 0;
  const done = allSubtasks.filter(s => s.status === 'done').length;
  return Math.round((done / allSubtasks.length) * 100);
}

export function getDaysUntilDeadline(deadline: string): number {
  const now = new Date();
  const d = new Date(deadline);
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
