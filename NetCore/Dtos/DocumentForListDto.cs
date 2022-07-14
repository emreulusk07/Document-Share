using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocumentShare.Dtos
{
    public class DocumentForListDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public int Likes { get; set; }
    }
}
