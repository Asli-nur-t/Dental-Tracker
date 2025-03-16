namespace DentalTracker.API.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<DentalGoal> Goals { get; set; } = new List<DentalGoal>();
        public virtual ICollection<DentalActivity> Activities { get; set; } = new List<DentalActivity>();
        public virtual ICollection<DentalNote> Notes { get; set; } = new List<DentalNote>();
    }
} 