using BE.DTOs.UserDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.UserHomeController
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChapterCompletionController : ControllerBase
    {
        private readonly OnlineLearningSystemContext _context;

        public ChapterCompletionController(OnlineLearningSystemContext context)
        {
            _context = context;
        }

        // POST: api/ChapterCompletion
        [HttpPost]
        public async Task<IActionResult> CompleteChapter(CompleteChapterDto completeChapterDto)
        {
            var chapterCompletion = new ChapterCompletion
            {
                UserId = completeChapterDto.UserId,
                ChapterId = completeChapterDto.ChapterId,
                SubjectId = completeChapterDto.SubjectId,
                CompletionDate = completeChapterDto.CompletionDate,
                Status = completeChapterDto.Status
            };

            _context.ChapterCompletions.Add(chapterCompletion);
            await _context.SaveChangesAsync();

            return Ok(chapterCompletion);
        }
    }
}
