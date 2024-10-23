using BE.DTOs.ExpertDto;
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

        private bool ChapterExists(int id)
        {
            return _context.Chapters.Any(e => e.Id == id);
        }
    }
}
