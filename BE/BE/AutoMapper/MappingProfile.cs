using AutoMapper;
using BE.DTOs.UserDto;
using BE.Models;
using Twilio.TwiML.Voice;

namespace BE.AutoMapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserAdminDto>().ReverseMap();

        }
    }
}
