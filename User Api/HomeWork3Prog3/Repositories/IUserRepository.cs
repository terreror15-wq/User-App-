using HomeWork3Prog3.Entities;

namespace HomeWork3Prog3.Interfaces.Repositories;

public interface IUserRepository
{
    Task CreateUser(User user);
    Task<IEnumerable<User>> GetAllUsers();
    Task<User> GetUserById(int id);
    Task SaveChanges();
    Task DeleteUser(int id);
}
