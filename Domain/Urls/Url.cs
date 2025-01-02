using Shared.Domain.Validation;

namespace Domain.Urls;

public sealed class Url
{
  public string Link { get; private set; }
  public string Description { get; private set; }

  private Url(string link, string description)
  {
    Link = link;
    Description = description;
  }

  public static Result<Url> Create(string link, string description)
  {
    if (string.IsNullOrWhiteSpace(link))
      return Result.Error(TranslationKeys.LinkCannotBeEmpty);

    if (string.IsNullOrWhiteSpace(description))
      return Result.Error(TranslationKeys.DescriptionCannotBeEmpty);

    return new Url(link, description);
  }
}
