using BE.DTOs.ModeratorDto;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.ModeratorHomeController
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly OnlineLearningSystemContext _context;
        private readonly List<string> validStatuses = new() { "Published", "Draft", "Archived" };

        public PostController(OnlineLearningSystemContext context)
        {
            _context = context;
        }

        [HttpGet("ListAllPosts")]
        public async Task<ActionResult<IEnumerable<PostDto>>> ListAllPosts()
        {
            var posts = await _context.Posts
                .Include(p => p.Category)
                .Include(p => p.PostImages)
                .Include(p => p.PostContents)
                .Select(p => new PostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    BriefInfo = p.BriefInfo,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,
                    IsFeatured = p.IsFeatured,
                    Status = p.Status,
                    Images = p.PostImages.OrderBy(i => i.DisplayOrder).Select(i => new PostImageDto
                    {
                        Id = i.Id,
                        Url = i.Url,
                        DisplayOrder = i.DisplayOrder
                    }).ToList(),
                    Contents = p.PostContents.OrderBy(c => c.DisplayOrder).Select(c => new PostContentDto
                    {
                        Id = c.Id,
                        Content = c.Content,
                        DisplayOrder = c.DisplayOrder
                    }).ToList()
                })
                .ToListAsync();

            return Ok(posts);
        }

        [HttpGet("GetPost/{id}")]
        public async Task<ActionResult<PostDto>> GetPost(int id)
        {
            var post = await _context.Posts
                .Include(p => p.Category)
                .Include(p => p.PostImages)
                .Include(p => p.PostContents)
                .Where(p => p.Id == id)
                .Select(p => new PostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    BriefInfo = p.BriefInfo,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,
                    IsFeatured = p.IsFeatured,
                    Status = p.Status,
                    Images = p.PostImages.OrderBy(i => i.DisplayOrder).Select(i => new PostImageDto 
                    { 
                        Id = i.Id, 
                        Url = i.Url, 
                        DisplayOrder = i.DisplayOrder 
                    }).ToList(),
                    Contents = p.PostContents.OrderBy(c => c.DisplayOrder).Select(c => new PostContentDto
                    {
                        Id = c.Id,
                        Content = c.Content,
                        DisplayOrder = c.DisplayOrder
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (post == null)
            {
                return NotFound("Post not found.");
            }

            return Ok(post);
        }

        [HttpPut("EditPost/{id}")]
        public async Task<IActionResult> EditPost(int id, EditPostDto editPostDto)
        {
            var post = await _context.Posts
                .Include(p => p.Category)
                .Include(p => p.PostImages)
                .Include(p => p.PostContents)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
            {
                return NotFound("Post not found.");
            }

            if (editPostDto.CategoryId.HasValue && !await _context.Categories.AnyAsync(c => c.Id == editPostDto.CategoryId.Value))
            {
                return BadRequest("Invalid CategoryId. The specified category does not exist.");
            }

            if (string.IsNullOrWhiteSpace(editPostDto.Title))
            {
                return BadRequest("Title cannot be null or empty.");
            }

            if (!validStatuses.Contains(editPostDto.Status))
            {
                return BadRequest($"Invalid status. Allowed values are {string.Join(", ", validStatuses)}.");
            }

            // Update post details
            post.Title = editPostDto.Title;
            post.BriefInfo = editPostDto.BriefInfo;
            post.CategoryId = editPostDto.CategoryId;
            post.IsFeatured = editPostDto.IsFeatured;
            post.Status = editPostDto.Status;

            // Update images
            var imagesToRemove = post.PostImages.Where(pi => !editPostDto.Images.Any(i => i.Id == pi.Id)).ToList();
            foreach (var image in imagesToRemove)
            {
                _context.PostImages.Remove(image);
            }

            foreach (var imageDto in editPostDto.Images)
            {
                var existingImage = post.PostImages.FirstOrDefault(pi => pi.Id == imageDto.Id);
                if (existingImage != null)
                {
                    existingImage.Url = imageDto.Url;
                    existingImage.DisplayOrder = imageDto.DisplayOrder;
                }
                else
                {
                    post.PostImages.Add(new PostImage
                    {
                        PostId = post.Id,
                        Url = imageDto.Url,
                        DisplayOrder = imageDto.DisplayOrder
                    });
                }
            }

            // Update contents
            var contentsToRemove = post.PostContents.Where(pc => !editPostDto.Contents.Any(c => c.Id == pc.Id)).ToList();
            foreach (var content in contentsToRemove)
            {
                _context.PostContents.Remove(content);
            }

            foreach (var contentDto in editPostDto.Contents)
            {
                var existingContent = post.PostContents.FirstOrDefault(pc => pc.Id == contentDto.Id);
                if (existingContent != null)
                {
                    existingContent.Content = contentDto.Content;
                    existingContent.DisplayOrder = contentDto.DisplayOrder;
                }
                else
                {
                    post.PostContents.Add(new PostContent
                    {
                        PostId = post.Id,
                        Content = contentDto.Content,
                        DisplayOrder = contentDto.DisplayOrder
                    });
                }
            }

            try
            {
                await _context.SaveChangesAsync();

                // Create a PostDto from the updated post
                var updatedPostDto = new PostDto
                {
                    Id = post.Id,
                    Title = post.Title,
                    BriefInfo = post.BriefInfo,
                    CategoryId = post.CategoryId,
                    CategoryName = post.Category?.Name,
                    IsFeatured = post.IsFeatured,
                    Status = post.Status,
                    Images = post.PostImages.Select(pi => new PostImageDto
                    {
                        Id = pi.Id,
                        Url = pi.Url,
                        DisplayOrder = pi.DisplayOrder
                    }).ToList(),
                    Contents = post.PostContents.Select(pc => new PostContentDto
                    {
                        Id = pc.Id,
                        Content = pc.Content,
                        DisplayOrder = pc.DisplayOrder
                    }).ToList()
                };

                return CreatedAtAction(nameof(GetPost), new { id = post.Id }, updatedPostDto);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PostExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        [HttpPost("AddPost")]
        public async Task<ActionResult> AddPost(EditPostDto editPostDto)
        {
            if (editPostDto.CategoryId.HasValue && !await _context.Categories.AnyAsync(c => c.Id == editPostDto.CategoryId.Value))
            {
                return BadRequest("Invalid CategoryId. The specified category does not exist.");
            }

            if (string.IsNullOrWhiteSpace(editPostDto.Title))
            {
                return BadRequest("Title cannot be null or empty.");
            }

            if (!validStatuses.Contains(editPostDto.Status))
            {
                return BadRequest($"Invalid status. Allowed values are {string.Join(", ", validStatuses)}.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var post = new Post
                {
                    Title = editPostDto.Title,
                    BriefInfo = editPostDto.BriefInfo,
                    CategoryId = editPostDto.CategoryId,
                    IsFeatured = editPostDto.IsFeatured,
                    Status = editPostDto.Status
                };

                _context.Posts.Add(post);
                await _context.SaveChangesAsync();

                // Add images
                if (editPostDto.Images != null && editPostDto.Images.Any())
                {
                    var postImages = editPostDto.Images.Select(imageDto => new PostImage
                    {
                        PostId = post.Id,
                        Url = imageDto.Url,
                        DisplayOrder = imageDto.DisplayOrder
                    }).ToList();

                    _context.PostImages.AddRange(postImages);
                }

                // Add contents
                if (editPostDto.Contents != null && editPostDto.Contents.Any())
                {
                    var postContents = editPostDto.Contents.Select(c => new PostContent
                    {
                        PostId = post.Id,
                        Content = c.Content,
                        DisplayOrder = c.DisplayOrder
                    }).ToList();

                    _context.PostContents.AddRange(postContents);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Return the newly created post
                var postDto = new PostDto
                {
                    Id = post.Id,
                    Title = post.Title,
                    BriefInfo = post.BriefInfo,
                    CategoryId = post.CategoryId,
                    IsFeatured = post.IsFeatured,
                    Status = post.Status,
                    Images = editPostDto.Images ?? new List<PostImageDto>(),
                    Contents = editPostDto.Contents ?? new List<PostContentDto>()
                };

                return CreatedAtAction(nameof(GetPost), new { id = post.Id }, postDto);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        [HttpDelete("DeletePost/{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _context.Posts
                .Include(p => p.PostImages)
                .Include(p => p.PostContents)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
            {
                return NotFound("Post not found.");
            }

            _context.PostImages.RemoveRange(post.PostImages);
            _context.PostContents.RemoveRange(post.PostContents);
            _context.Posts.Remove(post);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PostExists(int id)
        {
            return _context.Posts.Any(e => e.Id == id);
        }
    }
}