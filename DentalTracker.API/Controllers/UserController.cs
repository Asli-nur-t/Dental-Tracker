using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DentalTracker.API.Data;
using DentalTracker.API.Models;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DentalTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<UserController> _logger;
    private readonly IConfiguration _configuration;

    public UserController(ApplicationDbContext context, ILogger<UserController> logger, IConfiguration configuration)
    {
        _context = context;
        _logger = logger;
        _configuration = configuration;
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
            _logger.LogError(ex, "Kayıt sırasında hata oluştu: {Message}", ex.Message);
            return StatusCode(500, new { 
                message = "Kayıt işlemi sırasında bir hata oluştu",
                error = ex.Message 
            });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            _logger.LogInformation("Login isteği alındı: {Email}", request.Email); // Debug için

            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Email ve parola alanları zorunludur" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null)
            {
                return BadRequest(new { message = "Email veya parola hatalı" });
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return BadRequest(new { message = "Email veya parola hatalı" });
            }

            var token = GenerateJwtToken(user);
            _logger.LogInformation("Login başarılı: {Email}", request.Email); // Debug için

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
            _logger.LogError(ex, "Login sırasında hata oluştu: {Message}", ex.Message);
            return StatusCode(500, new { 
                message = "Giriş işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
                error = ex.Message 
            });
        }
    }

    private string GenerateJwtToken(User user)
    {
        var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key is not configured");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.GivenName, user.FirstName),
            new Claim(ClaimTypes.Surname, user.LastName)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:DurationInMinutes"])),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest request)
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null)
                return BadRequest(new { message = "Bu email adresi ile kayıtlı kullanıcı bulunamadı" });

            return Ok(new { message = "Email doğrulandı" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Email doğrulama sırasında hata oluştu");
            return BadRequest(new { message = "Email doğrulama işlemi başarısız" });
        }
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null)
                return BadRequest(new { message = "Kullanıcı bulunamadı" });

            // Parola kriterleri kontrolü
            if (!IsValidPassword(request.NewPassword))
                return BadRequest(new { message = "Parola en az 8 karakter uzunluğunda olmalı, büyük-küçük harf ve rakam içermelidir" });

            // Parola eşleşme kontrolü
            if (request.NewPassword != request.ConfirmPassword)
                return BadRequest(new { message = "Parolalar eşleşmiyor" });

            // Parolayı şifrele ve güncelle
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // TODO: Parola değişikliği hakkında email gönder

            return Ok(new { message = "Parolanız başarıyla güncellendi" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Parola sıfırlama sırasında hata oluştu");
            return BadRequest(new { message = "Parola sıfırlama işlemi başarısız" });
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

public class VerifyEmailRequest
{
    public required string Email { get; set; }
}

public class ResetPasswordRequest
{
    public required string Email { get; set; }
    public required string NewPassword { get; set; }
    public required string ConfirmPassword { get; set; }
}

public class UpdateProfileRequest
{
    public required string Email { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public DateTime BirthDate { get; set; }
}

public class ChangePasswordRequest
{
    public required string CurrentPassword { get; set; }
    public required string NewPassword { get; set; }
    public required string ConfirmPassword { get; set; }
} 