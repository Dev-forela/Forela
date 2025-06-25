// Test script to verify Supabase migration
// Run this in your browser console after updating environment variables

console.log('🔍 Testing Supabase Migration...');

// Test 1: Check Supabase connection
console.log('📡 Testing Supabase connection...');
const { data: connectionTest, error: connectionError } = await supabase
  .from('profiles')
  .select('count')
  .limit(1);

if (connectionError) {
  console.error('❌ Connection failed:', connectionError.message);
} else {
  console.log('✅ Supabase connection successful');
}

// Test 2: Check all tables exist
console.log('📋 Checking table existence...');
const tables = [
  'profiles',
  'journal_entries', 
  'medical_information',
  'ai_companion_interactions',
  'health_integration_settings',
  'health_data'
];

for (const table of tables) {
  const { data, error } = await supabase
    .from(table)
    .select('count')
    .limit(1);
  
  if (error) {
    console.error(`❌ Table ${table} error:`, error.message);
  } else {
    console.log(`✅ Table ${table} exists and accessible`);
  }
}

// Test 3: Check storage bucket
console.log('📦 Testing storage bucket...');
const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

if (bucketError) {
  console.error('❌ Storage bucket error:', bucketError.message);
} else {
  const audioBucket = buckets.find(b => b.id === 'audio-entries');
  if (audioBucket) {
    console.log('✅ Audio storage bucket exists');
  } else {
    console.error('❌ Audio storage bucket not found');
  }
}

console.log('🎉 Migration test complete!'); 