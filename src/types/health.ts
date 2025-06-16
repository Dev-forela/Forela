// Apple Health Data Types
export interface AppleHealthData {
  steps: HealthMetric[];
  heartRate: HealthMetric[];
  sleep: SleepData[];
  workouts: WorkoutData[];
  mindfulness: MindfulnessData[];
  bodyMass: HealthMetric[];
  height: HealthMetric[];
  bloodPressure: BloodPressureData[];
  respiratoryRate: HealthMetric[];
  oxygenSaturation: HealthMetric[];
}

export interface HealthMetric {
  value: number;
  unit: string;
  date: string;
  source: string;
}

export interface SleepData {
  startDate: string;
  endDate: string;
  value: number; // duration in hours
  category: 'inBed' | 'asleep' | 'awake' | 'core' | 'deep' | 'rem';
  source: string;
}

export interface WorkoutData {
  workoutType: string;
  startDate: string;
  endDate: string;
  duration: number; // in minutes
  totalEnergyBurned?: number;
  totalDistance?: number;
  source: string;
}

export interface MindfulnessData {
  startDate: string;
  endDate: string;
  duration: number; // in minutes
  source: string;
}

export interface BloodPressureData {
  systolic: number;
  diastolic: number;
  date: string;
  source: string;
}

// Oura Ring Data Types
export interface OuraData {
  sleep: OuraSleepData[];
  activity: OuraActivityData[];
  readiness: OuraReadinessData[];
  heartRate: OuraHeartRateData[];
  workouts: OuraWorkoutData[];
  sessions: OuraSessionData[];
  tags: OuraTagData[];
  enhancedTags: OuraEnhancedTagData[];
}

export interface OuraSleepData {
  id: string;
  contributors: {
    deep_sleep: number;
    efficiency: number;
    latency: number;
    rem_sleep: number;
    restfulness: number;
    timing: number;
    total_sleep: number;
  };
  day: string;
  score: number;
  timestamp: string;
}

export interface OuraActivityData {
  id: string;
  class_5_min: string;
  score: number;
  active_calories: number;
  average_met_minutes: number;
  contributors: {
    meet_daily_targets: number;
    move_every_hour: number;
    recovery_time: number;
    stay_active: number;
    training_frequency: number;
    training_volume: number;
  };
  equivalent_walking_distance: number;
  high_activity_met_minutes: number;
  high_activity_time: number;
  inactivity_alerts: number;
  low_activity_met_minutes: number;
  low_activity_time: number;
  medium_activity_met_minutes: number;
  medium_activity_time: number;
  met: {
    interval: number;
    items: number[];
    timestamp: string;
  };
  meters_to_target: number;
  non_wear_time: number;
  resting_time: number;
  sedentary_met_minutes: number;
  sedentary_time: number;
  steps: number;
  target_calories: number;
  target_meters: number;
  total_calories: number;
  day: string;
  timestamp: string;
}

export interface OuraReadinessData {
  id: string;
  contributors: {
    activity_balance: number;
    body_temperature: number;
    hrv_balance: number;
    previous_day_activity: number;
    previous_night: number;
    recovery_index: number;
    resting_heart_rate: number;
    sleep_balance: number;
  };
  day: string;
  score: number;
  temperature_deviation: number;
  temperature_trend_deviation: number;
  timestamp: string;
}

export interface OuraHeartRateData {
  bpm: number;
  source: 'awake' | 'rest' | 'sleep' | 'session';
  timestamp: string;
}

export interface OuraWorkoutData {
  id: string;
  activity: string;
  calories: number;
  day: string;
  distance: number;
  end_datetime: string;
  intensity: 'easy' | 'moderate' | 'hard';
  label: string;
  source: 'manual' | 'autodetected' | 'confirmed' | 'workout_heart_rate';
  start_datetime: string;
}

export interface OuraSessionData {
  id: string;
  day: string;
  start_datetime: string;
  end_datetime: string;
  type: 'breathing' | 'meditation' | 'nap' | 'relaxation' | 'rest' | 'body_status';
  heart_rate?: {
    interval: number;
    items: number[];
    timestamp: string;
  };
  heart_rate_variability?: {
    interval: number;
    items: number[];
    timestamp: string;
  };
  mood?: 'bad' | 'worse' | 'same' | 'good' | 'great';
  motion_count?: {
    interval: number;
    items: number[];
    timestamp: string;
  };
}

export interface OuraTagData {
  id: string;
  day: string;
  text: string;
  timestamp: string;
  tags: string[];
}

export interface OuraEnhancedTagData {
  id: string;
  day: string;
  text: string;
  timestamp: string;
  tags: string[];
}

// Unified Health Data Types
export interface UnifiedHealthData {
  date: string;
  steps?: number;
  heartRate?: {
    resting: number;
    average: number;
    max: number;
  };
  sleep?: {
    duration: number;
    efficiency: number;
    deepSleep: number;
    remSleep: number;
    score?: number;
  };
  activity?: {
    calories: number;
    activeMinutes: number;
    score?: number;
  };
  readiness?: {
    score: number;
    hrv: number;
    temperature: number;
  };
  workouts?: {
    type: string;
    duration: number;
    calories: number;
    intensity?: string;
  }[];
  mindfulness?: {
    duration: number;
    sessions: number;
  };
  source: 'apple_health' | 'oura' | 'manual';
}

// Health Integration Settings
export interface HealthIntegrationSettings {
  apple_health: {
    enabled: boolean;
    permissions: {
      steps: boolean;
      heart_rate: boolean;
      sleep: boolean;
      workouts: boolean;
      mindfulness: boolean;
      body_measurements: boolean;
    };
    last_sync: string | null;
  };
  oura: {
    enabled: boolean;
    access_token: string | null;
    refresh_token: string | null;
    permissions: {
      personal_info: boolean;
      daily_sleep: boolean;
      daily_activity: boolean;
      daily_readiness: boolean;
      heart_rate: boolean;
      workouts: boolean;
      sessions: boolean;
      tags: boolean;
    };
    last_sync: string | null;
  };
} 