using BE.DTOs.ExpertDto;
using BE.DTOs.UserDto;
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

            // Validate price packages
            if (editSubjectDto.PricePackages == null || !editSubjectDto.PricePackages.Any())
            {
                return BadRequest("At least one price package is required.");
            }

            foreach (var package in editSubjectDto.PricePackages)
            {
                if (string.IsNullOrWhiteSpace(package.Name))
                {
                    return BadRequest("Price package name cannot be null or empty.");
                }

                if (package.DurationMonths <= 0)
                {
                    return BadRequest("Duration months must be greater than 0.");
                }

                if (package.ListPrice < 0 || package.SalePrice < 0)
                {
                    return BadRequest("Prices cannot be negative.");
                }

                if (package.SalePrice > package.ListPrice)
                {
                    return BadRequest("Sale price cannot be greater than list price.");
                }
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Create the subject
                var subject = new Subject
                {
                    Name = editSubjectDto.Name,
                    Thumbnail = editSubjectDto.Thumbnail,
                    CategoryId = editSubjectDto.CategoryId,
                    IsFeatured = editSubjectDto.IsFeatured,
                    OwnerId = editSubjectDto.OwnerId,
                    Status = "Draft",
                    Description = editSubjectDto.Description
                };

                _context.Subjects.Add(subject);
                await _context.SaveChangesAsync();

                // Create price packages
                foreach (var packageDto in editSubjectDto.PricePackages)
                {
                    var pricePackage = new PricePackage
                    {
                        SubjectId = subject.Id,
                        Name = packageDto.Name,
                        DurationMonths = packageDto.DurationMonths,
                        ListPrice = packageDto.ListPrice,
                        SalePrice = packageDto.SalePrice,
                        Description = packageDto.Description,
                        Status = packageDto.Status
                    };

                    _context.PricePackages.Add(pricePackage);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Return the created subject ID
                return CreatedAtAction(nameof(GetSubjectById), new { id = subject.Id }, null);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
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
                .Include(s => s.Chapters) // Thêm include cho chapters
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
                    Url = l.Url,
                    ChapterId = l.ChapterId
                }).ToList(),

                Quizzes = subject.Quizzes.Select(q => new QuizSummaryDto
                {
                    Id = q.Id,
                    Name = q.Name,
                    DurationMinutes = q.DurationMinutes,
                    Status = q.Status,
                }).ToList(),

                PricePackages = subject.PricePackages.Select(p => new PricePackageSummaryDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    ListPrice = p.ListPrice,
                    SalePrice = p.SalePrice,
                    DurationMonths = p.DurationMonths
                }).ToList(),

                // Thêm danh sách chapters
                Chapters = subject.Chapters.Select(c => new ChapterSummaryDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Status = c.Status,
                    SubjectId = c.SubjectId
                }).ToList()
            };

            return Ok(subjectDetails);
        }


        [HttpGet("GetSubjectProgress/user/{userId}/subject/{subjectId}")]
        public async Task<ActionResult<SubjectProgressDto>> GetSubjectProgress(int userId, int subjectId)
        {
            // Verify user exists
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Get subject with related chapters, lessons, and quizzes
            var subject = await _context.Subjects
                .Include(s => s.Chapters)
                .FirstOrDefaultAsync(s => s.Id == subjectId);

            if (subject == null)
            {
                return NotFound("Subject not found");
            }

            // Get all chapters IDs for this subject
            var chapterIds = subject.Chapters.Select(c => c.Id).ToList();

            // Get all lessons and quizzes for these chapters
            var chaptersWithDetails = await _context.Chapters
                .Where(c => chapterIds.Contains(c.Id))
                .Select(c => new
                {
                    ChapterId = c.Id,
                    ChapterTitle = c.Title,
                    LessonIds = c.Lessons.Select(l => l.Id).ToList(),
                    QuizIds = c.Quizzes.Select(q => q.Id).ToList()
                })
                .ToListAsync();

            // Get all lesson completions for this user and these chapters
            var lessonCompletions = await _context.LessonCompletions
                .Where(lc => lc.UserId == userId)
                .Select(lc => lc.LessonId)
                .ToListAsync();

            // Get all passed quiz attempts for this user and these chapters
            var passedQuizIds = await _context.QuizAttempts
                .Where(qa => qa.UserId == userId && qa.IsPassed)
                .Select(qa => qa.QuizId)
                .ToListAsync();

            // Process progress for each chapter
            var chapterProgress = chaptersWithDetails.Select(chapter =>
            {
                // A chapter is completed only if all its lessons and quizzes are completed
                var allLessonsCompleted = chapter.LessonIds.All(lid => lessonCompletions.Contains(lid));
                var allQuizzesCompleted = chapter.QuizIds.All(qid => passedQuizIds.Contains(qid));

                return new ChapterProgressSummaryDto
                {
                    ChapterId = chapter.ChapterId,
                    ChapterTitle = chapter.ChapterTitle,
                    IsCompleted = allLessonsCompleted && allQuizzesCompleted
                };
            }).ToList();

            // Calculate overall subject completion
            var totalChapters = chapterProgress.Count;
            var completedChapters = chapterProgress.Count(cp => cp.IsCompleted);
            decimal subjectCompletionPercentage = totalChapters > 0 ?
                Math.Round((decimal)completedChapters / totalChapters * 100, 2) : 0;

            // Create the final response
            var response = new SubjectProgressDto
            {
                SubjectId = subject.Id,
                SubjectName = subject.Name,
                CompletionPercentage = subjectCompletionPercentage,
                IsCompleted = completedChapters == totalChapters && totalChapters > 0,
                ChapterProgress = chapterProgress
            };

            return Ok(response);
        }

        [HttpPut("{subjectId}/status")]
        public async Task<ActionResult> UpdateSubjectStatus(int subjectId, string status)
        {
            var subject = await _context.Subjects.FindAsync(subjectId);
            if (subject == null)
            {
                return NotFound();
            }

            // Validate status
            status = status?.Trim();
            if (string.IsNullOrEmpty(status))
            {
                return BadRequest("Status cannot be null or empty");
            }

            if (!validStatuses.Contains(status, StringComparer.OrdinalIgnoreCase))
            {
                return BadRequest($"Invalid status. Allowed values are: {string.Join(", ", validStatuses)}");
            }

            subject.Status = status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubjectExists(subjectId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok();
        }
    }
}
