using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using PolicyManagement.Core.Entities;

namespace PolicyManagement.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(
                    "Server=(localdb)\\mssqllocaldb;Database=PolicyManagementDb;Trusted_Connection=True;MultipleActiveResultSets=true",
                    b => b.MigrationsAssembly("PolicyManagement.Infrastructure"));
            }
        }

        public DbSet<Client> Clients { get; set; } = null!;
        public DbSet<Policy> Policies { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de Client
            modelBuilder.Entity<Client>(entity =>
            {
                entity.HasIndex(e => e.IdentificationNumber).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.IdentificationNumber).HasMaxLength(10);
                entity.Property(e => e.FullName).HasMaxLength(100);
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.Phone).HasMaxLength(20);
            });

            // Configuración de Policy
            modelBuilder.Entity<Policy>(entity =>
            {
                entity.Property(e => e.InsuredAmount).HasColumnType("decimal(18,2)");
                
                entity.HasOne(p => p.Client)
                    .WithMany(c => c.Policies)
                    .HasForeignKey(p => p.ClientId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configuración de índices
            modelBuilder.Entity<Policy>()
                .HasIndex(p => p.Type);

            modelBuilder.Entity<Policy>()
                .HasIndex(p => p.StartDate);

            modelBuilder.Entity<Policy>()
                .HasIndex(p => p.EndDate);
        }
    }
}
