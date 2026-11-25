using HomeWork3Prog3.Core;
using HomeWork3Prog3.Data;
using HomeWork3Prog3.Entities;
using HomeWork3Prog3.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace HomeWork3Prog3.Repository;

public class UserRepository(UserDB db) : IUserRepository
{
    public async Task CreateUser(User user)
    {
        await db.Users.AddAsync(user);
        await SaveChanges();
    }

    public async Task DeleteUser(int id)
    {
        var user = await GetUserById(id);
        db.Users.Remove(user);
        await SaveChanges();
    }

    public async Task<IEnumerable<User>> GetAllUsers() => await db.Users.AsNoTracking().ToListAsync();

    public async Task<User> GetUserById(int id) =>
        await db.Users.FindAsync(id) ?? throw new NotFoundException($"User {id} was not found.");

    public async Task SaveChanges()
    {
        await db.SaveChangesAsync();
    }
}
