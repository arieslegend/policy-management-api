using System.ComponentModel.DataAnnotations;

namespace PolicyManagement.Core.Entities
{
    public class Client
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(10)]
        [RegularExpression("^[0-9]{10}$", ErrorMessage = "El número de identificación debe tener 10 dígitos")]
        public string IdentificationNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        [RegularExpression(@"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+", ErrorMessage = "El nombre no debe contener números ni caracteres especiales")]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Phone]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;

        // Relación uno a muchos con Policy
        public ICollection<Policy> Policies { get; set; } = new List<Policy>();

        // Auditoría
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
