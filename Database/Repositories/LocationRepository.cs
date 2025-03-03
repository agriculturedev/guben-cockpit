using System.Globalization;
using Domain.Locations;
using Domain.Locations.repository;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Shared.Database;

namespace Database.Repositories;

public class LocationRepository
  : EntityFrameworkRepository<Location, Guid, GubenDbContext>, ILocationRepository
{
  public LocationRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
  }

  public Task<Location?> FindByName(string name, CultureInfo cultureInfo)
  {
    var languageKey = cultureInfo.TwoLetterISOLanguageName;

    var sql = $@"
      SELECT * FROM ""Guben"".""Location""
      WHERE jsonb_path_query_first(
          ""Location"".""Translations"",
          '$.""{languageKey}""?(@.Name == $name)',
          jsonb_build_object('name', :name)
      ) IS NOT NULL";

    return Set.FromSqlRaw(sql,
      new NpgsqlParameter("name", name)
    ).FirstOrDefaultAsync();
  }

  public Task<Location?> FindByNameAndAddress(string name, string city, string street, string zipcode, CultureInfo cultureInfo)
  {
    // Get the language key from the culture info, using its two-letter ISO code
    string languageKey = cultureInfo.TwoLetterISOLanguageName;

    var sql = $@"
        SELECT * FROM ""Guben"".""Location""
        WHERE jsonb_path_query_first(
                ""Location"".""Translations"",
                '$.""{languageKey}""?(@.Name == $name)',
                jsonb_build_object('name', :name)
            ) IS NOT NULL";

    return Set
      .FromSqlRaw(sql,
        new NpgsqlParameter("name", name),
        new NpgsqlParameter("city", city),
        new NpgsqlParameter("street", street),
        new NpgsqlParameter("zipcode", zipcode)
      )
      .Where(l => l.City == city && l.Street == street && l.Zip == zipcode)
      .FirstOrDefaultAsync();
  }
}
