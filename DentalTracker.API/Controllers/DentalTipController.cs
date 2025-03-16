using Microsoft.AspNetCore.Mvc;

namespace DentalTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DentalTipController : ControllerBase
{
    private readonly ILogger<DentalTipController> _logger;

    public DentalTipController(ILogger<DentalTipController> logger)
    {
        _logger = logger;
    }

    [HttpGet("random")]
    public IActionResult GetRandomTip()
    {
        try
        {
            // TODO: Get random active tip from database
            return Ok(new { message = "Öneri başarıyla getirildi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Öneri getirilirken hata oluştu");
            return BadRequest(new { message = "Öneri getirilemedi" });
        }
    }

    [HttpGet]
    public IActionResult GetAllTips()
    {
        try
        {
            // TODO: Get all active tips from database
            return Ok(new { message = "Öneriler başarıyla getirildi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Öneriler getirilirken hata oluştu");
            return BadRequest(new { message = "Öneriler getirilemedi" });
        }
    }
} 