using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocumentShare.Dtos
{
    public class FileDto
    {
        public string FileCaption { set; get; }
        public string FileDescription { set; get; }
        public IFormFile MyFile { set; get; }
    }
}
