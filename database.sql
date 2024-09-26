USE [master]
GO
/****** Object:  Database [OnlineLearningSystem]    Script Date: 9/26/2024 4:48:51 PM ******/
CREATE DATABASE [OnlineLearningSystem]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'OnlineLearningSystem', FILENAME = N'D:\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\OnlineLearningSystem.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'OnlineLearningSystem_log', FILENAME = N'D:\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\OnlineLearningSystem_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [OnlineLearningSystem] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [OnlineLearningSystem].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [OnlineLearningSystem] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET ARITHABORT OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [OnlineLearningSystem] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [OnlineLearningSystem] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET  ENABLE_BROKER 
GO
ALTER DATABASE [OnlineLearningSystem] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [OnlineLearningSystem] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET RECOVERY FULL 
GO
ALTER DATABASE [OnlineLearningSystem] SET  MULTI_USER 
GO
ALTER DATABASE [OnlineLearningSystem] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [OnlineLearningSystem] SET DB_CHAINING OFF 
GO
ALTER DATABASE [OnlineLearningSystem] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [OnlineLearningSystem] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [OnlineLearningSystem] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [OnlineLearningSystem] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'OnlineLearningSystem', N'ON'
GO
ALTER DATABASE [OnlineLearningSystem] SET QUERY_STORE = ON
GO
ALTER DATABASE [OnlineLearningSystem] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [OnlineLearningSystem]
GO
/****** Object:  Table [dbo].[ANSWER_OPTION]    Script Date: 9/26/2024 4:48:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ANSWER_OPTION](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[question_id] [int] NULL,
	[content] [nvarchar](max) NOT NULL,
	[is_correct] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CATEGORY]    Script Date: 9/26/2024 4:48:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CATEGORY](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[type] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DIMENSION]    Script Date: 9/26/2024 4:48:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DIMENSION](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[subject_id] [int] NULL,
	[name] [nvarchar](100) NOT NULL,
	[description] [nvarchar](max) NULL,
	[type] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LESSON]    Script Date: 9/26/2024 4:48:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LESSON](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[subject_id] [int] NULL,
	[name] [nvarchar](100) NOT NULL,
	[content] [nvarchar](max) NULL,
	[status] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[POST]    Script Date: 9/26/2024 4:48:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[POST](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[title] [nvarchar](255) NOT NULL,
	[thumbnail] [nvarchar](255) NULL,
	[brief_info] [nvarchar](max) NULL,
	[content] [nvarchar](max) NULL,
	[category_id] [int] NULL,
	[is_featured] [bit] NOT NULL,
	[status] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PRICE_PACKAGE]    Script Date: 9/26/2024 4:48:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PRICE_PACKAGE](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[subject_id] [int] NULL,
	[name] [nvarchar](100) NOT NULL,
	[duration_months] [int] NOT NULL,
	[list_price] [decimal](10, 2) NOT NULL,
	[sale_price] [decimal](10, 2) NOT NULL,
	[description] [nvarchar](max) NULL,
	[status] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[QUESTION]    Script Date: 9/26/2024 4:48:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QUESTION](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[quiz_id] [int] NULL,
	[content] [nvarchar](max) NOT NULL,
	[media_url] [nvarchar](255) NULL,
	[level] [nvarchar](20) NULL,
	[status] [nvarchar](20) NULL,
	[explanation] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[QUIZ]    Script Date: 9/26/2024 4:48:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QUIZ](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[subject_id] [int] NULL,
	[name] [nvarchar](100) NOT NULL,
	[level] [nvarchar](20) NULL,
	[duration_minutes] [int] NOT NULL,
	[pass_rate] [decimal](5, 2) NOT NULL,
	[type] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[REGISTRATION]    Script Date: 9/26/2024 4:48:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[REGISTRATION](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NULL,
	[subject_id] [int] NULL,
	[package_id] [int] NULL,
	[registration_time] [datetime] NOT NULL,
	[total_cost] [decimal](10, 2) NOT NULL,
	[status] [nvarchar](20) NULL,
	[valid_from] [date] NOT NULL,
	[valid_to] [date] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SUBJECT]    Script Date: 9/26/2024 4:48:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SUBJECT](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	[thumbnail] [nvarchar](255) NULL,
	[category_id] [int] NULL,
	[is_featured] [bit] NOT NULL,
	[owner_id] [int] NULL,
	[status] [nvarchar](20) NULL,
	[description] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[USER]    Script Date: 9/26/2024 4:48:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[USER](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[email] [nvarchar](100) NOT NULL,
	[password] [nvarchar](255) NOT NULL,
	[mobile] [nvarchar](20) NULL,
	[gender] [nvarchar](10) NULL,
	[avatar] [nvarchar](255) NULL,
	[role] [nvarchar](20) NULL,
	[status] [nvarchar](20) NULL,
	[first_name] [nvarchar](50) NULL,
	[mid_name] [nvarchar](50) NULL,
	[last_name] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[ANSWER_OPTION] ON 
GO
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct]) VALUES (1, 1, N'A container for storing data values', 1)
GO
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct]) VALUES (2, 1, N'A mathematical operation', 0)
GO
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct]) VALUES (3, 1, N'A type of loop', 0)
GO
SET IDENTITY_INSERT [dbo].[ANSWER_OPTION] OFF
GO
SET IDENTITY_INSERT [dbo].[CATEGORY] ON 
GO
INSERT [dbo].[CATEGORY] ([id], [name], [type]) VALUES (1, N'Information Technology', N'Subject')
GO
INSERT [dbo].[CATEGORY] ([id], [name], [type]) VALUES (2, N'Marketing', N'Subject')
GO
INSERT [dbo].[CATEGORY] ([id], [name], [type]) VALUES (3, N'Featured Courses', N'Post')
GO
INSERT [dbo].[CATEGORY] ([id], [name], [type]) VALUES (4, N'New Courses', N'Post')
GO
SET IDENTITY_INSERT [dbo].[CATEGORY] OFF
GO
SET IDENTITY_INSERT [dbo].[DIMENSION] ON 
GO
INSERT [dbo].[DIMENSION] ([id], [subject_id], [name], [description], [type]) VALUES (1, 1, N'Python Syntax', N'Basic Python syntax', N'Chapter')
GO
INSERT [dbo].[DIMENSION] ([id], [subject_id], [name], [description], [type]) VALUES (2, 1, N'Data Structures', N'Python data structures', N'Chapter')
GO
INSERT [dbo].[DIMENSION] ([id], [subject_id], [name], [description], [type]) VALUES (4, 3, N'Concurrency', N'Java concurrency and multithreading', N'Skill')
GO
INSERT [dbo].[DIMENSION] ([id], [subject_id], [name], [description], [type]) VALUES (5, 4, N'Content Strategy', N'Developing effective social media content', N'Topic')
GO
SET IDENTITY_INSERT [dbo].[DIMENSION] OFF
GO
SET IDENTITY_INSERT [dbo].[LESSON] ON 
GO
INSERT [dbo].[LESSON] ([id], [subject_id], [name], [content], [status]) VALUES (1, 1, N'Python Basics', N'Content for Python basics lesson', N'Active')
GO
INSERT [dbo].[LESSON] ([id], [subject_id], [name], [content], [status]) VALUES (2, 1, N'Python Functions', N'Content for Python functions lesson', N'Active')
GO
INSERT [dbo].[LESSON] ([id], [subject_id], [name], [content], [status]) VALUES (4, 3, N'Java Multithreading', N'Content for Java multithreading', N'Active')
GO
INSERT [dbo].[LESSON] ([id], [subject_id], [name], [content], [status]) VALUES (5, 4, N'Facebook Marketing Strategies', N'Content for Facebook marketing', N'Active')
GO
INSERT [dbo].[LESSON] ([id], [subject_id], [name], [content], [status]) VALUES (6, 1, N'aaaaaa', N'aaaaaaaaa', N'Active')
GO
SET IDENTITY_INSERT [dbo].[LESSON] OFF
GO
SET IDENTITY_INSERT [dbo].[POST] ON 
GO
INSERT [dbo].[POST] ([id], [title], [thumbnail], [brief_info], [content], [category_id], [is_featured], [status]) VALUES (1, N'Top IT Courses for Beginners', NULL, N'Discover the best IT courses to start your tech journey', N'Detailed content about top IT courses for beginners', 3, 1, N'Published')
GO
INSERT [dbo].[POST] ([id], [title], [thumbnail], [brief_info], [content], [category_id], [is_featured], [status]) VALUES (2, N'Latest Marketing Trends', NULL, N'Stay updated with the newest marketing strategies', N'In-depth analysis of current marketing trends', 4, 1, N'Published')
GO
SET IDENTITY_INSERT [dbo].[POST] OFF
GO
SET IDENTITY_INSERT [dbo].[PRICE_PACKAGE] ON 
GO
INSERT [dbo].[PRICE_PACKAGE] ([id], [subject_id], [name], [duration_months], [list_price], [sale_price], [description], [status]) VALUES (1, 1, N'Python Beginner Package', 3, CAST(99.99 AS Decimal(10, 2)), CAST(79.99 AS Decimal(10, 2)), N'3-month access to Python course', N'Active')
GO
INSERT [dbo].[PRICE_PACKAGE] ([id], [subject_id], [name], [duration_months], [list_price], [sale_price], [description], [status]) VALUES (3, 3, N'Advanced Java Package', 4, CAST(199.99 AS Decimal(10, 2)), CAST(179.99 AS Decimal(10, 2)), N'4-month access to Advanced Java course', N'Active')
GO
INSERT [dbo].[PRICE_PACKAGE] ([id], [subject_id], [name], [duration_months], [list_price], [sale_price], [description], [status]) VALUES (4, 4, N'Social Media Marketing Package', 3, CAST(129.99 AS Decimal(10, 2)), CAST(109.99 AS Decimal(10, 2)), N'3-month access to Social Media Marketing course', N'Active')
GO
SET IDENTITY_INSERT [dbo].[PRICE_PACKAGE] OFF
GO
SET IDENTITY_INSERT [dbo].[QUESTION] ON 
GO
INSERT [dbo].[QUESTION] ([id], [quiz_id], [content], [media_url], [level], [status], [explanation]) VALUES (1, 1, N'What is a variable in Python?', NULL, N'Easy', N'Active', N'A variable is a named location in memory used to store data')
GO
SET IDENTITY_INSERT [dbo].[QUESTION] OFF
GO
SET IDENTITY_INSERT [dbo].[QUIZ] ON 
GO
INSERT [dbo].[QUIZ] ([id], [subject_id], [name], [level], [duration_minutes], [pass_rate], [type]) VALUES (1, 1, N'Python Basics Quiz', N'Easy', 30, CAST(70.00 AS Decimal(5, 2)), N'Practice')
GO
SET IDENTITY_INSERT [dbo].[QUIZ] OFF
GO
SET IDENTITY_INSERT [dbo].[REGISTRATION] ON 
GO
INSERT [dbo].[REGISTRATION] ([id], [user_id], [subject_id], [package_id], [registration_time], [total_cost], [status], [valid_from], [valid_to]) VALUES (1, 3, 1, 1, CAST(N'2024-09-22T14:12:53.193' AS DateTime), CAST(79.99 AS Decimal(10, 2)), N'Approved', CAST(N'2024-09-20' AS Date), CAST(N'2024-12-20' AS Date))
GO
SET IDENTITY_INSERT [dbo].[REGISTRATION] OFF
GO
SET IDENTITY_INSERT [dbo].[SUBJECT] ON 
GO
INSERT [dbo].[SUBJECT] ([id], [name], [thumbnail], [category_id], [is_featured], [owner_id], [status], [description]) VALUES (1, N'Introduction to Python', NULL, 1, 1, 2, N'Active', N'Learn the basics of Python programming')
GO
INSERT [dbo].[SUBJECT] ([id], [name], [thumbnail], [category_id], [is_featured], [owner_id], [status], [description]) VALUES (3, N'Advanced Java Programming Hola', NULL, 1, 0, 2, N'Active', N'Deep dive into advanced Java concepts')
GO
INSERT [dbo].[SUBJECT] ([id], [name], [thumbnail], [category_id], [is_featured], [owner_id], [status], [description]) VALUES (4, N'Social Media Marketing', NULL, 2, 0, 2, N'Active', N'Learn effective social media marketing strategies')
GO
SET IDENTITY_INSERT [dbo].[SUBJECT] OFF
GO
SET IDENTITY_INSERT [dbo].[USER] ON 
GO
INSERT [dbo].[USER] ([id], [email], [password], [mobile], [gender], [avatar], [role], [status], [first_name], [mid_name], [last_name]) VALUES (1, N'john.doe@email.com', N'hashed_password_1', N'1234567890', N'Male', NULL, N'Admin', N'Active', N'A', N'John', N'Doe')
GO
INSERT [dbo].[USER] ([id], [email], [password], [mobile], [gender], [avatar], [role], [status], [first_name], [mid_name], [last_name]) VALUES (2, N'jane.smith@email.com', N'hashed_password_2', N'0987654321', N'Female', NULL, N'Teacher', N'Active', N'A', N'Jane', N'Smith')
GO
INSERT [dbo].[USER] ([id], [email], [password], [mobile], [gender], [avatar], [role], [status], [first_name], [mid_name], [last_name]) VALUES (3, N'bob.johnson@email.com', N'hashed_password_3', N'1122334455', N'Male', NULL, N'Student', N'Active', N'A', N'Bob', N'Johnson')
GO
SET IDENTITY_INSERT [dbo].[USER] OFF
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__USER__AB6E6164DC85DF7D]    Script Date: 9/26/2024 4:48:51 PM ******/
ALTER TABLE [dbo].[USER] ADD UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ANSWER_OPTION] ADD  DEFAULT ((0)) FOR [is_correct]
GO
ALTER TABLE [dbo].[POST] ADD  DEFAULT ((0)) FOR [is_featured]
GO
ALTER TABLE [dbo].[REGISTRATION] ADD  DEFAULT (getdate()) FOR [registration_time]
GO
ALTER TABLE [dbo].[SUBJECT] ADD  DEFAULT ((0)) FOR [is_featured]
GO
ALTER TABLE [dbo].[ANSWER_OPTION]  WITH CHECK ADD FOREIGN KEY([question_id])
REFERENCES [dbo].[QUESTION] ([id])
GO
ALTER TABLE [dbo].[DIMENSION]  WITH CHECK ADD FOREIGN KEY([subject_id])
REFERENCES [dbo].[SUBJECT] ([id])
GO
ALTER TABLE [dbo].[LESSON]  WITH CHECK ADD FOREIGN KEY([subject_id])
REFERENCES [dbo].[SUBJECT] ([id])
GO
ALTER TABLE [dbo].[POST]  WITH CHECK ADD FOREIGN KEY([category_id])
REFERENCES [dbo].[CATEGORY] ([id])
GO
ALTER TABLE [dbo].[PRICE_PACKAGE]  WITH CHECK ADD FOREIGN KEY([subject_id])
REFERENCES [dbo].[SUBJECT] ([id])
GO
ALTER TABLE [dbo].[QUESTION]  WITH CHECK ADD FOREIGN KEY([quiz_id])
REFERENCES [dbo].[QUIZ] ([id])
GO
ALTER TABLE [dbo].[QUIZ]  WITH CHECK ADD FOREIGN KEY([subject_id])
REFERENCES [dbo].[SUBJECT] ([id])
GO
ALTER TABLE [dbo].[REGISTRATION]  WITH CHECK ADD FOREIGN KEY([package_id])
REFERENCES [dbo].[PRICE_PACKAGE] ([id])
GO
ALTER TABLE [dbo].[REGISTRATION]  WITH CHECK ADD FOREIGN KEY([subject_id])
REFERENCES [dbo].[SUBJECT] ([id])
GO
ALTER TABLE [dbo].[REGISTRATION]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[USER] ([id])
GO
ALTER TABLE [dbo].[SUBJECT]  WITH CHECK ADD FOREIGN KEY([category_id])
REFERENCES [dbo].[CATEGORY] ([id])
GO
ALTER TABLE [dbo].[SUBJECT]  WITH CHECK ADD FOREIGN KEY([owner_id])
REFERENCES [dbo].[USER] ([id])
GO
ALTER TABLE [dbo].[CATEGORY]  WITH CHECK ADD CHECK  (([type]='Post' OR [type]='Subject'))
GO
ALTER TABLE [dbo].[DIMENSION]  WITH CHECK ADD CHECK  (([type]='Skill' OR [type]='Topic' OR [type]='Chapter'))
GO
ALTER TABLE [dbo].[LESSON]  WITH CHECK ADD CHECK  (([status]='Draft' OR [status]='Inactive' OR [status]='Active'))
GO
ALTER TABLE [dbo].[POST]  WITH CHECK ADD CHECK  (([status]='Archived' OR [status]='Draft' OR [status]='Published'))
GO
ALTER TABLE [dbo].[PRICE_PACKAGE]  WITH CHECK ADD CHECK  (([status]='Inactive' OR [status]='Active'))
GO
ALTER TABLE [dbo].[QUESTION]  WITH CHECK ADD CHECK  (([level]='Hard' OR [level]='Medium' OR [level]='Easy'))
GO
ALTER TABLE [dbo].[QUESTION]  WITH CHECK ADD CHECK  (([status]='Draft' OR [status]='Inactive' OR [status]='Active'))
GO
ALTER TABLE [dbo].[QUIZ]  WITH CHECK ADD CHECK  (([level]='Hard' OR [level]='Medium' OR [level]='Easy'))
GO
ALTER TABLE [dbo].[QUIZ]  WITH CHECK ADD CHECK  (([type]='Test' OR [type]='Practice'))
GO
ALTER TABLE [dbo].[REGISTRATION]  WITH CHECK ADD CHECK  (([status]='Rejected' OR [status]='Approved' OR [status]='Pending'))
GO
ALTER TABLE [dbo].[SUBJECT]  WITH CHECK ADD CHECK  (([status]='Draft' OR [status]='Inactive' OR [status]='Active'))
GO
ALTER TABLE [dbo].[USER]  WITH CHECK ADD CHECK  (([gender]='Other' OR [gender]='Female' OR [gender]='Male'))
GO
ALTER TABLE [dbo].[USER]  WITH CHECK ADD CHECK  (([role]='Student' OR [role]='Teacher' OR [role]='Admin'))
GO
ALTER TABLE [dbo].[USER]  WITH CHECK ADD CHECK  (([status]='Blocked' OR [status]='Inactive' OR [status]='Active'))
GO
USE [master]
GO
ALTER DATABASE [OnlineLearningSystem] SET  READ_WRITE 
GO
