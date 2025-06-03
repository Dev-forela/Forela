import React, { useState, useRef, useEffect } from 'react';
import pencilLine from '../assets/images/pencil-line.png';
import speechIcon from '../assets/images/speech.png';
import { FolderHeart, Search, X, Download, ChevronDown, Mic, Save, Volume2, VolumeX, Trash2, Menu, Edit3 } from 'lucide-react';

interface ActivitySummary {
  category: 'Meals' | 'Movement' | 'Mental Health' | 'Sleep';
  title: string;
  color: string;
  time: string;
}

interface CompanionSummary {
  summary: string;
  duration: string;
  startTime: string;
}

interface JournalEntry {
  id: number;
  title: string;
  date: string;
  summary: string;
  body: string;
  bodySummary: string;
  type: 'text' | 'audio';
  mood: 'very poor' | 'bad' | 'average' | 'very good' | 'excellent';
  transcription?: string;
  activities: ActivitySummary[];
  companion?: CompanionSummary;
  preview?: string;
}

const moodLabels = ['very poor', 'bad', 'average', 'very good', 'excellent'] as const;
const moodColors: Record<string, string> = {
  'very poor': '#D99C8F',
  'bad': '#E2B6A1',
  'average': '#A36456',
  'very good': '#1E6E8B',
  'excellent': '#4CB944',
};

const journalEntries: JournalEntry[] = [
  {
    id: 1,
    title: 'Morning Reflection',
    date: '2025-05-17',
    summary: '<b>Body:</b> Calm, rested<br/><b>Mind:</b> Hopeful, focused',
    body: 'Woke up feeling more rested after going to bed early. Did gentle yoga and had a nourishing breakfast. The morning light streaming through my window felt so peaceful, and I took a moment to really appreciate how much progress I\'ve made in my healing journey.',
    bodySummary: '',
    type: 'text',
    mood: 'very good',
    preview: 'Woke up feeling more rested after going to bed early. Did gentle yoga and had a nourishing breakfast...',
    activities: [
      { category: 'Movement', title: 'Gentle Yoga or Pilates', color: '#A36456', time: '7:30am' },
      { category: 'Meals', title: 'Tylers Coffee with Collagen', color: '#D99C8F', time: '7am' },
    ],
    companion: {
      summary: 'Talked about sleep and stress management',
      duration: '22 min',
      startTime: '8:15am',
    },
  },
  {
    id: 2,
    title: 'Audio Check-in',
    date: '2025-05-16',
    summary: '<b>Body:</b> Sore, low energy<br/><b>Mind:</b> Anxious, distracted',
    body: '',
    bodySummary: '',
    type: 'audio',
    mood: 'bad',
    transcription: 'Today was tough. My body felt heavy and I struggled to focus at work. I did my best to eat well and took a short walk at lunch. Sometimes the pain just takes over everything, but I\'m trying to be gentle with myself.',
    preview: 'Today was tough. My body felt heavy and I struggled to focus at work...',
    activities: [
      { category: 'Meals', title: 'High Protein Oatmeal', color: '#D99C8F', time: '8am' },
      { category: 'Movement', title: 'Pelvic Floor Lengthening', color: '#A36456', time: '12pm' },
    ],
  },
  {
    id: 3,
    title: 'Inspired by Art',
    date: '2025-05-15',
    summary: '<b>Body:</b> Energized<br/><b>Mind:</b> Creative, inspired',
    body: 'Went for a walk and got super inspired by my surroundings. Painted for a few hours. Great day for my art. The colors seemed so vibrant today, and I felt this incredible surge of creativity that I haven\'t experienced in months.',
    bodySummary: '',
    type: 'text',
    mood: 'excellent',
    preview: 'Went for a walk and got super inspired by my surroundings. Painted for a few hours...',
    activities: [
      { category: 'Meals', title: 'Rainbow Bowl', color: '#D99C8F', time: '12pm' },
      { category: 'Mental Health', title: 'Somatic Trauma Healing', color: '#082026', time: '5pm' },
    ],
  },
  {
    id: 4,
    title: 'Evening Audio',
    date: '2025-05-14',
    summary: '<b>Body:</b> Tired, mild pain<br/><b>Mind:</b> Calm',
    body: '',
    bodySummary: '',
    type: 'audio',
    mood: 'average',
    transcription: 'Felt tired after work but managed to do a short meditation. Dinner was light and easy. The meditation really helped center me after a long day.',
    preview: 'Felt tired after work but managed to do a short meditation. Dinner was light and easy...',
    activities: [
      { category: 'Meals', title: 'Green Goddess Soup', color: '#D99C8F', time: '6pm' },
      { category: 'Sleep', title: 'Warm Bath', color: '#1E6E8B', time: '30-60min before bed' },
    ],
  },
  {
    id: 5,
    title: 'Flare Day',
    date: '2025-05-13',
    summary: '<b>Body:</b> Tense, cramping, low energy<br/><b>Mind:</b> Frustrated, disconnected, tired',
    body: 'Woke up already cramping. Cancelled a meeting. The pain is one of those days where everything feels impossible. Trying to remind myself that this will pass.',
    bodySummary: '',
    type: 'text',
    mood: 'bad',
    preview: 'Woke up already cramping. Cancelled a meeting. The pain is one of those days...',
    activities: [
      { category: 'Meals', title: 'Apple and Peanut Butter', color: '#D99C8F', time: '3pm' },
      { category: 'Movement', title: 'Pelvic Floor Lengthening', color: '#A36456', time: '3pm' },
    ],
  },
  {
    id: 6,
    title: 'Quick Audio Note',
    date: '2025-05-12',
    summary: '<b>Body:</b> Okay<br/><b>Mind:</b> Focused',
    body: '',
    bodySummary: '',
    type: 'audio',
    mood: 'average',
    transcription: 'Kept meals simple. Focused on work. Did a short walk in the afternoon. Feeling more balanced today.',
    preview: 'Kept meals simple. Focused on work. Did a short walk in the afternoon...',
    activities: [
      { category: 'Meals', title: 'Golden Milk', color: '#D99C8F', time: '8pm' },
    ],
  },
  {
    id: 7,
    title: 'Good Sleep',
    date: '2025-05-11',
    summary: '<b>Body:</b> Rested<br/><b>Mind:</b> Peaceful',
    body: 'Slept well. Took a warm bath before bed. Felt more at ease today. The early bedtime routine is really starting to make a difference in how I feel.',
    bodySummary: '',
    type: 'text',
    mood: 'very good',
    preview: 'Slept well. Took a warm bath before bed. Felt more at ease today...',
    activities: [
      { category: 'Sleep', title: 'Early Bedtime', color: '#1E6E8B', time: 'Bedtime' },
      { category: 'Meals', title: 'Tylers Coffee with Collagen', color: '#D99C8F', time: '7am' },
    ],
  },
  {
    id: 8,
    title: 'Companion Chat',
    date: '2025-05-10',
    summary: '<b>Body:</b> Sore<br/><b>Mind:</b> Supported',
    body: 'Had a long chat with my companion. Felt heard and supported. Did some gentle stretching. It\'s amazing how much talking through my feelings helps process the physical symptoms.',
    bodySummary: '',
    type: 'text',
    mood: 'very good',
    preview: 'Had a long chat with my companion. Felt heard and supported. Did some gentle stretching...',
    activities: [
      { category: 'Movement', title: 'Gentle Yoga or Pilates', color: '#A36456', time: '7:30am' },
    ],
    companion: {
      summary: 'Discussed coping strategies and daily wins',
      duration: '35 min',
      startTime: '6:45pm',
    },
  },
  {
    id: 9,
    title: 'Sunday Reset',
    date: '2025-05-09',
    summary: '<b>Body:</b> Calm<br/><b>Mind:</b> Reflective',
    body: 'Meal prepped for the week. Did a meditation. Ready for Monday. Sunday rituals are becoming such an anchor for me.',
    bodySummary: '',
    type: 'text',
    mood: 'excellent',
    preview: 'Meal prepped for the week. Did a meditation. Ready for Monday...',
    activities: [
      { category: 'Meals', title: 'Rainbow Bowl', color: '#D99C8F', time: '12pm' },
      { category: 'Mental Health', title: 'Pelvic Floor Relaxation Meditation', color: '#082026', time: '7:50am' },
    ],
  },
  {
    id: 10,
    title: 'Audio Recap',
    date: '2025-05-08',
    summary: '<b>Body:</b> Fatigued<br/><b>Mind:</b> Hopeful',
    body: '',
    bodySummary: '',
    type: 'audio',
    mood: 'average',
    transcription: 'Felt tired but hopeful. Did my best to stick to my care plan. Some days are just about showing up.',
    preview: 'Felt tired but hopeful. Did my best to stick to my care plan...',
    activities: [
      { category: 'Meals', title: 'High Protein Oatmeal', color: '#D99C8F', time: '8am' },
      { category: 'Movement', title: 'Gentle Yoga or Pilates', color: '#A36456', time: '7:30am' },
    ],
  },
];

type GroupedEntries = { [key: string]: JournalEntry[] };

function groupEntriesByMonth(entries: JournalEntry[]): GroupedEntries {
  const groups: GroupedEntries = {};
  entries.forEach(entry => {
    const [year, month] = entry.date.split('-');
    const key = `${year}-${month}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
  });
  return groups;
}

const monthNames = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Journal: React.FC = () => {
  const [showAudio, setShowAudio] = useState(false);
  const [showType, setShowType] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showActionIcons, setShowActionIcons] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("Tap to start recording");
  const [recordingStart, setRecordingStart] = useState<Date | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [journalText, setJournalText] = useState('');
  const [searchText, setSearchText] = useState('');

  // Filter entries based on search text
  const filteredEntries = journalEntries.filter(entry => {
    if (!searchText.trim()) return true;
    const searchLower = searchText.toLowerCase();
    return (
      entry.title.toLowerCase().includes(searchLower) ||
      entry.body.toLowerCase().includes(searchLower) ||
      entry.transcription?.toLowerCase().includes(searchLower) ||
      entry.preview?.toLowerCase().includes(searchLower) ||
      entry.mood.toLowerCase().includes(searchLower) ||
      entry.activities.some(activity => 
        activity.title.toLowerCase().includes(searchLower) ||
        activity.category.toLowerCase().includes(searchLower)
      )
    );
  });

  const grouped = groupEntriesByMonth(filteredEntries);
  const mostRecentKey = Object.keys(grouped).sort().reverse()[0];
  const entryCount = journalEntries.length;

  // Handle search submission
  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Search is already happening through filtering, so we can just focus out
      (e.target as HTMLInputElement).blur();
    }
  };

  // Download logic
  const handleDownload = (entry: JournalEntry) => {
    const data = {
      ...entry,
      date: entry.date,
      activities: entry.activities,
      companion: entry.companion,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entry.title.replace(/\s+/g, '_')}_${entry.date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRecordToggle = () => {
    setIsRecording(prev => !prev);
    if (!isRecording) {
      setRecordingStatus("Recording...");
      setRecordingStart(new Date());
    } else {
      setRecordingStatus("Tap to start recording");
    }
  };

  const handleFinishRecording = () => {
    if ((!recordingStart && !isRecording) && !selectedMood) {
      return;
    }

    const endTime = new Date();
    const duration = recordingStart ? Math.round((endTime.getTime() - recordingStart.getTime()) / 1000) : 0;
    const simulatedTranscription = recordingStart ? `Audio entry recorded for ${duration}s. Reflecting on today's feelings and experiences.` : "Mood recorded without audio.";
    const simulatedTitle = recordingStart ? `Audio - ${new Date(recordingStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : `Mood - ${new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Reset states and close overlay
    setIsRecording(false);
    setRecordingStatus("Tap to start recording");
    setRecordingStart(null);
    setSelectedMood(null);
    setShowActionIcons(false);
    setShowAudio(false);
  };

  const handleSaveTextEntry = () => {
    if (journalText.trim() === '' && !selectedMood) {
      return;
    }

    const words = journalText.trim().split(/\s+/);
    const title = journalText.trim() ? (words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '')) : 'Mood Entry';

    // Reset states and close overlay
    setJournalText('');
    setSelectedMood(null);
    setShowType(false);
  };

  const handleCloseAudioOverlay = () => {
    setIsRecording(false);
    setRecordingStatus("Tap to start recording");
    setRecordingStart(null);
    setSelectedMood(null);
    setShowActionIcons(false);
    setShowAudio(false);
  };

  const handleCloseTypeOverlay = () => {
    setJournalText('');
    setSelectedMood(null);
    setShowType(false);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchText('');
  };

  // Mood selector component
  const MoodSelector = ({ selectedMood, onSelectMood }: { selectedMood: string | null, onSelectMood: (mood: string) => void }) => (
    <div className="my-4">
      <p style={{ fontSize: 14, fontWeight: 500, textAlign: 'center', color: '#311D00', marginBottom: 8 }}>How are you feeling?</p>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: 4, padding: '0 8px' }}>
        {moodLabels.map(mood => (
          <button 
            key={mood} 
            onClick={() => onSelectMood(mood)}
            style={{
              padding: '4px 8px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              transition: 'all 0.15s ease-in-out',
              background: selectedMood === mood ? moodColors[mood] : '#F5F1ED',
              color: selectedMood === mood ? '#fff' : '#6F5E53',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '20%',
              height: 32,
              justifyContent: 'center',
              transform: selectedMood === mood ? 'scale(1.05)' : 'scale(1)',
              boxShadow: selectedMood === mood ? '0 2px 6px rgba(49,29,0,0.15)' : 'none'
            }}
          >
            {mood.replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>
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
          <div style={{ filter: 'brightness(0) saturate(100%) invert(10%) sepia(41%) saturate(582%) hue-rotate(24deg) brightness(98%) contrast(97%)' }}>
            <img src={pencilLine} alt="Journal" style={{ width: 32, height: 32 }} />
          </div>
          <h1 style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontWeight: 700, fontSize: 24, color: '#311D00', margin: 0 }}>Journal</h1>
        </div>
      </div>

      {/* Greeting/ask */}
      <div style={{ padding: '1.5rem 1.5rem 0 1.5rem', position: 'relative', zIndex: 0, marginTop: '80px' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 28, color: '#311D00', marginBottom: 8 }}>
          Tell us how your body and mind are doing today
        </div>
        <p style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontWeight: 400, color: '#311D00', fontSize: 16, marginBottom: 24 }}>
          Nothing is too big or too small to note. Your mind and body are deeply connected, and tuning into both is how we begin to truly understand and support healing. This is the heart of holistic care – and the path to meaningful progress.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
          <button
            style={{
              background: '#E2B6A1',
              color: '#8C5A51',
              fontWeight: 500,
              padding: '12px 24px',
              borderRadius: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: 200,
              boxShadow: '0 4px 12px rgba(49,29,0,0.1)',
              border: 'none',
              cursor: 'pointer',
              fontSize: 16
            }}
            onClick={() => setShowAudio(true)}
            aria-label="Record Audio"
          >
            <div style={{ filter: 'brightness(0) saturate(100%) invert(32%) sepia(24%) saturate(451%) hue-rotate(346deg) brightness(91%) contrast(88%)', marginRight: 8 }}>
              <img src={speechIcon} alt="Audio" style={{ width: 24, height: 24 }} />
            </div>
            Record Audio
          </button>
          <button
            style={{
              background: '#DAEBF0',
              color: '#104457',
              fontWeight: 500,
              padding: '12px 24px',
              borderRadius: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: 200,
              boxShadow: '0 4px 12px rgba(49,29,0,0.1)',
              border: 'none',
              cursor: 'pointer',
              fontSize: 16
            }}
            onClick={() => setShowType(true)}
            aria-label="Type Entry"
          >
            <div style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(48%) saturate(1281%) hue-rotate(184deg) brightness(97%) contrast(98%)', marginRight: 8 }}>
              <img src={pencilLine} alt="Type" style={{ width: 24, height: 24 }} />
            </div>
            Type Entry
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#D9CFC2', margin: '0 0 1.5rem 0', width: '100%' }} />

        {/* Entry count, folder icon, search icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FolderHeart size={20} color="#A36456" />
            <span style={{ fontWeight: 600, color: '#A36456', fontSize: 16 }}>{entryCount} Journal Entries</span>
          </div>
          <button
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: 8, 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              position: 'relative', 
              zIndex: 15,
              borderRadius: '50%'
            }}
            onClick={() => setShowSearch(true)}
            aria-label="Search Journal"
          >
            <Search size={22} color={showSearch ? "#fff" : "#A36456"} />
          </button>

          {/* Search bar overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 35,
            background: '#6F5E53',
            borderRadius: 8,
            padding: 12,
            boxShadow: '0 4px 12px rgba(49,29,0,0.15)',
            zIndex: 14,
            transform: showSearch ? 'translateX(0) scaleX(1)' : 'translateX(20px) scaleX(0)',
            transformOrigin: 'right center',
            transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
            opacity: showSearch ? 1 : 0,
            minWidth: 360
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="text"
                placeholder="Search journal entries..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleSearchSubmit}
                style={{
                  flex: 1,
                  padding: 8,
                  borderRadius: 6,
                  border: 'none',
                  background: '#fff',
                  color: '#311D00',
                  fontSize: 14,
                  outline: 'none'
                }}
                autoFocus={showSearch}
              />
              <button
                onClick={handleCloseSearch}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: 4 }}
                aria-label="Close Search"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Journal entries */}
        <div style={{ marginTop: 16, position: 'relative', zIndex: 5 }}>
          {mostRecentKey && (
            <>
              <div style={{ fontWeight: 700, color: '#A36456', fontSize: 16, marginBottom: 8 }}>{monthNames[parseInt(mostRecentKey.split('-')[1], 10)]} {mostRecentKey.split('-')[0]}</div>
              {grouped[mostRecentKey].map(entry => {
                const expanded = expandedId === entry.id;
                return (
                  <div key={entry.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '1rem', marginBottom: 16, cursor: 'pointer', transition: 'box-shadow 0.2s', position: 'relative' }}>
                    {/* Header with title, mood, timestamp, and icons */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#311D00', fontSize: 17 }}>{entry.title}</div>
                        <span style={{ background: '#fff', color: moodColors[entry.mood], border: `2px solid ${moodColors[entry.mood]}`, borderRadius: 8, fontSize: 13, fontWeight: 600, padding: '2px 10px' }}>
                          {entry.mood.replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ color: '#A36456', fontSize: 14 }}>{new Date(entry.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        {entry.type === 'audio' && (
                          <Mic size={20} color="#A36456" />
                        )}
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); handleDownload(entry); }} aria-label="Download Entry">
                          <Download size={20} color="#A36456" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Summary */}
                    {entry.summary && <div style={{ color: '#A36456', fontSize: 14, marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: entry.summary }} />}
                    
                    {/* Preview text (always shown) */}
                    <div style={{ color: '#311D00', fontSize: 15, marginBottom: 8, cursor: 'pointer' }} onClick={() => setExpandedId(expanded ? null : entry.id)}>
                      {entry.preview}
                    </div>

                    {/* Audio player for audio entries */}
                    {entry.type === 'audio' && (
                      <div style={{ background: '#F5E9E2', borderRadius: 8, padding: '8px 12px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button style={{ background: '#E2B6A1', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <div style={{ width: 0, height: 0, borderLeft: '8px solid #fff', borderTop: '5px solid transparent', borderBottom: '5px solid transparent', marginLeft: 2 }} />
                        </button>
                        <div style={{ flex: 1, height: 4, background: '#D9CFC2', borderRadius: 2, position: 'relative' }}>
                          <div style={{ width: '30%', height: '100%', background: '#E2B6A1', borderRadius: 2 }} />
                        </div>
                        <span style={{ color: '#A36456', fontSize: 12 }}>2:34</span>
                      </div>
                    )}

                    {/* Expandable content */}
                    {expanded && (
                      <div style={{ marginTop: 8 }}>
                        {entry.type === 'audio' ? (
                          <>
                            <div style={{ fontWeight: 600, color: '#311D00', fontSize: 15, marginBottom: 8 }}>Transcription:</div>
                            <div style={{ color: '#311D00', fontSize: 15 }}>{entry.transcription}</div>
                          </>
                        ) : (
                          <div style={{ color: '#311D00', fontSize: 15 }}>{entry.body}</div>
                        )}
                        {/* Activities summary */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                          {entry.activities.map((act, i) => (
                            <div key={i} style={{ background: act.color, color: '#fff', borderRadius: 8, padding: '6px 12px', fontWeight: 600, fontSize: 14, minWidth: 120, textAlign: 'center' }}>
                              {act.title} <span style={{ fontWeight: 400, fontSize: 13, opacity: 0.9 }}>({act.time})</span>
                            </div>
                          ))}
                          {entry.companion && (
                            <div style={{ background: '#A36456', color: '#fff', borderRadius: 8, padding: '6px 12px', fontWeight: 600, fontSize: 14, minWidth: 120, textAlign: 'center' }}>
                              {entry.companion.summary} <span style={{ fontWeight: 400, fontSize: 13, opacity: 0.9 }}>({entry.companion.duration} at {entry.companion.startTime})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Chevron toggle in bottom right */}
                    <button 
                      style={{ 
                        position: 'absolute', 
                        bottom: 12, 
                        right: 12, 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }} 
                      onClick={e => { e.stopPropagation(); setExpandedId(expanded ? null : entry.id); }}
                      aria-label={expanded ? "Collapse entry" : "Expand entry"}
                    >
                      <ChevronDown size={20} color="#A36456" />
                    </button>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* Audio Recording Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(245, 241, 237, 0.95)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'transform 0.7s ease-in-out',
        transform: showAudio ? 'translateY(0)' : 'translateY(-100%)',
        pointerEvents: showAudio ? 'auto' : 'none'
      }}>
        <div style={{ width: '100%', maxWidth: 512, margin: '0 auto', padding: '1rem 1.5rem', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', flexGrow: 1, height: '100%' }}>
          
          {/* Close button - top right */}
          <button 
            onClick={handleCloseAudioOverlay}
            style={{ position: 'absolute', top: 24, right: 24, color: '#311D00', background: 'transparent', border: 'none', cursor: 'pointer', zIndex: 20 }}
          >
            <X size={30} />
          </button>

          {/* Menu button with sliding actions - top left */}
          <div style={{ position: 'absolute', top: 24, left: 24, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', zIndex: 20 }}>
            <button 
              onClick={() => setShowActionIcons(!showActionIcons)}
              style={{ 
                padding: 8, 
                borderRadius: '50%',
                color: '#311D00',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
              aria-label="Toggle menu"
            >
              <Menu size={28} />
            </button>
            
            {/* Sliding action icons row */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              gap: 12, 
              marginTop: 8,
              transform: showActionIcons ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'left center',
              transition: 'transform 0.3s ease-in-out',
              opacity: showActionIcons ? 1 : 0
            }}>
              <button 
                onClick={handleSaveTextEntry}
                style={{ 
                  padding: 8, 
                  borderRadius: '50%',
                  color: '#1E6E8B',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40
                }}
                aria-label="Save entry"
              >
                <Save size={20} />
              </button>
              <button 
                onClick={() => setIsMuted(prev => !prev)}
                style={{ 
                  padding: 8, 
                  borderRadius: '50%',
                  color: isMuted ? '#ef4444' : '#A36456',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40
                }}
                aria-label="Toggle mute"
              >
                {isMuted ? <VolumeX size={20} /> : <Mic size={20} />}
              </button>
              <button 
                style={{ 
                  padding: 8, 
                  borderRadius: '50%',
                  color: '#D99C8F',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40
                }}
                aria-label="Delete entry"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          {/* Mood selector */}
          <div style={{ marginTop: 80, marginBottom: 24, width: '100%' }}>
            <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />
          </div>

          {/* Recording button and status */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
            <button
              onClick={handleRecordToggle}
              style={{
                position: 'relative',
                width: 160,
                height: 160,
                background: '#E2B6A1',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(49,29,0,0.2)',
                border: 'none',
                cursor: 'pointer',
                animation: isRecording ? 'recordingSpinSlow 4s linear infinite' : 'pulseSlow 2s cubic-bezier(0.4,0,0.6,1) infinite',
                marginBottom: 20
              }}
              aria-label={isRecording ? "Stop recording" : "Start recording"}
            >
              <img src={speechIcon} alt="Record" style={{ width: 80, height: 80 }} />
            </button>
            <p style={{ color: '#311D00', fontSize: 18, textAlign: 'center', maxWidth: 280, fontFamily: 'Playfair Display, serif' }}>
              {recordingStatus}
            </p>
          </div>
        </div>

        {/* Finished button */}
        <button 
          onClick={handleFinishRecording}
          style={{
            background: '#8C5A51',
            color: '#fff',
            fontWeight: 600,
            padding: '12px 32px',
            borderRadius: 8,
            marginBottom: 32,
            boxShadow: '0 4px 16px rgba(49,29,0,0.15)',
            border: 'none',
            cursor: 'pointer',
            fontSize: 16,
            width: 'auto',
            alignSelf: 'center'
          }}
        >
          Finished
        </button>
      </div>

      {/* Text Entry Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(245, 241, 237, 0.95)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        transition: 'transform 0.7s ease-in-out',
        transform: showType ? 'translateY(0)' : 'translateY(100%)',
        pointerEvents: showType ? 'auto' : 'none'
      }}>
        <div style={{ width: '100%', maxWidth: 512, margin: '0 auto', padding: '1rem 1.5rem', position: 'relative', display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%' }}>
          
          {/* Header with close and save buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingTop: 8 }}>
            <h2 style={{ fontSize: 24, fontFamily: 'Playfair Display, serif', color: '#311D00', margin: 0 }}>How are you feeling?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button 
                onClick={handleCloseTypeOverlay}
                style={{ color: '#311D00', background: 'transparent', border: 'none', padding: 8, borderRadius: '50%', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
              <button 
                onClick={handleSaveTextEntry}
                style={{ color: '#1E6E8B', background: 'transparent', border: 'none', padding: 8, borderRadius: '50%', cursor: 'pointer' }}
                aria-label="Save entry"
              >
                <Save size={24} />
              </button>
            </div>
          </div>

          {/* Mood selector */}
          <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />

          {/* Text area */}
          <textarea 
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Share your thoughts..."
            style={{
              width: '100%',
              padding: 12,
              border: '1.5px solid #D9CFC2',
              borderRadius: 8,
              fontSize: 14,
              background: '#fff',
              color: '#000',
              resize: 'none',
              outline: 'none',
              height: 'calc(50vh - 160px)',
              fontFamily: 'Inter, Arial, Helvetica, sans-serif'
            }}
          />

          {/* Save button (floating) */}
          <button 
            onClick={handleSaveTextEntry}
            style={{
              position: 'absolute',
              bottom: 24,
              right: 24,
              background: '#1E6E8B',
              color: '#fff',
              padding: 16,
              borderRadius: '50%',
              boxShadow: '0 4px 16px rgba(49,29,0,0.15)',
              border: 'none',
              cursor: 'pointer',
              zIndex: 50
            }}
            aria-label="Save journal entry"
          >
            <Edit3 size={24} />
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes recordingSpinSlow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes pulseSlow {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.05);
            }
          }
        `
      }} />
    </div>
  );
};

export default Journal; 