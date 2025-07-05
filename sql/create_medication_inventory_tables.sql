-- Script để tạo bảng Medication Inventory (Kho thuốc)
USE [HealthSchoolDB]
GO

-- Tạo bảng medication_inventory để lưu trữ thông tin thuốc trong kho
CREATE TABLE [dbo].[medication_inventory](
	[medication_id] [int] IDENTITY(1,1) NOT NULL,
	[medication_name] [nvarchar](255) NOT NULL,
	[dosage] [nvarchar](100) NOT NULL,
	[form] [nvarchar](50) NOT NULL, -- Viên nén, Siro, Kem bôi, v.v.
	[manufacturer] [nvarchar](255) NULL,
	[batch_number] [nvarchar](50) NULL,
	[expiry_date] [date] NOT NULL,
	[quantity] [int] NOT NULL,
	[unit_cost] [decimal](10, 2) NULL,
	[storage_location] [nvarchar](100) NULL,
	[prescription_required] [bit] NOT NULL DEFAULT(0),
	[created_at] [datetime2](6) NOT NULL DEFAULT(GETDATE()),
	[updated_at] [datetime2](6) NULL,
	[created_by] [int] NULL,
	[updated_by] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[medication_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- Thêm các ràng buộc khóa ngoại
ALTER TABLE [dbo].[medication_inventory]  WITH CHECK ADD  CONSTRAINT [FK_medication_inventory_created_by] FOREIGN KEY([created_by])
REFERENCES [dbo].[users] ([user_id])
GO

ALTER TABLE [dbo].[medication_inventory]  WITH CHECK ADD  CONSTRAINT [FK_medication_inventory_updated_by] FOREIGN KEY([updated_by])
REFERENCES [dbo].[users] ([user_id])
GO

-- Bảng phụ để lưu thông tin tác dụng phụ của thuốc (quan hệ nhiều-nhiều)
CREATE TABLE [dbo].[medication_side_effects](
	[medication_id] [int] NOT NULL,
	[side_effect] [nvarchar](255) NOT NULL,
	CONSTRAINT [PK_medication_side_effects] PRIMARY KEY ([medication_id], [side_effect])
)
GO

ALTER TABLE [dbo].[medication_side_effects] WITH CHECK ADD CONSTRAINT [FK_medication_side_effects_medication]
FOREIGN KEY([medication_id]) REFERENCES [dbo].[medication_inventory]([medication_id])
GO

-- Bảng phụ để lưu thông tin chống chỉ định (quan hệ nhiều-nhiều)
CREATE TABLE [dbo].[medication_contraindications](
	[medication_id] [int] NOT NULL,
	[contraindication] [nvarchar](255) NOT NULL,
	CONSTRAINT [PK_medication_contraindications] PRIMARY KEY ([medication_id], [contraindication])
)
GO

ALTER TABLE [dbo].[medication_contraindications] WITH CHECK ADD CONSTRAINT [FK_medication_contraindications_medication]
FOREIGN KEY([medication_id]) REFERENCES [dbo].[medication_inventory]([medication_id])
GO

-- Tạo bảng theo dõi sử dụng thuốc
CREATE TABLE [dbo].[medication_usage](
	[usage_id] [int] IDENTITY(1,1) NOT NULL,
	[medication_id] [int] NOT NULL,
	[quantity_used] [int] NOT NULL,
	[usage_date] [datetime2](6) NOT NULL DEFAULT(GETDATE()),
	[used_by] [int] NULL,
	[request_id] [int] NULL, -- Liên kết với medication_requests nếu thuốc được sử dụng cho một yêu cầu
	[notes] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[usage_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[medication_usage] WITH CHECK ADD CONSTRAINT [FK_medication_usage_medication]
FOREIGN KEY([medication_id]) REFERENCES [dbo].[medication_inventory]([medication_id])
GO

ALTER TABLE [dbo].[medication_usage] WITH CHECK ADD CONSTRAINT [FK_medication_usage_used_by]
FOREIGN KEY([used_by]) REFERENCES [dbo].[users]([user_id])
GO

ALTER TABLE [dbo].[medication_usage] WITH CHECK ADD CONSTRAINT [FK_medication_usage_request]
FOREIGN KEY([request_id]) REFERENCES [dbo].[medication_requests]([request_id])
GO

-- Dữ liệu mẫu
INSERT INTO [dbo].[medication_inventory]
           ([medication_name]
           ,[dosage]
           ,[form]
           ,[manufacturer]
           ,[batch_number]
           ,[expiry_date]
           ,[quantity]
           ,[unit_cost]
           ,[storage_location]
           ,[prescription_required])
     VALUES
           (N'Paracetamol'
           ,N'500mg'
           ,N'Viên nén'
           ,N'Dược phẩm Việt Nam'
           ,N'VN-2023-001'
           ,'2025-12-31'
           ,100
           ,0.50
           ,N'Tủ thuốc A1'
           ,0)
GO

INSERT INTO [dbo].[medication_inventory]
           ([medication_name]
           ,[dosage]
           ,[form]
           ,[manufacturer]
           ,[batch_number]
           ,[expiry_date]
           ,[quantity]
           ,[unit_cost]
           ,[storage_location]
           ,[prescription_required])
     VALUES
           (N'Ibuprofen'
           ,N'200mg'
           ,N'Viên nén'
           ,N'Dược phẩm Hậu Giang'
           ,N'HG-2023-045'
           ,'2025-10-15'
           ,80
           ,0.75
           ,N'Tủ thuốc A2'
           ,0)
GO

-- Thêm tác dụng phụ mẫu
INSERT INTO [dbo].[medication_side_effects] ([medication_id], [side_effect])
VALUES (1, N'Buồn nôn'), (1, N'Nổi mẩn da');

INSERT INTO [dbo].[medication_side_effects] ([medication_id], [side_effect])
VALUES (2, N'Đau dạ dày'), (2, N'Chóng mặt');

-- Thêm chống chỉ định mẫu
INSERT INTO [dbo].[medication_contraindications] ([medication_id], [contraindication])
VALUES (1, N'Bệnh gan'), (2, N'Loét dạ dày');
