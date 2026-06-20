// VibeTeam Heatmap Timetable Component
// Design: Warm Pastel Studio — Sage green heatmap with opacity levels

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { DAYS, DAY_LABELS, PERIODS, PERIOD_TIMES, Day, Member, mergeTimetables, getHeatmapLevel } from '@/lib/mockData';

interface HeatmapTimetableProps {
  members: Member[];
}

const HEATMAP_STYLES = [
  { bg: 'bg-muted', text: 'text-muted-foreground', label: '모두 수업', opacity: 1 },
  { bg: '', text: 'text-emerald-700', label: '25% 공강', opacity: 1, color: 'oklch(0.88 0.07 150)' },
  { bg: '', text: 'text-emerald-700', label: '50% 공강', opacity: 1, color: 'oklch(0.78 0.10 150)' },
  { bg: '', text: 'text-emerald-800', label: '75% 공강', opacity: 1, color: 'oklch(0.67 0.13 150)' },
  { bg: '', text: 'text-white', label: '전원 공강', opacity: 1, color: 'oklch(0.55 0.16 150)' },
];

export default function HeatmapTimetable({ members }: HeatmapTimetableProps) {
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const freeMap = mergeTimetables(members);
  const total = members.length;

  const getSlotInfo = (day: Day, period: number) => {
    const key = `${day}-${period}`;
    const freeCount = freeMap[key] ?? 0;
    const level = getHeatmapLevel(freeCount, total);
    const busyMembers = members.filter(m =>
      m.timetable.slots.some(s => s.day === day && s.period === period)
    );
    const freeMembers = members.filter(m =>
      !m.timetable.slots.some(s => s.day === day && s.period === period)
    );
    return { key, freeCount, level, busyMembers, freeMembers };
  };

  // Find best slots (level 4 or 3)
  const bestSlots = DAYS.flatMap(day =>
    PERIODS.map(period => {
      const info = getSlotInfo(day, period);
      return { day, period, ...info };
    })
  ).filter(s => s.level >= 3).sort((a, b) => b.level - a.level || a.period - b.period);

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-muted-foreground mr-1">공강 밀도:</span>
        {HEATMAP_STYLES.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className={`w-4 h-4 rounded ${s.bg}`}
              style={s.color ? { backgroundColor: s.color } : {}}
            />
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Timetable Grid */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <div className="p-4" style={{ minWidth: 480 }}>
          <table className="w-full border-collapse">
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
                  <td className="py-0.5 pr-2 text-center">
                    <div className="text-xs font-semibold text-muted-foreground">{period}</div>
                    <div className="text-[10px] text-muted-foreground/60">{PERIOD_TIMES[period]}</div>
                  </td>
                  {DAYS.map(day => {
                    const info = getSlotInfo(day, period);
                    const style = HEATMAP_STYLES[info.level];
                    const isHovered = hoveredSlot === info.key;

                    return (
                      <td key={info.key} className="p-0.5">
                        <motion.div
                          className={`relative h-10 rounded-lg cursor-default transition-all duration-200 flex items-center justify-center ${style.bg}`}
                          style={style.color ? { backgroundColor: style.color } : {}}
                          whileHover={{ scale: 1.05 }}
                          onMouseEnter={() => setHoveredSlot(info.key)}
                          onMouseLeave={() => setHoveredSlot(null)}
                        >
                          {info.freeCount > 0 && (
                            <span className={`text-[10px] font-bold ${style.text}`}>
                              {info.freeCount}/{total}
                            </span>
                          )}

                          {/* Tooltip */}
                          {isHovered && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none">
                              <div className="bg-foreground text-background text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                                <div className="font-semibold mb-1">
                                  {DAY_LABELS[day]}요일 {period}교시 ({PERIOD_TIMES[period]})
                                </div>
                                {info.freeMembers.length > 0 && (
                                  <div className="text-emerald-400">
                                    ✓ 공강: {info.freeMembers.map(m => m.name).join(', ')}
                                  </div>
                                )}
                                {info.busyMembers.length > 0 && (
                                  <div className="text-rose-400">
                                    ✗ 수업: {info.busyMembers.map(m => m.name).join(', ')}
                                  </div>
                                )}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Best Slots Recommendation */}
      {bestSlots.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <h4 className="text-sm font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            추천 미팅 시간 (전원 공강)
          </h4>
          <div className="flex flex-wrap gap-2">
            {bestSlots.slice(0, 6).map(slot => (
              <div
                key={slot.key}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-emerald-200 text-xs font-semibold text-emerald-700"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                {DAY_LABELS[slot.day as Day]}요일 {slot.period}교시
                {slot.level === 4 && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1 rounded">전원</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
