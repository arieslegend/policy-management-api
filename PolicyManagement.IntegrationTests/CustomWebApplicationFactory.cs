using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using PolicyManagement.API;
using PolicyManagement.Infrastructure.Persistence;

namespace PolicyManagement.IntegrationTests
{
    public class CustomWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                // Remove all EF Core related services
                var dbContextDescriptors = services.Where(
                    d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>) ||
                         d.ServiceType == typeof(ApplicationDbContext) ||
                         d.ServiceType.Namespace?.StartsWith("Microsoft.EntityFrameworkCore") == true).ToList();

                foreach (var descriptor in dbContextDescriptors)
                {
                    services.Remove(descriptor);
                }

                // Add InMemory database for testing
                services.AddDbContext<ApplicationDbContext>(options =>
                {
                    options.UseInMemoryDatabase($"InMemoryDbForTesting_{Guid.NewGuid()}");
                    options.EnableSensitiveDataLogging(); // Helpful for debugging
                    options.EnableDetailedErrors();
                });

                // Create the database
                var sp = services.BuildServiceProvider();
                using var scope = sp.CreateScope();
                var scopedServices = scope.ServiceProvider;
                var db = scopedServices.GetRequiredService<ApplicationDbContext>();
                var logger = scopedServices.GetRequiredService<ILogger<CustomWebApplicationFactory>>();

                try
                {
                    db.Database.EnsureCreated();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred seeding the database. Error: {Message}", ex.Message);
                }
            });

            // Override appsettings for testing if needed
            builder.ConfigureAppConfiguration((context, config) =>
            {
                // You can add test-specific configuration here
            });
        }
    }
}
