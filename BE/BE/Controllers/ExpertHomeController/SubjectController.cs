using BE.DTOs.ExpertDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Expert
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SubjectController : ControllerBase
    {
        private readonly OnlineLearningSystemContext _context;
        private readonly List<string> validStatuses = new() { "Active", "Inactive", "Draft" };

        public SubjectController(OnlineLearningSystemContext context)
        {
            _context = context;
        }

        [HttpGet("ViewAllSubject")]
        public async Task<ActionResult<IEnumerable<SubjectDto>>> ViewAllSubject()
        {
            var subjects = await _context.Subjects
                .Include(s => s.Category)
                .Include(s => s.Owner)
                .Select(s => new SubjectDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Thumbnail = s.Thumbnail,
                    CategoryId = s.CategoryId,
                    CategoryName = s.Category.Name,
                    IsFeatured = s.IsFeatured,
                    OwnerId = s.OwnerId,
                    OwnerName = s.Owner.FirstName + s.Owner.MidName + s.Owner.LastName,
                    Status = s.Status,
                    Description = s.Description
                })
                .ToListAsync();

            return Ok(subjects);
        }

        [HttpPut("EditSubject/{id}")]
        public async Task<IActionResult> EditSubject(int id, EditSubjectDto editSubjectDto)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null)
            {
                return NotFound("Subject not found.");
            }

            if (editSubjectDto.CategoryId.HasValue && !await _context.Categories.AnyAsync(c => c.Id == editSubjectDto.CategoryId.Value))
            {
                return BadRequest("Invalid CategoryId. The specified category does not exist.");
            }

            if (editSubjectDto.OwnerId.HasValue && !await _context.Users.AnyAsync(u => u.Id == editSubjectDto.OwnerId.Value))
            {
                return BadRequest("Invalid OwnerId. The specified user does not exist.");
            }

            if (string.IsNullOrWhiteSpace(editSubjectDto.Name))
            {
                return BadRequest("Name cannot be null or empty.");
            }

            if (!validStatuses.Contains(editSubjectDto.Status))
            {
                return BadRequest("Invalid status. Allowed values are 'Active' , 'Inactive' and 'Draft'.");
            }

            subject.Name = editSubjectDto.Name;
            subject.Thumbnail = editSubjectDto.Thumbnail;
            subject.CategoryId = editSubjectDto.CategoryId;
            subject.IsFeatured = editSubjectDto.IsFeatured;
            subject.OwnerId = editSubjectDto.OwnerId;
            subject.Status = editSubjectDto.Status;
            subject.Description = editSubjectDto.Description;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubjectExists(id))
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

        [HttpPost("AddSubject")]
        public async Task<ActionResult> AddSubject(EditSubjectDto editSubjectDto)
        {
            if (editSubjectDto.CategoryId.HasValue && !await _context.Categories.AnyAsync(c => c.Id == editSubjectDto.CategoryId.Value))
            {
                return BadRequest("Invalid CategoryId. The specified category does not exist.");
            }

            if (editSubjectDto.OwnerId.HasValue && !await _context.Users.AnyAsync(u => u.Id == editSubjectDto.OwnerId.Value))
            {
                return BadRequest("Invalid OwnerId. The specified user does not exist.");
            }

            if (string.IsNullOrWhiteSpace(editSubjectDto.Name))
            {
                return BadRequest("Name cannot be null or empty.");
            }

            if (!validStatuses.Contains(editSubjectDto.Status))
            {
                return BadRequest("Invalid status. Allowed values are 'active' and 'inactive'.");
            }

            var subject = new Subject
            {
                Name = editSubjectDto.Name,
                Thumbnail = editSubjectDto.Thumbnail,
                CategoryId = editSubjectDto.CategoryId,
                IsFeatured = editSubjectDto.IsFeatured,
                OwnerId = editSubjectDto.OwnerId,
                Status = editSubjectDto.Status,
                Description = editSubjectDto.Description
            };

            _context.Subjects.Add(subject);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("DeleteSubject/{id}")]
        public async Task<IActionResult> DeleteSubject(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var subject = await _context.Subjects
                    .Include(s => s.Lessons)
                    .Include(s => s.PricePackages)
                    .Include(s => s.Quizzes)
                        .ThenInclude(q => q.Questions)
                            .ThenInclude(q => q.AnswerOptions)
                    .Include(s => s.Registrations)
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (subject == null)
                {
                    return NotFound("Subject not found.");
                }

                // Remove related entities
                foreach (var quiz in subject.Quizzes)
                {
                    foreach (var question in quiz.Questions)
                    {
                        _context.AnswerOptions.RemoveRange(question.AnswerOptions);
                    }
                    _context.Questions.RemoveRange(quiz.Questions);
                }
                _context.Quizzes.RemoveRange(subject.Quizzes);
                _context.Lessons.RemoveRange(subject.Lessons);
                _context.PricePackages.RemoveRange(subject.PricePackages);
                _context.Registrations.RemoveRange(subject.Registrations);

                _context.Subjects.Remove(subject);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"An error occurred while deleting the subject: {ex.Message}");
            }
        }



        private bool SubjectExists(int id)
        {
            return _context.Subjects.Any(e => e.Id == id);
        }

        [HttpGet("GetLessonsBySubjectId/{id}")]
        public async Task<ActionResult<IEnumerable<LessonDto>>> GetLessonsBySubjectId(int id)
        {
            // Kiểm tra xem chủ đề có tồn tại không
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null)
            {
                return NotFound("Subject not found.");
            }

            // Lấy danh sách bài học theo subjectId
            var lessons = await _context.Lessons
                .Where(l => l.SubjectId == id)
                .Include(l => l.Chapter)
                .Select(l => new LessonDto
                {
                    Id = l.Id,
                    Name = l.Name,
                    Content = l.Content,
                    Status = l.Status,
                    SubjectId = l.SubjectId,
                    Url = l.Url,
                    ChapterId = l.ChapterId,
                    DisplayOrder = l.DisplayOrder,
                    Title = l.Chapter.Title
                })
                .ToListAsync();

            return Ok(lessons);
        }

        [HttpGet("ViewSubjectsByOwner/{ownerId}")]
        public async Task<ActionResult<IEnumerable<SubjectDto>>> ViewSubjectsByOwner(int ownerId)
        {
            // Kiểm tra xem Owner có tồn tại hay không
            var ownerExists = await _context.Users.AnyAsync(u => u.Id == ownerId);
            if (!ownerExists)
            {
                return NotFound("Owner not found.");
            }

            // Lấy danh sách các subject theo OwnerId
            var subjects = await _context.Subjects
                .Where(s => s.OwnerId == ownerId)
                .Include(s => s.Category)
                .Include(s => s.Owner)
                .Select(s => new SubjectDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Thumbnail = s.Thumbnail,
                    CategoryId = s.CategoryId,
                    CategoryName = s.Category.Name,
                    IsFeatured = s.IsFeatured,
                    OwnerId = s.OwnerId,
                    OwnerName = s.Owner.FirstName + s.Owner.MidName + s.Owner.LastName,
                    Status = s.Status,
                    Description = s.Description
                })
                .ToListAsync();

            return Ok(subjects);
        }

        [HttpGet("GetSubjectById/{id}")]
        public async Task<ActionResult<SubjectDetailsDto>> GetSubjectById(int id)
        {
            var subject = await _context.Subjects
                .Include(s => s.Category)
                .Include(s => s.Owner)
                .Include(s => s.Lessons)
                .Include(s => s.Quizzes)
                .Include(s => s.PricePackages)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (subject == null)
            {
                return NotFound("Subject not found.");
            }

            var subjectDetails = new SubjectDetailsDto
            {
                Id = subject.Id,
                Name = subject.Name,
                Thumbnail = subject.Thumbnail,
                CategoryName = subject.Category?.Name,
                IsFeatured = subject.IsFeatured,
                OwnerName = $"{subject.Owner?.FirstName} {subject.Owner?.MidName} {subject.Owner?.LastName}".Trim(),
                Status = subject.Status,
                Description = subject.Description,

                Lessons = subject.Lessons.Select(l => new LessonSummaryDto
                {
                    Id = l.Id,
                    Name = l.Name,
                    Status = l.Status,
                    Url = l.Url
                }).ToList(),
              
                Quizzes = subject.Quizzes.Select(q => new QuizSummaryDto
                {
                    Id = q.Id,
                    Name = q.Name,
                    DurationMinutes = q.DurationMinutes
                }).ToList(),

                PricePackages = subject.PricePackages.Select(p => new PricePackageSummaryDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    ListPrice = p.ListPrice,
                    SalePrice = p.SalePrice,
                    DurationMonths = p.DurationMonths
                }).ToList()
            };

            return Ok(subjectDetails);
        }
    }
}
