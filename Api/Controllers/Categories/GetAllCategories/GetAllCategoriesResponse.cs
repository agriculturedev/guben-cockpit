using Api.Controllers.Categories.Shared;

namespace Api.Controllers.Categories.GetAllCategories;

public class GetAllCategoriesResponse
{
  public IEnumerable<CategoryResponse> Categories { get; set; }

}
