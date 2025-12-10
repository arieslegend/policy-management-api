using System.ComponentModel.DataAnnotations;

namespace PolicyManagement.API.DTOs.Clients
{
    public class ClientResponse
    {
        public int Id { get; set; }
        public string IdentificationNumber { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateClientRequest
    {
        [Required(ErrorMessage = "El número de identificación es requerido")]
        [StringLength(10, MinimumLength = 10, ErrorMessage = "El número de identificación debe tener 10 dígitos")]
        [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "El número de identificación debe contener solo dígitos")]
        public string IdentificationNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "El nombre completo es requerido")]
        [StringLength(100, ErrorMessage = "El nombre no puede exceder los 100 caracteres")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", ErrorMessage = "El nombre no debe contener números ni caracteres especiales")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "El correo electrónico es requerido")]
        [EmailAddress(ErrorMessage = "El formato del correo electrónico no es válido")]
        [StringLength(100, ErrorMessage = "El correo electrónico no puede exceder los 100 caracteres")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "El teléfono es requerido")]
        [Phone(ErrorMessage = "El formato del teléfono no es válido")]
        [StringLength(20, ErrorMessage = "El teléfono no puede exceder los 20 caracteres")]
        public string Phone { get; set; } = string.Empty;
    }

    public class UpdateClientRequest
    {
        [Required(ErrorMessage = "El número de identificación es requerido")]
        [StringLength(10, MinimumLength = 10, ErrorMessage = "El número de identificación debe tener 10 dígitos")]
        [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "El número de identificación debe contener solo dígitos")]
        public string IdentificationNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "El nombre completo es requerido")]
        [StringLength(100, ErrorMessage = "El nombre no puede exceder los 100 caracteres")]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$", 
            ErrorMessage = "El nombre no debe contener números ni caracteres especiales")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "El correo electrónico es requerido")]
        [EmailAddress(ErrorMessage = "El formato del correo electrónico no es válido")]
        [StringLength(100, ErrorMessage = "El correo electrónico no puede exceder los 100 caracteres")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "El teléfono es requerido")]
        [Phone(ErrorMessage = "El formato del teléfono no es válido")]
        [StringLength(20, ErrorMessage = "El teléfono no puede exceder los 20 caracteres")]
        public string Phone { get; set; } = string.Empty;
    }
}
