using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PolicyManagement.API.DTOs.Policies;
using PolicyManagement.Core.Entities;
using PolicyManagement.Core.Enums;
using PolicyManagement.Infrastructure.Persistence;

namespace PolicyManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PoliciesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<PoliciesController> _logger;

        public PoliciesController(ApplicationDbContext context, ILogger<PoliciesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PolicyResponse>>> GetPolicies(
            [FromQuery] PolicyFilterRequest filter)
        {
            var query = _context.Policies.AsQueryable();

            if (filter.Type.HasValue)
            {
                query = query.Where(p => p.Type == filter.Type.Value);
            }

            if (filter.Status.HasValue)
            {
                query = query.Where(p => p.Status == filter.Status.Value);
            }

            if (filter.StartDateFrom.HasValue)
            {
                query = query.Where(p => p.StartDate >= filter.StartDateFrom.Value);
            }

            if (filter.StartDateTo.HasValue)
            {
                query = query.Where(p => p.StartDate <= filter.StartDateTo.Value);
            }

            if (filter.EndDateFrom.HasValue)
            {
                query = query.Where(p => p.EndDate >= filter.EndDateFrom.Value);
            }

            if (filter.EndDateTo.HasValue)
            {
                query = query.Where(p => p.EndDate <= filter.EndDateTo.Value);
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

        [HttpGet("{id}")]
        public async Task<ActionResult<PolicyResponse>> GetPolicy(int id)
        {
            var policy = await _context.Policies
                .Where(p => p.Id == id)
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
                .FirstOrDefaultAsync();

            if (policy == null)
            {
                return NotFound();
            }

            return Ok(policy);
        }

        [HttpPost]
        public async Task<ActionResult<PolicyResponse>> CreatePolicy(CreatePolicyRequest request)
        {
            var client = await _context.Clients.FindAsync(request.ClientId);
            if (client == null)
            {
                ModelState.AddModelError(nameof(request.ClientId), 
                    "El cliente especificado no existe");
                return ValidationProblem(ModelState);
            }

            if (request.EndDate <= request.StartDate)
            {
                ModelState.AddModelError(nameof(request.EndDate), 
                    "La fecha de expiración debe ser posterior a la fecha de inicio");
                return ValidationProblem(ModelState);
            }

            var policy = new Policy
            {
                Type = request.Type,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                InsuredAmount = request.InsuredAmount,
                Status = PolicyStatus.Activa,
                ClientId = request.ClientId
            };

            _context.Policies.Add(policy);
            await _context.SaveChangesAsync();

            var response = new PolicyResponse
            {
                Id = policy.Id,
                Type = policy.Type,
                StartDate = policy.StartDate,
                EndDate = policy.EndDate,
                InsuredAmount = policy.InsuredAmount,
                Status = policy.Status,
                ClientId = policy.ClientId,
                CreatedAt = policy.CreatedAt
            };

            return CreatedAtAction(nameof(GetPolicy), new { id = policy.Id }, response);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdatePolicyStatus(int id, UpdatePolicyRequest request)
        {
            var policy = await _context.Policies.FindAsync(id);
            if (policy == null)
            {
                return NotFound();
            }

            policy.Status = request.Status;
            policy.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PolicyExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePolicy(int id)
        {
            var policy = await _context.Policies.FindAsync(id);
            if (policy == null)
            {
                return NotFound();
            }

            _context.Policies.Remove(policy);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PolicyExists(int id)
        {
            return _context.Policies.Any(e => e.Id == id);
        }
    }
}
