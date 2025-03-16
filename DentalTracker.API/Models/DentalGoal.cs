using DentalTracker.API.Models.Enums;

namespace DentalTracker.API.Models
{
    public class DentalGoal
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public GoalPeriod Period { get; set; }
        public GoalPriority Priority { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid UserId { get; set; }

        public virtual User User { get; set; } = null!;
        public virtual ICollection<DentalActivity> Activities { get; set; } = new List<DentalActivity>();
    }
} 