using Microsoft.EntityFrameworkCore;
using DentalTracker.API.Models;

namespace DentalTracker.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<DentalGoal> DentalGoals { get; set; }
        public DbSet<DentalActivity> DentalActivities { get; set; }
        public DbSet<DentalNote> DentalNotes { get; set; }
        public DbSet<DentalTip> DentalTips { get; set; }
    }
} 