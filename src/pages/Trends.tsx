import React, { useState } from 'react';
import { TrendingUp, Moon, Heart, Activity, MessageSquare, Smile, BarChart3, Clock, MapPin } from 'lucide-react';

interface MoodData {
  mood: string;
  count: number;
  percentage: number;
  color: string;
}

interface SleepData {
  date: string;
  hours: number;
}

interface KeywordData {
  word: string;
  count: number;
}

const Trends: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | '3months'>('week');

  // Sample data
  const moodData: MoodData[] = [
    { mood: 'Excellent', count: 8, percentage: 25, color: '#4CB944' },
    { mood: 'Very Good', count: 10, percentage: 31, color: '#9A9B89' },
    { mood: 'Average', count: 9, percentage: 28, color: '#A36456' },
    { mood: 'Bad', count: 4, percentage: 13, color: '#E2B6A1' },
    { mood: 'Very Poor', count: 1, percentage: 3, color: '#D99C8F' }
  ];

  const sleepDataWeek: SleepData[] = [
    { date: 'Mon', hours: 7.5 },
    { date: 'Tue', hours: 8.2 },
    { date: 'Wed', hours: 6.8 },
    { date: 'Thu', hours: 7.9 },
    { date: 'Fri', hours: 7.1 },
    { date: 'Sat', hours: 8.5 },
    { date: 'Sun', hours: 8.0 }
  ];

  const journalKeywords: KeywordData[] = [
    { word: 'peaceful', count: 12 },
    { word: 'tired', count: 8 },
    { word: 'gentle', count: 7 },
    { word: 'healing', count: 6 },
    { word: 'meditation', count: 5 }
  ];

  const currentStats = {
    lastNightSleep: 8.0,
    weeklyAverageSleep: 7.6,
    milesWalked: 2.3,
    currentHeartRate: 72,
    exerciseTimeToday: 35,
    weeklyExerciseTime: 180
  };

  const MetricCard = ({ 
    title, 
    value, 
    unit, 
    subtitle, 
    icon, 
    color,
    children 
  }: { 
    title: string;
    value: string | number;
    unit?: string;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
    children?: React.ReactNode;
  }) => (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(49,29,0,0.08)',
      border: `2px solid ${color}`,
      marginBottom: 16
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ color: color }}>{icon}</div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#311D00', margin: 0 }}>{title}</h3>
          {subtitle && <p style={{ fontSize: 14, color: '#6F5E53', margin: 0 }}>{subtitle}</p>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
        <span style={{ fontSize: 32, fontWeight: 700, color: '#311D00' }}>{value}</span>
        {unit && <span style={{ fontSize: 16, color: '#6F5E53' }}>{unit}</span>}
      </div>
      {children}
    </div>
  );

  const SleepChart = ({ data }: { data: SleepData[] }) => {
    const maxHours = Math.max(...data.map(d => d.hours));
    return (
      <div style={{ display: 'flex', alignItems: 'end', gap: 8, height: 100, marginTop: 16 }}>
        {data.map((day, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              background: '#9A9B89',
              width: '100%',
              height: `${(day.hours / maxHours) * 80}px`,
              borderRadius: '4px 4px 0 0',
              marginBottom: 8,
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: -20,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 11,
                fontWeight: 600,
                color: '#311D00'
              }}>
                {day.hours}h
              </div>
            </div>
            <span style={{ fontSize: 12, color: '#6F5E53' }}>{day.date}</span>
          </div>
        ))}
      </div>
    );
  };

  const MoodChart = ({ data }: { data: MoodData[] }) => (
    <div style={{ marginTop: 16 }}>
      {data.map((mood, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#311D00' }}>{mood.mood}</span>
            <span style={{ fontSize: 12, color: '#6F5E53' }}>{mood.count} days ({mood.percentage}%)</span>
          </div>
          <div style={{ background: '#F5F1ED', borderRadius: 4, height: 8, overflow: 'hidden' }}>
            <div style={{
              background: mood.color,
              height: '100%',
              width: `${mood.percentage}%`,
              borderRadius: 4,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      ))}
    </div>
  );

  const KeywordCloud = ({ keywords }: { keywords: KeywordData[] }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
      {keywords.map((keyword, i) => (
        <span 
          key={i}
          style={{
            background: '#E2B6A1',
            color: '#8C5A51',
            padding: '6px 12px',
            borderRadius: 16,
            fontSize: 13,
            fontWeight: 600,
            opacity: 0.7 + (keyword.count / 15) * 0.3
          }}
        >
          {keyword.word} ({keyword.count})
        </span>
      ))}
    </div>
  );

  return (
    <div style={{ background: '#EAE9E5', minHeight: '100vh', paddingBottom: 120 }}>
      {/* Header */}
      <div style={{ 
        background: '#fff', 
        padding: '1.5rem 1.5rem 1rem 4rem',
        borderBottom: '1px solid #D9CFC2',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <TrendingUp size={32} color="#A36456" />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#311D00', margin: 0, fontFamily: 'Inter, Arial, Helvetica, sans-serif' }}>
            Health Trends
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem 1.5rem 0 1.5rem', marginTop: '80px' }}>
        {/* Timeframe selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['week', 'month', '3months'] as const).map(timeframe => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              style={{
                background: selectedTimeframe === timeframe ? '#9A9B89' : '#fff',
                color: selectedTimeframe === timeframe ? '#fff' : '#6F5E53',
                border: '1px solid #D9CFC2',
                borderRadius: 8,
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {timeframe === '3months' ? '3 Months' : timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </button>
          ))}
        </div>

        {/* Quick stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: '1rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(49,29,0,0.08)'
          }}>
            <div style={{ color: '#9A9B89', marginBottom: 8 }}>
              <Moon size={24} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#311D00' }}>
              {currentStats.lastNightSleep}h
            </div>
            <div style={{ fontSize: 12, color: '#6F5E53' }}>Last Night</div>
          </div>
          
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: '1rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(49,29,0,0.08)'
          }}>
            <div style={{ color: '#E2B6A1', marginBottom: 8 }}>
              <Heart size={24} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#311D00' }}>
              {currentStats.currentHeartRate}
            </div>
            <div style={{ fontSize: 12, color: '#6F5E53' }}>Current BPM</div>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: '1rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(49,29,0,0.08)'
          }}>
            <div style={{ color: '#A36456', marginBottom: 8 }}>
              <MapPin size={24} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#311D00' }}>
              {currentStats.milesWalked}
            </div>
            <div style={{ fontSize: 12, color: '#6F5E53' }}>Miles Today</div>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: '1rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(49,29,0,0.08)'
          }}>
            <div style={{ color: '#4CB944', marginBottom: 8 }}>
              <Clock size={24} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#311D00' }}>
              {currentStats.exerciseTimeToday}m
            </div>
            <div style={{ fontSize: 12, color: '#6F5E53' }}>Exercise Today</div>
          </div>
        </div>

        {/* Detailed metrics */}
        <MetricCard
          title="Sleep This Week"
          value={currentStats.weeklyAverageSleep}
          unit="hours avg"
          subtitle="Daily sleep patterns"
          icon={<Moon size={24} />}
                        color="#9A9B89"
        >
          <SleepChart data={sleepDataWeek} />
        </MetricCard>

        <MetricCard
          title="Exercise Time"
          value={currentStats.weeklyExerciseTime}
          unit="minutes this week"
          subtitle="Movement and activity tracking"
          icon={<Activity size={24} />}
          color="#A36456"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 14, color: '#6F5E53' }}>Weekly Goal</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#311D00' }}>210 min</span>
              </div>
              <div style={{ background: '#F5F1ED', borderRadius: 4, height: 8 }}>
                <div style={{
                  background: '#A36456',
                  height: '100%',
                  width: `${(currentStats.weeklyExerciseTime / 210) * 100}%`,
                  borderRadius: 4
                }} />
              </div>
            </div>
          </div>
        </MetricCard>

        <MetricCard
          title="Mood Trends"
          value={moodData[1].mood}
          subtitle="Most frequent mood this month"
          icon={<Smile size={24} />}
          color="#4CB944"
        >
          <MoodChart data={moodData} />
        </MetricCard>

        <MetricCard
          title="Journal Keywords"
          value={journalKeywords[0].word}
          subtitle="Most used word in your entries"
          icon={<MessageSquare size={24} />}
          color="#E2B6A1"
        >
          <KeywordCloud keywords={journalKeywords} />
        </MetricCard>

        {/* Heart rate trend */}
        <MetricCard
          title="Heart Rate"
          value={currentStats.currentHeartRate}
          unit="bpm"
          subtitle="Average resting heart rate"
          icon={<Heart size={24} />}
          color="#D99C8F"
        >
          <div style={{ display: 'flex', alignItems: 'end', gap: 4, height: 60, marginTop: 16 }}>
            {[68, 71, 69, 72, 70, 74, 72].map((rate, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  background: '#D99C8F',
                  width: '100%',
                  height: `${((rate - 65) / 10) * 50}px`,
                  borderRadius: '2px 2px 0 0',
                  marginBottom: 4
                }} />
                <span style={{ fontSize: 10, color: '#6F5E53' }}>{rate}</span>
              </div>
            ))}
          </div>
        </MetricCard>
      </div>
    </div>
  );
};

export default Trends; 