using HomeWork3Prog3.UserDTO;

namespace HomeWork3Prog3.Interfaces;

public interface IUserService
{
    Task<ReadUserDTO> CreateUser(CreateUserDTO user);
    Task<IEnumerable<ReadUserDTO>> GetAllUsers();
    Task<ReadUserDTO> GetUserById(int id);
    Task<ReadUserDTO> UpdateUser(int id, CreateUserDTO user);
    Task<ReadUserDTO> UpdateStatus(int id, bool isActive);
    Task DeleteUser(int id);
}
