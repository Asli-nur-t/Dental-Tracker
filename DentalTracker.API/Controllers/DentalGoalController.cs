using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DentalTracker.API.Data;
using DentalTracker.API.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using DentalTracker.API.Models.Enums;

namespace DentalTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DentalGoalController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DentalGoalController> _logger;

    public DentalGoalController(ApplicationDbContext context, ILogger<DentalGoalController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetUserGoals()
    {
        try
        {
            var userId = GetUserIdFromToken();
            var goals = await _context.DentalGoals
                .Where(g => g.UserId == userId)
                .OrderByDescending(g => g.CreatedAt)
                .ToListAsync();

            return Ok(goals);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Hedefler getirilirken hata oluştu");
            return BadRequest(new { message = "Hedefler getirilemedi" });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateGoal([FromBody] CreateGoalRequest request)
    {
        try
        {
            _logger.LogInformation("Hedef oluşturma isteği alındı: {@Request}", request);

            if (request == null)
            {
                _logger.LogWarning("Boş istek gönderildi");
                return BadRequest(new { message = "Geçersiz istek" });
            }

            if (string.IsNullOrEmpty(request.Title))
            {
                _logger.LogWarning("Başlık alanı boş");
                return BadRequest(new { message = "Başlık alanı zorunludur" });
            }

            if (string.IsNullOrEmpty(request.Description))
            {
                _logger.LogWarning("Açıklama alanı boş");
                return BadRequest(new { message = "Açıklama alanı zorunludur" });
            }

            var userId = GetUserIdFromToken();
            _logger.LogInformation("Kullanıcı ID: {UserId}", userId);

            var goal = new DentalGoal
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = request.Title,
                Description = request.Description,
                Period = request.Period,
                Priority = request.Priority,
                CreatedAt = DateTime.UtcNow
            };

            _logger.LogInformation("Oluşturulan hedef: {@Goal}", goal);

            await _context.DentalGoals.AddAsync(goal);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Hedef başarıyla kaydedildi");

            return Ok(goal);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Hedef oluşturulurken hata oluştu");
            return BadRequest(new { message = $"Hedef oluşturulamadı: {ex.Message}" });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateGoal(Guid id, [FromBody] UpdateGoalRequest request)
    {
        try
        {
            var userId = GetUserIdFromToken();
            var goal = await _context.DentalGoals
                .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);

            if (goal == null)
                return BadRequest(new { message = "Hedef bulunamadı" });

            goal.Title = request.Title;
            goal.Description = request.Description;
            goal.Period = (Models.Enums.GoalPeriod)request.Period;
            goal.Priority = (Models.Enums.GoalPriority)request.Priority;
            goal.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(goal);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Hedef güncellenirken hata oluştu");
            return BadRequest(new { message = "Hedef güncellenemedi" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGoal(Guid id)
    {
        try
        {
            var userId = GetUserIdFromToken();
            var goal = await _context.DentalGoals
                .Include(g => g.Activities)
                .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);

            if (goal == null)
                return BadRequest(new { message = "Hedef bulunamadı" });

            if (goal.Activities.Any())
            {
                return BadRequest(new { 
                    message = "Bu hedef için kayıtlı aktiviteler bulunmaktadır. Silmek istediğinize emin misiniz?",
                    hasActivities = true
                });
            }

            _context.DentalGoals.Remove(goal);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Hedef başarıyla silindi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Hedef silinirken hata oluştu");
            return BadRequest(new { message = "Hedef silinemedi" });
        }
    }

    [HttpDelete("{id}/force")]
    public async Task<IActionResult> ForceDeleteGoal(Guid id)
    {
        try
        {
            var userId = GetUserIdFromToken();
            var goal = await _context.DentalGoals
                .Include(g => g.Activities)
                .FirstOrDefaultAsync(g => g.Id == id && g.UserId == userId);

            if (goal == null)
                return BadRequest(new { message = "Hedef bulunamadı" });

            // Önce aktiviteleri sil
            _context.DentalActivities.RemoveRange(goal.Activities);
            // Sonra hedefi sil
            _context.DentalGoals.Remove(goal);
            
            await _context.SaveChangesAsync();

            return Ok(new { message = "Hedef ve ilgili aktiviteler başarıyla silindi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Hedef silinirken hata oluştu");
            return BadRequest(new { message = "Hedef silinemedi" });
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

public class CreateGoalRequest
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public GoalPeriod Period { get; set; }
    public GoalPriority Priority { get; set; }
}

public class UpdateGoalRequest
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public GoalPeriod Period { get; set; }
    public GoalPriority Priority { get; set; }
}

public enum GoalPeriod
{
    Daily,
    Weekly,
    Monthly,
    ThreeMonths,
    SixMonths,
    Yearly
}

public enum GoalPriority
{
    Low,
    Medium,
    High
} 