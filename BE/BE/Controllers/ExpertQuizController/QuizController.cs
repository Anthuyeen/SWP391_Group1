using BE.DTOs.ExpertDto;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.ExpertQuizController
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class QuizController : Controller
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
                    Level = q.Level,
                    DurationMinutes = q.DurationMinutes,
                    PassRate = q.PassRate,
                    Type = q.Type,
                    SubjectId = q.SubjectId,
                    SubjectName = q.Subject.Name
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

            if (!validLevels.Contains(editQuizDto.Level))
            {
                return BadRequest("Invalid level. Allowed values are 'Easy', 'Medium', and 'Hard'.");
            }

            if (!validTypes.Contains(editQuizDto.Type))
            {
                return BadRequest("Invalid type. Allowed values are 'Practice' and 'Test'.");
            }

            quiz.SubjectId = editQuizDto.SubjectId;
            quiz.Name = editQuizDto.Name;
            quiz.Level = editQuizDto.Level;
            quiz.DurationMinutes = editQuizDto.DurationMinutes;
            quiz.PassRate = editQuizDto.PassRate;
            quiz.Type = editQuizDto.Type;

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

            if (!validLevels.Contains(editQuizDto.Level))
            {
                return BadRequest("Invalid level. Allowed values are 'Easy', 'Medium', and 'Hard'.");
            }

            if (!validTypes.Contains(editQuizDto.Type))
            {
                return BadRequest("Invalid type. Allowed values are 'Practice' and 'Test'.");
            }

            var quiz = new Quiz
            {
                SubjectId = editQuizDto.SubjectId,
                Name = editQuizDto.Name,
                Level = editQuizDto.Level,
                DurationMinutes = editQuizDto.DurationMinutes,
                PassRate = editQuizDto.PassRate,
                Type = editQuizDto.Type
            };

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("DeleteQuiz/{id}")]
        public async Task<IActionResult> DeleteQuiz(int id)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (quiz == null)
            {
                return NotFound("Quiz not found.");
            }

            // Start a transaction
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                foreach (var question in quiz.Questions)
                {
                    // Remove associated answer options
                    var answerOptions = await _context.AnswerOptions
                        .Where(ao => ao.QuestionId == question.Id)
                        .ToListAsync();
                    _context.AnswerOptions.RemoveRange(answerOptions);

                    // Remove the question
                    _context.Questions.Remove(question);
                }

                // Remove the quiz
                _context.Quizzes.Remove(quiz);

                await _context.SaveChangesAsync();

                // Commit the transaction
                await transaction.CommitAsync();

                return NoContent();
            }
            catch (Exception)
            {
                // If there's an error, roll back the transaction
                await transaction.RollbackAsync();
                throw;
            }
        }


        private bool QuizExists(int id)
        {
            return _context.Quizzes.Any(e => e.Id == id);
        }
    }
}
