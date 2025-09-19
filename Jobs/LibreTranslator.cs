using System.Globalization;
using System.Net.Http.Json;
using Jobs.Configuration;
using Microsoft.Extensions.Configuration;
using HtmlAgilityPack;
using System.Net;

namespace Jobs;

public class LibreTranslator
{
  private readonly IConfiguration _configuration;
  private readonly System.Net.Http.HttpClient _httpClient;
  private static DateTime _lastRequest = DateTime.MinValue;
  private static readonly TimeSpan _minInterval = TimeSpan.FromMilliseconds(600); // 100 requests/minute max

  public LibreTranslator(IConfiguration configuration)
  {
    _configuration = configuration;
    _httpClient = new System.Net.Http.HttpClient();

  }

  public async Task<List<string>> TranslateWithLibreTranslate(CultureInfo targetCulture, params string[] texts)
  {
    var timeSinceLastRequest = DateTime.UtcNow - _lastRequest;
    if (timeSinceLastRequest < _minInterval)
    {
      var delay = _minInterval - timeSinceLastRequest;
      Console.WriteLine($"Rate limiting: waiting {delay.TotalMilliseconds}ms");
      await Task.Delay(delay);
    }

    var payload = new
    {
      q = texts,
      source = "de",
      target = targetCulture.TwoLetterISOLanguageName,
      api_key = _configuration.GetLibreTranslateApiKey("LibreTranslate")
    };

    var response = await _httpClient.PostAsJsonAsync(_configuration.GetLibreTranslateUrl("LibreTranslate"), payload);

    _lastRequest = DateTime.UtcNow;

    if (response.StatusCode == HttpStatusCode.TooManyRequests)
    {
      Console.WriteLine("Rate limit hit, waiting 60 seconds...");
      await Task.Delay(60000);
      throw new HttpRequestException("Rate limit exceeded - retry after delay");
    }

    response.EnsureSuccessStatusCode();

    var data = await response.Content.ReadFromJsonAsync<LibreTranslateResponse>();
    return data?.TranslatedText ?? new List<string>();
  }

  public async Task<string> TranslateHtmlAsync(string html, CultureInfo targetCulture)
  {
    if (string.IsNullOrWhiteSpace(html))
      return html;

    var doc = new HtmlDocument();
    doc.LoadHtml(html);

    var textNodes = doc.DocumentNode.Descendants()
        .Where(n => n.NodeType == HtmlNodeType.Text && !string.IsNullOrWhiteSpace(n.InnerText))
        .ToList();

    if (!textNodes.Any())
      return html;

    var textsToTranslate = textNodes
        .Select(n => WebUtility.HtmlDecode(n.InnerText.Trim()))
        .ToArray();

    var translatedTexts = await TranslateWithLibreTranslate(targetCulture, textsToTranslate);

    for (int i = 0; i < textNodes.Count; i++)
    {
      textNodes[i].InnerHtml = translatedTexts[i];
    }

    return doc.DocumentNode.InnerHtml;
  }

  private class LibreTranslateResponse
  {
    public List<string> TranslatedText { get; set; } = new();
  }
}