using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.FooterItems;


public sealed class FooterItem : Entity<Guid>
{
  public string Name { get; set; }
  public string Content { get; set; }

  private FooterItem(string name, string content)
  {
    Id = Guid.CreateVersion7();
    Name = name;
    Content = content;
  }

  public static Result<FooterItem> Create(string name, string content)
  {
    return new FooterItem(name, content);
  }

  public Result UpdateName(string name)
  {
    Name = name;
    return Result.Ok();
  }

  public Result UpdateContent(string content)
  {
    Content = content;
    return Result.Ok();
  }
}
