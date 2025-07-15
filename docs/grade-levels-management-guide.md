# Grade Levels Management System (1-12)

## Overview

Hệ thống đã được cập nhật để hỗ trợ quản lý đầy đủ 12 khối lớp (Grade 1-12) thay vì chỉ 5 khối như trước. Hệ thống mới bao gồm:

- **Backend**: Entity, DTO, Service, Controller cho Grade Levels
- **Frontend**: Component selector hiện đại với UI Material-UI
- **Database**: Bảng `grade_levels` với dữ liệu tiêu chuẩn

## Features

### Backend Components

#### 1. GradeLevel Entity
```java
@Entity
@Table(name = "grade_levels")
public class GradeLevel {
    private Integer gradeId;
    private Integer gradeNumber; // 1-12
    private String gradeName; // "Grade 1", "Grade 2", etc.
    private String vietnameseName; // "Lớp 1", "Lớp 2", etc.
    private String description;
    private Integer minAge; // Tuổi tối thiểu
    private Integer maxAge; // Tuổi tối đa
    private Boolean isActive;
    // ... other fields
}
```

#### 2. Grade Level API Endpoints
- `GET /api/grade-levels` - Lấy tất cả grade levels đang active
- `GET /api/grade-levels/{id}` - Lấy grade level theo ID
- `GET /api/grade-levels/number/{number}` - Lấy grade level theo số (1-12)
- `GET /api/grade-levels/range?minGrade=1&maxGrade=5` - Lấy grade levels trong khoảng
- `GET /api/grade-levels/age/{age}` - Lấy grade levels phù hợp với tuổi
- `GET /api/grade-levels/display-options` - Lấy danh sách tên để hiển thị
- `POST /api/grade-levels/initialize` - Khởi tạo grades 1-12 tiêu chuẩn

### Frontend Components

#### 1. GradeLevelSelector Component
```jsx
<GradeLevelSelector
  value={selectedGrades}
  onChange={setSelectedGrades}
  multiple={true}
  label="Target Grade Levels"
  helperText="Select one or more grade levels"
  useVietnamese={false}
  required={true}
/>
```

**Props:**
- `value`: Array of selected grade numbers (e.g., ['1', '3', '5'])
- `onChange`: Callback function when selection changes
- `multiple`: Boolean for single/multiple selection
- `label`: Label text for the selector
- `helperText`: Help text below the selector
- `useVietnamese`: Show Vietnamese names ("Lớp 1" vs "Grade 1")
- `required`: Mark field as required
- `disabled`: Disable the selector
- `error`: Show error state

#### 2. useGradeLevels Hook
```javascript
const { 
  gradeLevels, 
  gradeOptions, 
  loading, 
  error,
  getGradeNameByNumber,
  getVietnameseGradeNameByNumber,
  formatGradeNumbersToString,
  parseGradeLevelsString
} = useGradeLevels();
```

**Utility Functions:**
- `getGradeNameByNumber(5)` → "Grade 5"
- `getVietnameseGradeNameByNumber(5)` → "Lớp 5"
- `formatGradeNumbersToString([1,3,5])` → "Grade 1, Grade 3, Grade 5"
- `parseGradeLevelsString("Grade 1, Grade 3-5")` → [1, 3, 4, 5]

## Database Schema

### grade_levels Table
```sql
CREATE TABLE grade_levels (
    grade_id INT IDENTITY(1,1) PRIMARY KEY,
    grade_number INT NOT NULL UNIQUE,
    grade_name NVARCHAR(50) NOT NULL,
    vietnamese_name NVARCHAR(50),
    description NVARCHAR(MAX),
    min_age INT,
    max_age INT,
    is_active BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);
```

### Standard Grade Data
| Grade Number | Grade Name | Vietnamese Name | Age Range |
|--------------|------------|-----------------|-----------|
| 1 | Grade 1 | Lớp 1 | 6-7 |
| 2 | Grade 2 | Lớp 2 | 7-8 |
| 3 | Grade 3 | Lớp 3 | 8-9 |
| 4 | Grade 4 | Lớp 4 | 9-10 |
| 5 | Grade 5 | Lớp 5 | 10-11 |
| 6 | Grade 6 | Lớp 6 | 11-12 |
| 7 | Grade 7 | Lớp 7 | 12-13 |
| 8 | Grade 8 | Lớp 8 | 13-14 |
| 9 | Grade 9 | Lớp 9 | 14-15 |
| 10 | Grade 10 | Lớp 10 | 15-16 |
| 11 | Grade 11 | Lớp 11 | 16-17 |
| 12 | Grade 12 | Lớp 12 | 17-18 |

## Setup Instructions

### 1. Database Setup
```sql
-- Run the initialization script
-- File: sql/initialize-grade-levels.sql
-- OR use the updated convert-all-to-nvarchar.sql
```

### 2. Backend Setup
Các file đã được tạo:
- `model/GradeLevel.java`
- `dto/GradeLevelDTO.java`
- `repository/GradeLevelRepository.java`
- `service/GradeLevelService.java`
- `controller/GradeLevelController.java`

### 3. Frontend Setup
Các file đã được tạo/cập nhật:
- `hooks/useGradeLevels.js`
- `components/shared/GradeLevelSelector.jsx`
- `components/admin/GradeLevelManagement.jsx`
- `utils/api.js` (thêm Grade Level APIs)

### 4. Update Existing Components
File đã cập nhật:
- `components/healthcheckup/HealthCheckupEventForm.js` - Sử dụng GradeLevelSelector mới

## Usage Examples

### 1. Health Checkup Event Form
```jsx
// Old way (limited to 5 grades)
<FormGroup row>
  <FormControlLabel control={<Checkbox />} label="Grade 1" />
  <FormControlLabel control={<Checkbox />} label="Grade 2" />
  // ... only up to Grade 5
</FormGroup>

// New way (supports 1-12 grades)
<GradeLevelSelector
  value={formData.targetGradeLevels}
  onChange={handleGradeLevelsChange}
  multiple={true}
  label="Target Grade Levels"
  helperText="Select one or more grade levels (1-12)"
/>
```

### 2. Display Grade Information
```jsx
// Using the hook
const { formatGradeNumbersToString } = useGradeLevels();

// Display selected grades
<Typography>
  Selected: {formatGradeNumbersToString([1, 3, 5, 7, 9])}
  // Output: "Grade 1, Grade 3, Grade 5, Grade 7, Grade 9"
</Typography>
```

### 3. Vietnamese Display
```jsx
<GradeLevelSelector
  value={selectedGrades}
  onChange={setSelectedGrades}
  multiple={true}
  label="Chọn Khối Lớp"
  useVietnamese={true}
  helperText="Chọn một hoặc nhiều khối lớp"
/>
```

## API Usage

### Initialize Standard Grades
```javascript
import { initializeStandardGradeLevels } from '../utils/api';

// Initialize grades 1-12 in database
await initializeStandardGradeLevels();
```

### Get Grade Options for Forms
```javascript
import { getGradeDisplayOptions } from '../utils/api';

const gradeOptions = await getGradeDisplayOptions();
// Returns: ["Grade 1", "Grade 2", ..., "Grade 12"]
```

## Migration Notes

### From Old System
1. **Data Migration**: Dữ liệu hiện tại trong `targetGradeLevels` vẫn tương thích
2. **API Compatibility**: API endpoints hiện tại vẫn hoạt động
3. **Frontend**: Components cũ vẫn hoạt động, nhưng nên cập nhật để sử dụng hệ thống mới

### Benefits of New System
1. **Scalable**: Dễ dàng thêm/bớt grade levels
2. **Manageable**: Quản lý tập trung qua database
3. **Flexible**: Hỗ trợ cả tiếng Anh và tiếng Việt
4. **User-friendly**: UI hiện đại với Material-UI
5. **Extensible**: Có thể thêm metadata (tuổi, mô tả, etc.)

## Testing

### Test GradeLevelManagement Component
```jsx
import GradeLevelManagement from '../components/admin/GradeLevelManagement';

// Add to admin route for testing
<Route path="/admin/grade-levels" component={GradeLevelManagement} />
```

### Test API Endpoints
```bash
# Get all grade levels
GET /api/grade-levels

# Initialize standard grades
POST /api/grade-levels/initialize

# Get grades by range
GET /api/grade-levels/range?minGrade=1&maxGrade=12
```

## Troubleshooting

### Common Issues
1. **API không tải được**: Kiểm tra xem backend có running và có quyền truy cập không
2. **Grades không hiển thị**: Chạy script initialize để tạo dữ liệu mẫu
3. **UI lỗi**: Kiểm tra import statements và dependencies

### Fallback Data
Nếu API fail, hệ thống sẽ tự động sử dụng dữ liệu fallback với grades 1-12.

```javascript
// Fallback data in useGradeLevels hook
const fallbackGrades = Array.from({ length: 12 }, (_, i) => ({
  gradeId: i + 1,
  gradeNumber: i + 1,
  gradeName: `Grade ${i + 1}`,
  vietnameseName: `Lớp ${i + 1}`,
  isActive: true
}));
```
