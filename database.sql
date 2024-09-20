USE master;
GO

-- Create a new database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'OnlineLearningSystem')
BEGIN
    CREATE DATABASE OnlineLearningSystem;
END
GO

-- Use the new database
USE OnlineLearningSystem;
GO

-- Create the USER table
CREATE TABLE [USER] (
    id INT PRIMARY KEY IDENTITY(1,1),
    full_name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    mobile NVARCHAR(20),
    gender NVARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    avatar NVARCHAR(255),
    role NVARCHAR(20) CHECK (role IN ('Admin', 'Teacher', 'Student')),
    status NVARCHAR(20) CHECK (status IN ('Active', 'Inactive', 'Blocked'))
);

-- Create the CATEGORY table
CREATE TABLE CATEGORY (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    type NVARCHAR(20) CHECK (type IN ('Subject', 'Post'))
);

-- Create the SUBJECT table
CREATE TABLE SUBJECT (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    thumbnail NVARCHAR(255),
    category_id INT,
    is_featured BIT NOT NULL DEFAULT 0,
    owner_id INT,
    status NVARCHAR(20) CHECK (status IN ('Active', 'Inactive', 'Draft')),
    description NVARCHAR(MAX),
    FOREIGN KEY (category_id) REFERENCES CATEGORY(id),
    FOREIGN KEY (owner_id) REFERENCES [USER](id)
);

-- Create the LESSON table
CREATE TABLE LESSON (
    id INT PRIMARY KEY IDENTITY(1,1),
    subject_id INT,
    name NVARCHAR(100) NOT NULL,
    content NVARCHAR(MAX),
    status NVARCHAR(20) CHECK (status IN ('Active', 'Inactive', 'Draft')),
    FOREIGN KEY (subject_id) REFERENCES SUBJECT(id)
);

-- Create the PRICE_PACKAGE table
CREATE TABLE PRICE_PACKAGE (
    id INT PRIMARY KEY IDENTITY(1,1),
    subject_id INT,
    name NVARCHAR(100) NOT NULL,
    duration_months INT NOT NULL,
    list_price DECIMAL(10, 2) NOT NULL,
    sale_price DECIMAL(10, 2) NOT NULL,
    description NVARCHAR(MAX),
    status NVARCHAR(20) CHECK (status IN ('Active', 'Inactive')),
    FOREIGN KEY (subject_id) REFERENCES SUBJECT(id)
);

-- Create the REGISTRATION table
CREATE TABLE REGISTRATION (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT,
    subject_id INT,
    package_id INT,
    registration_time DATETIME NOT NULL DEFAULT GETDATE(),
    total_cost DECIMAL(10, 2) NOT NULL,
    status NVARCHAR(20) CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES [USER](id),
    FOREIGN KEY (subject_id) REFERENCES SUBJECT(id),
    FOREIGN KEY (package_id) REFERENCES PRICE_PACKAGE(id)
);

-- Create the DIMENSION table
CREATE TABLE DIMENSION (
    id INT PRIMARY KEY IDENTITY(1,1),
    subject_id INT,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    type NVARCHAR(20) CHECK (type IN ('Chapter', 'Topic', 'Skill')),
    FOREIGN KEY (subject_id) REFERENCES SUBJECT(id)
);

-- Create the QUESTION table
CREATE TABLE QUESTION (
    id INT PRIMARY KEY IDENTITY(1,1),
    content NVARCHAR(MAX) NOT NULL,
    media_url NVARCHAR(255),
    level NVARCHAR(20) CHECK (level IN ('Easy', 'Medium', 'Hard')),
    status NVARCHAR(20) CHECK (status IN ('Active', 'Inactive', 'Draft')),
    explanation NVARCHAR(MAX)
);

-- Create the ANSWER_OPTION table
CREATE TABLE ANSWER_OPTION (
    id INT PRIMARY KEY IDENTITY(1,1),
    question_id INT,
    content NVARCHAR(MAX) NOT NULL,
    is_correct BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (question_id) REFERENCES QUESTION(id)
);

-- Create the QUIZ table
CREATE TABLE QUIZ (
    id INT PRIMARY KEY IDENTITY(1,1),
    subject_id INT,
    name NVARCHAR(100) NOT NULL,
    level NVARCHAR(20) CHECK (level IN ('Easy', 'Medium', 'Hard')),
    duration_minutes INT NOT NULL,
    pass_rate DECIMAL(5, 2) NOT NULL,
    type NVARCHAR(20) CHECK (type IN ('Practice', 'Test')),
    FOREIGN KEY (subject_id) REFERENCES SUBJECT(id)
);

-- Create the QUIZ_QUESTION table (junction table for many-to-many relationship)
CREATE TABLE QUIZ_QUESTION (
    quiz_id INT,
    question_id INT,
    PRIMARY KEY (quiz_id, question_id),
    FOREIGN KEY (quiz_id) REFERENCES QUIZ(id),
    FOREIGN KEY (question_id) REFERENCES QUESTION(id)
);

-- Create the POST table
CREATE TABLE POST (
    id INT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(255) NOT NULL,
    thumbnail NVARCHAR(255),
    brief_info NVARCHAR(MAX),
    content NVARCHAR(MAX),
    category_id INT,
    is_featured BIT NOT NULL DEFAULT 0,
    status NVARCHAR(20) CHECK (status IN ('Published', 'Draft', 'Archived')),
    FOREIGN KEY (category_id) REFERENCES CATEGORY(id)
);

INSERT INTO [USER] (full_name, email, password, mobile, gender, role, status)
VALUES 
('John Doe', 'john.doe@email.com', 'hashed_password_1', '1234567890', 'Male', 'Admin', 'Active'),
('Jane Smith', 'jane.smith@email.com', 'hashed_password_2', '0987654321', 'Female', 'Teacher', 'Active'),
('Bob Johnson', 'bob.johnson@email.com', 'hashed_password_3', '1122334455', 'Male', 'Student', 'Active');

-- Insert sample data into CATEGORY table
INSERT INTO CATEGORY (name, type)
VALUES 
('Information Technology', 'Subject'),
('Marketing', 'Subject'),
('Featured Courses', 'Post'),
('New Courses', 'Post');

-- Insert sample data into SUBJECT table
INSERT INTO SUBJECT (name, category_id, is_featured, owner_id, status, description)
VALUES 
('Introduction to Python', 1, 1, 2, 'Active', 'Learn the basics of Python programming'),
('Digital Marketing Fundamentals', 2, 1, 2, 'Active', 'Understand core concepts of digital marketing'),
('Advanced Java Programming', 1, 0, 2, 'Active', 'Deep dive into advanced Java concepts'),
('Social Media Marketing', 2, 0, 2, 'Active', 'Learn effective social media marketing strategies');

-- Insert sample data into LESSON table
INSERT INTO LESSON (subject_id, name, content, status)
VALUES 
(1, 'Python Basics', 'Content for Python basics lesson', 'Active'),
(1, 'Python Functions', 'Content for Python functions lesson', 'Active'),
(2, 'Introduction to Digital Marketing', 'Content for intro to digital marketing', 'Active'),
(3, 'Java Multithreading', 'Content for Java multithreading', 'Active'),
(4, 'Facebook Marketing Strategies', 'Content for Facebook marketing', 'Active');

-- Insert sample data into PRICE_PACKAGE table
INSERT INTO PRICE_PACKAGE (subject_id, name, duration_months, list_price, sale_price, description, status)
VALUES 
(1, 'Python Beginner Package', 3, 99.99, 79.99, '3-month access to Python course', 'Active'),
(2, 'Digital Marketing Starter', 6, 149.99, 129.99, '6-month access to Digital Marketing course', 'Active'),
(3, 'Advanced Java Package', 4, 199.99, 179.99, '4-month access to Advanced Java course', 'Active'),
(4, 'Social Media Marketing Package', 3, 129.99, 109.99, '3-month access to Social Media Marketing course', 'Active');

-- Insert sample data into REGISTRATION table
INSERT INTO REGISTRATION (user_id, subject_id, package_id, total_cost, status, valid_from, valid_to)
VALUES 
(3, 1, 1, 79.99, 'Approved', '2024-09-20', '2024-12-20'),
(3, 2, 2, 129.99, 'Pending', '2024-09-20', '2025-03-20');

-- Insert sample data into DIMENSION table
INSERT INTO DIMENSION (subject_id, name, description, type)
VALUES 
(1, 'Python Syntax', 'Basic Python syntax', 'Chapter'),
(1, 'Data Structures', 'Python data structures', 'Chapter'),
(2, 'SEO Basics', 'Search Engine Optimization fundamentals', 'Topic'),
(3, 'Concurrency', 'Java concurrency and multithreading', 'Skill'),
(4, 'Content Strategy', 'Developing effective social media content', 'Topic');

-- Insert sample data into QUESTION table
INSERT INTO QUESTION (content, level, status, explanation)
VALUES 
('What is a variable in Python?', 'Easy', 'Active', 'A variable is a named location in memory used to store data'),
('Explain the concept of SEO in digital marketing.', 'Medium', 'Active', 'SEO is the practice of optimizing a website to increase its visibility in search engine results');

-- Insert sample data into ANSWER_OPTION table
INSERT INTO ANSWER_OPTION (question_id, content, is_correct)
VALUES 
(1, 'A container for storing data values', 1),
(1, 'A mathematical operation', 0),
(1, 'A type of loop', 0),
(2, 'A type of social media platform', 0),
(2, 'Search Engine Optimization', 1);

-- Insert sample data into QUIZ table
INSERT INTO QUIZ (subject_id, name, level, duration_minutes, pass_rate, type)
VALUES 
(1, 'Python Basics Quiz', 'Easy', 30, 70.00, 'Practice'),
(2, 'Digital Marketing Concepts', 'Medium', 45, 75.00, 'Test');

-- Insert sample data into QUIZ_QUESTION table
INSERT INTO QUIZ_QUESTION (quiz_id, question_id)
VALUES 
(1, 1),
(2, 2);

-- Insert sample data into POST table
INSERT INTO POST (title, brief_info, content, category_id, is_featured, status)
VALUES 
('Top IT Courses for Beginners', 'Discover the best IT courses to start your tech journey', 'Detailed content about top IT courses for beginners', 3, 1, 'Published'),
('Latest Marketing Trends', 'Stay updated with the newest marketing strategies', 'In-depth analysis of current marketing trends', 4, 1, 'Published');