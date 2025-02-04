using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.Pages;

public sealed class Page : Entity<string>
{
  public string Title { get; private set; }
  public string Description { get; private set; }

  private Page(){}

  private Page(string id, string title, string description)
  {
    Id = id;
    Title = title;
    Description = description;
  }

  public static Result<Page> Create(string name, string title, string description)
  {
    if (string.IsNullOrWhiteSpace(name))
      return Result.Error(TranslationKeys.NameCannotBeEmpty);

    return new Page(name, title, description);
  }

  public void Update(string title, string description)
  {
    Title = title;
    Description = description;
  }
}
