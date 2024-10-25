using BE.DTOs.UserDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.UserHomeController
{
    [Route("api/[controller]")]
    [ApiController]
    public class LessonCompletionController : ControllerBase
    {
        private readonly OnlineLearningSystemContext _context;

        public LessonCompletionController(OnlineLearningSystemContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CompleteLesson(CompleteLessonDto completeLessonDto)
        {
            var lessonCompletion = new LessonCompletion
            {
                UserId = completeLessonDto.UserId,
                LessonId = completeLessonDto.LessonId,
                CompletionDate = completeLessonDto.CompletionDate,
                Status = completeLessonDto.Status
            };

            _context.LessonCompletions.Add(lessonCompletion);
            await _context.SaveChangesAsync();

            return Ok(lessonCompletion);
        }
    }
}
