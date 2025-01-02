using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.Events;

public sealed class Category : Entity<Guid>
{
  public string Name { get; private set; }

  private Category(string name)
  {
    Id = Guid.CreateVersion7();
    Name = name;
  }

  public static Result<Category> Create(string name)
  {
    if (string.IsNullOrWhiteSpace(name))
      return Result.Error(TranslationKeys.NameCannotBeEmpty);

    return new Category(name);
  }
}
