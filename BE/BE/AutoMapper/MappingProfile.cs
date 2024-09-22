using AutoMapper;
using BE.DTOs.SubjectDto;
using BE.DTOs.UserDto;
using BE.Models;
using Twilio.TwiML.Voice;

namespace BE.AutoMapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Subject, SubjectViewDto>()
            .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category.Name))
            .ReverseMap();
        }
    }
}
