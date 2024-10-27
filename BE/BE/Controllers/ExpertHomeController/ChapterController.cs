using BE.DTOs.ExpertDto;
using BE.DTOs.UserDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.ExpertHomeController
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChapterController : ControllerBase
    {
        private readonly OnlineLearningSystemContext _context;
        private readonly List<string> validStatuses = new() { "Active", "Inactive", "Draft" };

        public ChapterController(OnlineLearningSystemContext context)
        {
            _context = context;
        }


        //get all chapter
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChapterDto>>> GetChapters()
        {
            var chapters = await _context.Chapters
                .Include(c => c.Subject) // Include Subject để lấy thông tin liên quan
                .Select(c => new ChapterDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Status = c.Status
                })
                .ToListAsync();

            return Ok(chapters);
        }

        [HttpGet("ViewAllChapterBySubjectId/{subjectId}")]
        public async Task<ActionResult<IEnumerable<ChapterDto>>> ViewAllChapterBySubjectId(int subjectId)
        {
            var subjectExists = await _context.Subjects.AnyAsync(s => s.Id == subjectId);
            if (!subjectExists)
            {
                return NotFound("Subject not found.");
            }

            var chapters = await _context.Chapters
                .Where(c => c.SubjectId == subjectId)
                .Select(c => new ChapterDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Status = c.Status,
                    SubjectId = c.SubjectId
                })
                .ToListAsync();

            return Ok(chapters);
        }

        [HttpGet("ViewChapterDetails/{chapterId}")]
        public async Task<ActionResult<ChapterDetailsDto>> ViewChapterDetails(int chapterId)
        {
            var chapter = await _context.Chapters
                .Include(c => c.Subject)
                .Include(c => c.Lessons)
                .Include(c => c.Quizzes)
                .FirstOrDefaultAsync(c => c.Id == chapterId);

            if (chapter == null)
            {
                return NotFound("Chapter not found.");
            }

            var chapterDetails = new ChapterDetailsDto
            {
                Id = chapter.Id,
                Title = chapter.Title,
                Status = chapter.Status,
                SubjectId = chapter.SubjectId,
                SubjectName = chapter.Subject.Name,
                Lessons = chapter.Lessons
                .OrderBy(l => l.DisplayOrder)
                .Select(l => new LessonDto
                {
                    Id = l.Id,
                    Name = l.Name,
                    Content = l.Content,
                    Status = l.Status,
                    SubjectId = l.SubjectId,
                    ChapterId = l.ChapterId,
                    Url = l.Url,
                    DisplayOrder = l.DisplayOrder
                }).ToList(),
                Quizzes = chapter.Quizzes.Select(q => new QuizDto
                {
                    Id = q.Id,
                    Name = q.Name,
                    DurationMinutes = q.DurationMinutes,
                    PassRate = q.PassRate,
                    Type = q.Type,
                    Status = q.Status,
                    SubjectId = q.SubjectId,
                    ChapterId = q.ChapterId
                }).ToList()
            };
            return Ok(chapterDetails);
        }

        [HttpPost("AddChapter")]
        public async Task<ActionResult> AddChapter(EditChapterDto editChapterDto)
        {
            var subjectExists = await _context.Subjects.AnyAsync(s => s.Id == editChapterDto.SubjectId);
            if (!subjectExists)
            {
                return BadRequest("Invalid SubjectId. The specified subject does not exist.");
            }

            if (string.IsNullOrWhiteSpace(editChapterDto.Title))
            {
                return BadRequest("Title cannot be null or empty.");
            }

            if (!validStatuses.Contains(editChapterDto.Status))
            {
                return BadRequest("Invalid status. Allowed values are 'Active', 'Inactive', and 'Draft'.");
            }

            var chapter = new Chapter
            {
                Title = editChapterDto.Title,
                Status = editChapterDto.Status,
                SubjectId = editChapterDto.SubjectId
            };

            _context.Chapters.Add(chapter);
            await _context.SaveChangesAsync();

            return Ok(new ChapterDto
            {
                Id = chapter.Id,
                Title = chapter.Title,
                Status = chapter.Status,
                SubjectId = chapter.SubjectId
            }); ;
        }

        [HttpPut("EditChapter/{id}")]
        public async Task<IActionResult> EditChapter(int id, EditChapterDto editChapterDto)
        {
            var chapter = await _context.Chapters.FindAsync(id);
            if (chapter == null)
            {
                return NotFound("Chapter not found.");
            }

            var subjectExists = await _context.Subjects.AnyAsync(s => s.Id == editChapterDto.SubjectId);
            if (!subjectExists)
            {
                return BadRequest("Invalid SubjectId. The specified subject does not exist.");
            }

            if (string.IsNullOrWhiteSpace(editChapterDto.Title))
            {
                return BadRequest("Title cannot be null or empty.");
            }

            if (!validStatuses.Contains(editChapterDto.Status))
            {
                return BadRequest("Invalid status. Allowed values are 'Active', 'Inactive', and 'Draft'.");
            }

            chapter.Title = editChapterDto.Title;
            chapter.Status = editChapterDto.Status;
            chapter.SubjectId = editChapterDto.SubjectId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChapterExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new ChapterDto
            {
                Id = chapter.Id,
                Title = chapter.Title,
                Status = chapter.Status,
                SubjectId = chapter.SubjectId
            });
        }

        [HttpPut("{chapterId}/status")]
        public async Task<ActionResult> UpdateChapterStatus(int chapterId)
        {
            var chapter = await _context.Chapters.FindAsync(chapterId);
            if (chapter == null)
            {
                return NotFound();
            }

            // Cycle through statuses: Active -> Inactive -> Draft -> Active
            chapter.Status = chapter.Status switch
            {
                "Active" => "Inactive",
                "Inactive" => "Draft",
                _ => "Active"
            };

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChapterExists(chapterId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new ChapterDto
            {
                Id = chapter.Id,
                Title = chapter.Title,
                Status = chapter.Status,
                SubjectId = chapter.SubjectId
            });
        }

        [HttpGet("GetChapterProgress/user/{userId}/chapter/{chapterId}")]
        public async Task<ActionResult<ChapterProgressDto>> GetChapterProgress(int userId, int chapterId)
        {
            // Verify user exists
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Get chapter with related lessons and quizzes
            var chapter = await _context.Chapters
                .Include(c => c.Lessons)
                .Include(c => c.Quizzes)
                .FirstOrDefaultAsync(c => c.Id == chapterId);

            if (chapter == null)
            {
                return NotFound("Chapter not found");
            }

            // Get lesson completions for this user
            var lessonCompletions = await _context.LessonCompletions
                .Where(lc => lc.UserId == userId &&
                            chapter.Lessons.Select(l => l.Id).Contains(lc.LessonId))
                .ToListAsync();

            // Get quiz attempts for this user
            var quizAttempts = await _context.QuizAttempts
                .Where(qa => qa.UserId == userId &&
                            chapter.Quizzes.Select(q => q.Id).Contains(qa.QuizId))
                .ToListAsync();

            // Create progress DTOs for lessons
            var lessonProgress = chapter.Lessons.Select(lesson => new LessonProgressDto
            {
                LessonId = lesson.Id,
                LessonName = lesson.Name,
                IsCompleted = lessonCompletions.Any(lc => lc.LessonId == lesson.Id && lc.UserId == userId)
            }).ToList();

            // Create progress DTOs for quizzes
            var quizProgress = chapter.Quizzes.Select(quiz =>
            {
                var attempts = quizAttempts.Where(qa => qa.QuizId == quiz.Id).ToList();
                var bestAttempt = attempts.OrderByDescending(a => a.Score).FirstOrDefault();

                return new QuizProgressDto
                {
                    QuizId = quiz.Id,
                    QuizName = quiz.Name,
                    IsCompleted = bestAttempt?.IsPassed ?? false,
                };
            }).ToList();

            // Calculate overall completion percentage
            decimal totalItems = chapter.Lessons.Count + chapter.Quizzes.Count;
            decimal completedItems = lessonProgress.Count(l => l.IsCompleted) + quizProgress.Count(q => q.IsCompleted);
            decimal completionPercentage = Math.Round(totalItems > 0 ? (completedItems / totalItems) * 100 : 0);

            // Create the final response
            var response = new ChapterProgressDto
            {
                ChapterId = chapter.Id,
                ChapterTitle = chapter.Title,
                IsCompleted = completionPercentage == 100,
                CompletionPercentage = completionPercentage,
                LessonProgress = lessonProgress,
                QuizProgress = quizProgress
            };

            return Ok(response);
        }

        [HttpGet("ViewCompletedLessons/{chapterId}/{userId}")]
        public async Task<ActionResult<IEnumerable<SimpleLessonCompletionDto>>> ViewCompletedLessons(int chapterId, int userId)
        {
            // Kiểm tra chapter tồn tại
            var chapter = await _context.Chapters
                .Include(c => c.Lessons)
                .FirstOrDefaultAsync(c => c.Id == chapterId);

            if (chapter == null)
            {
                return NotFound("Chapter not found.");
            }

            // Kiểm tra user tồn tại
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Lấy lesson completions cho user
            var completedLessonIds = await _context.LessonCompletions
                .Where(lc => lc.UserId == userId && lc.Status)
                .Select(lc => lc.LessonId)
                .ToListAsync();

            // Tạo danh sách lesson với thông tin completion đơn giản
            var lessons = chapter.Lessons
                .OrderBy(l => l.DisplayOrder)
                .Select(lesson => new SimpleLessonCompletionDto
                {
                    Id = lesson.Id,
                    Name = lesson.Name,
                    IsCompleted = completedLessonIds.Contains(lesson.Id)
                })
                .ToList();

            return Ok(lessons);
        }

        private bool ChapterExists(int id)
        {
            return _context.Chapters.Any(e => e.Id == id);
        }
    }
}
