﻿using BE.DTOs.ExpertDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Expert
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class QAController : ControllerBase
    {
        private readonly OnlineLearningSystemContext _context;
        public QAController(OnlineLearningSystemContext context)
        {
            _context = context;
        }

        [HttpPost("AddQuestionsToQuiz/{quizId}")]
        public async Task<IActionResult> AddQuestionsToQuiz(int quizId, [FromBody] List<QuestionWithAnswersDto> questionsWithAnswers)
        {
            var quiz = await _context.Quizzes.FindAsync(quizId);
            if (quiz == null)
            {
                return NotFound($"Quiz with ID {quizId} not found.");
            }

            // Validate questions and answers content before starting transaction
            foreach (var questionDto in questionsWithAnswers)
            {
                if (string.IsNullOrEmpty(questionDto.Content))
                {
                    return BadRequest("Question content cannot be null or empty.");
                }

                if (questionDto.Answers == null || !questionDto.Answers.Any())
                {
                    return BadRequest($"Question '{questionDto.Content}' must have at least one answer.");
                }

                foreach (var answerDto in questionDto.Answers)
                {
                    if (string.IsNullOrEmpty(answerDto.Content))
                    {
                        return BadRequest($"Answer content for question '{questionDto.Content}' cannot be null or empty.");
                    }
                }
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                foreach (var questionDto in questionsWithAnswers)
                {
                    var question = new Question
                    {
                        QuizId = quizId,
                        Content = questionDto.Content,
                        MediaUrl = questionDto.MediaUrl,
                        Status = questionDto.Status
                    };
                    _context.Questions.Add(question);
                    await _context.SaveChangesAsync();

                    foreach (var answerDto in questionDto.Answers)
                    {
                        var answer = new AnswerOption
                        {
                            QuestionId = question.Id,
                            Content = answerDto.Content,
                            IsCorrect = answerDto.IsCorrect,
                            Status = answerDto.Status
                        };
                        _context.AnswerOptions.Add(answer);
                    }
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
                return Ok("Questions and answers added successfully.");
            }
            catch (DbUpdateException ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"An error occurred while adding questions and answers: {ex.Message}");
            }
        }

        [HttpGet("GetQuizDetails/{quizId}")]
        public async Task<ActionResult<QuizDetailsDto>> GetQuizDetails(int quizId)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.AnswerOptions)
                .FirstOrDefaultAsync(q => q.Id == quizId);

            if (quiz == null)
            {
                return NotFound($"Quiz with ID {quizId} not found.");
            }

            var quizDetails = new QuizDetailsDto
            {
                Id = quiz.Id,
                Name = quiz.Name,
                DurationMinutes = quiz.DurationMinutes,
                PassRate = quiz.PassRate,
                Type = quiz.Type,
                ChapterId = quiz.ChapterId,
                SubjectId = quiz.SubjectId,
                Questions = quiz.Questions.Select(q => new QuestionDto
                {
                    Id = q.Id,
                    Content = q.Content,
                    MediaUrl = q.MediaUrl,
                    Status = q.Status,
                    Answers = q.AnswerOptions.Select(a => new AnswerDto
                    {
                        Id = a.Id,
                        Content = a.Content,
                        IsCorrect = a.IsCorrect,
                        Status = a.Status
                    }).ToList()
                }).ToList()
            };
            return Ok(quizDetails);
        }

        [HttpPut("EditQuestion/{questionId}")]
        public async Task<IActionResult> EditQuestion(int questionId, [FromBody] EditQuestionDto editQuestionDto)
        {
            // Validate question content
            if (string.IsNullOrEmpty(editQuestionDto.Content))
            {
                return BadRequest("Question content cannot be null or empty.");
            }

            // Validate answers
            if (editQuestionDto.Answers == null || !editQuestionDto.Answers.Any())
            {
                return BadRequest("Question must have at least one answer.");
            }

            foreach (var answerDto in editQuestionDto.Answers)
            {
                if (string.IsNullOrEmpty(answerDto.Content))
                {
                    return BadRequest("Answer content cannot be null or empty.");
                }
            }

            var question = await _context.Questions
                .Include(q => q.AnswerOptions)
                .FirstOrDefaultAsync(q => q.Id == questionId);

            if (question == null)
            {
                return NotFound($"Question with ID {questionId} not found.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Update question properties
                question.Content = editQuestionDto.Content.Trim();
                question.MediaUrl = editQuestionDto.MediaUrl;
                question.Status = editQuestionDto.Status;

                // Get existing answers
                var existingAnswers = question.AnswerOptions.ToDictionary(a => a.Id);

                // Track if at least one answer is marked as correct
                bool hasCorrectAnswer = false;

                foreach (var answerDto in editQuestionDto.Answers)
                {
                    if (answerDto.IsCorrect)
                    {
                        hasCorrectAnswer = true;
                    }

                    if (answerDto.Id.HasValue && existingAnswers.ContainsKey(answerDto.Id.Value))
                    {
                        // Update existing answer
                        var existingAnswer = existingAnswers[answerDto.Id.Value];
                        existingAnswer.Content = answerDto.Content.Trim();
                        existingAnswer.IsCorrect = answerDto.IsCorrect;
                        existingAnswer.Status = answerDto.Status;
                        existingAnswers.Remove(answerDto.Id.Value);
                    }
                    else
                    {
                        // Add new answer
                        var newAnswer = new AnswerOption
                        {
                            QuestionId = questionId,
                            Content = answerDto.Content.Trim(),
                            IsCorrect = answerDto.IsCorrect,
                            Status = answerDto.Status
                        };
                        _context.AnswerOptions.Add(newAnswer);
                    }
                }

                // Validate that at least one answer is marked as correct
                if (!hasCorrectAnswer)
                {
                    return BadRequest("At least one answer must be marked as correct.");
                }

                // Set status = false for answers not in the update list (soft delete)
                foreach (var remainingAnswer in existingAnswers.Values)
                {
                    remainingAnswer.Status = false;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Ok("Question and answers updated successfully.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"An error occurred while updating the question and answers: {ex.Message}");
            }
        }
    }
}



