namespace DentalTracker.API.Models
{
    public class DentalActivity
    {
        public Guid Id { get; set; }
        public DateTime ActivityDate { get; set; }
        public TimeSpan Duration { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid UserId { get; set; }
        public Guid GoalId { get; set; }

        public virtual User User { get; set; } = null!;
        public virtual DentalGoal Goal { get; set; } = null!;
    }
} 