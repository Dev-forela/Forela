import { supabase } from './supabase';
import { 
  UnifiedHealthData, 
  HealthIntegrationSettings, 
  AppleHealthData, 
  OuraData 
} from '../types/health';
import { 
  fetchAppleHealthData, 
  isHealthKitAvailable, 
  convertAppleHealthToUnified 
} from './appleHealth';
import { 
  fetchAllOuraData, 
  convertOuraToUnified 
} from './ouraService';

// Get user's health integration settings
export const getHealthIntegrationSettings = async (userId: string): Promise<HealthIntegrationSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('health_integration_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw error;
    }

    return data || getDefaultHealthIntegrationSettings();
  } catch (error) {
    console.error('Error fetching health integration settings:', error);
    return getDefaultHealthIntegrationSettings();
  }
};

// Save user's health integration settings
export const saveHealthIntegrationSettings = async (
  userId: string, 
  settings: HealthIntegrationSettings
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('health_integration_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving health integration settings:', error);
    throw error;
  }
};

// Get default health integration settings
const getDefaultHealthIntegrationSettings = (): HealthIntegrationSettings => ({
  apple_health: {
    enabled: false,
    permissions: {
      steps: false,
      heart_rate: false,
      sleep: false,
      workouts: false,
      mindfulness: false,
      body_measurements: false,
    },
    last_sync: null,
  },
  oura: {
    enabled: false,
    access_token: null,
    refresh_token: null,
    permissions: {
      personal_info: false,
      daily_sleep: false,
      daily_activity: false,
      daily_readiness: false,
      heart_rate: false,
      workouts: false,
      sessions: false,
      tags: false,
    },
    last_sync: null,
  },
});

// Sync all health data for a user
export const syncAllHealthData = async (userId: string): Promise<UnifiedHealthData[]> => {
  const settings = await getHealthIntegrationSettings(userId);
  if (!settings) return [];

  const allHealthData: UnifiedHealthData[] = [];

  try {
    // Sync Apple Health data if enabled
    if (settings.apple_health.enabled && isHealthKitAvailable()) {
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
      const endDate = new Date();
      const appleHealthData = await fetchAppleHealthData(startDate, endDate);
      const unifiedAppleData = convertAppleHealthToUnified(appleHealthData);
      allHealthData.push(...unifiedAppleData);

      // Update last sync time
      settings.apple_health.last_sync = new Date().toISOString();
    }

    // Sync Oura data if enabled
    if (settings.oura.enabled && settings.oura.access_token) {
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const endDate = new Date().toISOString().split('T')[0];
      const ouraData = await fetchAllOuraData(settings.oura.access_token, startDate, endDate);
      const unifiedOuraData = convertOuraToUnified(ouraData);
      allHealthData.push(...unifiedOuraData);

      // Update last sync time
      settings.oura.last_sync = new Date().toISOString();
    }

    // Save updated settings
    await saveHealthIntegrationSettings(userId, settings);

    // Store unified health data in database
    await storeHealthData(userId, allHealthData);

    return allHealthData;
  } catch (error) {
    console.error('Error syncing health data:', error);
    throw error;
  }
};

// Store unified health data in the database
const storeHealthData = async (userId: string, healthData: UnifiedHealthData[]): Promise<void> => {
  try {
    const dataToInsert = healthData.map(data => ({
      user_id: userId,
      date: data.date,
      steps: data.steps,
      heart_rate_resting: data.heartRate?.resting,
      heart_rate_average: data.heartRate?.average,
      heart_rate_max: data.heartRate?.max,
      sleep_duration: data.sleep?.duration,
      sleep_efficiency: data.sleep?.efficiency,
      sleep_deep: data.sleep?.deepSleep,
      sleep_rem: data.sleep?.remSleep,
      sleep_score: data.sleep?.score,
      activity_calories: data.activity?.calories,
      activity_active_minutes: data.activity?.activeMinutes,
      activity_score: data.activity?.score,
      readiness_score: data.readiness?.score,
      readiness_hrv: data.readiness?.hrv,
      readiness_temperature: data.readiness?.temperature,
      workouts: data.workouts ? JSON.stringify(data.workouts) : null,
      mindfulness_duration: data.mindfulness?.duration,
      mindfulness_sessions: data.mindfulness?.sessions,
      source: data.source,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('health_data')
      .upsert(dataToInsert, {
        onConflict: 'user_id,date,source'
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error storing health data:', error);
    throw error;
  }
};

// Get health data for a user within a date range
export const getHealthData = async (
  userId: string, 
  startDate: string, 
  endDate: string
): Promise<UnifiedHealthData[]> => {
  try {
    const { data, error } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;

    return data.map(row => ({
      date: row.date,
      steps: row.steps,
      heartRate: row.heart_rate_resting || row.heart_rate_average || row.heart_rate_max ? {
        resting: row.heart_rate_resting,
        average: row.heart_rate_average,
        max: row.heart_rate_max,
      } : undefined,
      sleep: row.sleep_duration || row.sleep_efficiency || row.sleep_deep || row.sleep_rem || row.sleep_score ? {
        duration: row.sleep_duration,
        efficiency: row.sleep_efficiency,
        deepSleep: row.sleep_deep,
        remSleep: row.sleep_rem,
        score: row.sleep_score,
      } : undefined,
      activity: row.activity_calories || row.activity_active_minutes || row.activity_score ? {
        calories: row.activity_calories,
        activeMinutes: row.activity_active_minutes,
        score: row.activity_score,
      } : undefined,
      readiness: row.readiness_score || row.readiness_hrv || row.readiness_temperature ? {
        score: row.readiness_score,
        hrv: row.readiness_hrv,
        temperature: row.readiness_temperature,
      } : undefined,
      workouts: row.workouts ? JSON.parse(row.workouts) : undefined,
      mindfulness: row.mindfulness_duration || row.mindfulness_sessions ? {
        duration: row.mindfulness_duration,
        sessions: row.mindfulness_sessions,
      } : undefined,
      source: row.source as 'apple_health' | 'oura' | 'manual',
    }));
  } catch (error) {
    console.error('Error fetching health data:', error);
    return [];
  }
};

// Get health data summary for dashboard
export const getHealthDataSummary = async (userId: string, days: number = 7): Promise<{
  averageSteps: number;
  averageSleep: number;
  averageHeartRate: number;
  totalWorkouts: number;
  averageReadinessScore: number;
  averageActivityScore: number;
}> => {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const healthData = await getHealthData(userId, startDate, endDate);

  const summary = {
    averageSteps: 0,
    averageSleep: 0,
    averageHeartRate: 0,
    totalWorkouts: 0,
    averageReadinessScore: 0,
    averageActivityScore: 0,
  };

  if (healthData.length === 0) return summary;

  let stepsSum = 0, stepsCount = 0;
  let sleepSum = 0, sleepCount = 0;
  let heartRateSum = 0, heartRateCount = 0;
  let readinessSum = 0, readinessCount = 0;
  let activitySum = 0, activityCount = 0;
  let workoutCount = 0;

  healthData.forEach(data => {
    if (data.steps) {
      stepsSum += data.steps;
      stepsCount++;
    }
    if (data.sleep?.duration) {
      sleepSum += data.sleep.duration;
      sleepCount++;
    }
    if (data.heartRate?.average) {
      heartRateSum += data.heartRate.average;
      heartRateCount++;
    }
    if (data.readiness?.score) {
      readinessSum += data.readiness.score;
      readinessCount++;
    }
    if (data.activity?.score) {
      activitySum += data.activity.score;
      activityCount++;
    }
    if (data.workouts) {
      workoutCount += data.workouts.length;
    }
  });

  return {
    averageSteps: stepsCount > 0 ? Math.round(stepsSum / stepsCount) : 0,
    averageSleep: sleepCount > 0 ? Math.round((sleepSum / sleepCount) * 10) / 10 : 0,
    averageHeartRate: heartRateCount > 0 ? Math.round(heartRateSum / heartRateCount) : 0,
    totalWorkouts: workoutCount,
    averageReadinessScore: readinessCount > 0 ? Math.round(readinessSum / readinessCount) : 0,
    averageActivityScore: activityCount > 0 ? Math.round(activitySum / activityCount) : 0,
  };
};

// Enable Apple Health integration
export const enableAppleHealthIntegration = async (userId: string): Promise<boolean> => {
  try {
    if (!isHealthKitAvailable()) {
      throw new Error('Apple Health is not available on this device');
    }

    // Request permissions and data
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
    const endDate = new Date();
    const healthData = await fetchAppleHealthData(startDate, endDate);
    
    // Update settings
    const settings = await getHealthIntegrationSettings(userId);
    if (settings) {
      settings.apple_health.enabled = true;
      settings.apple_health.permissions = {
        steps: true,
        heart_rate: true,
        sleep: true,
        workouts: true,
        mindfulness: true,
        body_measurements: true,
      };
      settings.apple_health.last_sync = new Date().toISOString();
      
      await saveHealthIntegrationSettings(userId, settings);
    }

    return true;
  } catch (error) {
    console.error('Error enabling Apple Health integration:', error);
    return false;
  }
};

// Enable Oura integration
export const enableOuraIntegration = async (
  userId: string, 
  accessToken: string, 
  refreshToken: string
): Promise<boolean> => {
  try {
    // Test the connection
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Last 7 days
    const endDate = new Date().toISOString().split('T')[0];
    const ouraData = await fetchAllOuraData(accessToken, startDate, endDate);
    
    // Update settings
    const settings = await getHealthIntegrationSettings(userId);
    if (settings) {
      settings.oura.enabled = true;
      settings.oura.access_token = accessToken;
      settings.oura.refresh_token = refreshToken;
      settings.oura.permissions = {
        personal_info: true,
        daily_sleep: true,
        daily_activity: true,
        daily_readiness: true,
        heart_rate: true,
        workouts: true,
        sessions: true,
        tags: true,
      };
      settings.oura.last_sync = new Date().toISOString();
      
      await saveHealthIntegrationSettings(userId, settings);
    }

    return true;
  } catch (error) {
    console.error('Error enabling Oura integration:', error);
    return false;
  }
};

// Disable health integration
export const disableHealthIntegration = async (
  userId: string, 
  provider: 'apple_health' | 'oura'
): Promise<void> => {
  try {
    const settings = await getHealthIntegrationSettings(userId);
    if (settings) {
      if (provider === 'apple_health') {
        settings.apple_health.enabled = false;
        settings.apple_health.permissions = {
          steps: false,
          heart_rate: false,
          sleep: false,
          workouts: false,
          mindfulness: false,
          body_measurements: false,
        };
      } else if (provider === 'oura') {
        settings.oura.enabled = false;
        settings.oura.access_token = null;
        settings.oura.refresh_token = null;
        settings.oura.permissions = {
          personal_info: false,
          daily_sleep: false,
          daily_activity: false,
          daily_readiness: false,
          heart_rate: false,
          workouts: false,
          sessions: false,
          tags: false,
        };
      }
      
      await saveHealthIntegrationSettings(userId, settings);
    }
  } catch (error) {
    console.error('Error disabling health integration:', error);
    throw error;
  }
}; 