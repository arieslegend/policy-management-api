using System.ComponentModel.DataAnnotations;

namespace PolicyManagement.API.Models
{
    public class UpdateCustomerProfileRequest
    {
        [Phone(ErrorMessage = "El formato del teléfono no es válido")]
        [StringLength(20, ErrorMessage = "El teléfono no puede exceder los 20 caracteres")]
        public string? Phone { get; set; }
    }
}
