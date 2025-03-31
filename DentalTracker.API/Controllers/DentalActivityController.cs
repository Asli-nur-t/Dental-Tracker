using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DentalTracker.API.Data;
using DentalTracker.API.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace DentalTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DentalActivityController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DentalActivityController> _logger;

    public DentalActivityController(ApplicationDbContext context, ILogger<DentalActivityController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("last-seven-days")]
    public async Task<IActionResult> GetLastSevenDaysActivities()
    {
        try
        {
            var userId = GetUserIdFromToken();
            var sevenDaysAgo = DateTime.UtcNow.AddDays(-7);

            var activities = await _context.DentalActivities
                .Include(a => a.Goal)
                .Where(a => a.UserId == userId && a.ActivityDate >= sevenDaysAgo)
                .OrderByDescending(a => a.ActivityDate)
                .ToListAsync();

            return Ok(activities);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Aktiviteler getirilirken hata oluştu");
            return BadRequest(new { message = "Aktiviteler getirilemedi" });
        }
    }

    [HttpGet("goal/{goalId}")]
    public async Task<IActionResult> GetGoalActivities(Guid goalId)
    {
        try
        {
            var userId = GetUserIdFromToken();
            var activities = await _context.DentalActivities
                .Where(a => a.UserId == userId && a.GoalId == goalId)
                .OrderByDescending(a => a.ActivityDate)
                .ToListAsync();

            return Ok(activities);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Aktiviteler getirilirken hata oluştu");
            return BadRequest(new { message = "Aktiviteler getirilemedi" });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateActivity([FromBody] CreateActivityRequest request)
    {
        try
        {
            var userId = GetUserIdFromToken();

            // Hedefin kullanıcıya ait olduğunu kontrol et
            var goal = await _context.DentalGoals
                .FirstOrDefaultAsync(g => g.Id == request.GoalId && g.UserId == userId);

            if (goal == null)
                return BadRequest(new { message = "Hedef bulunamadı" });

            var activity = new DentalActivity
            {
                UserId = userId,
                GoalId = request.GoalId,
                ActivityDate = request.ActivityDate.ToUniversalTime(),
                Duration = request.Duration,
                IsCompleted = request.IsCompleted,
                CreatedAt = DateTime.UtcNow
            };

            await _context.DentalActivities.AddAsync(activity);
            await _context.SaveChangesAsync();

            return Ok(activity);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Aktivite kaydedilirken hata oluştu");
            return BadRequest(new { message = "Aktivite kaydedilemedi" });
        }
    }

    [HttpPost("note")]
    public async Task<IActionResult> AddNote([FromForm] AddNoteRequest request)
    {
        try
        {
            var userId = GetUserIdFromToken();

            if (string.IsNullOrEmpty(request.Description))
                return BadRequest(new { message = "Açıklama alanı zorunludur" });

            string? imagePath = null;
            if (request.Image != null && request.Image.Length > 0)
            {
                // Görsel kaydetme işlemi burada yapılacak
                // Örnek: imagePath = await SaveImage(request.Image);
            }

            var note = new DentalNote
            {
                UserId = userId,
                Description = request.Description,
                ImagePath = imagePath,
                CreatedAt = DateTime.UtcNow
            };

            await _context.DentalNotes.AddAsync(note);
            await _context.SaveChangesAsync();

            return Ok(note);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Not eklenirken hata oluştu");
            return BadRequest(new { message = "Not eklenemedi" });
        }
    }

    [HttpGet("notes")]
    public async Task<IActionResult> GetNotes()
    {
        try
        {
            var userId = GetUserIdFromToken();
            var notes = await _context.DentalNotes
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return Ok(notes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Notlar getirilirken hata oluştu");
            return BadRequest(new { message = "Notlar getirilemedi" });
        }
    }

    private Guid GetUserIdFromToken()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            throw new UnauthorizedAccessException("Kullanıcı kimliği bulunamadı");

        return Guid.Parse(userIdClaim.Value);
    }
}

public class CreateActivityRequest
{
    public Guid GoalId { get; set; }
    public DateTime ActivityDate { get; set; }
    public TimeSpan Duration { get; set; }
    public bool IsCompleted { get; set; }
}

public class AddNoteRequest
{
    public required string Description { get; set; }
    public IFormFile? Image { get; set; }
} 