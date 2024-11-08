using BE.DTOs.UserDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.UserHomeController
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectCompletionController : ControllerBase
    {
        private readonly OnlineLearningSystemContext _context;

        public SubjectCompletionController(OnlineLearningSystemContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CompleteSubject(CompleteSubjectDto completeSubjectDto)
        {
            try
            {
                // Check if user exists
                var user = await _context.Users.FindAsync(completeSubjectDto.UserId);
                if (user == null)
                    return NotFound("User not found");

                // Check if subject exists
                var subject = await _context.Subjects.FindAsync(completeSubjectDto.SubjectId);
                if (subject == null)
                    return NotFound("Subject not found");

                // Check if completion already exists
                var existingCompletion = await _context.SubjectCompletions
                    .FirstOrDefaultAsync(sc => sc.UserId == completeSubjectDto.UserId &&
                                            sc.SubjectId == completeSubjectDto.SubjectId);

                if (existingCompletion != null)
                    return BadRequest("Subject completion already exists for this user");

                var subjectCompletion = new SubjectCompletion
                {
                    UserId = completeSubjectDto.UserId,
                    SubjectId = completeSubjectDto.SubjectId,
                    CompletionDate = completeSubjectDto.CompletionDate,
                    Status = completeSubjectDto.Status,
                    CertificateUrl = completeSubjectDto.CertificateUrl
                };

                _context.SubjectCompletions.Add(subjectCompletion);
                await _context.SaveChangesAsync();

                return Ok(subjectCompletion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<SubjectCompletion>>> GetUserSubjectCompletions(int userId)
        {
            var completions = await _context.SubjectCompletions
                .Include(sc => sc.Subject)
                .Where(sc => sc.UserId == userId)
                .ToListAsync();

            return Ok(completions);
        }
      
        [HttpGet("{userId}/{subjectId}")]
        public async Task<ActionResult> GetSpecificSubjectCompletion(int userId, int subjectId)
        {
            var completion = await _context.SubjectCompletions
                .Include(sc => sc.Subject)
                .FirstOrDefaultAsync(sc => sc.UserId == userId && sc.SubjectId == subjectId);

            if (completion == null)
            {
                return Ok(new { IsCompleted = false });
            }

            return Ok(new
            {
                completion,
                IsCompleted = true
            });
        }

    }
}
