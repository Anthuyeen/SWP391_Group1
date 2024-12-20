USE [master]
GO
/****** Object:  Database [OnlineLearningSystem]    Script Date: 10/26/2024 2:11:04 AM ******/
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
/****** Object:  Table [dbo].[ANSWER_OPTION]    Script Date: 10/26/2024 2:11:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ANSWER_OPTION](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[question_id] [int] NULL,
	[content] [nvarchar](max) NOT NULL,
	[is_correct] [bit] NOT NULL,
	[status] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CATEGORY]    Script Date: 10/26/2024 2:11:04 AM ******/
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
/****** Object:  Table [dbo].[CHAPTER]    Script Date: 10/26/2024 2:11:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CHAPTER](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[subject_id] [int] NOT NULL,
	[title] [nvarchar](255) NOT NULL,
	[status] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CHAPTER_COMPLETION]    Script Date: 10/26/2024 2:11:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CHAPTER_COMPLETION](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[chapter_id] [int] NOT NULL,
	[subject_id] [int] NOT NULL,
	[completion_date] [datetime] NOT NULL,
	[status] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LESSON]    Script Date: 10/26/2024 2:11:04 AM ******/
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
	[url] [nvarchar](255) NULL,
	[chapter_id] [int] NULL,
	[display_order] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LESSON_COMPLETION]    Script Date: 10/26/2024 2:11:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LESSON_COMPLETION](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[lesson_id] [int] NOT NULL,
	[completion_date] [datetime] NULL,
	[status] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[POST]    Script Date: 10/26/2024 2:11:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[POST](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[title] [nvarchar](255) NOT NULL,
	[brief_info] [nvarchar](max) NULL,
	[category_id] [int] NULL,
	[is_featured] [bit] NOT NULL,
	[status] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[POST_CONTENT]    Script Date: 10/26/2024 2:11:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[POST_CONTENT](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[post_id] [int] NOT NULL,
	[content] [nvarchar](max) NULL,
	[display_order] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[POST_IMAGES]    Script Date: 10/26/2024 2:11:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[POST_IMAGES](
	[post_id] [int] NOT NULL,
	[url] [text] NOT NULL,
	[display_order] [int] NOT NULL,
	[id] [int] IDENTITY(1,1) NOT NULL,
 CONSTRAINT [PK_POST_IMAGES] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PRICE_PACKAGE]    Script Date: 10/26/2024 2:11:04 AM ******/
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
/****** Object:  Table [dbo].[QUESTION]    Script Date: 10/26/2024 2:11:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QUESTION](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[quiz_id] [int] NULL,
	[content] [nvarchar](max) NOT NULL,
	[media_url] [nvarchar](255) NULL,
	[status] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[QUIZ]    Script Date: 10/26/2024 2:11:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QUIZ](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[subject_id] [int] NULL,
	[name] [nvarchar](100) NOT NULL,
	[duration_minutes] [int] NOT NULL,
	[pass_rate] [decimal](5, 2) NOT NULL,
	[type] [nvarchar](20) NULL,
	[status] [nvarchar](20) NOT NULL,
	[chapter_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[QUIZ_ATTEMPT]    Script Date: 10/26/2024 2:11:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QUIZ_ATTEMPT](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[quiz_id] [int] NOT NULL,
	[score] [decimal](5, 2) NOT NULL,
	[start_time] [datetime] NOT NULL,
	[end_time] [datetime] NOT NULL,
	[attempt_number] [int] NOT NULL,
	[IsPassed] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[REGISTRATION]    Script Date: 10/26/2024 2:11:04 AM ******/
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
/****** Object:  Table [dbo].[SUBJECT]    Script Date: 10/26/2024 2:11:04 AM ******/
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
/****** Object:  Table [dbo].[SUBJECT_COMPLETION]    Script Date: 10/26/2024 2:11:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SUBJECT_COMPLETION](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[subject_id] [int] NOT NULL,
	[completion_date] [datetime] NOT NULL,
	[status] [bit] NOT NULL,
	[certificate_url] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[USER]    Script Date: 10/26/2024 2:11:04 AM ******/
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
/****** Object:  Table [dbo].[USER_ANSWER]    Script Date: 10/26/2024 2:11:04 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[USER_ANSWER](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[quiz_attempt_id] [int] NOT NULL,
	[question_id] [int] NOT NULL,
	[answer_option_id] [int] NOT NULL,
	[is_correct] [bit] NOT NULL,
	[question_content] [nvarchar](max) NOT NULL,
	[selected_answer_content] [nvarchar](max) NOT NULL,
	[correct_answer_content] [nvarchar](max) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[ANSWER_OPTION] ON 

INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct], [status]) VALUES (1, 1, N'A container for storing data values', 0, 1)
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct], [status]) VALUES (2, 1, N'A mathematical operation', 0, 1)
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct], [status]) VALUES (3, 1, N'A type of loop', 1, 1)
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct], [status]) VALUES (4, 1, N'A function definition', 0, 1)
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct], [status]) VALUES (5, 3, N'Integer', 0, 1)
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct], [status]) VALUES (6, 3, N'Float', 0, 1)
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct], [status]) VALUES (7, 3, N'String', 0, 1)
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct], [status]) VALUES (8, 3, N'Character', 1, 1)
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct], [status]) VALUES (9, 4, N'4', 0, 1)
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct], [status]) VALUES (10, 4, N'6', 0, 1)
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct], [status]) VALUES (11, 4, N'8', 1, 1)
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct], [status]) VALUES (12, 4, N'9', 0, 1)
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct], [status]) VALUES (15, 5, N'string123', 0, 1)
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct], [status]) VALUES (16, 5, N'string2123', 0, 0)
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct], [status]) VALUES (17, 5, N'11111', 1, 1)
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct], [status]) VALUES (18, 6, N'asdsadsadas', 0, 0)
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct], [status]) VALUES (19, 6, N'asdsdfafa', 0, 0)
INSERT [dbo].[ANSWER_OPTION] ([id], [question_id], [content], [is_correct], [status]) VALUES (20, 6, N'adsdad', 1, 1)
SET IDENTITY_INSERT [dbo].[ANSWER_OPTION] OFF
GO
SET IDENTITY_INSERT [dbo].[CATEGORY] ON 

INSERT [dbo].[CATEGORY] ([id], [name], [type]) VALUES (1, N'Information Technology', N'Subject')
INSERT [dbo].[CATEGORY] ([id], [name], [type]) VALUES (2, N'Marketing', N'Subject')
INSERT [dbo].[CATEGORY] ([id], [name], [type]) VALUES (3, N'Featured Courses', N'Post')
INSERT [dbo].[CATEGORY] ([id], [name], [type]) VALUES (4, N'New Courses', N'Post')
SET IDENTITY_INSERT [dbo].[CATEGORY] OFF
GO
SET IDENTITY_INSERT [dbo].[CHAPTER] ON 

INSERT [dbo].[CHAPTER] ([id], [subject_id], [title], [status]) VALUES (1, 1, N'Python', N'Active')
SET IDENTITY_INSERT [dbo].[CHAPTER] OFF
GO
SET IDENTITY_INSERT [dbo].[LESSON] ON 

INSERT [dbo].[LESSON] ([id], [subject_id], [name], [content], [status], [url], [chapter_id], [display_order]) VALUES (1, 1, N'Python Basics', N'Content for Python basics lesson', N'Active', NULL, 1, 1)
INSERT [dbo].[LESSON] ([id], [subject_id], [name], [content], [status], [url], [chapter_id], [display_order]) VALUES (2, 1, N'Python Functions', N'Content for Python functions lesson', N'Active', NULL, 1, 2)
INSERT [dbo].[LESSON] ([id], [subject_id], [name], [content], [status], [url], [chapter_id], [display_order]) VALUES (4, 3, N'Java Multithreading', N'Content for Java multithreading', N'Active', NULL, NULL, 0)
INSERT [dbo].[LESSON] ([id], [subject_id], [name], [content], [status], [url], [chapter_id], [display_order]) VALUES (5, 4, N'Facebook Marketing Strategies', N'Content for Facebook marketing', N'Active', NULL, NULL, 0)
SET IDENTITY_INSERT [dbo].[LESSON] OFF
GO
SET IDENTITY_INSERT [dbo].[LESSON_COMPLETION] ON 

INSERT [dbo].[LESSON_COMPLETION] ([id], [user_id], [lesson_id], [completion_date], [status]) VALUES (1, 3, 1, CAST(N'2024-10-21T11:06:49.707' AS DateTime), 0)
INSERT [dbo].[LESSON_COMPLETION] ([id], [user_id], [lesson_id], [completion_date], [status]) VALUES (2, 3, 2, CAST(N'2024-10-25T18:18:58.943' AS DateTime), 1)
SET IDENTITY_INSERT [dbo].[LESSON_COMPLETION] OFF
GO
SET IDENTITY_INSERT [dbo].[POST] ON 

INSERT [dbo].[POST] ([id], [title], [brief_info], [category_id], [is_featured], [status]) VALUES (1, N'Top IT Courses for Beginners', N'Discover the best IT courses to start your tech journey', 3, 1, N'Published')
INSERT [dbo].[POST] ([id], [title], [brief_info], [category_id], [is_featured], [status]) VALUES (2, N'Latest Marketing Trends', N'Stay updated with the newest marketing strategies', 4, 1, N'Published')
SET IDENTITY_INSERT [dbo].[POST] OFF
GO
SET IDENTITY_INSERT [dbo].[POST_CONTENT] ON 

INSERT [dbo].[POST_CONTENT] ([id], [post_id], [content], [display_order]) VALUES (1, 1, N'Detailed content about top IT courses for beginners', 0)
INSERT [dbo].[POST_CONTENT] ([id], [post_id], [content], [display_order]) VALUES (2, 2, N'In-depth analysis of current marketing trends', 0)
SET IDENTITY_INSERT [dbo].[POST_CONTENT] OFF
GO
SET IDENTITY_INSERT [dbo].[POST_IMAGES] ON 

INSERT [dbo].[POST_IMAGES] ([post_id], [url], [display_order], [id]) VALUES (1, N'https://example.com/image1.jpg', 0, 4)
INSERT [dbo].[POST_IMAGES] ([post_id], [url], [display_order], [id]) VALUES (1, N'https://example.com/image2.jpg', 0, 5)
SET IDENTITY_INSERT [dbo].[POST_IMAGES] OFF
GO
SET IDENTITY_INSERT [dbo].[PRICE_PACKAGE] ON 

INSERT [dbo].[PRICE_PACKAGE] ([id], [subject_id], [name], [duration_months], [list_price], [sale_price], [description], [status]) VALUES (1, 1, N'Python Beginner Package', 3, CAST(99.99 AS Decimal(10, 2)), CAST(79.99 AS Decimal(10, 2)), N'3-month access to Python course', N'Active')
INSERT [dbo].[PRICE_PACKAGE] ([id], [subject_id], [name], [duration_months], [list_price], [sale_price], [description], [status]) VALUES (3, 3, N'Advanced Java Package', 4, CAST(199.99 AS Decimal(10, 2)), CAST(179.99 AS Decimal(10, 2)), N'4-month access to Advanced Java course', N'Active')
INSERT [dbo].[PRICE_PACKAGE] ([id], [subject_id], [name], [duration_months], [list_price], [sale_price], [description], [status]) VALUES (4, 4, N'Social Media Marketing Package', 3, CAST(129.99 AS Decimal(10, 2)), CAST(109.99 AS Decimal(10, 2)), N'3-month access to Social Media Marketing course', N'Active')
SET IDENTITY_INSERT [dbo].[PRICE_PACKAGE] OFF
GO
SET IDENTITY_INSERT [dbo].[QUESTION] ON 

INSERT [dbo].[QUESTION] ([id], [quiz_id], [content], [media_url], [status]) VALUES (1, 1, N'What is a variable in Python?', NULL, N'Active')
INSERT [dbo].[QUESTION] ([id], [quiz_id], [content], [media_url], [status]) VALUES (3, 1, N'Which of the following is not a valid Python data type?', NULL, N'Active')
INSERT [dbo].[QUESTION] ([id], [quiz_id], [content], [media_url], [status]) VALUES (4, 1, N'What is the output of print(2 ** 3)?', NULL, N'Active')
INSERT [dbo].[QUESTION] ([id], [quiz_id], [content], [media_url], [status]) VALUES (5, 1, N'string213213', N'string', N'Active')
INSERT [dbo].[QUESTION] ([id], [quiz_id], [content], [media_url], [status]) VALUES (6, 1, N'dabkbvkhzxcb kj', N'', N'Active')
SET IDENTITY_INSERT [dbo].[QUESTION] OFF
GO
SET IDENTITY_INSERT [dbo].[QUIZ] ON 

INSERT [dbo].[QUIZ] ([id], [subject_id], [name], [duration_minutes], [pass_rate], [type], [status], [chapter_id]) VALUES (1, 1, N'Python Basics Quiz', 30, CAST(80.00 AS Decimal(5, 2)), N'Practice', N'Published', 1)
SET IDENTITY_INSERT [dbo].[QUIZ] OFF
GO
SET IDENTITY_INSERT [dbo].[QUIZ_ATTEMPT] ON 

INSERT [dbo].[QUIZ_ATTEMPT] ([id], [user_id], [quiz_id], [score], [start_time], [end_time], [attempt_number], [IsPassed]) VALUES (1, 3, 1, CAST(80.00 AS Decimal(5, 2)), CAST(N'2024-09-25T10:00:00.000' AS DateTime), CAST(N'2024-09-25T10:25:00.000' AS DateTime), 1, 0)
INSERT [dbo].[QUIZ_ATTEMPT] ([id], [user_id], [quiz_id], [score], [start_time], [end_time], [attempt_number], [IsPassed]) VALUES (2, 3, 1, CAST(90.00 AS Decimal(5, 2)), CAST(N'2024-09-26T14:00:00.000' AS DateTime), CAST(N'2024-09-26T14:22:00.000' AS DateTime), 2, 0)
INSERT [dbo].[QUIZ_ATTEMPT] ([id], [user_id], [quiz_id], [score], [start_time], [end_time], [attempt_number], [IsPassed]) VALUES (3, 2, 1, CAST(100.00 AS Decimal(5, 2)), CAST(N'2024-09-27T09:00:00.000' AS DateTime), CAST(N'2024-09-27T09:18:00.000' AS DateTime), 1, 0)
INSERT [dbo].[QUIZ_ATTEMPT] ([id], [user_id], [quiz_id], [score], [start_time], [end_time], [attempt_number], [IsPassed]) VALUES (4, 3, 1, CAST(50.00 AS Decimal(5, 2)), CAST(N'2024-10-14T10:20:15.917' AS DateTime), CAST(N'2024-10-14T10:27:45.147' AS DateTime), 3, 0)
SET IDENTITY_INSERT [dbo].[QUIZ_ATTEMPT] OFF
GO
SET IDENTITY_INSERT [dbo].[REGISTRATION] ON 

INSERT [dbo].[REGISTRATION] ([id], [user_id], [subject_id], [package_id], [registration_time], [total_cost], [status], [valid_from], [valid_to]) VALUES (1, 3, 1, 1, CAST(N'2024-09-22T14:12:53.193' AS DateTime), CAST(79.99 AS Decimal(10, 2)), N'Approved', CAST(N'2024-09-20' AS Date), CAST(N'2024-12-20' AS Date))
SET IDENTITY_INSERT [dbo].[REGISTRATION] OFF
GO
SET IDENTITY_INSERT [dbo].[SUBJECT] ON 

INSERT [dbo].[SUBJECT] ([id], [name], [thumbnail], [category_id], [is_featured], [owner_id], [status], [description]) VALUES (1, N'Introduction to Python', NULL, 1, 1, 2, N'Active', N'Learn the basics of Python programming')
INSERT [dbo].[SUBJECT] ([id], [name], [thumbnail], [category_id], [is_featured], [owner_id], [status], [description]) VALUES (3, N'Advanced Java Programming Hola', NULL, 1, 0, 2, N'Active', N'Deep dive into advanced Java concepts')
INSERT [dbo].[SUBJECT] ([id], [name], [thumbnail], [category_id], [is_featured], [owner_id], [status], [description]) VALUES (4, N'Social Media Marketing', NULL, 2, 0, 2, N'Active', N'Learn effective social media marketing strategies')
SET IDENTITY_INSERT [dbo].[SUBJECT] OFF
GO
SET IDENTITY_INSERT [dbo].[USER] ON 

INSERT [dbo].[USER] ([id], [email], [password], [mobile], [gender], [avatar], [role], [status], [first_name], [mid_name], [last_name]) VALUES (1, N'john.doe@email.com', N'hashed_password_1', N'1234567890', N'Male', NULL, N'Admin', N'Active', N'A', N'John', N'Doe')
INSERT [dbo].[USER] ([id], [email], [password], [mobile], [gender], [avatar], [role], [status], [first_name], [mid_name], [last_name]) VALUES (2, N'jane.smith@email.com', N'hashed_password_2', N'0987654321', N'Female', NULL, N'Teacher', N'Active', N'A', N'Jane', N'Smith')
INSERT [dbo].[USER] ([id], [email], [password], [mobile], [gender], [avatar], [role], [status], [first_name], [mid_name], [last_name]) VALUES (3, N'bob.johnson@email.com', N'hashed_password_3', N'1122334455', N'Male', NULL, N'Student', N'Active', N'A', N'Bob', N'Johnson')
SET IDENTITY_INSERT [dbo].[USER] OFF
GO
SET IDENTITY_INSERT [dbo].[USER_ANSWER] ON 

INSERT [dbo].[USER_ANSWER] ([id], [quiz_attempt_id], [question_id], [answer_option_id], [is_correct], [question_content], [selected_answer_content], [correct_answer_content]) VALUES (1, 4, 1, 1, 1, N'What is a variable in Python?', N'A container for storing data values', N'A container for storing data values')
INSERT [dbo].[USER_ANSWER] ([id], [quiz_attempt_id], [question_id], [answer_option_id], [is_correct], [question_content], [selected_answer_content], [correct_answer_content]) VALUES (2, 4, 3, 6, 0, N'Which of the following is not a valid Python data type?', N'Float', N'Character')
INSERT [dbo].[USER_ANSWER] ([id], [quiz_attempt_id], [question_id], [answer_option_id], [is_correct], [question_content], [selected_answer_content], [correct_answer_content]) VALUES (3, 4, 4, 11, 1, N'What is the output of print(2 ** 3)?', N'8', N'8')
INSERT [dbo].[USER_ANSWER] ([id], [quiz_attempt_id], [question_id], [answer_option_id], [is_correct], [question_content], [selected_answer_content], [correct_answer_content]) VALUES (4, 4, 5, 15, 0, N'string213213', N'string123', N'No correct answer provided')
SET IDENTITY_INSERT [dbo].[USER_ANSWER] OFF
GO
/****** Object:  Index [UC_UserChapter]    Script Date: 10/26/2024 2:11:04 AM ******/
ALTER TABLE [dbo].[CHAPTER_COMPLETION] ADD  CONSTRAINT [UC_UserChapter] UNIQUE NONCLUSTERED 
(
	[user_id] ASC,
	[chapter_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [idx_post_content_post_id]    Script Date: 10/26/2024 2:11:04 AM ******/
CREATE NONCLUSTERED INDEX [idx_post_content_post_id] ON [dbo].[POST_CONTENT]
(
	[post_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [idx_post_images_post_id]    Script Date: 10/26/2024 2:11:04 AM ******/
CREATE NONCLUSTERED INDEX [idx_post_images_post_id] ON [dbo].[POST_IMAGES]
(
	[post_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_QUIZ_ATTEMPT_USER_QUIZ]    Script Date: 10/26/2024 2:11:04 AM ******/
CREATE NONCLUSTERED INDEX [IX_QUIZ_ATTEMPT_USER_QUIZ] ON [dbo].[QUIZ_ATTEMPT]
(
	[user_id] ASC,
	[quiz_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [UC_UserSubject]    Script Date: 10/26/2024 2:11:04 AM ******/
ALTER TABLE [dbo].[SUBJECT_COMPLETION] ADD  CONSTRAINT [UC_UserSubject] UNIQUE NONCLUSTERED 
(
	[user_id] ASC,
	[subject_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__USER__AB6E61647ED8C41B]    Script Date: 10/26/2024 2:11:04 AM ******/
ALTER TABLE [dbo].[USER] ADD UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_USER_ANSWER_QUIZ_ATTEMPT]    Script Date: 10/26/2024 2:11:04 AM ******/
CREATE NONCLUSTERED INDEX [IX_USER_ANSWER_QUIZ_ATTEMPT] ON [dbo].[USER_ANSWER]
(
	[quiz_attempt_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ANSWER_OPTION] ADD  DEFAULT ((0)) FOR [is_correct]
GO
ALTER TABLE [dbo].[CHAPTER_COMPLETION] ADD  DEFAULT ((1)) FOR [status]
GO
ALTER TABLE [dbo].[LESSON] ADD  DEFAULT ((0)) FOR [display_order]
GO
ALTER TABLE [dbo].[POST] ADD  DEFAULT ((0)) FOR [is_featured]
GO
ALTER TABLE [dbo].[POST_CONTENT] ADD  DEFAULT ((0)) FOR [display_order]
GO
ALTER TABLE [dbo].[POST_IMAGES] ADD  DEFAULT ((0)) FOR [display_order]
GO
ALTER TABLE [dbo].[QUIZ_ATTEMPT] ADD  DEFAULT ((0)) FOR [IsPassed]
GO
ALTER TABLE [dbo].[REGISTRATION] ADD  DEFAULT (getdate()) FOR [registration_time]
GO
ALTER TABLE [dbo].[SUBJECT] ADD  DEFAULT ((0)) FOR [is_featured]
GO
ALTER TABLE [dbo].[SUBJECT_COMPLETION] ADD  DEFAULT ((1)) FOR [status]
GO
ALTER TABLE [dbo].[ANSWER_OPTION]  WITH CHECK ADD FOREIGN KEY([question_id])
REFERENCES [dbo].[QUESTION] ([id])
GO
ALTER TABLE [dbo].[CHAPTER]  WITH CHECK ADD FOREIGN KEY([subject_id])
REFERENCES [dbo].[SUBJECT] ([id])
GO
ALTER TABLE [dbo].[CHAPTER_COMPLETION]  WITH CHECK ADD FOREIGN KEY([chapter_id])
REFERENCES [dbo].[CHAPTER] ([id])
GO
ALTER TABLE [dbo].[CHAPTER_COMPLETION]  WITH CHECK ADD FOREIGN KEY([subject_id])
REFERENCES [dbo].[SUBJECT] ([id])
GO
ALTER TABLE [dbo].[CHAPTER_COMPLETION]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[USER] ([id])
GO
ALTER TABLE [dbo].[LESSON]  WITH CHECK ADD FOREIGN KEY([subject_id])
REFERENCES [dbo].[SUBJECT] ([id])
GO
ALTER TABLE [dbo].[LESSON]  WITH CHECK ADD  CONSTRAINT [FK_LESSON_CHAPTER] FOREIGN KEY([chapter_id])
REFERENCES [dbo].[CHAPTER] ([id])
GO
ALTER TABLE [dbo].[LESSON] CHECK CONSTRAINT [FK_LESSON_CHAPTER]
GO
ALTER TABLE [dbo].[LESSON_COMPLETION]  WITH CHECK ADD FOREIGN KEY([lesson_id])
REFERENCES [dbo].[LESSON] ([id])
GO
ALTER TABLE [dbo].[LESSON_COMPLETION]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[USER] ([id])
GO
ALTER TABLE [dbo].[POST]  WITH CHECK ADD FOREIGN KEY([category_id])
REFERENCES [dbo].[CATEGORY] ([id])
GO
ALTER TABLE [dbo].[POST_CONTENT]  WITH CHECK ADD FOREIGN KEY([post_id])
REFERENCES [dbo].[POST] ([id])
GO
ALTER TABLE [dbo].[POST_IMAGES]  WITH CHECK ADD FOREIGN KEY([post_id])
REFERENCES [dbo].[POST] ([id])
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
ALTER TABLE [dbo].[QUIZ]  WITH CHECK ADD  CONSTRAINT [FK_QUIZ_CHAPTER] FOREIGN KEY([chapter_id])
REFERENCES [dbo].[CHAPTER] ([id])
GO
ALTER TABLE [dbo].[QUIZ] CHECK CONSTRAINT [FK_QUIZ_CHAPTER]
GO
ALTER TABLE [dbo].[QUIZ_ATTEMPT]  WITH CHECK ADD FOREIGN KEY([quiz_id])
REFERENCES [dbo].[QUIZ] ([id])
GO
ALTER TABLE [dbo].[QUIZ_ATTEMPT]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[USER] ([id])
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
ALTER TABLE [dbo].[SUBJECT_COMPLETION]  WITH CHECK ADD FOREIGN KEY([subject_id])
REFERENCES [dbo].[SUBJECT] ([id])
GO
ALTER TABLE [dbo].[SUBJECT_COMPLETION]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[USER] ([id])
GO
ALTER TABLE [dbo].[USER_ANSWER]  WITH CHECK ADD FOREIGN KEY([answer_option_id])
REFERENCES [dbo].[ANSWER_OPTION] ([id])
GO
ALTER TABLE [dbo].[USER_ANSWER]  WITH CHECK ADD FOREIGN KEY([question_id])
REFERENCES [dbo].[QUESTION] ([id])
GO
ALTER TABLE [dbo].[USER_ANSWER]  WITH CHECK ADD FOREIGN KEY([quiz_attempt_id])
REFERENCES [dbo].[QUIZ_ATTEMPT] ([id])
GO
ALTER TABLE [dbo].[CATEGORY]  WITH CHECK ADD CHECK  (([type]='Post' OR [type]='Subject'))
GO
ALTER TABLE [dbo].[CHAPTER]  WITH CHECK ADD CHECK  (([status]='Active' OR [status]='Inactive' OR [status]='Draft'))
GO
ALTER TABLE [dbo].[LESSON]  WITH CHECK ADD CHECK  (([status]='Draft' OR [status]='Inactive' OR [status]='Active' OR [status]='Denied'))
GO
ALTER TABLE [dbo].[POST]  WITH CHECK ADD CHECK  (([status]='Archived' OR [status]='Draft' OR [status]='Published'))
GO
ALTER TABLE [dbo].[PRICE_PACKAGE]  WITH CHECK ADD CHECK  (([status]='Inactive' OR [status]='Active'))
GO
ALTER TABLE [dbo].[QUESTION]  WITH CHECK ADD CHECK  (([status]='Draft' OR [status]='Inactive' OR [status]='Active'))
GO
ALTER TABLE [dbo].[QUIZ]  WITH CHECK ADD CHECK  (([type]='Test' OR [type]='Practice'))
GO
ALTER TABLE [dbo].[QUIZ]  WITH CHECK ADD  CONSTRAINT [CK_QUIZ_Status] CHECK  (([status]='Archived' OR [status]='Published' OR [status]='Draft'))
GO
ALTER TABLE [dbo].[QUIZ] CHECK CONSTRAINT [CK_QUIZ_Status]
GO
ALTER TABLE [dbo].[REGISTRATION]  WITH CHECK ADD CHECK  (([status]='Rejected' OR [status]='Approved' OR [status]='Pending'))
GO
ALTER TABLE [dbo].[SUBJECT]  WITH CHECK ADD CHECK  (([status]='Draft' OR [status]='Inactive' OR [status]='Active' OR [status]='Denied'))
GO
ALTER TABLE [dbo].[USER]  WITH CHECK ADD CHECK  (([gender]='Other' OR [gender]='Female' OR [gender]='Male'))
GO
ALTER TABLE [dbo].[USER]  WITH CHECK ADD CHECK  (([role]='Student' OR [role]='Teacher' OR [role]='Admin'OR [role]='Moderator'))
GO
ALTER TABLE [dbo].[USER]  WITH CHECK ADD CHECK  (([role]='Student' OR [role]='Teacher' OR [role]='Admin'OR [role]='Moderator'))
GO
USE [master]
GO
ALTER DATABASE [OnlineLearningSystem] SET  READ_WRITE 
GO
