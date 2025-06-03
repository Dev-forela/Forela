import React, { useState, useRef, useEffect } from 'react';
import personalizedCareIcon from '../assets/images/Personalized care Vector.png';
import chevronDown from '../assets/images/chevron-down.png';
import chevronUp from '../assets/images/chevron-up.png';
import checkboxSelected from '../assets/images/Checkbox-selected.png';
import checkboxUnselected from '../assets/images/Checkbox.png';
import repeatReplaceIcon from '../assets/images/repeat-replace.png';
import ActivityOverlay from '../components/shared/ActivityOverlay';

// Import specific images for each activity
import coffeeImg from '../assets/images/coffee.png';
import oatmealImg from '../assets/images/oatmeal.png';
import rainbowImg from '../assets/images/rainbow.png';
import appleImg from '../assets/images/apple.png';
import greengoddessImg from '../assets/images/greengoddess.png';
import ramenImg from '../assets/images/ramen.png';
import yogaImg from '../assets/images/yoga.png';
import pelvicFloorImg from '../assets/images/pelvic floor.png';
import meditateImg from '../assets/images/meditate.png';
import somaticImg from '../assets/images/somatic.png';
import bathImg from '../assets/images/bath.png';
import bedImg from '../assets/images/bed.png';

const mealsData = {
  title: 'Meals',
  percent: 20,
  color: '#D99C8F',
  activities: [
    { 
      id: 1,
      time: '7am', 
      image: coffeeImg, 
      desc: 'One cup of Tylers Coffee Acid Free with one scoop of Needed Prenatal Collagen Protein',
      completed: true,
      repeating: false
    },
    { 
      id: 2,
      time: '8am', 
      image: oatmealImg, 
      desc: 'High Protein Oatmeal with Almonds and Blueberries',
      completed: false,
      repeating: true
    },
    { 
      id: 3,
      time: '12pm', 
      image: rainbowImg, 
      desc: 'Rainbow Bowl with Olive Oil and Sea Salt',
      completed: false,
      repeating: false
    },
    { 
      id: 4,
      time: '3pm', 
      image: appleImg, 
      desc: 'Apple and Peanut Butter',
      completed: false,
      repeating: true
    },
    { 
      id: 5,
      time: '6pm', 
      image: greengoddessImg, 
      desc: 'Green Goddess Soup',
      completed: false,
      repeating: false
    },
    { 
      id: 6,
      time: '8pm', 
      image: ramenImg, 
      desc: 'Golden Milk',
      completed: false,
      repeating: true
    },
  ],
};

const movementData = {
  title: 'Movement',
  percent: 33,
  color: '#A36456',
  activities: [
    { 
      id: 7,
      time: '7:30am', 
      image: yogaImg, 
      desc: '20min Gentle Yoga or Pilates',
      completed: true,
      repeating: true
    },
    { 
      id: 8,
      time: '12pm', 
      image: pelvicFloorImg, 
      desc: '3min Pelvic Floor Lengthening, Seated',
      completed: false,
      repeating: true
    },
    { 
      id: 9,
      time: '3pm', 
      image: pelvicFloorImg, 
      desc: '3min Pelvic Floor Lengthening, Seated',
      completed: false,
      repeating: true
    },
  ],
};

const mentalData = {
  title: 'Mental Health',
  percent: 0,
  color: '#082026',
  activities: [
    { 
      id: 10,
      time: '7:50am', 
      image: meditateImg, 
      desc: '10min Pelvic Floor Relaxation Meditation',
      completed: false,
      repeating: true
    },
    { 
      id: 11,
      time: '5pm', 
      image: somaticImg, 
      desc: '20min Somatic Trauma Healing',
      completed: false,
      repeating: false
    },
  ],
};

const sleepData = {
  title: 'Sleep',
  percent: 0,
  color: '#1E6E8B',
  activities: [
    { 
      id: 12,
      time: '30-60min before bed', 
      image: bathImg, 
      desc: 'A warm bath before bedtime can help relax your muscles and soothe your pelvic area, promoting a more restful night\'s sleep.',
      completed: false,
      repeating: false
    },
    { 
      id: 13,
      time: 'Bedtime', 
      image: bedImg, 
      desc: 'Try heading to bed around 9pm tonight to support recovery from last night\'s limited sleep. Giving your body and mind this extra rest can help you feel more restored for tomorrow.',
      completed: false,
      repeating: false
    },
  ],
};

interface Activity {
  id: number;
  time: string;
  image: string;
  desc: string;
  completed: boolean;
  repeating: boolean;
}

const Accordion: React.FC<{
  title: string;
  percent: number;
  color: string;
  activities: Activity[];
}> = ({ title, percent: initialPercent, color, activities }) => {
  const [open, setOpen] = useState(false);
  const [activityStates, setActivityStates] = useState<{[key: number]: boolean}>(
    activities.reduce((acc, activity) => ({ ...acc, [activity.id]: activity.completed }), {})
  );
  const [overlayActivity, setOverlayActivity] = useState<Activity | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // If this is the Sleep accordion, do not show checkboxes or percent completed
  const isSleep = title === 'Sleep';

  // Calculate percent completed based on activityStates
  const completedCount = Object.values(activityStates).filter(Boolean).length;
  const percent = Math.round((completedCount / activities.length) * 100);

  useEffect(() => {
    if (contentRef.current) {
      // Add 8px to the height so the drawer sits a few pixels higher
      setHeight(open ? contentRef.current.scrollHeight + 8 : 0);
    }
  }, [open, activityStates]);

  const toggleActivity = (id: number) => {
    setActivityStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleActivityClick = (activity: Activity) => {
    setOverlayActivity(activity);
    setIsBookmarked(false);
    setIsCompleted(activity.completed);
  };

  const handleOverlayClose = () => setOverlayActivity(null);
  const handleBookmarkToggle = () => setIsBookmarked((b) => !b);
  const handleReplace = () => alert('Replace action!');
  const handleCompleteToggle = () => setIsCompleted((c) => !c);

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          background: color,
          color: '#fff',
          border: 'none',
          borderRadius: '0.75rem',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: 600,
          fontSize: '1.1rem',
          fontFamily: 'var(--font-sans)',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }}
      >
        <span style={{ textAlign: 'left' }}>{title}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!isSleep && (
            <span style={{ fontWeight: 500, fontSize: '0.98rem', color: '#fff', opacity: 0.85 }}>
              {percent}% Completed
            </span>
          )}
          <img 
            src={open ? chevronUp : chevronDown} 
            alt="chevron" 
            style={{ 
              width: 24, 
              height: 24,
              transition: 'transform 0.3s ease'
            }} 
          />
        </span>
      </button>
      
      <div
        style={{
          height: height,
          overflow: 'hidden',
          transition: 'height 1.2s cubic-bezier(0.4,0,0.2,1)',
          background: '#ffffff',
          borderTopLeftRadius: open ? 0 : '0.75rem',
          borderTopRightRadius: open ? 0 : '0.75rem',
          borderBottomLeftRadius: '0.75rem',
          borderBottomRightRadius: '0.75rem',
          boxShadow: open ? 'var(--shadow-sm)' : 'none',
          marginTop: open ? '-8px' : 0,
        }}
      >
        <div 
          ref={contentRef}
          style={{ 
            padding: '1.25rem',
            color: '#311D00'
          }}
        >
          <div>
            {activities.map((activity, i) => {
              const completed = activityStates[activity.id];
              return (
                <div 
                  key={activity.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    marginBottom: i === activities.length - 1 ? 0 : '1.5rem',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    background: completed && !isSleep ? '#EAE9E5' : '#FFFFFF',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'background 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleActivityClick(activity)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  }}
                >
                  <img 
                    src={activity.image} 
                    alt={activity.time} 
                    style={{ 
                      width: 56, 
                      height: 56, 
                      borderRadius: 8, 
                      objectFit: 'cover', 
                      marginRight: 16, 
                      flexShrink: 0,
                      border: '2px solid rgba(0,0,0,0.1)'
                    }} 
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{ fontWeight: 600, fontSize: '1rem', color: '#311D00' }}>
                        {activity.time}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        {!isSleep && (
                          <button
                            onClick={() => toggleActivity(activity.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              borderRadius: '4px',
                              width: 32,
                              height: 32,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              outline: 'none',
                              boxShadow: 'none',
                            }}
                            title={completed ? "Mark as incomplete" : "Mark as complete"}
                            tabIndex={0}
                          >
                            <img 
                              src={completed ? checkboxSelected : checkboxUnselected} 
                              alt={completed ? "Completed" : "Not completed"} 
                              style={{ width: 20, height: 20 }} 
                            />
                          </button>
                        )}
                        <button
                          style={{
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            outline: 'none',
                            boxShadow: 'none',
                          }}
                          title="Repeating activity"
                          tabIndex={0}
                        >
                          <img 
                            src={repeatReplaceIcon} 
                            alt="Repeat" 
                            style={{ width: 20, height: 20 }} 
                          />
                        </button>
                      </div>
                    </div>
                    <div style={{
                      fontSize: '0.95rem',
                      opacity: 0.95,
                      lineHeight: 1.4,
                      color: '#311D00',
                      maxHeight: 40,
                      overflow: 'hidden',
                      position: 'relative',
                    }}>
                      <span style={{
                        display: 'inline-block',
                        WebkitMaskImage: 'linear-gradient(180deg, #000 60%, transparent 100%)',
                        maskImage: 'linear-gradient(180deg, #000 60%, transparent 100%)',
                        fontFamily: 'inherit',
                      }}>{activity.desc}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Activity Overlay */}
      <ActivityOverlay
        open={!!overlayActivity}
        onClose={handleOverlayClose}
        activity={overlayActivity}
        isBookmarked={isBookmarked}
        onBookmarkToggle={handleBookmarkToggle}
        onReplace={handleReplace}
        onCompleteToggle={handleCompleteToggle}
        isCompleted={isCompleted}
      >
        {overlayActivity && (
          <div>
            <img src={overlayActivity.image} alt={overlayActivity.time} style={{ width: '100%', borderRadius: 12, marginBottom: 12 }} />
            <div style={{ fontWeight: 700, fontSize: 18, color: '#311D00', marginBottom: 4 }}>{overlayActivity.desc.split(' ')[0]} Soup with Micro Greens and Coconut Milk</div>
            <div style={{ color: '#A36456', fontSize: 14, marginBottom: 12 }}>Low-FODMAP, dairy-free, and flavorful without irritants.</div>
            <div style={{ fontSize: 15, color: '#311D00', marginBottom: 16 }}>{overlayActivity.desc}</div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Ingredients</div>
            <div style={{ fontWeight: 500, marginBottom: 2 }}>For the Soup:</div>
            <ul style={{ margin: 0, paddingLeft: 18, marginBottom: 8 }}>
              <li>1 small head of cauliflower, cut into florets</li>
              <li>1 medium carrot, sliced</li>
              <li>1 small parsnip (optional, for sweetness), peeled & chopped</li>
              <li>2 tablespoons olive oil</li>
              <li>½ teaspoon dried thyme</li>
              <li>½ teaspoon ground turmeric (optional, anti-inflammatory)</li>
              <li>2½ cups low-sodium vegetable broth (IC-friendly, no onion/garlic)</li>
              <li>½ cup unsweetened coconut milk (from a can or carton — IC-safe)</li>
              <li>Sea salt & black pepper (if tolerated), to taste</li>
            </ul>
            <div style={{ fontWeight: 500, marginBottom: 2 }}>For Topping:</div>
            <ul style={{ margin: 0, paddingLeft: 18, marginBottom: 12 }}>
              <li>2 tablespoons coconut milk (for swirl)</li>
              <li>Microgreens (e.g., pea shoots, broccoli sprouts, or radish microgreens — IC-safe in small amounts)</li>
              <li>Optional: a few pink peppercorns or chive oil for garnish</li>
            </ul>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Instructions</div>
            <ol style={{ margin: 0, paddingLeft: 18, marginBottom: 12 }}>
              <li><b>Roast the Veggies</b>
                <ul>
                  <li>Preheat oven to 400°F (200°C).</li>
                  <li>Toss cauliflower, carrot, and parsnip with olive oil, thyme, turmeric, and sea salt.</li>
                  <li>Roast for 25–30 minutes, until golden and tender.</li>
                </ul>
              </li>
              <li><b>Blend the Soup</b>
                <ul>
                  <li>Transfer roasted vegetables to a blender or use an immersion blender.</li>
                  <li>Add broth and ½ cup coconut milk, and blend until smooth.</li>
                  <li>If needed, add a bit more broth for a thinner texture.</li>
                </ul>
              </li>
              <li><b>Warm and Adjust</b>
                <ul>
                  <li>Pour blended soup into a pot and warm over medium-low heat.</li>
                  <li>Taste and adjust salt or herbs.</li>
                </ul>
              </li>
              <li><b>Serve</b>
                <ul>
                  <li>Ladle into bowls.</li>
                  <li>Swirl a spoonful of coconut milk on top.</li>
                  <li>Garnish with microgreens and optional pink peppercorns or herbs.</li>
                </ul>
              </li>
            </ol>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Why It Works</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>No onions, garlic, or acidic ingredients.</li>
              <li>Roasting adds natural sweetness without needing extra sugar.</li>
              <li>Coconut milk adds creaminess without dairy irritation.</li>
              <li>Topped with fresh micro greens for texture and nutrients.</li>
            </ul>
          </div>
        )}
      </ActivityOverlay>
    </div>
  );
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 5) return 'Good Night';
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 20) return 'Good Evening';
  return 'Good Night';
};

const MyProfile: React.FC = () => {
  const greeting = getGreeting();
  return (
    <div style={{ padding: '1.5rem 0', background: '#EAE9E5' }}>
      {/* Greeting and summary */}
      <section style={{ background: '#EAE9E5', borderRadius: '1rem', padding: '2rem 1.5rem', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 32, lineHeight: '45px', letterSpacing: 0, marginBottom: '0.5rem', color: '#311d00' }}>
          {greeting}, Olivia.
        </h2>
        <p style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontWeight: 400, lineHeight: '100%', letterSpacing: 0, color: 'var(--color-text-main)', fontSize: '1rem', marginBottom: '1.5rem' }}>
          You've made meaningful progress over the past six weeks — with a 60% improvement in pain, bladder urgency, and constipation. Your care is working and we're here to continue supporting you. Keep listening to your body.
        </p>
        <button className="journal-btn">
          Continue to Journal
        </button>
      </section>

      {/* Personalized Care Section */}
      <section style={{ marginBottom: '2rem', maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto', padding: 0 }}>
        <div style={{ background: '#eae9e5', borderRadius: '1rem', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', maxWidth: '100%', margin: 0 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text-main)', marginBottom: '1rem', marginLeft: 0 }}>
            <img src={personalizedCareIcon} alt="Personalized Care" style={{ marginRight: '0.5rem', width: 24, height: 24 }} />
            Today's Personalized Care
          </h3>
          <p style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontWeight: 400, lineHeight: '100%', letterSpacing: 0, color: 'var(--color-text-main)', fontSize: '1rem', marginBottom: '1.5rem', marginLeft: 0 }}>
            Based on your limited sleep, your work-from-home schedule, and what's in your fridge, today's care revolves around gentle movement, support for your nervous system, and meals that nourish your gut and bladder. Let's ease into the day with intention.
          </p>
          <div style={{ background: '#eae9e5', borderRadius: '1rem', padding: '1.5rem 0 0 0', boxShadow: 'var(--shadow-sm)', maxWidth: '100%', margin: 0 }}>
            <Accordion {...mealsData} />
            <Accordion {...movementData} />
            <Accordion {...mentalData} />
            <Accordion {...sleepData} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyProfile; 