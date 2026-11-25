using HomeWork3Prog3.Interfaces;
using HomeWork3Prog3.UserDTO;
using Microsoft.AspNetCore.Mvc;

namespace HomeWork3Prog3.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController(IUserService service) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IEnumerable<ReadUserDTO>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ReadUserDTO>>> GetAllUser() => Ok(await service.GetAllUsers());

    [HttpGet("{id}")]
    [ProducesResponseType<ReadUserDTO>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ReadUserDTO>> GetUserById(int id) => Ok(await service.GetUserById(id));

    [HttpPost]
    [ProducesResponseType<ReadUserDTO>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ReadUserDTO>> CreateUser(CreateUserDTO user)
    {
        var created = await service.CreateUser(user);
        return CreatedAtAction(nameof(GetUserById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    [ProducesResponseType<ReadUserDTO>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ReadUserDTO>> UpdateUser(int id, CreateUserDTO user) =>
        Ok(await service.UpdateUser(id, user));

    [HttpPatch("{id}/status")]
    [ProducesResponseType<ReadUserDTO>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ReadUserDTO>> UpdateStatus(int id, UpdateUserStatusDTO status) =>
        Ok(await service.UpdateStatus(id, status.IsActive));

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteUser(int id)
    {
        await service.DeleteUser(id);
        return NoContent();
    }
}
