-- Create health_integration_settings table
CREATE TABLE health_integration_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    apple_health_enabled BOOLEAN DEFAULT false,
    apple_health_permissions JSONB DEFAULT '{
        "steps": false,
        "heart_rate": false,
        "sleep": false,
        "workouts": false,
        "mindfulness": false,
        "body_measurements": false,
        "nutrition": false
    }'::jsonb,
    apple_health_last_sync TIMESTAMP WITH TIME ZONE,
    oura_enabled BOOLEAN DEFAULT false,
    oura_access_token TEXT,
    oura_refresh_token TEXT,
    oura_permissions JSONB DEFAULT '{
        "personal_info": false,
        "daily_sleep": false,
        "daily_activity": false,
        "daily_readiness": false,
        "heart_rate": false,
        "workouts": false,
        "sessions": false,
        "tags": false
    }'::jsonb,
    oura_last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Create health_data table for unified health metrics
CREATE TABLE health_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    
    -- Activity & Movement
    steps INTEGER,
    distance_walked DECIMAL(10,2), -- in kilometers
    flights_climbed INTEGER,
    active_energy_burned DECIMAL(10,2), -- in calories
    resting_energy_burned DECIMAL(10,2), -- in calories
    exercise_minutes INTEGER,
    stand_hours INTEGER,
    
    -- Heart Rate
    heart_rate_resting INTEGER,
    heart_rate_average INTEGER,
    heart_rate_max INTEGER,
    heart_rate_variability DECIMAL(10,2), -- in milliseconds
    
    -- Sleep
    sleep_duration DECIMAL(5,2), -- in hours
    sleep_efficiency DECIMAL(5,2), -- percentage
    sleep_deep DECIMAL(5,2), -- in hours
    sleep_rem DECIMAL(5,2), -- in hours
    sleep_light DECIMAL(5,2), -- in hours
    sleep_awake DECIMAL(5,2), -- in hours
    sleep_score INTEGER, -- 0-100
    time_in_bed DECIMAL(5,2), -- in hours
    
    -- Body Measurements
    weight DECIMAL(6,2), -- in kg
    height DECIMAL(5,2), -- in cm
    body_mass_index DECIMAL(4,2),
    body_fat_percentage DECIMAL(5,2),
    lean_body_mass DECIMAL(6,2), -- in kg
    
    -- Vital Signs
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    respiratory_rate INTEGER,
    oxygen_saturation DECIMAL(5,2), -- percentage
    body_temperature DECIMAL(4,2), -- in celsius
    
    -- Activity Scores (Oura specific)
    activity_score INTEGER, -- 0-100
    readiness_score INTEGER, -- 0-100
    
    -- Nutrition (basic tracking)
    calories_consumed INTEGER,
    water_intake DECIMAL(6,2), -- in liters
    
    -- Workouts (JSON array of workout sessions)
    workouts JSONB,
    
    -- Mindfulness
    mindfulness_duration INTEGER, -- in minutes
    mindfulness_sessions INTEGER,
    
    -- Data source tracking
    source TEXT CHECK (source IN ('apple_health', 'oura', 'manual')) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure one record per user per date per source
    UNIQUE(user_id, date, source)
);

-- Create indexes for better query performance
CREATE INDEX idx_health_integration_settings_user_id ON health_integration_settings(user_id);
CREATE INDEX idx_health_data_user_id ON health_data(user_id);
CREATE INDEX idx_health_data_date ON health_data(date DESC);
CREATE INDEX idx_health_data_user_date ON health_data(user_id, date DESC);

-- Add updated_at trigger for health_integration_settings
CREATE TRIGGER update_health_integration_settings_updated_at
    BEFORE UPDATE ON health_integration_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at trigger for health_data
CREATE TRIGGER update_health_data_updated_at
    BEFORE UPDATE ON health_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE health_integration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;

-- RLS policies for health_integration_settings
CREATE POLICY "Users can view their own health integration settings"
    ON health_integration_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health integration settings"
    ON health_integration_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health integration settings"
    ON health_integration_settings FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS policies for health_data
CREATE POLICY "Users can view their own health data"
    ON health_data FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health data"
    ON health_data FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health data"
    ON health_data FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health data"
    ON health_data FOR DELETE
    USING (auth.uid() = user_id); 