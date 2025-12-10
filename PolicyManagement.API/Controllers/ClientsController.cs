using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PolicyManagement.API.DTOs.Clients;
using PolicyManagement.Core.Entities;
using PolicyManagement.Infrastructure.Persistence;

namespace PolicyManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ClientsController> _logger;

        public ClientsController(ApplicationDbContext context, ILogger<ClientsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClientResponse>>> GetClients([FromQuery] string? search = null)
        {
            var query = _context.Clients.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim().ToLower();
                query = query.Where(c =>
                    c.IdentificationNumber.Contains(search) ||
                    c.FullName.ToLower().Contains(search) ||
                    c.Email.ToLower().Contains(search));
            }

            var clients = await query
                .OrderBy(c => c.FullName)
                .Select(c => new ClientResponse
                {
                    Id = c.Id,
                    IdentificationNumber = c.IdentificationNumber,
                    FullName = c.FullName,
                    Email = c.Email,
                    Phone = c.Phone,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync();

            return Ok(clients);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClientResponse>> GetClient(int id)
        {
            var client = await _context.Clients
                .Where(c => c.Id == id)
                .Select(c => new ClientResponse
                {
                    Id = c.Id,
                    IdentificationNumber = c.IdentificationNumber,
                    FullName = c.FullName,
                    Email = c.Email,
                    Phone = c.Phone,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (client == null)
            {
                return NotFound();
            }

            return Ok(client);
        }

        [HttpPost]
        public async Task<ActionResult<ClientResponse>> CreateClient(CreateClientRequest request)
        {
            if (await _context.Clients.AnyAsync(c => c.IdentificationNumber == request.IdentificationNumber))
            {
                ModelState.AddModelError(nameof(request.IdentificationNumber), "Ya existe un cliente con este número de identificación");
                return ValidationProblem(ModelState);
            }

            if (await _context.Clients.AnyAsync(c => c.Email == request.Email))
            {
                ModelState.AddModelError(nameof(request.Email), "Ya existe un cliente con este correo electrónico");
                return ValidationProblem(ModelState);
            }

            var client = new Client
            {
                IdentificationNumber = request.IdentificationNumber,
                FullName = request.FullName.Trim(),
                Email = request.Email.Trim().ToLower(),
                Phone = request.Phone.Trim()
            };

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            var response = new ClientResponse
            {
                Id = client.Id,
                IdentificationNumber = client.IdentificationNumber,
                FullName = client.FullName,
                Email = client.Email,
                Phone = client.Phone,
                CreatedAt = client.CreatedAt
            };

            return CreatedAtAction(nameof(GetClient), new { id = client.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClient(int id, UpdateClientRequest request)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }

            if (await _context.Clients.AnyAsync(c => c.Id != id && c.IdentificationNumber == request.IdentificationNumber))
            {
                ModelState.AddModelError(nameof(request.IdentificationNumber), 
                    "Ya existe un cliente con este número de identificación");
                return ValidationProblem(ModelState);
            }

            if (await _context.Clients.AnyAsync(c => c.Id != id && c.Email == request.Email))
            {
                ModelState.AddModelError(nameof(request.Email), 
                    "Ya existe un cliente con este correo electrónico");
                return ValidationProblem(ModelState);
            }

            client.IdentificationNumber = request.IdentificationNumber;
            client.FullName = request.FullName.Trim();
            client.Email = request.Email.Trim().ToLower();
            client.Phone = request.Phone.Trim();
            client.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }

            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClientExists(int id)
        {
            return _context.Clients.Any(e => e.Id == id);
        }
    }
}
