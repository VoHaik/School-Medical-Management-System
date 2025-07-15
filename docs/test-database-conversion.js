// Script kiểm tra lỗi database conversion cụ thể
// Chạy trong browser console để test từng API endpoint

const API_BASE_URL = 'http://localhost:8080/api';

async function testDatabaseConversion() {
  console.log('🔍 Testing Database Conversion Issues...');
  console.log('==========================================');
  
  const endpoints = [
    { name: 'Users', url: '/users' },
    { name: 'Students', url: '/students' },
    { name: 'Health Declarations', url: '/health-declarations' },
    { name: 'Medical Events', url: '/medical-events' },
    { name: 'Medication Requests', url: '/medication-requests' },
    { name: 'Notifications', url: '/notifications' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Testing ${endpoint.name}...`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint.url}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Nếu cần
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint.name}: OK (${response.status})`);
        console.log(`   Data type: ${typeof data}, Records: ${Array.isArray(data) ? data.length : 'N/A'}`);
      } else {
        console.error(`❌ ${endpoint.name}: ERROR (${response.status})`);
        const errorText = await response.text();
        console.error(`   Error: ${errorText}`);
        
        // Kiểm tra lỗi conversion cụ thể
        if (errorText.includes('conversion from text to NCHAR')) {
          console.error(`🗃️ DATABASE CONVERSION ERROR DETECTED in ${endpoint.name}!`);
          console.error('   → Cần chạy convert-all-to-nvarchar.sql script');
        }
      }
      
    } catch (error) {
      console.error(`💥 ${endpoint.name}: NETWORK ERROR`);
      console.error(`   ${error.message}`);
    }
    
    // Delay nhỏ giữa các requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n✅ Testing completed!');
  console.log('If you see "DATABASE CONVERSION ERROR", run the SQL conversion script.');
}

// Chạy test:
testDatabaseConversion();

// Hoặc test một endpoint cụ thể:
async function testSingleEndpoint(url) {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`);
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Ví dụ:
// testSingleEndpoint('/students');
