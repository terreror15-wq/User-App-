using HomeWork3Prog3.Entities;
using HomeWork3Prog3.Interfaces;
using HomeWork3Prog3.Interfaces.Repositories;
using HomeWork3Prog3.UserDTO;

namespace HomeWork3Prog3.Service;

public class UserService(IUserRepository repo) : IUserService
{
    public async Task<ReadUserDTO> CreateUser(CreateUserDTO user)
    {
        var created = new User(user.Name, user.LastName, user.Email, user.Address, user.PhoneNumber, user.IsActive);
        await repo.CreateUser(created);
        return ToDto(created);
    }

    public Task DeleteUser(int id) => repo.DeleteUser(id);

    public async Task<IEnumerable<ReadUserDTO>> GetAllUsers() => (await repo.GetAllUsers()).Select(ToDto);

    public async Task<ReadUserDTO> GetUserById(int id) => ToDto(await repo.GetUserById(id));

    public async Task<ReadUserDTO> UpdateUser(int id, CreateUserDTO user)
    {
        var existing = await repo.GetUserById(id);
        existing.UpdateName(user.Name);
        existing.UpdateLastName(user.LastName);
        existing.UpdateEmail(user.Email);
        existing.UpdateAddress(user.Address);
        existing.UpdatePhoneNumber(user.PhoneNumber);
        SetStatus(existing, user.IsActive);
        await repo.SaveChanges();
        return ToDto(existing);
    }

    public async Task<ReadUserDTO> UpdateStatus(int id, bool isActive)
    {
        var user = await repo.GetUserById(id);
        SetStatus(user, isActive);
        await repo.SaveChanges();
        return ToDto(user);
    }

    private static void SetStatus(User user, bool isActive)
    {
        if (isActive)
        {
            user.Active();
        }
        else
        {
            user.Deactive();
        }
    }

    private static ReadUserDTO ToDto(User user) =>
        new(user.Name, user.LastName, user.Email, user.Address, user.PhoneNumber, user.IsActive, user.Id);
}
