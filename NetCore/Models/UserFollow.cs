using DocumentShare.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocumentShare.Models
{
    public class UserFollow
    {
        public UserFollow()
        {
            Users = new List<AppIdentityUser>();
        }
        public int Id { get; set; }
        public string UserId { get; set; }
        public string FollowedUserId { get; set; }

        public List<AppIdentityUser> Users { get; set; }
    }
}
