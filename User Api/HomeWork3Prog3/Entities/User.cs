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


        public User(){ 
        }

        public User(string name, string lastname, string email, string address, string phonenumber, bool isactive)
        {
            if (string.IsNullOrEmpty(name))
            {
                throw new ArgumentException("Name can't be null or empty.", nameof(name));
            }
            Name = name;
            if (string.IsNullOrEmpty(lastname))
            {
                throw new ArgumentException("LastName can't be null or empty.", nameof(lastname));
            }
            LastName = lastname;
            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentException("Email can't be null or empty.", nameof(email));
            }
            Email = email;
            if (string.IsNullOrEmpty(address))
            {
                throw new ArgumentException("Address can't be null or empty.", nameof(address));
            }
            Address = address;
            if (string.IsNullOrEmpty(phonenumber))
            {
                throw new ArgumentException("PhoneNumber can't be null or empty.", nameof(phonenumber));
            }
            PhoneNumber = phonenumber;

            IsActive = isactive;


        }
        public void Active()
        {
            IsActive = true;
        }

        public void Deactive()
        {
            IsActive = false;
        }



       public void UpdateName(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                throw new ArgumentException("Name can't be null or empty.", nameof(name));
            }
            Name = name;
        }
        public void UpdateLastName(string lastname)
        {
            if (string.IsNullOrEmpty(lastname))
            {
                throw new ArgumentException("LastName can't be null or empty.", nameof(lastname));
            }
            LastName = lastname;
        }
        public void UpdateEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentException("Email can't be null or empty.", nameof(email));
            }
            Email = email;
        }
        public void UpdateAddress(string address)
        {
            if (string.IsNullOrEmpty(address))
            {
                throw new ArgumentException("Address can't be null or empty.", nameof(address));
            }
            Address = address;
        }
        public void UpdatePhoneNumber(string phonenumber)
        {
            if (string.IsNullOrEmpty(phonenumber))
            {
                throw new ArgumentException("PhoneNumber can't be null or empty.", nameof(phonenumber));
            }
            PhoneNumber = phonenumber;
            
            
        }
        

        
    }
}
