using AutoMapper;
using BE.DTOs.ExpertDto;
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

        [HttpGet]
        public async Task<IActionResult> ListAllExperts()
        {
            try
            {
                var experts = await _context.Users
                    .Where(u => u.Role == "Teacher")
                    .Select(u => new UserAdminDto
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        MidName = u.MidName,
                        LastName = u.LastName,
                        Email = u.Email,
                        Mobile = u.Mobile,
                        Gender = u.Gender,
                        Avatar = u.Avatar,
                        Role = u.Role,
                        Status = u.Status
                    })
                    .ToListAsync();

                return Ok(experts);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching experts: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetExpertById(int id)
        {
            try
            {
                var expert = await _context.Users
                    .Where(u => u.Id == id && u.Role == "Teacher")
                    .Select(u => new ExpertDetailsDto
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        MidName = u.MidName,
                        LastName = u.LastName,
                        Email = u.Email,
                        Mobile = u.Mobile,
                        Gender = u.Gender,
                        Avatar = u.Avatar,
                        Role = u.Role,
                        Status = u.Status,
                        Subjects = u.Subjects.Select(s => new SubjectSummaryDto
                        {
                            Id = s.Id,
                            Name = s.Name,
                            Status = s.Status
                        }).ToList()
                    })
                    .FirstOrDefaultAsync();

                if (expert == null)
                {
                    return NotFound($"Expert with ID {id} not found or is not a teacher.");
                }

                return Ok(expert);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching the expert: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddModerator(ModeratorAddDto moderator)
        {
            try
            {
                if (_userService.CheckEmailExits(moderator.Email))
                {
                    return BadRequest("This email already exist");
                }

                var e = new User()
                {
                    FirstName = moderator.FirstName,
                    MidName = moderator.MidName,
                    LastName = moderator.LastName,
                    Avatar = moderator.Avatar,
                    Email = moderator.Email,
                    Gender = moderator.Gender,
                    Role = "Moderator",
                    Mobile = moderator.Mobile,
                    Status = "Active",
                    Password = moderator.Password,
                };
                await _context.Users.AddAsync(e);
                await _context.SaveChangesAsync();
                var ex = _context.Users.FirstOrDefault(e => e.Email == moderator.Email);
                return Ok(ex);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> ListAllModerator()
        {
            try
            {
                var experts = await _context.Users
                    .Where(u => u.Role == "Moderator")
                    .Select(u => new UserAdminDto
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        MidName = u.MidName,
                        LastName = u.LastName,
                        Email = u.Email,
                        Mobile = u.Mobile,
                        Gender = u.Gender,
                        Avatar = u.Avatar,
                        Role = u.Role,
                        Status = u.Status
                    })
                    .ToListAsync();

                return Ok(experts);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred while fetching experts: {ex.Message}");
            }
        }
    }
}
