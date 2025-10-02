using Api.Infrastructure.Extensions;
using Domain;
using Domain.MasterportalLinks;
using Domain.MasterportalLinks.repository;
using Shared.Api;

namespace Api.Controllers.MasterportalLinks.CreateMasterportalLink;

public class CreateMasterportalLinkHandler : ApiRequestHandler<CreateMasterportalLinkQuery, CreateMasterportalLinkResponse>
{
    private readonly IMasterportalLinkRepository _masterportalLinkRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IMasterportalCapabilitiesService _masterportalCapabilitiesService;

    public CreateMasterportalLinkHandler(
        IMasterportalLinkRepository masterportalLinkRepository,
        IHttpContextAccessor httpContextAccessor,
        IMasterportalCapabilitiesService masterportalCapabilitiesService
    )
    {
        _masterportalLinkRepository = masterportalLinkRepository;
        _httpContextAccessor = httpContextAccessor;
        _masterportalCapabilitiesService = masterportalCapabilitiesService;
    }

    public async override Task<CreateMasterportalLinkResponse> Handle(CreateMasterportalLinkQuery request, CancellationToken cancellationToken)
    {
        var keycloakId = _httpContextAccessor.HttpContext?.User.GetKeycloakId();
		if (string.IsNullOrEmpty(keycloakId))
			throw new UnauthorizedAccessException(TranslationKeys.UserNotLoggedIn);

        var normalizedUrl = NormalizeUrl(request.Url);
        var (baseUrl, query) = SplitUrl(normalizedUrl);

        var result = MasterportalLink.Create(
            name: request.Name,
            url: baseUrl,
            folder: request.Folder,
            createdByUserId: keycloakId
        );
        result.ThrowIfFailure();
        var link = result.Value;

        if (link.Type == MasterportalLinkType.WMS)
        {
            var layers = query.GetFirst("layers") ?? throw new ProblemDetailsException(TranslationKeys.MasterportalLinkWmsLayersRequired);
            link.SetWmsMetadata(layers, null, null, null, null, null).ThrowIfFailure();
        }
        else if (link.Type == MasterportalLinkType.WFS)
        {
            var featureType = query.GetFirst("typeName") ?? query.GetFirst("typename") ?? query.GetFirst("typenames");
            if (string.IsNullOrWhiteSpace(featureType))
                throw new ProblemDetailsException(TranslationKeys.MasterportalLinkWfsFeatureTypeRequired);

            link.SetWfsMetadata(featureType, null, null).ThrowIfFailure();
        }
        else
        {
            throw new ProblemDetailsException(TranslationKeys.MasterportalLinkTypeInvalid);
        }

        await _masterportalCapabilitiesService.ValidateAndEnrichAsync(link, cancellationToken);
        await _masterportalLinkRepository.SaveAsync(link);

        return new CreateMasterportalLinkResponse();
    }

    private static (string baseUrl, QueryBag query) SplitUrl(string url)
    {
        var uri = new Uri(url);
        var baseUrl = $"{uri.Scheme}://{uri.Host}{uri.AbsolutePath}".TrimEnd('?');
        var query = new QueryBag(uri.Query);
        return (baseUrl, query);
    }

    private sealed class QueryBag
    {
        private readonly Dictionary<string,string> _map;
        public QueryBag(string rawQuery)
        {
            _map = System.Web.HttpUtility.ParseQueryString(rawQuery ?? string.Empty)
                    .AllKeys?
                    .Where(k => k != null)
                    .ToDictionary(k => k!, k => System.Web.HttpUtility.ParseQueryString(rawQuery)[k!] ?? string.Empty,
                                StringComparer.OrdinalIgnoreCase)
                ?? new Dictionary<string,string>(StringComparer.OrdinalIgnoreCase);
        }
        public string? GetFirst(string key) => _map.TryGetValue(key, out var v) ? v : null;
    }

    private static string NormalizeUrl(string url)
    {
        var u = (url ?? string.Empty).Trim();
        if (string.IsNullOrEmpty(u)) return u;

        if (!u.StartsWith("http://", StringComparison.OrdinalIgnoreCase) &&
            !u.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
        {
            u = "https://" + u;
        }

        if (!Uri.TryCreate(u, UriKind.Absolute, out _))
            throw new ProblemDetailsException("Url is not a valid absolute URL.");

        return u;
    }
}