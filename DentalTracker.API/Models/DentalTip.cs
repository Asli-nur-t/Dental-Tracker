namespace DentalTracker.API.Models
{
    public class DentalTip
    {
        public Guid Id { get; set; }
        public required string Content { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
} 