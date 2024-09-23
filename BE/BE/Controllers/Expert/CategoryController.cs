using BE.DTOs.ExpertDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Expert
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly OnlineLearningSystemContext _context;
        public CategoryController(OnlineLearningSystemContext context)
        {
            _context = context;
        }
        [HttpGet("ListAllCategory")]
        public async Task<ActionResult<IEnumerable<Category>>> ListAllCategory()
        {
            var categories = await _context.Categories
                .Select(l => new CategoryDto
                {
                    Id = l.Id,
                    Name = l.Name,
                    Type = l.Type,
                })
                .ToListAsync();
            return Ok(categories);
        }
    }
}
