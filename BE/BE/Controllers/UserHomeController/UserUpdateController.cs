using BE.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.UserHomeController
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserUpdateController : ControllerBase
    {
        private readonly OnlineLearningSystemContext _context;

        public UserUpdateController(OnlineLearningSystemContext context)
        {
            _context = context;
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            // Map to UserProfileDTO
            var userDto = new UserProfileDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                MidName = user.MidName,
                LastName = user.LastName,
                Email = user.Email,
                Mobile = user.Mobile,
                Gender = user.Gender,
                Avatar = user.Avatar,
                Password = user.Password
            };

            return Ok(userDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserProfileDTO userDto)
        {
            if (id != userDto.Id)
            {
                return BadRequest("User ID mismatch");
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Cập nhật các thuộc tính
            user.FirstName = userDto.FirstName;
            user.MidName = userDto.MidName;
            user.LastName = userDto.LastName;
            user.Email = userDto.Email;
            user.Mobile = userDto.Mobile;
            user.Gender = userDto.Gender;
            user.Avatar = userDto.Avatar;

            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            return NoContent(); // Trả về 204 No Content để xác nhận đã cập nhật thành công
        }

    }
}
