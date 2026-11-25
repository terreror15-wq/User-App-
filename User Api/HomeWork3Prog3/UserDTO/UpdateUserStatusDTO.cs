using System.Text.Json.Serialization;

namespace HomeWork3Prog3.UserDTO;

public class UpdateUserStatusDTO
{
    [JsonRequired]
    public bool IsActive { get; set; }
}
