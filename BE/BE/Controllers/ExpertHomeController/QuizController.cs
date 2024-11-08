using BE.DTOs.ExpertDto;
using BE.DTOs.UserDto;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using OfficeOpenXml;


namespace BE.Controllers.Expert
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly OnlineLearningSystemContext _context;
        private readonly List<string> validLevels = new() { "Easy", "Medium", "Hard" };
        private readonly List<string> validTypes = new() { "Practice", "Test" };
        private readonly IMemoryCache _memoryCache;

        public QuizController(OnlineLearningSystemContext context, IMemoryCache memoryCache)
        {
            _context = context;
            _memoryCache = memoryCache;

        }

        [HttpGet("ViewAllQuiz")]
        public async Task<ActionResult<IEnumerable<QuizDto>>> ViewAllQuiz()
        {
            var quizzes = await _context.Quizzes
                .Include(q => q.Subject)
                .Select(q => new QuizDto
                {
                    Id = q.Id,
                    Name = q.Name,
                    DurationMinutes = q.DurationMinutes,
                    PassRate = q.PassRate,
                    Type = q.Type,
                    SubjectId = q.SubjectId,
                    SubjectName = q.Subject.Name,
                    Status = q.Status,
                    ChapterId = q.ChapterId
                })
                .ToListAsync();

            return Ok(quizzes);
        }

        [HttpPut("EditQuiz/{id}")]
        public async Task<IActionResult> EditQuiz(int id, EditQuizDto editQuizDto)
        {
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz == null)
            {
                return NotFound("Quiz not found.");
            }

            if (editQuizDto.SubjectId.HasValue && !await _context.Subjects.AnyAsync(s => s.Id == editQuizDto.SubjectId.Value))
            {
                return BadRequest("Invalid SubjectId. The specified subject does not exist.");
            }

            if (string.IsNullOrWhiteSpace(editQuizDto.Name))
            {
                return BadRequest("Name cannot be null or empty.");
            }



            if (!validTypes.Contains(editQuizDto.Type))
            {
                return BadRequest("Invalid type. Allowed values are 'Practice' and 'Test'.");
            }

            quiz.SubjectId = editQuizDto.SubjectId;
            quiz.Name = editQuizDto.Name;
            quiz.DurationMinutes = editQuizDto.DurationMinutes;
            quiz.PassRate = editQuizDto.PassRate;
            quiz.Type = editQuizDto.Type;
            quiz.Status = editQuizDto.Status;
            quiz.ChapterId = editQuizDto.ChapterId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuizExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost("AddQuiz")]
        public async Task<ActionResult> AddQuiz(EditQuizDto editQuizDto)
        {
            if (editQuizDto.SubjectId.HasValue && !await _context.Subjects.AnyAsync(s => s.Id == editQuizDto.SubjectId.Value))
            {
                return BadRequest("Invalid SubjectId. The specified subject does not exist.");
            }

            if (string.IsNullOrWhiteSpace(editQuizDto.Name))
            {
                return BadRequest("Name cannot be null or empty.");
            }

            if (!validTypes.Contains(editQuizDto.Type))
            {
                return BadRequest("Invalid type. Allowed values are 'Practice' and 'Test'.");
            }

            var quiz = new Quiz
            {
                SubjectId = editQuizDto.SubjectId,
                Name = editQuizDto.Name,
                DurationMinutes = editQuizDto.DurationMinutes,
                PassRate = editQuizDto.PassRate,
                Type = editQuizDto.Type,
                Status = editQuizDto.Status,
                ChapterId = editQuizDto.ChapterId
            };

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{quizId}")]
        public async Task<ActionResult<QuizDto>> GetQuizById(int quizId)
        {
            var quiz = await _context.Quizzes.FindAsync(quizId);
            if (quiz == null)
            {
                return NotFound();
            }

            var quizDto = new QuizDto
            {
                Id = quiz.Id,
                Name = quiz.Name,
                DurationMinutes = quiz.DurationMinutes,
                PassRate = quiz.PassRate,
                Type = quiz.Type,
                SubjectId = quiz.SubjectId,
                Status = quiz.Status,
                ChapterId = quiz.ChapterId
            };

            return quizDto;
        }

        [HttpPut("{quizId}/status")]
        public async Task<ActionResult> EditQuizStatus(int quizId)
        {
            var quiz = await _context.Quizzes.FindAsync(quizId);
            if (quiz == null)
            {
                return NotFound();
            }

            quiz.Status = quiz.Status == "Published" ? "Draft" : "Published";

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuizExists(quizId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(await GetQuizById(quizId));
        }
      
        [HttpGet("GetQuizzesByExpert/{expertId}")]
        public async Task<ActionResult<IEnumerable<QuizDto>>> GetQuizzesByExpert(int expertId)
        {
            var expertExists = await _context.Users.AnyAsync(u => u.Id == expertId);
            if (!expertExists)
            {
                return NotFound("Expert not found.");
            }

            var quizzes = await _context.Quizzes
                .Include(q => q.Subject)
                .Include(q => q.Chapter)
                .Where(q => q.Subject.OwnerId == expertId)
                .Select(q => new QuizDto
                {
                    Id = q.Id,
                    Name = q.Name,
                    DurationMinutes = q.DurationMinutes,
                    PassRate = q.PassRate,
                    Type = q.Type,
                    SubjectId = q.SubjectId,
                    SubjectName = q.Subject.Name,
                    Status = q.Status,
                    ChapterId = q.ChapterId,
                    ChapterTitle = q.Chapter.Title
                })
                .ToListAsync();

            return Ok(quizzes);
        }

        [HttpPost("SubmitQuiz")]
        public async Task<ActionResult<QuizSubmissionResultDto>> SubmitQuiz(QuizSubmissionDto submission)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.AnswerOptions)
                .FirstOrDefaultAsync(q => q.Id == submission.QuizId);

            if (quiz == null)
            {
                return NotFound("Quiz not found");
            }

            var user = await _context.Users.FindAsync(submission.UserId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            int correctAnswers = 0;
            var quizAttempt = new QuizAttempt
            {
                UserId = submission.UserId,
                QuizId = submission.QuizId,
                StartTime = submission.StartTime,
                EndTime = DateTime.UtcNow,
                AttemptNumber = await _context.QuizAttempts
                    .CountAsync(qa => qa.UserId == submission.UserId && qa.QuizId == submission.QuizId) + 1
            };

            foreach (var answer in submission.Answers)
            {
                var question = quiz.Questions.FirstOrDefault(q => q.Id == answer.QuestionId);
                if (question == null)
                {
                    return BadRequest($"Invalid question ID: {answer.QuestionId}");
                }

                var selectedOption = question.AnswerOptions.FirstOrDefault(ao => ao.Id == answer.SelectedAnswerId);
                if (selectedOption == null)
                {
                    return BadRequest($"Invalid answer option ID: {answer.SelectedAnswerId}");
                }

                var correctOption = question.AnswerOptions.FirstOrDefault(ao => ao.IsCorrect);

                var userAnswer = new UserAnswer
                {
                    QuestionId = question.Id,
                    AnswerOptionId = selectedOption.Id,
                    IsCorrect = selectedOption.IsCorrect,
                    QuestionContent = question.Content,
                    SelectedAnswerContent = selectedOption.Content,
                    CorrectAnswerContent = correctOption?.Content ?? "No correct answer provided"
                };

                quizAttempt.UserAnswers.Add(userAnswer);

                if (selectedOption.IsCorrect)
                {
                    correctAnswers++;
                }
            }

            quizAttempt.Score = (decimal)correctAnswers / quiz.Questions.Count * 100;
            quizAttempt.IsPassed = quizAttempt.Score >= quiz.PassRate;

            _context.QuizAttempts.Add(quizAttempt);
            await _context.SaveChangesAsync();

            return new QuizSubmissionResultDto
            {
                Score = quizAttempt.Score,
                TotalQuestions = quiz.Questions.Count,
                CorrectAnswers = correctAnswers,
                AttemptId = quizAttempt.Id,
                IsPassed = quizAttempt.IsPassed
            };
        }
        [HttpGet("GetQuizzesBySubject/{subjectId}")]
        public async Task<ActionResult<IEnumerable<QuizDto>>> GetQuizzesBySubject(int subjectId)
        {
            var subjectExists = await _context.Subjects.AnyAsync(s => s.Id == subjectId);
            if (!subjectExists)
            {
                return NotFound("Subject not found.");
            }

            var quizzes = await _context.Quizzes
                .Include(q => q.Subject)
                .Where(q => q.SubjectId == subjectId)
                .Select(q => new QuizDto
                {
                    Id = q.Id,
                    Name = q.Name,
                    DurationMinutes = q.DurationMinutes,
                    PassRate = q.PassRate,
                    Type = q.Type,
                    SubjectId = q.SubjectId,
                    SubjectName = q.Subject.Name,
                    Status = q.Status,
                    ChapterId = q.ChapterId
                })
                .ToListAsync();

            return Ok(quizzes);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<QuizAttemptDto>>> GetQuizAttemptsByUserId(int userId)
        {
            var quizAttempts = await _context.QuizAttempts
                .Where(qa => qa.UserId == userId)
                .Include(qa => qa.UserAnswers)
                .Include(qa => qa.Quiz) // Bao gồm Quiz để lấy thông tin về các câu hỏi
                .ThenInclude(q => q.Questions) // Bao gồm các câu hỏi
                .ThenInclude(q => q.AnswerOptions) // Bao gồm các tùy chọn trả lời
                .ToListAsync();

            if (quizAttempts == null || quizAttempts.Count == 0)
            {
                return NotFound($"Không tìm thấy các lần làm bài kiểm tra cho UserId: {userId}");
            }

            var result = quizAttempts.Select(qa => new QuizAttemptDto
            {
                Id = qa.Id,
                UserId = qa.UserId,
                QuizId = qa.QuizId,
                Score = qa.Score,
                StartTime = qa.StartTime,
                EndTime = qa.EndTime,
                AttemptNumber = qa.AttemptNumber,
                IsPassed = qa.IsPassed,
                UserAnswers = qa.UserAnswers != null && qa.UserAnswers.Any()
                    ? qa.UserAnswers.Select(ua => new UserAnswerAttempDto
                    {
                        Id = ua.Id,
                        QuestionId = ua.QuestionId,
                        AnswerOptionId = ua.AnswerOptionId,
                        IsCorrect = ua.IsCorrect,
                        QuestionContent = ua.QuestionContent,
                        SelectedAnswerContent = ua.SelectedAnswerContent,
                        CorrectAnswerContent = ua.CorrectAnswerContent,
                        AnswerOptions = _context.Questions
                            .Where(q => q.Id == ua.QuestionId)
                            .SelectMany(q => q.AnswerOptions.Select(ao => new AnswerOptionAttempDto
                            {
                                Id = ao.Id,
                                Content = ao.Content,
                                IsCorrect = ao.IsCorrect
                            })).ToList()
                    }).ToList()
                    : qa.Quiz.Questions.Select(q => new UserAnswerAttempDto
                    {
                        QuestionId = q.Id,
                        QuestionContent = q.Content, // Hoặc thuộc tính chứa nội dung câu hỏi
                        AnswerOptions = q.AnswerOptions.Select(ao => new AnswerOptionAttempDto
                        {
                            Id = ao.Id,
                            Content = ao.Content,
                            IsCorrect = ao.IsCorrect
                        }).ToList()
                    }).ToList()
            }).ToList();

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<QuizAttemptDto>> GetQuizAttemptById(int id)
        {
            var quizAttempt = await _context.QuizAttempts
                .Include(qa => qa.UserAnswers)
                .Include(qa => qa.Quiz)
                    .ThenInclude(q => q.Questions)
                        .ThenInclude(q => q.AnswerOptions)
                .FirstOrDefaultAsync(qa => qa.Id == id);

            if (quizAttempt == null)
            {
                return NotFound(); // Trả về 404 nếu không tìm thấy
            }

            var result = new QuizAttemptDto
            {
                Id = quizAttempt.Id,
                UserId = quizAttempt.UserId,
                QuizId = quizAttempt.QuizId,
                Score = quizAttempt.Score,
                StartTime = quizAttempt.StartTime,
                EndTime = quizAttempt.EndTime,
                AttemptNumber = quizAttempt.AttemptNumber,
                IsPassed = quizAttempt.IsPassed,
                UserAnswers = quizAttempt.UserAnswers != null && quizAttempt.UserAnswers.Any()
                    ? quizAttempt.UserAnswers.Select(ua => new UserAnswerAttempDto
                    {
                        Id = ua.Id,
                        QuestionId = ua.QuestionId,
                        AnswerOptionId = ua.AnswerOptionId,
                        IsCorrect = ua.IsCorrect,
                        QuestionContent = ua.QuestionContent,
                        SelectedAnswerContent = ua.SelectedAnswerContent,
                        CorrectAnswerContent = ua.CorrectAnswerContent,
                        AnswerOptions = _context.Questions
                            .Where(q => q.Id == ua.QuestionId)
                            .SelectMany(q => q.AnswerOptions.Select(ao => new AnswerOptionAttempDto
                            {
                                Id = ao.Id,
                                Content = ao.Content,
                                IsCorrect = ao.IsCorrect
                            })).ToList()
                    }).ToList()
                    : quizAttempt.Quiz.Questions.Select(q => new UserAnswerAttempDto
                    {
                        QuestionId = q.Id,
                        QuestionContent = q.Content,
                        AnswerOptions = q.AnswerOptions.Select(ao => new AnswerOptionAttempDto
                        {
                            Id = ao.Id,
                            Content = ao.Content,
                            IsCorrect = ao.IsCorrect
                        }).ToList()
                    }).ToList()
            };

            return Ok(result); // Trả về 200 OK kèm theo kết quả
        }

        //[HttpPost("import/{quizId}")]
        //public async Task<IActionResult> ImportQuestions(int quizId, IFormFile file)
        //{
        //    if (file == null || file.Length == 0)
        //    {
        //        return BadRequest("No file uploaded.");
        //    }

        //    var questions = new List<Question>();

        //    try
        //    {
        //        using (var stream = new MemoryStream())
        //        {
        //            await file.CopyToAsync(stream);
        //            using (var package = new ExcelPackage(stream))
        //            {
        //                var worksheet = package.Workbook.Worksheets.FirstOrDefault();
        //                if (worksheet == null)
        //                {
        //                    return BadRequest("Invalid Excel file.");
        //                }

        //                for (int row = 2; row <= worksheet.Dimension.End.Row; row++)
        //                {
        //                    var content = worksheet.Cells[row, 1].Text.Trim();
        //                    if (string.IsNullOrWhiteSpace(content)) // Dừng nếu ô đầu tiên trống
        //                    {
        //                        break; // Không có dữ liệu ở hàng này, thoát khỏi vòng lặp
        //                    }

        //                    var mediaUrl = worksheet.Cells[row, 2].Text.Trim();
        //                    var correctAnswer = worksheet.Cells[row, 3].Text.Trim();

        //                    if (string.IsNullOrWhiteSpace(correctAnswer))
        //                    {
        //                        return BadRequest($"Correct answer is missing at row {row}.");
        //                    }

        //                    // Tách correctAnswer thành danh sách các đáp án đúng
        //                    var correctAnswers = correctAnswer.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries)
        //                                                      .Select(a => a.Trim())
        //                                                      .ToList();

        //                    var answerOptions = new List<AnswerOption>();

        //                    for (int col = 4; col <= worksheet.Dimension.End.Column; col++)
        //                    {
        //                        var optionContent = worksheet.Cells[row, col].Text.Trim();
        //                        if (string.IsNullOrWhiteSpace(optionContent))
        //                        {
        //                            continue; // Bỏ qua nếu ô không có nội dung
        //                        }

        //                        // Tạo AnswerOption và kiểm tra nếu nó có trong danh sách correctAnswers
        //                        var answerOption = new AnswerOption
        //                        {
        //                            Content = optionContent,
        //                            IsCorrect = correctAnswers.Contains(optionContent, StringComparer.OrdinalIgnoreCase),
        //                            Status = true // Trạng thái mặc định là true
        //                        };
        //                        answerOptions.Add(answerOption);
        //                    }

        //                    if (!answerOptions.Any(a => a.IsCorrect))
        //                    {
        //                        return BadRequest($"Invalid correct answer(s) '{correctAnswer}' at row {row}. None match any option.");
        //                    }

        //                    // Kiểm tra câu hỏi đã tồn tại
        //                    var existingQuestion = await _context.Questions
        //                        .Include(q => q.AnswerOptions)
        //                        .FirstOrDefaultAsync(q => q.Content == content && q.QuizId == quizId);

        //                    if (existingQuestion != null)
        //                    {
        //                        // Cập nhật câu hỏi đã tồn tại
        //                        existingQuestion.MediaUrl = mediaUrl;

        //                        // Xóa tất cả AnswerOptions cũ và thêm mới
        //                        existingQuestion.AnswerOptions.Clear();
        //                        foreach (var option in answerOptions)
        //                        {
        //                            existingQuestion.AddAnswerOption(option);
        //                        }
        //                    }
        //                    else
        //                    {
        //                        // Tạo Question mới
        //                        var question = new Question
        //                        {
        //                            Content = content,
        //                            MediaUrl = mediaUrl,
        //                            Status = "Active",
        //                            QuizId = quizId
        //                        };

        //                        // Thêm AnswerOptions vào câu hỏi
        //                        foreach (var option in answerOptions)
        //                        {
        //                            question.AddAnswerOption(option);
        //                        }

        //                        questions.Add(question); // Thêm câu hỏi mới vào danh sách
        //                    }
        //                }
        //            }
        //        }

        //        // Lưu vào database
        //        await _context.Questions.AddRangeAsync(questions);
        //        await _context.SaveChangesAsync();

        //        return Ok(new { Count = questions.Count, Questions = questions });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal server error: {ex.Message}");
        //    }
        //}
        [HttpPost("import/{quizId}")]
        public async Task<IActionResult> ImportQuestions(int quizId, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var questions = new List<Question>();

            try
            {
                // Sử dụng MemoryStream để đọc file
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    stream.Position = 0; // Đặt vị trí về đầu stream trước khi đọc

                    using (var package = new ExcelPackage(stream))
                    {
                        var worksheet = package.Workbook.Worksheets.FirstOrDefault();
                        if (worksheet == null)
                        {
                            return BadRequest("Invalid Excel file.");
                        }

                        for (int row = 2; row <= worksheet.Dimension.End.Row; row++)
                        {
                            var content = worksheet.Cells[row, 1].Text.Trim();
                            if (string.IsNullOrWhiteSpace(content))
                            {
                                break; // Không có dữ liệu ở hàng này, thoát khỏi vòng lặp
                            }

                            var mediaUrl = worksheet.Cells[row, 2].Text.Trim();
                            var correctAnswer = worksheet.Cells[row, 3].Text.Trim();

                            if (string.IsNullOrWhiteSpace(correctAnswer))
                            {
                                return BadRequest($"Correct answer is missing at row {row}.");
                            }

                            var correctAnswers = correctAnswer.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries)
                                                              .Select(a => a.Trim())
                                                              .ToList();

                            var answerOptions = new List<AnswerOption>();

                            for (int col = 4; col <= worksheet.Dimension.End.Column; col++)
                            {
                                var optionContent = worksheet.Cells[row, col].Text.Trim();
                                if (string.IsNullOrWhiteSpace(optionContent))
                                {
                                    continue; // Bỏ qua nếu ô không có nội dung
                                }

                                var answerOption = new AnswerOption
                                {
                                    Content = optionContent,
                                    IsCorrect = correctAnswers.Contains(optionContent, StringComparer.OrdinalIgnoreCase),
                                    Status = true // Trạng thái mặc định là true
                                };
                                answerOptions.Add(answerOption);
                            }

                            if (!answerOptions.Any(a => a.IsCorrect))
                            {
                                return BadRequest($"Invalid correct answer(s) '{correctAnswer}' at row {row}. None match any option.");
                            }

                            var existingQuestion = await _context.Questions
                                .Include(q => q.AnswerOptions)
                                .FirstOrDefaultAsync(q => q.Content == content && q.QuizId == quizId);

                            if (existingQuestion != null)
                            {
                                existingQuestion.MediaUrl = mediaUrl;
                                existingQuestion.AnswerOptions.Clear(); // Xóa tất cả AnswerOptions cũ

                                // Thêm mới AnswerOptions
                                foreach (var option in answerOptions)
                                {
                                    existingQuestion.AddAnswerOption(option); // Gọi phương thức để thêm AnswerOption
                                }
                            }
                            else
                            {
                                var question = new Question
                                {
                                    Content = content,
                                    MediaUrl = mediaUrl,
                                    Status = "Active",
                                    QuizId = quizId
                                };

                                // Thêm AnswerOptions vào câu hỏi
                                foreach (var option in answerOptions)
                                {
                                    question.AddAnswerOption(option); // Gọi phương thức để thêm AnswerOption
                                }

                                questions.Add(question); // Thêm câu hỏi mới vào danh sách
                            }
                        }
                    }
                }

                // Lưu vào database
                await _context.Questions.AddRangeAsync(questions);
                await _context.SaveChangesAsync();

                return Ok(new { Count = questions.Count, Questions = questions });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }




        [HttpPost("import/{quizId}")]
        public async Task<IActionResult> ImportQuestion(int quizId, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var questions = new List<Question>();

            try
            {
                // Sử dụng MemoryStream để đọc file
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    stream.Position = 0; // Đặt vị trí về đầu stream trước khi đọc

                    using (var package = new ExcelPackage(stream))
                    {
                        var worksheet = package.Workbook.Worksheets.FirstOrDefault();
                        if (worksheet == null)
                        {
                            return BadRequest("Invalid Excel file.");
                        }

                        for (int row = 2; row <= worksheet.Dimension.End.Row; row++)
                        {
                            var content = worksheet.Cells[row, 1].Text.Trim();
                            if (string.IsNullOrWhiteSpace(content))
                            {
                                break; // Không có dữ liệu ở hàng này, thoát khỏi vòng lặp
                            }

                            var mediaUrl = worksheet.Cells[row, 2].Text.Trim();
                            var correctAnswer = worksheet.Cells[row, 3].Text.Trim();

                            if (string.IsNullOrWhiteSpace(correctAnswer))
                            {
                                return BadRequest($"Correct answer is missing at row {row}.");
                            }

                            var correctAnswers = correctAnswer.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries)
                                                               .Select(a => a.Trim())
                                                               .ToList();

                            var answerOptions = new List<AnswerOption>();

                            for (int col = 4; col <= worksheet.Dimension.End.Column; col++)
                            {
                                var optionContent = worksheet.Cells[row, col].Text.Trim();
                                if (string.IsNullOrWhiteSpace(optionContent))
                                {
                                    continue; // Bỏ qua nếu ô không có nội dung
                                }

                                var answerOption = new AnswerOption
                                {
                                    Content = optionContent,
                                    IsCorrect = correctAnswers.Contains(optionContent, StringComparer.OrdinalIgnoreCase),
                                    Status = true // Trạng thái mặc định là true
                                };
                                answerOptions.Add(answerOption);
                            }

                            if (!answerOptions.Any(a => a.IsCorrect))
                            {
                                return BadRequest($"Invalid correct answer(s) '{correctAnswer}' at row {row}. None match any option.");
                            }

                            var existingQuestion = await _context.Questions
                                .Include(q => q.AnswerOptions)
                                .FirstOrDefaultAsync(q => q.Content == content && q.QuizId == quizId);

                            if (existingQuestion != null)
                            {
                                existingQuestion.MediaUrl = mediaUrl;
                                existingQuestion.AnswerOptions.Clear(); // Xóa tất cả AnswerOptions cũ

                                // Thêm mới AnswerOptions
                                foreach (var option in answerOptions)
                                {
                                    existingQuestion.AddAnswerOption(option); // Gọi phương thức để thêm AnswerOption
                                }
                            }
                            else
                            {
                                var question = new Question
                                {
                                    Content = content,
                                    MediaUrl = mediaUrl,
                                    Status = "Active",
                                    QuizId = quizId
                                };

                                // Thêm AnswerOptions vào câu hỏi
                                foreach (var option in answerOptions)
                                {
                                    question.AddAnswerOption(option); // Gọi phương thức để thêm AnswerOption
                                }

                                questions.Add(question); // Thêm câu hỏi mới vào danh sách
                            }
                        }
                    }
                }

                // Lưu vào database
                await _context.Questions.AddRangeAsync(questions);
                await _context.SaveChangesAsync();

                var response = Ok(new { Count = questions.Count, Questions = questions });

                // Xóa cache (nếu có)
                _memoryCache.Remove($"Quiz_{quizId}_Questions"); // Thay thế tên khóa cache với tên khóa thực tế của bạn

                return response; // Trả về response body
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        private bool QuizExists(int id)
        {
            return _context.Quizzes.Any(e => e.Id == id);
        }
    }
}