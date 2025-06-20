using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.GeoDataSource;

public class GeoDataSource : Entity<Guid>
{
  public string Path { get; set; }
  public bool IsValidated { get; set; }
  public bool IsPublic { get; set; }

  private GeoDataSource(string path, bool isValidated, bool isPublic)
  {
    Path = path;
    IsValidated = isValidated;
    IsPublic = isPublic;
  }

  public static Result<GeoDataSource> Create(string path, bool isValidated, bool isPublic)
  {
    return new GeoDataSource(path, isValidated, isPublic);
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
