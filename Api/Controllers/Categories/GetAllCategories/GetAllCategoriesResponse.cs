using Api.Controllers.Categories.Shared;

namespace Api.Controllers.Categories.GetAllCategories;

public struct GetAllCategoriesResponse
{
  public required IEnumerable<CategoryResponse> Categories { get; set; }
}
