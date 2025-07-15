# 📝 Ghi chú chức năng các function trong School Medical Management System

## 🏥 **dashboardSlice.js - Quản lý Dashboard Y tế**

### **📊 Async Thunks (Xử lý bất đồng bộ)**

#### `fetchDashboardData`
```javascript
// Chức năng: Lấy toàn bộ dữ liệu dashboard từ API
// Input: Không có tham số
// Output: Object chứa stats, recentActivity, upcomingTasks, healthSummary
// Sử dụng: Khi load trang dashboard lần đầu hoặc refresh toàn bộ
```

#### `updateDashboardStats`
```javascript
// Chức năng: Cập nhật chỉ số thống kê mới nhất (background update)
// Input: Không có tham số
// Output: Object chứa stats mới
// Sử dụng: Auto-refresh mỗi 5 phút để cập nhật số liệu
```

### **🔄 Reducers (Xử lý đồng bộ)**

#### **Stats Management**
```javascript
updateStats(state, action)
// Chức năng: Cập nhật thống kê dashboard
// Input: Object chứa stats mới
// Output: Merge stats mới vào state hiện tại
// Ví dụ: { todaysAppointments: 10, activeAlerts: 3 }
```

#### **Activity Management**
```javascript
addActivity(state, action)
// Chức năng: Thêm hoạt động mới vào feed
// Input: Object activity { id, type, message, time, priority }
// Output: Thêm vào đầu mảng, giữ tối đa 10 items
// Ví dụ: Thêm "Administered medication to student X"

updateActivity(state, action)
// Chức năng: Cập nhật trạng thái hoạt động có sẵn
// Input: Object chứa id và thông tin cập nhật
// Output: Cập nhật activity theo id
// Ví dụ: Đổi status từ "pending" thành "completed"
```

#### **Task Management**
```javascript
addTask(state, action)
// Chức năng: Thêm task mới vào danh sách
// Input: Object task { id, task, time, type, priority }
// Output: Push task vào mảng upcomingTasks
// Ví dụ: "EpiPen training at 2:00 PM"

updateTask(state, action)
// Chức năng: Cập nhật thông tin task
// Input: Object chứa id và thông tin mới
// Output: Cập nhật task theo id
// Ví dụ: Đổi thời gian hoặc priority

removeTask(state, action)
// Chức năng: Xóa task đã hoàn thành
// Input: taskId (string/number)
// Output: Loại bỏ task khỏi mảng
// Ví dụ: Xóa task đã hoàn thành
```

#### **Health Summary Management**
```javascript
updateHealthSummary(state, action)
// Chức năng: Cập nhật tổng quan sức khỏe
// Input: Object chứa thông tin tổng quan
// Output: Merge thông tin mới vào healthSummary
// Ví dụ: { criticalCases: 2, followUpsRequired: 5 }
```

#### **Settings & Controls**
```javascript
setAutoRefresh(state, action)
// Chức năng: Bật/tắt tự động refresh
// Input: Boolean (true/false)
// Output: Cập nhật autoRefresh setting

setRefreshInterval(state, action)
// Chức năng: Đặt khoảng thời gian auto-refresh
// Input: Number (milliseconds)
// Output: Cập nhật refreshInterval
// Mặc định: 300000ms = 5 phút

clearError(state)
// Chức năng: Xóa thông báo lỗi
// Input: Không có
// Output: Set error = null

setLastUpdated(state)
// Chức năng: Cập nhật timestamp lần cuối
// Input: Không có
// Output: Set thời gian hiện tại
```

### **🔍 Selectors (Lấy dữ liệu từ state)**

#### **Basic Selectors**
```javascript
selectDashboardStats(state)
// Chức năng: Lấy toàn bộ thống kê dashboard
// Return: Object stats

selectRecentActivity(state)
// Chức năng: Lấy danh sách hoạt động gần đây
// Return: Array activities

selectUpcomingTasks(state)
// Chức năng: Lấy danh sách task sắp tới
// Return: Array tasks

selectHealthSummary(state)
// Chức năng: Lấy tổng quan sức khỏe
// Return: Object health summary

selectDashboardLoading(state)
// Chức năng: Kiểm tra trạng thái loading
// Return: Boolean

selectDashboardError(state)
// Chức năng: Lấy thông tin lỗi
// Return: String error message hoặc null

selectLastUpdated(state)
// Chức năng: Lấy thời gian cập nhật cuối
// Return: ISO timestamp string

selectAutoRefresh(state)
// Chức năng: Kiểm tra trạng thái auto-refresh
// Return: Boolean

selectRefreshInterval(state)
// Chức năng: Lấy khoảng thời gian refresh
// Return: Number (milliseconds)
```

#### **Computed Selectors (Tính toán)**
```javascript
selectHighPriorityTasks(state)
// Chức năng: Lọc các task có priority cao
// Return: Array tasks với priority = 'high'
// Sử dụng: Hiển thị task ưu tiên trong sidebar

selectCriticalAlerts(state)
// Chức năng: Lọc các alert nghiêm trọng
// Return: Array activities với priority = 'high' và type = 'alert'
// Sử dụng: Hiển thị cảnh báo khẩn cấp

selectPendingActivities(state)
// Chức năng: Lọc các hoạt động chưa hoàn thành
// Return: Array activities với status = 'pending'
// Sử dụng: Theo dõi việc cần xử lý
```

---

## 🏥 **Các Component Package Chính**

### **📊 Dashboard Components**

#### **NurseDashboard.jsx**
```javascript
// Chức năng chính: Trang dashboard chính cho y tá
// Features:
- Hiển thị thống kê theo thời gian thực
- Feed hoạt động gần đây
- Quick actions (hành động nhanh)
- Task management
- Health summary
- Emergency contacts

// Hook sử dụng:
- useSelector: Lấy data từ Redux store
- useDispatch: Gửi actions
- useEffect: Setup auto-refresh
- useMemo: Optimize re-renders
- useCallback: Memoize functions
```

#### **StatsCard.jsx**
```javascript
// Chức năng: Hiển thị card thống kê
// Props:
- title: Tiêu đề thống kê
- value: Giá trị số
- icon: Icon component
- color: Màu theme
- trend: Xu hướng thay đổi
- loading: Trạng thái loading

// Sử dụng: Hiển thị "Today's Appointments", "Pending Medications", etc.
```

#### **ActivityCard.jsx**
```javascript
// Chức năng: Hiển thị card hoạt động
// Props:
- activity: Object hoạt động
- icon: Icon theo loại hoạt động
- priorityColor: Màu theo priority

// Features:
- Phân loại theo type (medication, checkup, alert, followup)
- Color coding theo priority
- Timestamp display
- Status indicators
```

#### **TaskCard.jsx**
```javascript
// Chức năng: Hiển thị card task
// Props:
- task: Object task
- priorityColor: Màu border theo priority

// Features:
- Task description
- Time display
- Priority visualization
- Task type icons
```

### **👥 Student Management Components**

#### **StudentManagement.jsx**
```javascript
// Chức năng: Quản lý thông tin học sinh
// Features:
- Tìm kiếm học sinh
- Lọc theo lớp, grade
- Hiển thị health profile
- Emergency contacts
- Medical history
- Vaccination status

// State management:
- students: Danh sách học sinh
- selectedStudent: Học sinh được chọn
- filters: Bộ lọc search
- loading states
```

#### **StudentHealthProfile.jsx**
```javascript
// Chức năng: Profile sức khỏe chi tiết của học sinh
// Tabs:
- Health Declarations: Khai báo sức khỏe
- Medical History: Lịch sử bệnh án
- Periodic Checkups: Khám định kỳ
- Immunizations: Tiêm chủng
- Nurse Notes: Ghi chú y tá

// Features:
- Tabbed interface
- Editable fields
- File attachments
- Print functionality
```

### **🏥 Medical Event Components**

#### **RecordMedicalEvent.jsx**
```javascript
// Chức năng: Ghi nhận sự kiện y tế
// Form fields:
- Student selection
- Event type & severity
- Description & symptoms
- Actions taken
- Medications used
- Supplies used
- Outcome
- Follow-up requirements
- Parent notification

// Validation: Yup schema validation
// Integration: Automatic inventory deduction
```

#### **MedicalEventLog.jsx**
```javascript
// Chức năng: Lịch sử sự kiện y tế
// Features:
- Advanced filtering
- Date range selection
- Severity color coding
- Detailed event modal
- Export capabilities
- Search functionality

// Filters:
- Date range
- Student name
- Event type
- Severity level
```

### **💊 Medication Components**

#### **MedicationManagement.jsx**
```javascript
// Chức năng: Quản lý thuốc và cho thuốc
// Tabs:
- Medication Inventory: Kho thuốc
- Student Administrations: Lịch cho thuốc
- Reports: Báo cáo

// Features:
- CRUD operations
- Expiry tracking
- Low stock alerts
- Prescription requirements
- Dosage documentation
- Administration scheduling
```

#### **MedicationCard.jsx**
```javascript
// Chức năng: Hiển thị thông tin thuốc
// Props:
- medication: Object thông tin thuốc
- onEdit: Callback edit
- onDelete: Callback delete

// Features:
- Medication details
- Stock status
- Expiry warnings
- Action buttons
```

### **🩺 Health Checkup Components**

#### **HealthCheckups.jsx**
```javascript
// Chức năng: Quản lý khám sức khỏe
// Features:
- Annual/periodic checkups
- Vital signs recording
- Vision/hearing tests
- Growth measurements
- BMI calculations
- Abnormal findings
- Consent management

// Form validation: Comprehensive health data validation
// Calculations: Auto BMI calculation, health risk assessment
```

#### **CheckupCycleDetail.jsx**
```javascript
// Chức năng: Chi tiết chu kỳ khám
// Features:
- Checkup configuration
- Student progress tracking
- Results recording
- Follow-up scheduling
- Parent notifications
```

### **💉 Vaccination Components**

#### **VaccinationManagement.jsx**
```javascript
// Chức năng: Quản lý chiến dịch tiêm chủng
// Campaign lifecycle:
- Planning phase
- Consent collection
- In progress
- Completed

// Features:
- Campaign creation
- Student management
- Consent tracking
- Batch recording
- Adverse reactions
- Progress monitoring
```

#### **VaccinationCampaignDetail.jsx**
```javascript
// Chức năng: Chi tiết chiến dịch tiêm chủng
// Features:
- Campaign overview
- Student lists
- Vaccination sessions
- Inventory tracking
- Completion statistics
- Result distribution
```

### **📊 Reporting Components**

#### **NurseReports.jsx**
```javascript
// Chức năng: Tạo và xuất báo cáo
// Report types:
- Medical Event Summary
- Immunization Coverage
- Health Checkup Summary
- Inventory Usage
- Consent Status
- Attendance Analysis
- Chronic Conditions
- Emergency Contacts

// Features:
- Interactive charts
- Date range filtering
- Export PDF/Excel
- Real-time data
- Custom filters
```

### **🚨 Emergency Components**

#### **EmergencyLog.jsx**
```javascript
// Chức năng: Ghi nhận sự cố khẩn cấp
// Features:
- Incident documentation
- Severity classification
- Staff involvement
- Response time tracking
- Follow-up requirements
- Emergency services contact

// Classifications:
- Critical: Requires immediate attention
- High: Urgent medical care
- Medium: Standard medical care
- Low: Minor incidents
```

---

## 🔧 **Utility Functions**

### **medicalCalculations.js**
```javascript
calculateBMI(height, weight)
// Chức năng: Tính chỉ số BMI
// Input: height (cm), weight (kg)
// Output: BMI value (số thập phân 1 chữ số)

assessHealthRisk(student)
// Chức năng: Đánh giá mức độ rủi ro sức khỏe
// Input: Object student data
// Output: { level: 'Low/Medium/High', factors: Array }

checkVaccinationStatus(immunizations)
// Chức năng: Kiểm tra tình trạng tiêm chủng
// Input: Array immunization records
// Output: 'Up to Date', 'Overdue', 'Incomplete'
```

### **dateHelpers.js**
```javascript
formatMedicalDate(date)
// Chức năng: Format ngày tháng cho y tế
// Input: Date object or string
// Output: Formatted string "Jan 15, 2025, 2:30 PM"

isCheckupDue(lastCheckup, interval)
// Chức năng: Kiểm tra đến hạn khám
// Input: lastCheckup date, interval (days)
// Output: Boolean true/false

calculateAge(birthDate)
// Chức năng: Tính tuổi từ ngày sinh
// Input: Birth date
// Output: Age in years
```

### **validationSchemas.js**
```javascript
medicalEventSchema
// Chức năng: Validation cho medical events
// Fields: studentId, eventType, severity, description, etc.

healthCheckupSchema
// Chức năng: Validation cho health checkups
// Fields: vitals, measurements, findings, etc.

medicationSchema
// Chức năng: Validation cho medications
// Fields: name, dosage, expiry, quantity, etc.
```

---

## 🏗️ **Architecture Pattern**

### **Redux Flow**
```
1. Component dispatch action
2. Action creator (thunk) calls API
3. Reducer updates state
4. Component re-renders with new data
5. Selectors provide computed values
```

### **Component Hierarchy**
```
App
├── ProtectedRoute (ROLE_SCHOOLNURSE)
│   ├── NurseDashboard
│   │   ├── StatsGrid
│   │   ├── ActivityFeed
│   │   ├── QuickActions
│   │   └── Sidebar
│   ├── StudentManagement
│   ├── MedicalEventLog
│   ├── HealthCheckups
│   ├── MedicationManagement
│   ├── VaccinationManagement
│   ├── EmergencyLog
│   └── NurseReports
```

### **Data Flow**
```
API ↔ Redux Store ↔ Components ↔ UI
     ↑           ↑             ↑
  Services   Selectors    Event Handlers
```

Tất cả các function đều được thiết kế để hỗ trợ quy trình làm việc của y tá trong môi trường trường học, từ quản lý hồ sơ sức khỏe học sinh đến xử lý các tình huống khẩn cấp.
