using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.UserHomeController
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EnrollController : ControllerBase
    {
        private readonly OnlineLearningSystemContext _learningSystemContext;
        public EnrollController(OnlineLearningSystemContext learningSystemContext)
        {
            _learningSystemContext = learningSystemContext;
        }

        [HttpGet]
        public async Task<IActionResult> CheckStatusSubject(int accid, int subid)
        {
            try
            {
                var reg =  _learningSystemContext.Registrations.Where(x => x.UserId == accid).FirstOrDefault(x => x.SubjectId == subid);
                if (reg == null || reg.Status == "Pending")
                {
                    var subprice = _learningSystemContext.PricePackages.FirstOrDefault(x => x.SubjectId == subid);
                    return Ok(subprice.SalePrice);

                }
             
                return Ok("Bạn đã đăng ký môn học này");
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpPost]
        public async Task<IActionResult> RegisterSubject(int accid, int subid)
        {
            try
            {
                var pp = await _learningSystemContext.PricePackages.Include(x => x.Subject).FirstOrDefaultAsync(x => x.SubjectId == subid);
                var reg = new Registration
                {
                    UserId = accid,
                    SubjectId = subid,
                    PackageId = pp.Id,
                    RegistrationTime = DateTime.Now,
                    TotalCost = pp.SalePrice,
                    Status = "Pending",
                    ValidFrom = DateTime.Now,
                    ValidTo = DateTime.Now.AddDays(pp.DurationMonths)
                };
                await _learningSystemContext.Registrations.AddAsync(reg);
                await _learningSystemContext.SaveChangesAsync();
                return Ok(reg);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut]
        public async Task<IActionResult> PayForRegisteredSubject(int accid, int regid)
        {
            try
            {
                var reg = await _learningSystemContext.Registrations.FirstOrDefaultAsync(x => x.Id == regid);
                reg.Status = "Approved";
                _learningSystemContext.Registrations.Update(reg);
                await _learningSystemContext.SaveChangesAsync();
                return Ok(reg);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
