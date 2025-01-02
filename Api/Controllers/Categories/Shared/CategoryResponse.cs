using Api.Shared.Entity;
using Domain.Category;

namespace Api.Controllers.Categories.Shared;

public class CategoryResponse : EntityResponse<Guid>
{
  public string Name { get; set; }

  public static CategoryResponse Map(Category category)
  {
    return new CategoryResponse()
    {
      Id = category.Id,
      Name = category.Name
    };
  }
}
