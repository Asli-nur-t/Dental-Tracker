namespace DentalTracker.API.Models
{
    public class DentalNote
    {
        public Guid Id { get; set; }
        public required string Description { get; set; }
        public string? ImagePath { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid UserId { get; set; }

        public virtual User User { get; set; } = null!;
    }
} 