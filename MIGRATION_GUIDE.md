# Hướng dẫn Migration từ axiosWithAuth sang api.js

## ✅ Files đã được cập nhật:
1. `frontend/src/pages/nurse/NurseDashboard.js` - ✅ Hoàn thành

## ⚠️ Files cần cập nhật:

### 1. `frontend/src/pages/medical/MedicationManagement.js`
**Thay đổi cần thiết:**
```javascript
// Từ:
import axiosWithAuth from '../../utils/axiosWithAuth';
const authAxios = axiosWithAuth();

// Thành:
import apiClient from '../../utils/api';
const authAxios = apiClient;
```

### 2. `frontend/src/components/medical/MedicalEventTab.js`
**Thay đổi cần thiết:**
```javascript
// Từ:
import axiosWithAuth from '../../utils/axiosWithAuth';
const authAxios = axiosWithAuth();

// Thành:
import apiClient from '../../utils/api';
const authAxios = apiClient;
```

### 3. `frontend/src/components/healthcheckup/HealthEventForm.js`
**Thay đổi cần thiết:**
```javascript
// Từ:
import axiosWithAuth from '../../utils/axiosWithAuth';
const authAxios = axiosWithAuth();

// Thành:
import apiClient from '../../utils/api';
const authAxios = apiClient;
```

### 4. `frontend/src/pages/debug/AuthDebugger.js`
**Trạng thái:** Đã comment - không cần cập nhật

## 🔧 Script PowerShell để tự động thay thế:

```powershell
# Navigate to frontend directory
cd "c:\Users\Khai\Documents\GitHub\School-Medical-Management-System-TranDinh\School-Medical-Management-System-TranDinh\School-Medical-Management-System-TranDinh\frontend"

# Replace import statements
(Get-Content "src\pages\medical\MedicationManagement.js") -replace "import axiosWithAuth from '../../utils/axiosWithAuth';", "import apiClient from '../../utils/api';" | Set-Content "src\pages\medical\MedicationManagement.js"

(Get-Content "src\components\medical\MedicalEventTab.js") -replace "import axiosWithAuth from '../../utils/axiosWithAuth';", "import apiClient from '../../utils/api';" | Set-Content "src\components\medical\MedicalEventTab.js"

(Get-Content "src\components\healthcheckup\HealthEventForm.js") -replace "import axiosWithAuth from '../../utils/axiosWithAuth';", "import apiClient from '../../utils/api';" | Set-Content "src\components\healthcheckup\HealthEventForm.js"

# Replace usage
(Get-Content "src\pages\medical\MedicationManagement.js") -replace "axiosWithAuth\(\)", "apiClient" | Set-Content "src\pages\medical\MedicationManagement.js"

(Get-Content "src\components\medical\MedicalEventTab.js") -replace "axiosWithAuth\(\)", "apiClient" | Set-Content "src\components\medical\MedicalEventTab.js"

(Get-Content "src\components\healthcheckup\HealthEventForm.js") -replace "axiosWithAuth\(\)", "apiClient" | Set-Content "src\components\healthcheckup\HealthEventForm.js"
```

## ✅ Tóm tắt tình trạng hiện tại:

### Files đã dọn dẹp xong:
- ✅ `utils/apiDiagnostics.js` - Đã comment
- ✅ `utils/axiosWithAuth.js` - Đã comment, export empty function
- ✅ `pages/debug/AuthDebugger.js` - Đã comment
- ✅ `components/HealthCheckupDebug.js` - Đã xóa
- ✅ `pages/medical/HealthCheckupManagement.js` - Đã remove debug code
- ✅ `pages/nurse/NurseDashboard.js` - Đã cập nhật import

### Files cần hoàn thiện:
- ⚠️ 3 files còn lại cần cập nhật import từ axiosWithAuth sang apiClient

### File chính đang hoạt động:
- ✅ `utils/api.js` - File chính với tất cả API functions

---
*Sau khi cập nhật 3 files còn lại, dự án sẽ hoàn toàn sạch sẽ và chỉ sử dụng api.js làm source duy nhất cho API calls.*
