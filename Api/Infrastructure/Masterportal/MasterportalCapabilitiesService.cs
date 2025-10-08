using System.Xml.Linq;
using Domain;
using Domain.MasterportalLinks;
using Shared.Api;

public class MasterportalCapabilitiesService : IMasterportalCapabilitiesService
{
  private readonly HttpClient _http;

  public MasterportalCapabilitiesService(HttpClient http) => _http = http;

  public async Task ValidateAndEnrichAsync(MasterportalLink link, CancellationToken ct)
  {
    switch (link.Type)
    {
      case MasterportalLinkType.WMS:
        await ValidateWmsAsync(link, ct);
        break;
      case MasterportalLinkType.WFS:
        await ValidateWfsAsync(link, ct);
        break;
      default:
        throw new ProblemDetailsException(TranslationKeys.MasterportalLinkTypeInvalid);
    }
  }

  private async Task ValidateWmsAsync(MasterportalLink link, CancellationToken ct)
  {
    var capabilitiesUrl = BuildGetCapabilitiesUrl(link.Url, "WMS");

    var xml = await FetchXmlAsync(capabilitiesUrl, ct);

    var root = xml.Root ?? throw Invalid("WMS capabilities XML has no root.");

    var wmsVersion = (string?)root.Attribute("version") ?? "1.3.0";

    var formats = root
      .ElementAny("Capability")?
      .ElementAny("Request")?
      .ElementAny("GetMap")?
      .ElementsAny("Format")
      .Select(e => e.Value.Trim())
      .Where(v => !string.IsNullOrWhiteSpace(v))
      .Distinct(StringComparer.OrdinalIgnoreCase)
      .ToList() ?? new();

    var allLayers = root.DescendantsAny("Layer").ToList();
    var requested = allLayers.FirstOrDefault(l =>
      string.Equals(l.ElementAny("Name")?.Value?.Trim(), link.WmsLayers, StringComparison.OrdinalIgnoreCase));

    if (requested is null)
      throw new ProblemDetailsException(TranslationKeys.MasterportalLinkWmsLayersRequired);

    var minScale = requested.ElementAny("MinScaleDenominator")?.Value?.Trim();
    var maxScale = requested.ElementAny("MaxScaleDenominator")?.Value?.Trim();

    var legendUrl = requested
      .ElementAny("Style")?
      .ElementAny("LegendURL")?
      .ElementAny("OnlineResource")
      ?.GetXLinkHref();


    var chosenFormat = formats.FirstOrDefault(f => f.Equals("image/png", StringComparison.OrdinalIgnoreCase))
      ?? formats.FirstOrDefault()
      ?? "image/png";

    link.SetWmsMetadata(
      layers: link.WmsLayers!,
      format: chosenFormat,
      version: wmsVersion,
      maxScale: maxScale,
      minScale: minScale,
      legendUrl: legendUrl
    );

    var attribution = requested.ElementAny("Attribution")?.ElementAny("Title")?.Value?.Trim();
    
    if (!string.IsNullOrWhiteSpace(attribution))
    {
      // link.SetWmsAttribution(attribution); // add method
    }
  }

  private async Task ValidateWfsAsync(MasterportalLink link, CancellationToken ct)
  {
    var capabilitiesUrl = BuildGetCapabilitiesUrl(link.Url, "WFS");
    var xml = await FetchXmlAsync(capabilitiesUrl, ct);

    var root = xml.Root ?? throw Invalid("WFS capabilities XML has no root.");
    var version = (string?)root.Attribute("version") ?? "1.1.0";

    var targetNamespace = (string?)root.Attribute("targetNamespace");

    var featureTypes = root
        .DescendantsAny("FeatureTypeList")
        .SelectMany(ftl => ftl.DescendantsAny("FeatureType"))
        .ToList();

    var match = featureTypes.FirstOrDefault(ft =>
      string.Equals(ft.ElementAny("Name")?.Value?.Trim(), link.WfsFeatureType, StringComparison.OrdinalIgnoreCase));

    if (match is null)
      throw new ProblemDetailsException(TranslationKeys.MasterportalLinkWfsFeatureTypeRequired);

    var nameValue = match.ElementAny("Name")?.Value?.Trim();
    string? featureNs = targetNamespace;
    if (!string.IsNullOrWhiteSpace(nameValue) && nameValue.Contains(':'))
    {
      var prefix = nameValue.Split(':')[0];
      featureNs = root.GetNamespaceOfPrefix(prefix)?.NamespaceName ?? featureNs;
    }

    link.SetWfsMetadata(
      featureType: link.WfsFeatureType!,
      featureNs: featureNs,
      version: version
    );
  }

  private static string BuildGetCapabilitiesUrl(string baseUrl, string service)
  {
    var sep = baseUrl.Contains('?') ? "&" : "?";
    return $"{baseUrl}{sep}service={service}&request=GetCapabilities";
  }

  private async Task<XDocument> FetchXmlAsync(string url, CancellationToken ct)
  {
    using var req = new HttpRequestMessage(HttpMethod.Get, url);
    using var res = await _http.SendAsync(req, HttpCompletionOption.ResponseHeadersRead, ct);
    if (!res.IsSuccessStatusCode)
      throw new ProblemDetailsException($"GetCapabilities failed ({(int)res.StatusCode}).");

    var stream = await res.Content.ReadAsStreamAsync(ct);
    try { return XDocument.Load(stream); }
    catch
    {
      throw new ProblemDetailsException("Invalid XML returned by GetCapabilities.");
    }
  }

  private static ProblemDetailsException Invalid(string msg) => new ProblemDetailsException(msg);
}

internal static class XmlNsAgnostic
{
  public static XElement? ElementAny(this XContainer node, string localName) =>
    node.Elements().FirstOrDefault(e => e.Name.LocalName.Equals(localName, StringComparison.OrdinalIgnoreCase));

  public static IEnumerable<XElement> ElementsAny(this XContainer node, string localName) =>
    node.Elements().Where(e => e.Name.LocalName.Equals(localName, StringComparison.OrdinalIgnoreCase));

  public static IEnumerable<XElement> DescendantsAny(this XContainer node, string localName) =>
    node.Descendants().Where(e => e.Name.LocalName.Equals(localName, StringComparison.OrdinalIgnoreCase));

  public static string? GetXLinkHref(this XElement el)
  {
    var hrefAttr = el.Attributes().FirstOrDefault(a => a.Name.LocalName.Equals("href", StringComparison.OrdinalIgnoreCase));
    return hrefAttr?.Value?.Trim();
  }
}
