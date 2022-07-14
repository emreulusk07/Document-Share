using DocumentShare.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocumentShare.Data
{
    public class AppIdentityDbContext : IdentityDbContext<AppIdentityUser, AppIdentityRole, string>
    {
        public AppIdentityDbContext(DbContextOptions<AppIdentityDbContext> options) : base(options)
        {

        }

        public DbSet<CommentToDocument> CommentToDocuments { get; set; }
        public DbSet<FileClass> FileClasses { get; set; }
        public DbSet<Forum> Forums { get; set; }
        public DbSet<UserFollow> UserFollows { get; set; }
    }
}
