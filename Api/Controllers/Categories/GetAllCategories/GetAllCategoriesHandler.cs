using Api.Controllers.Categories.Shared;
using Domain.Category.repository;
using Shared.Api;

namespace Api.Controllers.Categories.GetAllCategories;

public class GetAllCategoriesHandler : ApiRequestHandler<GetAllCategoriesQuery, GetAllCategoriesResponse>
{
  private readonly ICategoryRepository _categoryRepository;

  public GetAllCategoriesHandler(ICategoryRepository categoryRepository)
  {
    _categoryRepository = categoryRepository;
  }

  public override async Task<GetAllCategoriesResponse> Handle(GetAllCategoriesQuery request, CancellationToken
      cancellationToken)
  {
    var categories = await _categoryRepository.GetAll();

    return new GetAllCategoriesResponse()
    {
      Categories = categories.Select(CategoryResponse.Map)
    };
  }
}
