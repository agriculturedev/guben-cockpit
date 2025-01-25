using Api.Controllers.Categories.Shared;

namespace Api.Controllers.Categories.GetAllCategories;

public class GetAllCategoriesResponse
{
  public required IEnumerable<CategoryResponse> Categories { get; set; }
}
