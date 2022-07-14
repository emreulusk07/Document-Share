using DocumentShare.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocumentShare.Data
{
    public class AppRepository : IAppRepository
    {
        private AppIdentityDbContext _context;

        public AppRepository(AppIdentityDbContext context)
        {
            _context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }
        /*
        public List<Document> GetDocuments()
        {
            var documents = _context.Documents.Include(d => d.CommentToDocuments).ToList();
            return documents;
        }*/

        public List<FileClass> GetFiles()
        {
            var files = _context.FileClasses.ToList();
            return files;
        }

        public int GetFilesCount()
        {
            var filesCount = _context.FileClasses.ToList().Count;
            return filesCount;
        }

        public List<Forum> GetForums()
        {
            var forums = _context.Forums.ToList();
            return forums;
        }
        /*
        public Document GetDocumentById(int DocumentId)
        {
            var document = _context.Documents.Include(d => d.CommentToDocuments).FirstOrDefault(d => d.Id == DocumentId);
            return document;
        }*/

        public FileClass GetFileById(int FileId)
        {
            var file = _context.FileClasses.FirstOrDefault(f => f.Id == FileId);
            return file;
        }

        public List<FileClass> GetFilteredFiles(string userId)
        {
            var files = _context.FileClasses.Where(f => f.UserId == userId).ToList();
            return files;
        }

        public Forum GetForumById(int ForumId)
        {
            var forum = _context.Forums.FirstOrDefault(f => f.Id == ForumId);
            return forum;
        }

        public List<CommentToDocument> GetCommentToDocumentsById(int FileId)
        {
            var comments = _context.CommentToDocuments.Where(c => c.FileId == FileId).ToList();
            return comments;
        }

        public bool SaveAll()
        {
            return _context.SaveChanges() > 0;
        }
    }
}
