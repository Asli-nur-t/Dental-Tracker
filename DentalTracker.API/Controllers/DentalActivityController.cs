using Microsoft.AspNetCore.Mvc;

namespace DentalTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DentalActivityController : ControllerBase
{
    private readonly ILogger<DentalActivityController> _logger;

    public DentalActivityController(ILogger<DentalActivityController> logger)
    {
        _logger = logger;
    }

    [HttpGet("last-seven-days")]
    public IActionResult GetLastSevenDaysActivities()
    {
        try
        {
            // TODO: Get user ID from JWT token
            // TODO: Get activities from last 7 days
            return Ok(new { message = "Son 7 günün aktiviteleri başarıyla getirildi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Aktiviteler getirilirken hata oluştu");
            return BadRequest(new { message = "Aktiviteler getirilemedi" });
        }
    }

    [HttpGet("goal/{goalId}")]
    public IActionResult GetGoalActivities(Guid goalId)
    {
        try
        {
            // TODO: Get user ID from JWT token
            // TODO: Check if goal belongs to user
            // TODO: Get activities for specific goal
            return Ok(new { message = "Hedefe ait aktiviteler başarıyla getirildi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Aktiviteler getirilirken hata oluştu");
            return BadRequest(new { message = "Aktiviteler getirilemedi" });
        }
    }

    [HttpPost]
    public IActionResult CreateActivity([FromBody] CreateActivityRequest request)
    {
        try
        {
            if (request.GoalId == Guid.Empty)
                return BadRequest(new { message = "Hedef seçimi zorunludur" });

            // TODO: Get user ID from JWT token
            // TODO: Check if goal belongs to user
            // TODO: Save activity
            return Ok(new { message = "Aktivite başarıyla kaydedildi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Aktivite kaydedilirken hata oluştu");
            return BadRequest(new { message = "Aktivite kaydedilemedi" });
        }
    }

    [HttpPost("note")]
    public IActionResult AddNote([FromForm] AddNoteRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Description))
                return BadRequest(new { message = "Açıklama alanı zorunludur" });

            // TODO: Get user ID from JWT token
            // TODO: Save note and image
            return Ok(new { message = "Not başarıyla eklendi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Not eklenirken hata oluştu");
            return BadRequest(new { message = "Not eklenemedi" });
        }
    }

    [HttpGet("notes")]
    public IActionResult GetNotes()
    {
        try
        {
            // TODO: Get user ID from JWT token
            // TODO: Get user's notes
            return Ok(new { message = "Notlar başarıyla getirildi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Notlar getirilirken hata oluştu");
            return BadRequest(new { message = "Notlar getirilemedi" });
        }
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