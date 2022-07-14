using DocumentShare.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DocumentShare.Models
{
    public class CommentToDocument
    {
        public int Id { get; set; }
        public string UserId { get; set; }

        [ForeignKey("FileClass")]
        public int FileId { get; set; }
        public string CommentMessage { get; set; }

        public AppIdentityUser User { get; set; }
        public FileClass FileClass { get; set; }
    }
}
