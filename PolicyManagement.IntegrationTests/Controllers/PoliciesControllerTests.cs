using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PolicyManagement.API.DTOs.Policies;
using PolicyManagement.Core.Entities;
using PolicyManagement.Core.Enums;
using PolicyManagement.Infrastructure.Persistence;
using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace PolicyManagement.IntegrationTests.Controllers
{
    public class PoliciesControllerTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory _factory;

        public PoliciesControllerTests(CustomWebApplicationFactory factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetPolicies_WhenEmpty_ReturnsEmptyList()
        {
            // Act
            var response = await _client.GetAsync("/api/policies");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var policies = await response.Content.ReadFromJsonAsync<List<PolicyResponse>>();
            policies.Should().NotBeNull();
            policies.Should().BeEmpty();
        }

        [Fact]
        public async Task GetPolicy_WithInvalidId_ReturnsNotFound()
        {
            // Act
            var response = await _client.GetAsync("/api/policies/999");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task CreatePolicy_WithInvalidDates_ReturnsValidationError()
        {
            // Arrange
            var request = new CreatePolicyRequest
            {
                Type = PolicyType.Vida,
                StartDate = DateTime.Today.AddDays(10),
                EndDate = DateTime.Today, // End date before start date
                InsuredAmount = 500000,
                ClientId = 1
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/policies", request);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task CreatePolicy_WithNonExistentClient_ReturnsValidationError()
        {
            // Arrange
            var request = new CreatePolicyRequest
            {
                Type = PolicyType.Vida,
                StartDate = DateTime.Today,
                EndDate = DateTime.Today.AddYears(1),
                InsuredAmount = 500000,
                ClientId = 999 // Non-existent client
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/policies", request);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task UpdatePolicyStatus_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var request = new UpdatePolicyRequest
            {
                Status = PolicyStatus.Cancelada
            };

            // Act
            var response = await _client.PutAsJsonAsync("/api/policies/999/status", request);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task DeletePolicy_WithInvalidId_ReturnsNotFound()
        {
            // Act
            var response = await _client.DeleteAsync("/api/policies/999");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

    }
}
