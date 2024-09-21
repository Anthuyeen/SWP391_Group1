using AutoMapper;
using BE.DTOs.UserDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.AdminHomeController
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserManagementController : ControllerBase
    {
        private readonly OnlineLearningSystemContext _context;
        private readonly IMapper _mapper;

        public UserManagementController(OnlineLearningSystemContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<IActionResult> ViewListUser()
        {
            try
            {
                var list = await _context.Users.ToListAsync();
                var lists = _mapper.Map<List<UserAdminDto>>(list);
                return Ok(list);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpPost]
        public async Task<IActionResult> AddExpert(User expert)
        {
            try
            {
                var e = new User()
                {
                    FullName = expert.FullName,
                    Avatar = expert.Avatar,
                    Email = expert.Email,
                    Gender = expert.Gender,
                    Role = "Teacher",
                    Mobile = expert.Mobile,
                    Status = "Active",
                    Password = expert.Password,
                };
                await _context.Users.AddAsync(expert);
                await _context.SaveChangesAsync();
                return Ok(e);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> SetActiveExpert(int eid)
        {
            try
            {
                var e = await _context.Users.FirstOrDefaultAsync(x => x.Id == eid);
                e.Status = "active";
                _context.Users.Update(e);
                await _context.SaveChangesAsync();
                return Ok(e);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
