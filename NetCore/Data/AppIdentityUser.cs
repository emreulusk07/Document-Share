using DocumentShare.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocumentShare.Data
{
    public class AppIdentityUser : IdentityUser
    {
        public AppIdentityUser()
        {
            Forums = new List<Forum>();
            FileClasses = new List<FileClass>();
            CommentToDocuments = new List<CommentToDocument>();
        }
        //public int FollowersCount { get; set; }
        //public int FollowingCount { get; set; }
        //public Nullable<DateTime> CreatedDate { get; set; }

        public List<UserFollow> UserFollows { get; set; }
        public List<CommentToDocument> CommentToDocuments { get; set; }
        public List<FileClass> FileClasses { get; set; }
        public List<Forum> Forums { get; set; }
    }
}
