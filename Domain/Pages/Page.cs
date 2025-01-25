using Shared.Domain.Validation;

namespace Domain.Pages;

public sealed class Page
{
  public string Name { get; private set; }
  public string Title { get; private set; }
  public string Description { get; private set; }

  private Page(string name, string title, string description)
  {
    Name = name;
    Title = title;
    Description = description;
  }

  public static Result<Page> Create(string name, string title, string description)
  {
    if (string.IsNullOrWhiteSpace(name))
      return Result.Error(TranslationKeys.NameCannotBeEmpty);

    return new Page(name, title, description);
  }
}
