-- Script để đơn giản hóa bảng medication_inventory
-- Lưu ý: Thực hiện backup dữ liệu trước khi chạy script này

-- 1. Trước tiên, tạo bảng tạm thời để lưu trữ dữ liệu cần giữ
IF OBJECT_ID('tempdb..#TempMedicationInventory') IS NOT NULL
DROP TABLE #TempMedicationInventory;

CREATE TABLE #TempMedicationInventory (
    medication_id INT,
    medication_name NVARCHAR(255),
    dosage NVARCHAR(100),
    form NVARCHAR(50),
    batch_number NVARCHAR(50),
    expiry_date DATE,
    quantity INT,
    created_at DATETIME,
    updated_at DATETIME
);

-- 2. Sao chép dữ liệu từ bảng gốc sang bảng tạm
INSERT INTO #TempMedicationInventory (
    medication_id,
    medication_name,
    dosage,
    form,
    batch_number,
    expiry_date,
    quantity,
    created_at,
    updated_at
)
SELECT
    medication_id,
    medication_name,
    dosage,
    form,
    batch_number,
    expiry_date,
    quantity,
    created_at,
    updated_at
FROM medication_inventory;

-- 3. Xóa các bảng liên quan (nếu có)
-- Lưu ý: Có thể cần điều chỉnh theo cấu trúc thực tế của database
IF OBJECT_ID('dbo.medication_usage', 'U') IS NOT NULL
    DROP TABLE dbo.medication_usage;
    
IF OBJECT_ID('dbo.medication_side_effects', 'U') IS NOT NULL
    DROP TABLE dbo.medication_side_effects;
    
IF OBJECT_ID('dbo.medication_contraindications', 'U') IS NOT NULL
    DROP TABLE dbo.medication_contraindications;

-- 4. Xóa bảng medication_inventory hiện tại
IF OBJECT_ID('dbo.medication_inventory', 'U') IS NOT NULL
    DROP TABLE dbo.medication_inventory;

-- 5. Tạo lại bảng medication_inventory với cấu trúc đã đơn giản hóa
CREATE TABLE dbo.medication_inventory (
    medication_id INT PRIMARY KEY IDENTITY(1,1),
    medication_name NVARCHAR(255) NOT NULL,
    dosage NVARCHAR(100) NOT NULL,
    form NVARCHAR(50) NOT NULL,
    batch_number NVARCHAR(50) NULL,
    expiry_date DATE NOT NULL,
    quantity INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NULL
);

-- 6. Khôi phục dữ liệu từ bảng tạm
SET IDENTITY_INSERT dbo.medication_inventory ON;

INSERT INTO dbo.medication_inventory (
    medication_id,
    medication_name,
    dosage,
    form,
    batch_number,
    expiry_date,
    quantity,
    created_at,
    updated_at
)
SELECT
    medication_id,
    medication_name,
    dosage,
    form,
    batch_number,
    expiry_date,
    quantity,
    created_at,
    updated_at
FROM #TempMedicationInventory;

SET IDENTITY_INSERT dbo.medication_inventory OFF;

-- 7. Xóa bảng tạm
DROP TABLE #TempMedicationInventory;

-- 8. Kiểm tra kết quả
SELECT TOP 10 * FROM dbo.medication_inventory;
