using Domain;
using Domain.GeoDataSource.repository;
using Shared.Api;

namespace Api.Controllers.Geo.ValidateGeoDataSource;

public class ValidateGeoDataSourceHandler : ApiRequestHandler<ValidateGeoDataSourceQuery, ValidateGeoDataSourceResponse>
{
  private readonly IGeoDataSourceRepository _geoDataSourceRepository;

  public ValidateGeoDataSourceHandler(IGeoDataSourceRepository geoDataSourceRepository)
  {
    _geoDataSourceRepository = geoDataSourceRepository;
  }


  public override async Task<ValidateGeoDataSourceResponse> Handle(ValidateGeoDataSourceQuery request, CancellationToken cancellationToken)
  {
    var source = await _geoDataSourceRepository.Get(request.Id);

    if (source is null)
      throw new ProblemDetailsException(TranslationKeys.GeoDataSourceNotFound);

    if (request.IsValid)
      source.Validate();
    else
      source.Invalidate();

    await _geoDataSourceRepository.SaveAsync(source);

    return new ValidateGeoDataSourceResponse();
  }
}
