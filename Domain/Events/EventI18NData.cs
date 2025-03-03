using System.Text.Json.Serialization;
using Shared.Domain.Validation;

namespace Domain.Events;

public sealed class EventI18NData
{
  public string Title { get; private set; }
  public string Description { get; private set; }

  [JsonConstructor]
  private EventI18NData(string title, string description)
  {
    Title = title;
    Description = description;
  }

  public static Result<EventI18NData> Create(string title, string description)
  {
    return new EventI18NData(title, description);
  }

  public Result Update(EventI18NData data)
  {
    return UpdateTitle(data.Title)
      .Merge(UpdateDescription(data.Description));
  }

  public Result UpdateTitle(string newTitle)
  {
    if (string.IsNullOrWhiteSpace(newTitle))
      return Result.Error(TranslationKeys.TitleCannotBeEmpty);

    Title = newTitle;
    return Result.Ok();
  }

  public Result UpdateDescription(string newDescription)
  {
    if (string.IsNullOrWhiteSpace(newDescription))
      return Result.Error(TranslationKeys.DescriptionCannotBeEmpty);

    Description = newDescription;
    return Result.Ok();
  }
}
