using AutoMapper;
using BE.DTOs.UserDto;
using BE.Models;
using BE.Service.IService;
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
        private readonly IUserService _userService;

        public UserManagementController(OnlineLearningSystemContext context, IMapper mapper, IUserService userService)
        {
            _context = context;
            _mapper = mapper;
            _userService = userService;
        }
        [HttpGet]
        public async Task<IActionResult> ViewListUser()
        {
            try
            {
                var list = await _context.Users.Where(x => x.Role.ToLower() == "teacher").ToListAsync();
                var lists = _mapper.Map<List<UserAdminDto>>(list);
                return Ok(list);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        public async Task<IActionResult> AddExpert(ExpertAddDto expert)
        {
            try
            {
                if(_userService.CheckEmailExits(expert.Email))
                {
                    return BadRequest("This email already exist");
                }

                var e = new User()
                {
                    FirstName = expert.FirstName,
                    MidName = expert.MidName,
                    LastName = expert.LastName,
                    Avatar = expert.Avatar,
                    Email = expert.Email,
                    Gender = expert.Gender,
                    Role = "Teacher",
                    Mobile = expert.Mobile,
                    Status = "Active",
                    Password = expert.Password,
                };
                await _context.Users.AddAsync(e);
                await _context.SaveChangesAsync();
                var ex = _context.Users.FirstOrDefault(e => e.Email == expert.Email);
                return Ok(ex);
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
                if (e.Status == "Active")
                    e.Status = "Inactive";
                else
                    e.Status = "Active";
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
