using Domain.Category;

namespace Api.Controllers.Categories.Shared;

public struct CategoryResponse
{
  public required Guid Id { get; set; }
  public required string Name { get; set; }

  public static CategoryResponse Map(Category category)
  {
    return new CategoryResponse()
    {
      Id = category.Id,
      Name = category.Name
    };
  }
}
