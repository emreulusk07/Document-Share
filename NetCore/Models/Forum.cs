using DocumentShare.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DocumentShare.Models
{
    public class Forum
    {
        public Forum()
        {
            CommentToDocuments = new List<CommentToDocument>();
        }
        public int Id { get; set; }

        [ForeignKey("AppIdentityUser")]
        public string UserId { get; set; }
        public string Name { get; set; }
        
        [FromHeader]
        public string Category { get; set; }

        public List<CommentToDocument> CommentToDocuments { get; set; }
        public AppIdentityUser User { get; set; }
    }
}
