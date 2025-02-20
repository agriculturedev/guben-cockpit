using System.Text.Json.Serialization;
using Shared.Domain.Validation;

namespace Domain.Pages;


public sealed class PageI18NData
{
  public string Title { get; private set; }
  public string Description { get; private set; }

  [JsonConstructor]
  private PageI18NData(string title, string description)
  {
    Title = title;
    Description = description;
  }

  public static Result<PageI18NData> Create(string title, string description)
  {
    return new PageI18NData(title, description);
  }
}
