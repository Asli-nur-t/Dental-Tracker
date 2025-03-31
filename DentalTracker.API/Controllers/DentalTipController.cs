using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DentalTracker.API.Data;
using DentalTracker.API.Models;
using Microsoft.AspNetCore.Authorization;

namespace DentalTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DentalTipController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DentalTipController> _logger;
    private readonly Random _random;

    public DentalTipController(ApplicationDbContext context, ILogger<DentalTipController> logger)
    {
        _context = context;
        _logger = logger;
        _random = new Random();
    }

    [HttpGet("random")]
    public async Task<IActionResult> GetRandomTip()
    {
        try
        {
            var activeTips = await _context.DentalTips
                .Where(t => t.IsActive)
                .ToListAsync();

            if (!activeTips.Any())
                return NotFound(new { message = "Aktif öneri bulunamadı" });

            var randomTip = activeTips[_random.Next(activeTips.Count)];
            return Ok(randomTip);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Öneri getirilirken hata oluştu");
            return BadRequest(new { message = "Öneri getirilemedi" });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAllTips()
    {
        try
        {
            var tips = await _context.DentalTips
                .Where(t => t.IsActive)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();

            return Ok(tips);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Öneriler getirilirken hata oluştu");
            return BadRequest(new { message = "Öneriler getirilemedi" });
        }
    }
} 