using Microsoft.AspNetCore.Mvc;

namespace DentalTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DentalGoalController : ControllerBase
{
    private readonly ILogger<DentalGoalController> _logger;

    public DentalGoalController(ILogger<DentalGoalController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetUserGoals()
    {
        try
        {
            // TODO: Get user ID from JWT token
            // TODO: Get user's goals from database
            return Ok(new { message = "Hedefler başarıyla getirildi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Hedefler getirilirken hata oluştu");
            return BadRequest(new { message = "Hedefler getirilemedi" });
        }
    }

    [HttpPost]
    public IActionResult CreateGoal([FromBody] CreateGoalRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Title))
                return BadRequest(new { message = "Başlık alanı zorunludur" });

            // TODO: Get user ID from JWT token
            // TODO: Save goal to database

            return Ok(new { message = "Hedef başarıyla oluşturuldu" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Hedef oluşturulurken hata oluştu");
            return BadRequest(new { message = "Hedef oluşturulamadı" });
        }
    }

    [HttpPut("{id}")]
    public IActionResult UpdateGoal(Guid id, [FromBody] UpdateGoalRequest request)
    {
        try
        {
            // TODO: Get user ID from JWT token
            // TODO: Check if goal belongs to user
            // TODO: Update goal in database

            return Ok(new { message = "Hedef başarıyla güncellendi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Hedef güncellenirken hata oluştu");
            return BadRequest(new { message = "Hedef güncellenemedi" });
        }
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteGoal(Guid id)
    {
        try
        {
            // TODO: Get user ID from JWT token
            // TODO: Check if goal belongs to user
            // TODO: Check if goal has activities
            // TODO: Delete goal from database

            return Ok(new { message = "Hedef başarıyla silindi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Hedef silinirken hata oluştu");
            return BadRequest(new { message = "Hedef silinemedi" });
        }
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