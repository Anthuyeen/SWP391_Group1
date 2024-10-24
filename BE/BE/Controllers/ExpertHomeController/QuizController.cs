﻿using BE.DTOs.ExpertDto;
using BE.DTOs.UserDto;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Expert
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly OnlineLearningSystemContext _context;
        private readonly List<string> validLevels = new() { "Easy", "Medium", "Hard" };
        private readonly List<string> validTypes = new() { "Practice", "Test" };

        public QuizController(OnlineLearningSystemContext context)
        {
            _context = context;
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

        //[HttpDelete("DeleteQuiz/{id}")]
        //public async Task<IActionResult> DeleteQuiz(int id)
        //{
        //    using var transaction = await _context.Database.BeginTransactionAsync();

        //    try
        //    {
        //        var quiz = await _context.Quizzes
        //            .Include(q => q.Questions)
        //            .ThenInclude(q => q.AnswerOptions)
        //            .FirstOrDefaultAsync(q => q.Id == id);

        //        if (quiz == null)
        //        {
        //            return NotFound("Quiz not found.");
        //        }

        //        foreach (var question in quiz.Questions)
        //        {
        //            _context.AnswerOptions.RemoveRange(question.AnswerOptions);
        //        }

        //        _context.Questions.RemoveRange(quiz.Questions);

        //        _context.Quizzes.Remove(quiz);

        //        await _context.SaveChangesAsync();
        //        await transaction.CommitAsync();

        //        return NoContent();
        //    }
        //    catch (Exception ex)
        //    {
        //        await transaction.RollbackAsync();
        //        return StatusCode(500, $"An error occurred while deleting the quiz: {ex.Message}");
        //    }
        //}

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

        private bool QuizExists(int id)
        {
            return _context.Quizzes.Any(e => e.Id == id);
        }
    }
}