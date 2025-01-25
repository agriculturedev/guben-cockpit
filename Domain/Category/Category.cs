using System.Collections.ObjectModel;
using Domain.Events;
using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.Category;

public sealed class Category : Entity<Guid>, IEquatable<Category>
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

  public bool Equals(Category? other)
  {
    if (other is null) return false;
    if (ReferenceEquals(this, other)) return true;
    return CategoryId == other.CategoryId && Name == other.Name;
  }

  public override bool Equals(object? obj)
  {
    return ReferenceEquals(this, obj) || obj is Category other && Equals(other);
  }

  public override int GetHashCode()
  {
    return HashCode.Combine(CategoryId, Name);
  }
}
