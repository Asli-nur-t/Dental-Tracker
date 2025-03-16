using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DentalTracker.API.Data;
using DentalTracker.API.Models;
using BCrypt.Net;

namespace DentalTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<UserController> _logger;

    public UserController(ApplicationDbContext context, ILogger<UserController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            // Email format kontrolü
            if (!IsValidEmail(request.Email))
                return BadRequest(new { message = "Geçersiz email formatı" });

            // Parola kriterleri kontrolü
            if (!IsValidPassword(request.Password))
                return BadRequest(new { message = "Parola en az 8 karakter uzunluğunda olmalı, büyük-küçük harf ve rakam içermelidir" });

            // Parola eşleşme kontrolü
            if (request.Password != request.ConfirmPassword)
                return BadRequest(new { message = "Parolalar eşleşmiyor" });

            // Email uniqueness check
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return BadRequest(new { message = "Bu email adresi zaten kullanımda" });

            // Create user
            var user = new User
            {
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                FirstName = request.FirstName,
                LastName = request.LastName,
                BirthDate = request.BirthDate.ToUniversalTime(),
                CreatedAt = DateTime.UtcNow
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            // TODO: Send welcome email

            return Ok(new { message = "Kayıt başarılı" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Kayıt sırasında hata oluştu");
            return BadRequest(new { message = "Kayıt işlemi başarısız" });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                return BadRequest(new { message = "Email ve parola alanları zorunludur" });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null)
                return BadRequest(new { message = "Kullanıcı bulunamadı" });

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return BadRequest(new { message = "Parola hatalı" });

            // TODO: Generate proper JWT token
            var token = "test_token";

            return Ok(new { 
                message = "Giriş başarılı", 
                token = token,
                user = new {
                    id = user.Id,
                    email = user.Email,
                    firstName = user.FirstName,
                    lastName = user.LastName
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Giriş sırasında hata oluştu");
            return BadRequest(new { message = "Giriş başarısız" });
        }
    }

    [HttpPost("reset-password")]
    public IActionResult ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Email))
                return BadRequest(new { message = "Email alanı zorunludur" });

            // TODO: Check if user exists
            // TODO: Generate reset token
            // TODO: Send reset email

            return Ok(new { message = "Parola sıfırlama talimatları email adresinize gönderildi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Parola sıfırlama sırasında hata oluştu");
            return BadRequest(new { message = "Parola sıfırlama başarısız" });
        }
    }

    [HttpGet("profile")]
    public IActionResult GetProfile()
    {
        try
        {
            // TODO: Get user ID from JWT token
            // TODO: Get user profile from database
            return Ok(new { message = "Profil bilgileri başarıyla getirildi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Profil bilgileri getirilirken hata oluştu");
            return BadRequest(new { message = "Profil bilgileri getirilemedi" });
        }
    }

    [HttpPut("profile")]
    public IActionResult UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        try
        {
            // Email format kontrolü
            if (!IsValidEmail(request.Email))
                return BadRequest(new { message = "Geçersiz email formatı" });

            // TODO: Get user ID from JWT token
            // TODO: Check if new email is already taken
            // TODO: Update user profile
            return Ok(new { message = "Profil başarıyla güncellendi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Profil güncellenirken hata oluştu");
            return BadRequest(new { message = "Profil güncellenemedi" });
        }
    }

    [HttpPost("change-password")]
    public IActionResult ChangePassword([FromBody] ChangePasswordRequest request)
    {
        try
        {
            if (!IsValidPassword(request.NewPassword))
                return BadRequest(new { message = "Yeni parola kriterlere uygun değil" });

            if (request.NewPassword != request.ConfirmPassword)
                return BadRequest(new { message = "Parolalar eşleşmiyor" });

            // TODO: Get user ID from JWT token
            // TODO: Verify current password
            // TODO: Update password
            return Ok(new { message = "Parola başarıyla güncellendi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Parola güncellenirken hata oluştu");
            return BadRequest(new { message = "Parola güncellenemedi" });
        }
    }

    private bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    private bool IsValidPassword(string password)
    {
        if (string.IsNullOrEmpty(password) || password.Length < 8)
            return false;

        bool hasUpperCase = password.Any(char.IsUpper);
        bool hasLowerCase = password.Any(char.IsLower);
        bool hasNumber = password.Any(char.IsDigit);

        return hasUpperCase && hasLowerCase && hasNumber;
    }
}

public class RegisterRequest
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string ConfirmPassword { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public DateTime BirthDate { get; set; }
}

public class LoginRequest
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class ResetPasswordRequest
{
    public string Email { get; set; }
}

public class UpdateProfileRequest
{
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime BirthDate { get; set; }
}

public class ChangePasswordRequest
{
    public string CurrentPassword { get; set; }
    public string NewPassword { get; set; }
    public string ConfirmPassword { get; set; }
} 