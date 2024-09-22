using AutoMapper;
using BE.DTOs.SubjectDto;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.UserHomeController
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly OnlineLearningSystemContext _learningSystemContext;
        private readonly IMapper _mapper;

        public HomeController(OnlineLearningSystemContext learningSystemContext, IMapper mapper)
        {
            _learningSystemContext = learningSystemContext;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSubject()
        {
            var s = await _learningSystemContext.Subjects.Include(x => x.Category).ToListAsync();
            var ss = _mapper.Map<List<SubjectViewDto>>(s);
            return Ok(ss);
        }
    }
}
