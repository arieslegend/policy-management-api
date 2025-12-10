using PolicyManagement.Core.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PolicyManagement.Core.Entities
{
    public class Policy
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public PolicyType Type { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        [Range(0.01, double.MaxValue, ErrorMessage = "El monto asegurado debe ser mayor a cero")]
        public decimal InsuredAmount { get; set; }

        [Required]
        public PolicyStatus Status { get; set; } = PolicyStatus.Activa;

        [Required]
        public bool IsActive { get; set; } = true;

        // Relación con Client
        public int ClientId { get; set; }
        public Client Client { get; set; } = null!;

        // Auditoría
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
