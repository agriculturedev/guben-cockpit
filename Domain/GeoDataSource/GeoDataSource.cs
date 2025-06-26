using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.GeoDataSource;

public class GeoDataSource : Entity<Guid>
{
  public string Path { get; set; }
  public bool IsValidated { get; set; }
  public bool IsPublic { get; set; }

  public GeoDataSourceType Type { get; set; }

  private GeoDataSource(string path, bool isValidated, bool isPublic, GeoDataSourceType type)
  {
    Path = path;
    IsValidated = isValidated;
    IsPublic = isPublic;
    Type = type;
  }

  public static Result<GeoDataSource> Create(string path, bool isValidated, bool isPublic, GeoDataSourceType type)
  {
    return new GeoDataSource(path, isValidated, isPublic, type);
  }

  public void Validate()
  {
    IsValidated = true;
  }

  public void Invalidate()
  {
    IsValidated = false;
  }
}
