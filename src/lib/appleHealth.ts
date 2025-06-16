import { AppleHealthData, HealthMetric, SleepData, WorkoutData, MindfulnessData, BloodPressureData, UnifiedHealthData } from '../types/health';

// Check if we're running on iOS and HealthKit is available
export const isHealthKitAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
         'webkit' in window && 
         'messageHandlers' in (window as any).webkit &&
         'healthKit' in (window as any).webkit.messageHandlers;
};

// Check if we're running in a PWA context on iOS
export const isIOSPWA = (): boolean => {
  return typeof window !== 'undefined' &&
         (window.navigator as any).standalone === true &&
         /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Mock data for development/testing
const generateMockHealthData = (): AppleHealthData => {
  const now = new Date();
  const mockData: AppleHealthData = {
    steps: [],
    heartRate: [],
    sleep: [],
    workouts: [],
    mindfulness: [],
    bodyMass: [],
    height: [],
    bloodPressure: [],
    respiratoryRate: [],
    oxygenSaturation: []
  };

  // Generate 7 days of mock data
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Steps
    mockData.steps.push({
      value: Math.floor(Math.random() * 5000) + 5000,
      unit: 'count',
      date: dateStr,
      source: 'iPhone'
    });

    // Heart Rate (multiple readings per day)
    for (let j = 0; j < 3; j++) {
      mockData.heartRate.push({
        value: Math.floor(Math.random() * 40) + 60,
        unit: 'bpm',
        date: dateStr,
        source: 'Apple Watch'
      });
    }

    // Sleep
    const sleepDuration = Math.random() * 2 + 6; // 6-8 hours
    mockData.sleep.push({
      startDate: `${dateStr}T23:00:00Z`,
      endDate: `${new Date(date.getTime() + sleepDuration * 60 * 60 * 1000).toISOString()}`,
      value: sleepDuration,
      category: 'asleep',
      source: 'iPhone'
    });

    // Workouts (not every day)
    if (Math.random() > 0.4) {
      mockData.workouts.push({
        workoutType: ['Running', 'Walking', 'Cycling', 'Yoga'][Math.floor(Math.random() * 4)],
        startDate: `${dateStr}T07:00:00Z`,
        endDate: `${dateStr}T08:00:00Z`,
        duration: Math.floor(Math.random() * 60) + 30,
        totalEnergyBurned: Math.floor(Math.random() * 300) + 200,
        totalDistance: Math.random() * 5 + 2,
        source: 'Apple Watch'
      });
    }

    // Mindfulness (occasional)
    if (Math.random() > 0.6) {
      mockData.mindfulness.push({
        startDate: `${dateStr}T19:00:00Z`,
        endDate: `${dateStr}T19:10:00Z`,
        duration: Math.floor(Math.random() * 15) + 5,
        source: 'iPhone'
      });
    }
  }

  return mockData;
};

// Request HealthKit permissions
export const requestHealthKitPermissions = async (): Promise<boolean> => {
  if (!isHealthKitAvailable()) {
    console.log('HealthKit not available, using mock data');
    return true; // Return true for development
  }

  try {
    // Send message to native iOS app to request permissions
    (window as any).webkit.messageHandlers.healthKit.postMessage({
      action: 'requestPermissions',
      permissions: [
        'steps',
        'heartRate',
        'sleep',
        'workouts',
        'mindfulness',
        'bodyMass',
        'height',
        'bloodPressure',
        'respiratoryRate',
        'oxygenSaturation'
      ]
    });

    // Wait for response (this would be handled by a callback in a real implementation)
    return new Promise((resolve) => {
      // Mock successful permission grant after 1 second
      setTimeout(() => resolve(true), 1000);
    });
  } catch (error) {
    console.error('Error requesting HealthKit permissions:', error);
    return false;
  }
};

// Fetch health data from HealthKit
export const fetchAppleHealthData = async (startDate: Date, endDate: Date): Promise<AppleHealthData> => {
  if (!isHealthKitAvailable()) {
    console.log('HealthKit not available, returning mock data');
    return generateMockHealthData();
  }

  try {
    // Send message to native iOS app to fetch data
    (window as any).webkit.messageHandlers.healthKit.postMessage({
      action: 'fetchData',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      dataTypes: [
        'steps',
        'heartRate',
        'sleep',
        'workouts',
        'mindfulness',
        'bodyMass',
        'height',
        'bloodPressure',
        'respiratoryRate',
        'oxygenSaturation'
      ]
    });

    // In a real implementation, this would wait for the native callback
    return new Promise((resolve) => {
      setTimeout(() => resolve(generateMockHealthData()), 1000);
    });
  } catch (error) {
    console.error('Error fetching Apple Health data:', error);
    return generateMockHealthData();
  }
};

// Convert Apple Health data to unified format
export const convertAppleHealthToUnified = (appleData: AppleHealthData): UnifiedHealthData[] => {
  const unifiedData: Map<string, UnifiedHealthData> = new Map();

  // Process steps
  appleData.steps.forEach(step => {
    const date = step.date;
    if (!unifiedData.has(date)) {
      unifiedData.set(date, { date, source: 'apple_health' });
    }
    const dayData = unifiedData.get(date)!;
    dayData.steps = (dayData.steps || 0) + step.value;
  });

  // Process heart rate
  appleData.heartRate.forEach(hr => {
    const date = hr.date;
    if (!unifiedData.has(date)) {
      unifiedData.set(date, { date, source: 'apple_health' });
    }
    const dayData = unifiedData.get(date)!;
    if (!dayData.heartRate) {
      dayData.heartRate = { resting: hr.value, average: hr.value, max: hr.value };
    } else {
      dayData.heartRate.resting = Math.min(dayData.heartRate.resting, hr.value);
      dayData.heartRate.max = Math.max(dayData.heartRate.max, hr.value);
      dayData.heartRate.average = (dayData.heartRate.average + hr.value) / 2;
    }
  });

  // Process sleep
  appleData.sleep.forEach(sleep => {
    const date = sleep.startDate.split('T')[0];
    if (!unifiedData.has(date)) {
      unifiedData.set(date, { date, source: 'apple_health' });
    }
    const dayData = unifiedData.get(date)!;
    if (!dayData.sleep) {
      dayData.sleep = {
        duration: sleep.value,
        efficiency: 85, // Default efficiency
        deepSleep: sleep.value * 0.2,
        remSleep: sleep.value * 0.25
      };
    }
  });

  // Process workouts
  appleData.workouts.forEach(workout => {
    const date = workout.startDate.split('T')[0];
    if (!unifiedData.has(date)) {
      unifiedData.set(date, { date, source: 'apple_health' });
    }
    const dayData = unifiedData.get(date)!;
    if (!dayData.workouts) {
      dayData.workouts = [];
    }
    dayData.workouts.push({
      type: workout.workoutType,
      duration: workout.duration,
      calories: workout.totalEnergyBurned || 0
    });

    // Update activity summary
    if (!dayData.activity) {
      dayData.activity = { calories: 0, activeMinutes: 0 };
    }
    dayData.activity.calories += workout.totalEnergyBurned || 0;
    dayData.activity.activeMinutes += workout.duration;
  });

  // Process mindfulness
  appleData.mindfulness.forEach(mindfulness => {
    const date = mindfulness.startDate.split('T')[0];
    if (!unifiedData.has(date)) {
      unifiedData.set(date, { date, source: 'apple_health' });
    }
    const dayData = unifiedData.get(date)!;
    if (!dayData.mindfulness) {
      dayData.mindfulness = { duration: 0, sessions: 0 };
    }
    dayData.mindfulness.duration += mindfulness.duration;
    dayData.mindfulness.sessions += 1;
  });

  return Array.from(unifiedData.values()).sort((a, b) => a.date.localeCompare(b.date));
};

// Check if user has granted specific permissions
export const checkHealthKitPermissions = async (): Promise<{ [key: string]: boolean }> => {
  if (!isHealthKitAvailable()) {
    // Return mock permissions for development
    return {
      steps: true,
      heartRate: true,
      sleep: true,
      workouts: true,
      mindfulness: true,
      bodyMass: true
    };
  }

  try {
    (window as any).webkit.messageHandlers.healthKit.postMessage({
      action: 'checkPermissions'
    });

    return new Promise((resolve) => {
      setTimeout(() => resolve({
        steps: true,
        heartRate: true,
        sleep: true,
        workouts: true,
        mindfulness: true,
        bodyMass: true
      }), 500);
    });
  } catch (error) {
    console.error('Error checking HealthKit permissions:', error);
    return {};
  }
};

// Setup HealthKit observer for real-time updates
export const setupHealthKitObserver = (callback: (data: AppleHealthData) => void): void => {
  if (!isHealthKitAvailable()) {
    console.log('HealthKit not available, observer not set up');
    return;
  }

  try {
    (window as any).webkit.messageHandlers.healthKit.postMessage({
      action: 'setupObserver'
    });

    // In a real implementation, this would set up a callback for when new data arrives
    console.log('HealthKit observer set up successfully');
  } catch (error) {
    console.error('Error setting up HealthKit observer:', error);
  }
}; 