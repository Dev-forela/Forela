import { 
  OuraData, 
  OuraSleepData, 
  OuraActivityData, 
  OuraReadinessData, 
  OuraHeartRateData, 
  OuraWorkoutData, 
  OuraSessionData, 
  OuraTagData, 
  OuraEnhancedTagData,
  UnifiedHealthData 
} from '../types/health';

const OURA_API_BASE_URL = 'https://api.ouraring.com/v2';

// OAuth2 configuration
const OURA_OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_OURA_CLIENT_ID,
  redirectUri: import.meta.env.VITE_OURA_REDIRECT_URI || `${window.location.origin}/settings`,
  scope: 'email personal daily'
};

export interface OuraTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

// Generate OAuth2 authorization URL
export const getOuraAuthUrl = (): string => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: OURA_OAUTH_CONFIG.clientId || '',
    redirect_uri: OURA_OAUTH_CONFIG.redirectUri,
    scope: OURA_OAUTH_CONFIG.scope,
    state: generateRandomState()
  });

  return `https://cloud.ouraring.com/oauth/authorize?${params.toString()}`;
};

// Generate random state for OAuth2 security
const generateRandomState = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Exchange authorization code for access token
export const exchangeOuraCode = async (code: string): Promise<OuraTokenResponse> => {
  const response = await fetch('https://api.ouraring.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: OURA_OAUTH_CONFIG.redirectUri,
      client_id: OURA_OAUTH_CONFIG.clientId || '',
      client_secret: import.meta.env.VITE_OURA_CLIENT_SECRET || ''
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to exchange Oura code: ${response.statusText}`);
  }

  return response.json();
};

// Refresh access token
export const refreshOuraToken = async (refreshToken: string): Promise<OuraTokenResponse> => {
  const response = await fetch('https://api.ouraring.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: OURA_OAUTH_CONFIG.clientId || '',
      client_secret: import.meta.env.VITE_OURA_CLIENT_SECRET || ''
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh Oura token: ${response.statusText}`);
  }

  return response.json();
};

// Make authenticated API request
const makeOuraRequest = async (endpoint: string, accessToken: string, params?: Record<string, string>): Promise<any> => {
  const url = new URL(`${OURA_API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Oura token expired');
    }
    throw new Error(`Oura API error: ${response.statusText}`);
  }

  return response.json();
};

// Fetch personal info
export const fetchOuraPersonalInfo = async (accessToken: string): Promise<any> => {
  return makeOuraRequest('/usercollection/personal_info', accessToken);
};

// Fetch sleep data
export const fetchOuraSleepData = async (
  accessToken: string, 
  startDate: string, 
  endDate: string
): Promise<{ data: OuraSleepData[] }> => {
  return makeOuraRequest('/usercollection/daily_sleep', accessToken, {
    start_date: startDate,
    end_date: endDate
  });
};

// Fetch activity data
export const fetchOuraActivityData = async (
  accessToken: string, 
  startDate: string, 
  endDate: string
): Promise<{ data: OuraActivityData[] }> => {
  return makeOuraRequest('/usercollection/daily_activity', accessToken, {
    start_date: startDate,
    end_date: endDate
  });
};

// Fetch readiness data
export const fetchOuraReadinessData = async (
  accessToken: string, 
  startDate: string, 
  endDate: string
): Promise<{ data: OuraReadinessData[] }> => {
  return makeOuraRequest('/usercollection/daily_readiness', accessToken, {
    start_date: startDate,
    end_date: endDate
  });
};

// Fetch heart rate data
export const fetchOuraHeartRateData = async (
  accessToken: string, 
  startDate: string, 
  endDate: string
): Promise<{ data: OuraHeartRateData[] }> => {
  return makeOuraRequest('/usercollection/heartrate', accessToken, {
    start_datetime: `${startDate}T00:00:00`,
    end_datetime: `${endDate}T23:59:59`
  });
};

// Fetch workout data
export const fetchOuraWorkoutData = async (
  accessToken: string, 
  startDate: string, 
  endDate: string
): Promise<{ data: OuraWorkoutData[] }> => {
  return makeOuraRequest('/usercollection/workout', accessToken, {
    start_date: startDate,
    end_date: endDate
  });
};

// Fetch session data (meditation, naps, etc.)
export const fetchOuraSessionData = async (
  accessToken: string, 
  startDate: string, 
  endDate: string
): Promise<{ data: OuraSessionData[] }> => {
  return makeOuraRequest('/usercollection/session', accessToken, {
    start_date: startDate,
    end_date: endDate
  });
};

// Fetch tags data
export const fetchOuraTagData = async (
  accessToken: string, 
  startDate: string, 
  endDate: string
): Promise<{ data: OuraTagData[] }> => {
  return makeOuraRequest('/usercollection/tag', accessToken, {
    start_date: startDate,
    end_date: endDate
  });
};

// Fetch enhanced tags data
export const fetchOuraEnhancedTagData = async (
  accessToken: string, 
  startDate: string, 
  endDate: string
): Promise<{ data: OuraEnhancedTagData[] }> => {
  return makeOuraRequest('/usercollection/enhanced_tag', accessToken, {
    start_date: startDate,
    end_date: endDate
  });
};

// Fetch all Oura data
export const fetchAllOuraData = async (
  accessToken: string, 
  startDate: string, 
  endDate: string
): Promise<OuraData> => {
  try {
    const [
      sleepResponse,
      activityResponse,
      readinessResponse,
      heartRateResponse,
      workoutResponse,
      sessionResponse,
      tagResponse,
      enhancedTagResponse
    ] = await Promise.allSettled([
      fetchOuraSleepData(accessToken, startDate, endDate),
      fetchOuraActivityData(accessToken, startDate, endDate),
      fetchOuraReadinessData(accessToken, startDate, endDate),
      fetchOuraHeartRateData(accessToken, startDate, endDate),
      fetchOuraWorkoutData(accessToken, startDate, endDate),
      fetchOuraSessionData(accessToken, startDate, endDate),
      fetchOuraTagData(accessToken, startDate, endDate),
      fetchOuraEnhancedTagData(accessToken, startDate, endDate)
    ]);

    return {
      sleep: sleepResponse.status === 'fulfilled' ? sleepResponse.value.data : [],
      activity: activityResponse.status === 'fulfilled' ? activityResponse.value.data : [],
      readiness: readinessResponse.status === 'fulfilled' ? readinessResponse.value.data : [],
      heartRate: heartRateResponse.status === 'fulfilled' ? heartRateResponse.value.data : [],
      workouts: workoutResponse.status === 'fulfilled' ? workoutResponse.value.data : [],
      sessions: sessionResponse.status === 'fulfilled' ? sessionResponse.value.data : [],
      tags: tagResponse.status === 'fulfilled' ? tagResponse.value.data : [],
      enhancedTags: enhancedTagResponse.status === 'fulfilled' ? enhancedTagResponse.value.data : []
    };
  } catch (error) {
    console.error('Error fetching Oura data:', error);
    throw error;
  }
};

// Convert Oura data to unified format
export const convertOuraToUnified = (ouraData: OuraData): UnifiedHealthData[] => {
  const unifiedData: Map<string, UnifiedHealthData> = new Map();

  // Process sleep data
  ouraData.sleep.forEach(sleep => {
    const date = sleep.day;
    if (!unifiedData.has(date)) {
      unifiedData.set(date, { date, source: 'oura' });
    }
    const dayData = unifiedData.get(date)!;
    dayData.sleep = {
      duration: sleep.contributors.total_sleep / 3600, // Convert seconds to hours
      efficiency: sleep.contributors.efficiency,
      deepSleep: sleep.contributors.deep_sleep / 3600,
      remSleep: sleep.contributors.rem_sleep / 3600,
      score: sleep.score
    };
  });

  // Process activity data
  ouraData.activity.forEach(activity => {
    const date = activity.day;
    if (!unifiedData.has(date)) {
      unifiedData.set(date, { date, source: 'oura' });
    }
    const dayData = unifiedData.get(date)!;
    dayData.steps = activity.steps;
    dayData.activity = {
      calories: activity.active_calories,
      activeMinutes: activity.high_activity_time + activity.medium_activity_time,
      score: activity.score
    };
  });

  // Process readiness data
  ouraData.readiness.forEach(readiness => {
    const date = readiness.day;
    if (!unifiedData.has(date)) {
      unifiedData.set(date, { date, source: 'oura' });
    }
    const dayData = unifiedData.get(date)!;
    dayData.readiness = {
      score: readiness.score,
      hrv: readiness.contributors.hrv_balance,
      temperature: readiness.temperature_deviation
    };
  });

  // Process heart rate data
  const heartRateByDate: Map<string, number[]> = new Map();
  ouraData.heartRate.forEach(hr => {
    const date = hr.timestamp.split('T')[0];
    if (!heartRateByDate.has(date)) {
      heartRateByDate.set(date, []);
    }
    heartRateByDate.get(date)!.push(hr.bpm);
  });

  heartRateByDate.forEach((bpms, date) => {
    if (!unifiedData.has(date)) {
      unifiedData.set(date, { date, source: 'oura' });
    }
    const dayData = unifiedData.get(date)!;
    const restingBpms = bpms.filter((_, i) => i % 3 === 0); // Approximate resting HR
    dayData.heartRate = {
      resting: Math.min(...restingBpms),
      average: Math.round(bpms.reduce((a, b) => a + b, 0) / bpms.length),
      max: Math.max(...bpms)
    };
  });

  // Process workout data
  ouraData.workouts.forEach(workout => {
    const date = workout.day;
    if (!unifiedData.has(date)) {
      unifiedData.set(date, { date, source: 'oura' });
    }
    const dayData = unifiedData.get(date)!;
    if (!dayData.workouts) {
      dayData.workouts = [];
    }
    
    const startTime = new Date(workout.start_datetime);
    const endTime = new Date(workout.end_datetime);
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    
    dayData.workouts.push({
      type: workout.activity,
      duration,
      calories: workout.calories,
      intensity: workout.intensity
    });
  });

  // Process session data (mindfulness)
  ouraData.sessions.forEach(session => {
    if (session.type === 'meditation' || session.type === 'breathing' || session.type === 'relaxation') {
      const date = session.day;
      if (!unifiedData.has(date)) {
        unifiedData.set(date, { date, source: 'oura' });
      }
      const dayData = unifiedData.get(date)!;
      if (!dayData.mindfulness) {
        dayData.mindfulness = { duration: 0, sessions: 0 };
      }
      
      const startTime = new Date(session.start_datetime);
      const endTime = new Date(session.end_datetime);
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
      
      dayData.mindfulness.duration += duration;
      dayData.mindfulness.sessions += 1;
    }
  });

  return Array.from(unifiedData.values()).sort((a, b) => a.date.localeCompare(b.date));
};

// Generate mock Oura data for development
export const generateMockOuraData = (): OuraData => {
  const now = new Date();
  const mockData: OuraData = {
    sleep: [],
    activity: [],
    readiness: [],
    heartRate: [],
    workouts: [],
    sessions: [],
    tags: [],
    enhancedTags: []
  };

  // Generate 7 days of mock data
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Sleep data
    mockData.sleep.push({
      id: `sleep_${dateStr}`,
      contributors: {
        deep_sleep: Math.floor(Math.random() * 3600) + 3600, // 1-2 hours
        efficiency: Math.floor(Math.random() * 20) + 80, // 80-100%
        latency: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes
        rem_sleep: Math.floor(Math.random() * 3600) + 3600, // 1-2 hours
        restfulness: Math.floor(Math.random() * 30) + 70, // 70-100
        timing: Math.floor(Math.random() * 30) + 70, // 70-100
        total_sleep: Math.floor(Math.random() * 7200) + 21600 // 6-8 hours
      },
      day: dateStr,
      score: Math.floor(Math.random() * 30) + 70, // 70-100
      timestamp: `${dateStr}T08:00:00+00:00`
    });

    // Activity data
    mockData.activity.push({
      id: `activity_${dateStr}`,
      class_5_min: '0'.repeat(288), // 24 hours * 12 (5-minute intervals)
      score: Math.floor(Math.random() * 30) + 70,
      active_calories: Math.floor(Math.random() * 500) + 300,
      average_met_minutes: Math.floor(Math.random() * 100) + 50,
      contributors: {
        meet_daily_targets: Math.floor(Math.random() * 30) + 70,
        move_every_hour: Math.floor(Math.random() * 30) + 70,
        recovery_time: Math.floor(Math.random() * 30) + 70,
        stay_active: Math.floor(Math.random() * 30) + 70,
        training_frequency: Math.floor(Math.random() * 30) + 70,
        training_volume: Math.floor(Math.random() * 30) + 70
      },
      equivalent_walking_distance: Math.floor(Math.random() * 5000) + 5000,
      high_activity_met_minutes: Math.floor(Math.random() * 60) + 30,
      high_activity_time: Math.floor(Math.random() * 3600) + 1800,
      inactivity_alerts: Math.floor(Math.random() * 5),
      low_activity_met_minutes: Math.floor(Math.random() * 200) + 100,
      low_activity_time: Math.floor(Math.random() * 7200) + 3600,
      medium_activity_met_minutes: Math.floor(Math.random() * 100) + 50,
      medium_activity_time: Math.floor(Math.random() * 3600) + 1800,
      met: {
        interval: 300,
        items: Array.from({ length: 288 }, () => Math.floor(Math.random() * 5) + 1),
        timestamp: `${dateStr}T00:00:00+00:00`
      },
      meters_to_target: Math.floor(Math.random() * 2000),
      non_wear_time: Math.floor(Math.random() * 3600),
      resting_time: Math.floor(Math.random() * 28800) + 28800,
      sedentary_met_minutes: Math.floor(Math.random() * 500) + 300,
      sedentary_time: Math.floor(Math.random() * 28800) + 28800,
      steps: Math.floor(Math.random() * 5000) + 5000,
      target_calories: 400,
      target_meters: 8000,
      total_calories: Math.floor(Math.random() * 500) + 1800,
      day: dateStr,
      timestamp: `${dateStr}T00:00:00+00:00`
    });

    // Readiness data
    mockData.readiness.push({
      id: `readiness_${dateStr}`,
      contributors: {
        activity_balance: Math.floor(Math.random() * 30) + 70,
        body_temperature: Math.floor(Math.random() * 30) + 70,
        hrv_balance: Math.floor(Math.random() * 30) + 70,
        previous_day_activity: Math.floor(Math.random() * 30) + 70,
        previous_night: Math.floor(Math.random() * 30) + 70,
        recovery_index: Math.floor(Math.random() * 30) + 70,
        resting_heart_rate: Math.floor(Math.random() * 30) + 70,
        sleep_balance: Math.floor(Math.random() * 30) + 70
      },
      day: dateStr,
      score: Math.floor(Math.random() * 30) + 70,
      temperature_deviation: (Math.random() - 0.5) * 2, // -1 to 1
      temperature_trend_deviation: (Math.random() - 0.5) * 2,
      timestamp: `${dateStr}T08:00:00+00:00`
    });
  }

  return mockData;
}; 