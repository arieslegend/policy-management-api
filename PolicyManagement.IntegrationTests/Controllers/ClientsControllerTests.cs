using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PolicyManagement.Core.Entities;
using PolicyManagement.Infrastructure.Persistence;
using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace PolicyManagement.IntegrationTests.Controllers
{
    public class ClientsControllerTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory _factory;

        public ClientsControllerTests(CustomWebApplicationFactory factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetClients_WhenEmpty_ReturnsEmptyList()
        {
            // Act
            var response = await _client.GetAsync("/api/clients");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var clients = await response.Content.ReadFromJsonAsync<List<object>>();
            clients.Should().NotBeNull();
            clients.Should().BeEmpty();
        }

        [Fact]
        public async Task GetClient_WithInvalidId_ReturnsNotFound()
        {
            // Act
            var response = await _client.GetAsync("/api/clients/999");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

    }
}
