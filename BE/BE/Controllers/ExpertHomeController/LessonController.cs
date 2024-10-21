using BE.DTOs.ExpertDto;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Expert
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LessonController : ControllerBase
    {
        private readonly OnlineLearningSystemContext _context;
        List<string> validStatuses = new() { "Active", "Inactive", "Draft" };

        public LessonController(OnlineLearningSystemContext context)
        {
            _context = context;
        }

        [HttpGet("ListAllLesson")]
        public async Task<ActionResult<IEnumerable<LessonDto>>> ListAllLesson()
        {
            var lessons = await _context.Lessons
                .Include(l => l.Subject)
                .Select(l => new LessonDto
                {
                    Id = l.Id,
                    Name = l.Name,
                    Content = l.Content,
                    Status = l.Status,
                    SubjectId = l.SubjectId,
                    SubjectName = l.Subject.Name,
                    Url = l.Url
                })
                .ToListAsync();

            return Ok(lessons);
        }

        [HttpPut("EditLesson/{id}")]
        public async Task<IActionResult> EditLesson(int id, EditLessonDto editLessonDto)
        {
            var lesson = await _context.Lessons.FindAsync(id);
            if (lesson == null)
            {
                return NotFound();
            }

            if (editLessonDto.SubjectId.HasValue && !await _context.Subjects.AnyAsync(s => s.Id == editLessonDto.SubjectId.Value))
            {
                return BadRequest("Invalid SubjectId. The specified subject does not exist.");
            }

            if (string.IsNullOrWhiteSpace(editLessonDto.Name))
            {
                return BadRequest("Name cannot be null or empty.");
            }

            if (!validStatuses.Contains(editLessonDto.Status))
            {
                return BadRequest("Invalid status. Allowed values are 'Active' , 'Inactive' and 'Draft'.");
            }

            lesson.SubjectId = editLessonDto.SubjectId;
            lesson.Name = editLessonDto.Name;
            lesson.Content = editLessonDto.Content;
            lesson.Status = editLessonDto.Status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LessonExists(id))
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

        [HttpPost("AddLesson")]
        public async Task<ActionResult> AddLesson(EditLessonDto editLessonDto)
        {
            if (editLessonDto.SubjectId.HasValue && !await _context.Subjects.AnyAsync(s => s.Id == editLessonDto.SubjectId.Value))
            {
                return BadRequest("Invalid SubjectId. The specified subject does not exist.");
            }

            if (string.IsNullOrWhiteSpace(editLessonDto.Name))
            {
                return BadRequest("Name cannot be null or empty.");
            }

            if (!validStatuses.Contains(editLessonDto.Status))
            {
                return BadRequest("Invalid status. Allowed values are 'active' and 'inactive'.");
            }

            var lesson = new Lesson
            {
                SubjectId = editLessonDto.SubjectId,
                Name = editLessonDto.Name,
                Content = editLessonDto.Content,
                Status = editLessonDto.Status
            };

            _context.Lessons.Add(lesson);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{lessonId}")]
        public async Task<ActionResult<LessonDto>> GetLessonById(int lessonId)
        {
            var lesson = await _context.Lessons.FindAsync(lessonId);
            if (lesson == null)
            {
                return NotFound();
            }

            var lessonDto = new LessonDto
            {
                Id = lesson.Id,
                Name = lesson.Name,
                Content = lesson.Content,
                Status = lesson.Status,
                SubjectId = lesson.SubjectId,
                Url = lesson.Url
            };

            return lessonDto;
        }

        [HttpPut("{lessonId}/status")]
        public async Task<ActionResult> UpdateLessonStatus(int lessonId)
        {
            var lesson = await _context.Lessons.FindAsync(lessonId);
            if (lesson == null)
            {
                return NotFound();
            }

            lesson.Status = lesson.Status == "Active" ? "Inactive" : "Active";

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LessonExists(lessonId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(await GetLessonById(lessonId));
        }

        [HttpGet("ListAllLessonComplete")]
        public async Task<ActionResult<IEnumerable<Lesson>>> ListAllLessonComplete(int subjectId, int userId)
        {
            var lessonCompletions = await _context.LessonCompletions
                .Where(lc => lc.Lesson.SubjectId == subjectId && lc.UserId == userId)
                .Select(lc => lc.Lesson)
                .ToListAsync();

            return Ok(lessonCompletions);
        }

        //[HttpDelete("DeleteLesson/{id}")]
        //public async Task<IActionResult> DeleteLesson(int id)
        //{
        //    var lesson = await _context.Lessons.FindAsync(id);

        //    if (lesson == null)
        //    {
        //        return NotFound("Lesson not found.");
        //    }

        //    _context.Lessons.Remove(lesson);

        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}



        private bool LessonExists(int id)
        {
            return _context.Lessons.Any(e => e.Id == id);
        }
    }
}
