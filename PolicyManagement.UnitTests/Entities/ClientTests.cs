using FluentAssertions;
using PolicyManagement.Core.Entities;
using Xunit;

namespace PolicyManagement.UnitTests.Entities
{
    public class ClientTests
    {
        [Fact]
        public void Client_Should_Be_Created_With_Valid_Data()
        {
            // Arrange
            var idNumber = "1234567890";
            var fullName = "Juan Pérez";
            var email = "juan.perez@example.com";
            var phone = "+52 555 123 4567";

            // Act
            var client = new Client
            {
                IdentificationNumber = idNumber,
                FullName = fullName,
                Email = email,
                Phone = phone
            };

            // Assert
            client.IdentificationNumber.Should().Be(idNumber);
            client.FullName.Should().Be(fullName);
            client.Email.Should().Be(email);
            client.Phone.Should().Be(phone);
            client.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
            client.Policies.Should().BeEmpty();
        }

        [Theory]
        [InlineData("123456789")] // 9 dígitos
        [InlineData("12345678901")] // 11 dígitos
        [InlineData("abcd123456")] // contiene letras
        public void Client_Should_Validate_IdentificationNumber_Length(string invalidId)
        {
            // Arrange
            var client = new Client
            {
                IdentificationNumber = invalidId,
                FullName = "Juan Pérez",
                Email = "juan.perez@example.com",
                Phone = "+52 555 123 4567"
            };

            // Act
            var validationResults = ValidateModel(client);

            // Assert
            validationResults.Should().Contain(v => 
                v.MemberNames.Contains(nameof(Client.IdentificationNumber)) &&
                v.ErrorMessage!.Contains("El número de identificación debe tener 10 dígitos"));
        }

        [Theory]
        [InlineData("juan123")] // contiene números
        [InlineData("Juan@Perez")] // contiene caracteres especiales
        public void Client_Should_Validate_FullName(string invalidName)
        {
            // Arrange
            var client = new Client
            {
                IdentificationNumber = "1234567890",
                FullName = invalidName,
                Email = "juan.perez@example.com",
                Phone = "+52 555 123 4567"
            };

            // Act
            var validationResults = ValidateModel(client);

            // Assert
            validationResults.Should().Contain(v => 
                v.MemberNames.Contains(nameof(Client.FullName)) &&
                v.ErrorMessage!.Contains("El nombre no debe contener números ni caracteres especiales"));
        }

        [Theory]
        [InlineData("invalid-email")]
        [InlineData("juan@")]
        [InlineData("@example.com")]
        public void Client_Should_Validate_Email(string invalidEmail)
        {
            // Arrange
            var client = new Client
            {
                IdentificationNumber = "1234567890",
                FullName = "Juan Pérez",
                Email = invalidEmail,
                Phone = "+52 555 123 4567"
            };

            // Act
            var validationResults = ValidateModel(client);

            // Assert
            validationResults.Should().Contain(v => 
                v.MemberNames.Contains(nameof(Client.Email)) &&
                v.ErrorMessage!.Contains("not a valid e-mail address"));
        }

        [Fact]
        public void Client_Id_Property_Should_Be_Accessible()
        {
            // Arrange
            var client = new Client
            {
                IdentificationNumber = "1234567890",
                FullName = "Juan Pérez",
                Email = "juan.perez@example.com",
                Phone = "+52 555 123 4567"
            };

            // Act & Assert
            // The Id property should be accessible (covered by this test)
            var id = client.Id;
            
            // Initially Id should be 0 (default for int)
            id.Should().Be(0);
        }

        [Fact]
        public void Client_UpdatedAt_Property_Should_Be_Accessible()
        {
            // Arrange
            var client = new Client
            {
                IdentificationNumber = "1234567890",
                FullName = "Juan Pérez",
                Email = "juan.perez@example.com",
                Phone = "+52 555 123 4567"
            };

            // Act & Assert
            // The UpdatedAt property should be accessible (covered by this test)
            var updatedAt = client.UpdatedAt;
            
            // Initially UpdatedAt should be null (default for DateTime?)
            updatedAt.Should().BeNull();
        }

        [Fact]
        public void Client_CreatedAt_Property_Should_Be_Accessible()
        {
            // Arrange
            var client = new Client
            {
                IdentificationNumber = "1234567890",
                FullName = "Juan Pérez",
                Email = "juan.perez@example.com",
                Phone = "+52 555 123 4567"
            };

            // Act & Assert
            // The CreatedAt property should be accessible (covered by this test)
            var createdAt = client.CreatedAt;
            
            // CreatedAt should be set automatically
            createdAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
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
