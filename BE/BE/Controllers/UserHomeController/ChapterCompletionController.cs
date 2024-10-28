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
        //[HttpPost]
        //public async Task<IActionResult> CompleteChapter(CompleteChapterDto completeChapterDto)
        //{
        //    var chapterCompletion = new ChapterCompletion
        //    {
        //        UserId = completeChapterDto.UserId,
        //        ChapterId = completeChapterDto.ChapterId,
        //        SubjectId = completeChapterDto.SubjectId,
        //        CompletionDate = completeChapterDto.CompletionDate,
        //        Status = completeChapterDto.Status
        //    };

        //    _context.ChapterCompletions.Add(chapterCompletion);
        //    await _context.SaveChangesAsync();

        //    return Ok(chapterCompletion);
        //}
        [HttpPost]
        public async Task<IActionResult> CompleteChapter(CompleteChapterDto completeChapterDto)
        {
            // Kiểm tra xem bản ghi đã tồn tại với Status = true hay chưa
            var existingCompletion = await _context.ChapterCompletions
                .FirstOrDefaultAsync(cc => cc.UserId == completeChapterDto.UserId
                                          && cc.ChapterId == completeChapterDto.ChapterId
                                          && cc.SubjectId == completeChapterDto.SubjectId
                                          && cc.Status == true); // Kiểm tra trạng thái

            if (existingCompletion != null)
            {
                // Nếu bản ghi đã tồn tại và Status = true, trả về thông báo
                return Conflict("User already completed course");
            }

            // Nếu chưa tồn tại hoặc Status = false, tiến hành thêm bản ghi mới
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
