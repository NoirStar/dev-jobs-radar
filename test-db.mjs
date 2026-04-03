import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://cbkaesbcnrdtdftsgrki.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNia2Flc2JjbnJkdGRmdHNncmtpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ4MTIzOSwiZXhwIjoyMDg3MDU3MjM5fQ.MW5b5UTx14pYHdeBsrKLGNpzscyVRG75_mA-X-LJOMg'
)

// 1) 테스트 데이터 쓰기
const { error } = await supabase.from('jobs').upsert([{
  id: 'test-1',
  title: 'Test Backend Engineer',
  company_name: 'TestCo',
  company_id: 'testco',
  category: 'backend',
  skills: ['Java', 'Spring'],
  experience: { level: 'mid', minYears: 3, maxYears: null, text: '3년+' },
  location: 'Seoul',
  is_remote: false,
  source: 'wanted',
  source_url: 'https://test.com',
  collected_at: new Date().toISOString(),
  is_active: true,
}], { onConflict: 'id' })

if (error) {
  console.log('❌ WRITE ERROR:', error.message)
} else {
  console.log('✅ WRITE OK')
}

// 2) 읽기 확인
const { data, error: e2 } = await supabase.from('jobs').select('id, title, company_name').limit(5)
if (e2) {
  console.log('❌ READ ERROR:', e2.message)
} else {
  console.log('✅ READ OK:', JSON.stringify(data, null, 2))
}

// 3) 테스트 데이터 삭제
await supabase.from('jobs').delete().eq('id', 'test-1')
console.log('🧹 테스트 데이터 삭제 완료')
