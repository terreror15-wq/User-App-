using HomeWork3Prog3.Core;
using Microsoft.Extensions.Primitives;
using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;

namespace HomeWork3Prog3.Entities
{
    public class User : BaseEntity
    {
        public string Name { get; private set; } = String.Empty;
        public string LastName { get; private set; } = String.Empty;
        public String Email { get; private set; } = String.Empty;
        public string Address { get; private set; } = String.Empty;
        public string PhoneNumber { get; private set; } = String.Empty;
        public bool IsActive { get; private set; } = true;

        

        
    }
}
