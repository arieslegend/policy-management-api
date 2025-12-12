using System.ComponentModel.DataAnnotations;
using PolicyManagement.Core.Enums;

namespace PolicyManagement.API.DTOs.Policies
{
    public class PolicyResponse
    {
        public int Id { get; set; }
        public PolicyType Type { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal InsuredAmount { get; set; }
        public PolicyStatus Status { get; set; }
        public int ClientId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreatePolicyRequest
    {
        [Required(ErrorMessage = "El tipo de póliza es requerido")]
        public PolicyType Type { get; set; }

        [Required(ErrorMessage = "La fecha de inicio es requerida")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "La fecha de expiración es requerida")]
        public DateTime EndDate { get; set; }

        [Required(ErrorMessage = "El monto asegurado es requerido")]
        [Range(0.01, double.MaxValue, ErrorMessage = "El monto asegurado debe ser mayor a cero")]
        public decimal InsuredAmount { get; set; }

        [Required(ErrorMessage = "El ID del cliente es requerido")]
        public int ClientId { get; set; }
    }

    public class UpdatePolicyRequest
    {
        [Required(ErrorMessage = "El tipo de póliza es requerido")]
        public PolicyType Type { get; set; }

        [Required(ErrorMessage = "La fecha de inicio es requerida")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "La fecha de expiración es requerida")]
        public DateTime EndDate { get; set; }

        [Required(ErrorMessage = "El monto asegurado es requerido")]
        [Range(0.01, double.MaxValue, ErrorMessage = "El monto asegurado debe ser mayor a cero")]
        public decimal InsuredAmount { get; set; }

        [Required(ErrorMessage = "El ID del cliente es requerido")]
        public int ClientId { get; set; }

        [Required(ErrorMessage = "El estado de la póliza es requerido")]
        public PolicyStatus Status { get; set; }
    }

    public class PolicyFilterRequest
    {
        public PolicyType? Type { get; set; }
        public PolicyStatus? Status { get; set; }
        public DateTime? StartDateFrom { get; set; }
        public DateTime? StartDateTo { get; set; }
        public DateTime? EndDateFrom { get; set; }
        public DateTime? EndDateTo { get; set; }
    }
}
