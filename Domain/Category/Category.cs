using System.Collections.ObjectModel;
using Domain.Events;
using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.Category;

public sealed class Category : Entity<Guid>
{
  public int CategoryId { get; private set; }
  public string Name { get; private set; }
  private readonly List<Event> _events;
  public IReadOnlyCollection<Event> Events => new ReadOnlyCollection<Event>(_events);

  private Category(int categoryId, string name)
  {
    Id = Guid.CreateVersion7();
    CategoryId = categoryId;
    Name = name;
    _events = new List<Event>();
  }

  public static Result<Category> Create(int categoryId, string name)
  {
    if (string.IsNullOrWhiteSpace(name))
      return Result.Error(TranslationKeys.NameCannotBeEmpty);

    return new Category(categoryId, name);
  }
}
