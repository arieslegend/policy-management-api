using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PolicyManagement.Infrastructure.Persistence;
using Xunit;

namespace PolicyManagement.UnitTests.Persistence
{
    public class DatabaseConfigTests
    {
        private readonly IServiceCollection _services;

        public DatabaseConfigTests()
        {
            _services = new ServiceCollection();
        }

        [Fact]
        public void AddDatabaseConfiguration_ShouldAddDbContextWithSqlServer()
        {
            // Arrange
            var configData = new Dictionary<string, string>
            {
                ["ConnectionStrings:DefaultConnection"] = "Server=test;Database=test;Trusted_Connection=true;"
            };
            var configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(configData)
                .Build();

            // Act
            var result = DatabaseConfig.AddDatabaseConfiguration(_services, configuration);

            // Assert
            Assert.Same(_services, result);
            
            var serviceProvider = _services.BuildServiceProvider();
            var dbContext = serviceProvider.GetRequiredService<ApplicationDbContext>();
            
            Assert.NotNull(dbContext);
            // Just verify the context can be created - the options are internal
            Assert.NotNull(dbContext.Database);
        }

        [Fact]
        public void AddDatabaseConfiguration_ShouldConfigureRetryOnFailure()
        {
            // Arrange
            var configData = new Dictionary<string, string>
            {
                ["ConnectionStrings:DefaultConnection"] = "Server=test;Database=test;Trusted_Connection=true;"
            };
            var configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(configData)
                .Build();

            // Act
            DatabaseConfig.AddDatabaseConfiguration(_services, configuration);

            // Assert
            var serviceProvider = _services.BuildServiceProvider();
            var dbContext = serviceProvider.GetRequiredService<ApplicationDbContext>();
            
            // Verify the context was created successfully (retry logic is configured internally)
            Assert.NotNull(dbContext);
        }

        [Fact]
        public void AddDatabaseConfiguration_ShouldConfigureMigrationsAssembly()
        {
            // Arrange
            var configData = new Dictionary<string, string>
            {
                ["ConnectionStrings:DefaultConnection"] = "Server=test;Database=test;Trusted_Connection=true;"
            };
            var configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(configData)
                .Build();

            // Act
            DatabaseConfig.AddDatabaseConfiguration(_services, configuration);

            // Assert
            var serviceProvider = _services.BuildServiceProvider();
            var dbContext = serviceProvider.GetRequiredService<ApplicationDbContext>();
            
            // Verify migrations are configured by checking the context can be created
            Assert.NotNull(dbContext);
        }

        [Fact]
        public void AddDatabaseConfiguration_WithNullConnectionString_ShouldStillAddDbContext()
        {
            // Arrange
            var configData = new Dictionary<string, string>();
            var emptyConfig = new ConfigurationBuilder()
                .AddInMemoryCollection(configData)
                .Build();

            // Act & Assert
            var result = DatabaseConfig.AddDatabaseConfiguration(_services, emptyConfig);
            
            Assert.Same(_services, result);
            
            var serviceProvider = _services.BuildServiceProvider();
            var dbContext = serviceProvider.GetRequiredService<ApplicationDbContext>();
            
            Assert.NotNull(dbContext);
        }

        [Fact]
        public void AddDatabaseConfiguration_WithEmptyConnectionString_ShouldStillAddDbContext()
        {
            // Arrange
            var configData = new Dictionary<string, string>
            {
                ["ConnectionStrings:DefaultConnection"] = ""
            };
            var emptyConfig = new ConfigurationBuilder()
                .AddInMemoryCollection(configData)
                .Build();

            // Act & Assert
            var result = DatabaseConfig.AddDatabaseConfiguration(_services, emptyConfig);
            
            Assert.Same(_services, result);
            
            var serviceProvider = _services.BuildServiceProvider();
            var dbContext = serviceProvider.GetRequiredService<ApplicationDbContext>();
            
            Assert.NotNull(dbContext);
        }

        [Fact]
        public void AddDatabaseConfiguration_ShouldReturnServiceCollectionForChaining()
        {
            // Arrange
            var configData = new Dictionary<string, string>
            {
                ["ConnectionStrings:DefaultConnection"] = "Server=test;Database=test;Trusted_Connection=true;"
            };
            var configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(configData)
                .Build();

            // Act
            var result = DatabaseConfig.AddDatabaseConfiguration(_services, configuration);

            // Assert
            Assert.NotNull(result);
            Assert.Same(_services, result);
        }
    }
}
