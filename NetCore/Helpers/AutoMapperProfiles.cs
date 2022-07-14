using AutoMapper;
using DocumentShare.Dtos;
using DocumentShare.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocumentShare.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            /*
            CreateMap<Document, DocumentForListDto>().ForMember(dest => dest.Url, opt =>
            {
                opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
            });
            */
            // Bizde(videodan farklı olarak) değişken isimleri(Url) aynı olduğundan direkt aşağıdaki gibi
            // yazılması sorun teşkil etmez. Değişken isimleri farklı olsaydı yukardaki işlem yapılırdı.

            CreateMap<FileClass, FileForDetailDto>();
            //CreateMap<Photos, PhotoForCreationDto>();
            //CreateMap<PhotoForReturnDto, Photos>();
        }
    }
}
