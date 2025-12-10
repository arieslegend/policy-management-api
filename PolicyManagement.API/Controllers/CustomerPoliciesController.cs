using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PolicyManagement.API.DTOs.Policies;
using PolicyManagement.API.Models;
using PolicyManagement.Core.Entities;
using PolicyManagement.Core.Enums;
using PolicyManagement.Infrastructure.Persistence;

namespace PolicyManagement.API.Controllers
{
    [Route("api/customers/{customerId}")]
    [ApiController]
    public class CustomerPoliciesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CustomerPoliciesController> _logger;

        public CustomerPoliciesController(ApplicationDbContext context, ILogger<CustomerPoliciesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("policies")]
        public async Task<ActionResult<IEnumerable<PolicyResponse>>> GetCustomerPolicies(
            int customerId,
            [FromQuery] PolicyStatus? status = null)
        {
            var customerExists = await _context.Clients.AnyAsync(c => c.Id == customerId);
            if (!customerExists)
            {
                return NotFound("Cliente no encontrado");
            }

            var query = _context.Policies
                .Where(p => p.ClientId == customerId);

            if (status.HasValue)
            {
                query = query.Where(p => p.Status == status.Value);
            }

            var policies = await query
                .OrderBy(p => p.StartDate)
                .Select(p => new PolicyResponse
                {
                    Id = p.Id,
                    Type = p.Type,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    InsuredAmount = p.InsuredAmount,
                    Status = p.Status,
                    ClientId = p.ClientId,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                })
                .ToListAsync();

            return Ok(policies);
        }

        [HttpPost("policies/{policyId}/cancel")]
        public async Task<IActionResult> CancelPolicy(int customerId, int policyId)
        {
            var policy = await _context.Policies
                .FirstOrDefaultAsync(p => p.Id == policyId && p.ClientId == customerId);

            if (policy == null)
            {
                return NotFound("Póliza no encontrada o no pertenece al cliente especificado");
            }

            if (policy.Status == PolicyStatus.Cancelada)
            {
                return BadRequest("La póliza ya está cancelada");
            }

            policy.Status = PolicyStatus.Cancelada;
            policy.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PolicyExists(policyId))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(
            int customerId,
            [FromBody] UpdateCustomerProfileRequest request)
        {
            var customer = await _context.Clients.FindAsync(customerId);
            if (customer == null)
            {
                return NotFound("Cliente no encontrado");
            }

            var updated = false;

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                var normalizedEmail = request.Email.Trim();

                var emailInUse = await _context.Clients
                    .AnyAsync(c => c.Id != customerId && c.Email == normalizedEmail);

                if (emailInUse)
                {
                    return Conflict("El correo electrónico ya está en uso por otro cliente");
                }

                customer.Email = normalizedEmail;
                updated = true;
            }

            if (!string.IsNullOrWhiteSpace(request.Phone))
            {
                customer.Phone = request.Phone.Trim();
                updated = true;
            }

            if (updated)
            {
                customer.UpdatedAt = DateTime.UtcNow;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(customerId))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        private bool PolicyExists(int id)
        {
            return _context.Policies.Any(e => e.Id == id);
        }

        private bool CustomerExists(int id)
        {
            return _context.Clients.Any(e => e.Id == id);
        }
    }
}
