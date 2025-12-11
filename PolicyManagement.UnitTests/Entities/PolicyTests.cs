using FluentAssertions;
using PolicyManagement.Core.Entities;
using PolicyManagement.Core.Enums;
using Xunit;

namespace PolicyManagement.UnitTests.Entities
{
    public class PolicyTests
    {
        [Fact]
        public void Policy_Should_Be_Created_With_Valid_Data()
        {
            // Arrange
            var startDate = DateTime.UtcNow;
            var endDate = startDate.AddYears(1);
            var insuredAmount = 500000m;

            // Act
            var policy = new Policy
            {
                Type = PolicyType.Vida,
                StartDate = startDate,
                EndDate = endDate,
                InsuredAmount = insuredAmount,
                Status = PolicyStatus.Activa,
                ClientId = 1
            };

            // Assert
            policy.Type.Should().Be(PolicyType.Vida);
            policy.StartDate.Should().Be(startDate);
            policy.EndDate.Should().Be(endDate);
            policy.InsuredAmount.Should().Be(insuredAmount);
            policy.Status.Should().Be(PolicyStatus.Activa);
            policy.ClientId.Should().Be(1);
            policy.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        }

        [Theory]
        [InlineData(0)] // cero
        [InlineData(-1)] // negativo
        [InlineData(-100.5)] // negativo con decimales
        public void Policy_Should_Validate_InsuredAmount_Greater_Than_Zero(decimal invalidAmount)
        {
            // Arrange
            var policy = new Policy
            {
                Type = PolicyType.Vida,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddYears(1),
                InsuredAmount = invalidAmount,
                Status = PolicyStatus.Activa,
                ClientId = 1
            };

            // Act
            var validationResults = ValidateModel(policy);

            // Assert
            validationResults.Should().Contain(v =>
                v.MemberNames.Contains(nameof(Policy.InsuredAmount)) &&
                v.ErrorMessage!.Contains("El monto asegurado debe ser mayor a cero"));
        }

        [Fact]
        public void Policy_Should_Have_Default_Status_Active()
        {
            // Arrange & Act
            var policy = new Policy();

            // Assert
            policy.Status.Should().Be(PolicyStatus.Activa);
        }

        [Fact]
        public void Policy_Should_Allow_Different_Types()
        {
            // Arrange & Act
            var vidaPolicy = new Policy { Type = PolicyType.Vida };
            var autoPolicy = new Policy { Type = PolicyType.Automovil };
            var saludPolicy = new Policy { Type = PolicyType.Salud };
            var hogarPolicy = new Policy { Type = PolicyType.Hogar };

            // Assert
            vidaPolicy.Type.Should().Be(PolicyType.Vida);
            autoPolicy.Type.Should().Be(PolicyType.Automovil);
            saludPolicy.Type.Should().Be(PolicyType.Salud);
            hogarPolicy.Type.Should().Be(PolicyType.Hogar);
        }

        [Fact]
        public void Policy_Should_Allow_Status_Changes()
        {
            // Arrange
            var policy = new Policy { Status = PolicyStatus.Activa };

            // Act
            policy.Status = PolicyStatus.Cancelada;

            // Assert
            policy.Status.Should().Be(PolicyStatus.Cancelada);
        }

        [Fact]
        public void Policy_Id_Property_Should_Be_Accessible()
        {
            // Arrange
            var policy = new Policy
            {
                Type = PolicyType.Vida,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddYears(1),
                InsuredAmount = 500000m,
                Status = PolicyStatus.Activa,
                ClientId = 1
            };

            // Act & Assert
            // The Id property should be accessible (covered by this test)
            var id = policy.Id;
            
            // Initially Id should be 0 (default for int)
            id.Should().Be(0);
        }

        [Fact]
        public void Policy_UpdatedAt_Property_Should_Be_Accessible()
        {
            // Arrange
            var policy = new Policy
            {
                Type = PolicyType.Vida,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddYears(1),
                InsuredAmount = 500000m,
                Status = PolicyStatus.Activa,
                ClientId = 1
            };

            // Act & Assert
            // The UpdatedAt property should be accessible (covered by this test)
            var updatedAt = policy.UpdatedAt;
            
            // Initially UpdatedAt should be null (default for DateTime?)
            updatedAt.Should().BeNull();
        }

        [Fact]
        public void Policy_CreatedAt_Property_Should_Be_Accessible()
        {
            // Arrange
            var policy = new Policy
            {
                Type = PolicyType.Vida,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddYears(1),
                InsuredAmount = 500000m,
                Status = PolicyStatus.Activa,
                ClientId = 1
            };

            // Act & Assert
            // The CreatedAt property should be accessible (covered by this test)
            var createdAt = policy.CreatedAt;
            
            // CreatedAt should be set automatically
            createdAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        }

        [Fact]
        public void Policy_Client_Property_Should_Be_Accessible()
        {
            // Arrange
            var policy = new Policy
            {
                Type = PolicyType.Vida,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddYears(1),
                InsuredAmount = 500000m,
                Status = PolicyStatus.Activa,
                ClientId = 1
            };

            // Act & Assert
            // The Client property should be accessible (covered by this test)
            var client = policy.Client;
            
            // Initially Client should be null (default for navigation property)
            client.Should().BeNull();
        }

        private static List<System.ComponentModel.DataAnnotations.ValidationResult> ValidateModel(object model)
        {
            var validationResults = new List<System.ComponentModel.DataAnnotations.ValidationResult>();
            var context = new System.ComponentModel.DataAnnotations.ValidationContext(model);
            System.ComponentModel.DataAnnotations.Validator.TryValidateObject(model, context, validationResults, true);
            return validationResults;
        }
    }
}
