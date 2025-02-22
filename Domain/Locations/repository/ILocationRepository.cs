using System.Globalization;
using Shared.Domain;

namespace Domain.Locations.repository;

public interface ILocationRepository : IRepository<Location, Guid>
{
  Task<Location?> FindByName(string name, CultureInfo cultureInfo);
  Task<Location?> FindByNameAndAddress(string name, string? city, string? street, string? zipcode, CultureInfo cultureInfo);
}
