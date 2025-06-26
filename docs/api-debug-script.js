// Debug script để kiểm tra API response đầy đủ
// Thêm script này vào file api.js hoặc console để debug

// Trong file api.js, thêm logging chi tiết:
axios.interceptors.response.use(
  (response) => {
    console.log('✅ API Response Success:');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', response.headers);
    console.log('Data:', response.data);
    console.log('Config URL:', response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Error Message:', error.message);
    console.error('Error Data:', error.response?.data);
    console.error('Config URL:', error.config?.url);
    
    // Kiểm tra các loại lỗi phổ biến:
    if (error.response?.status === 500) {
      console.error('🔥 Server Error - Có thể là lỗi database conversion!');
    }
    if (error.message.includes('Network Error')) {
      console.error('🌐 Network Error - Backend không phản hồi');
    }
    if (error.response?.data?.message?.includes('conversion from text to NCHAR')) {
      console.error('🗃️ Database Conversion Error detected!');
    }
    
    return Promise.reject(error);
  }
);

// Hoặc kiểm tra response cụ thể:
function debugApiCall(apiFunction) {
  return apiFunction
    .then(response => {
      console.log('✅ Success Response:', {
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers['content-type'],
        dataType: typeof response.data,
        dataKeys: response.data ? Object.keys(response.data) : null,
        hasError: response.data?.error || response.data?.message?.includes('error')
      });
      return response;
    })
    .catch(error => {
      console.error('❌ Error Response:', {
        status: error.response?.status,
        message: error.message,
        serverMessage: error.response?.data?.message,
        isDbError: error.response?.data?.message?.includes('conversion'),
        url: error.config?.url
      });
      throw error;
    });
}

// Sử dụng:
// debugApiCall(api.get('/students'))
// debugApiCall(api.post('/health-declarations', data))
