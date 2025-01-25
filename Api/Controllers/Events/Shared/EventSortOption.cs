using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using Api.Infrastructure.JsonConverters;

namespace Api.Controllers.Events.Shared;

[DataContract]
[JsonConverter(typeof(EnumMemberConverter<EventSortOption>))]
public enum EventSortOption
{
  [EnumMember(Value = "Title")]
  Title,
  [EnumMember(Value = "StartDate")]
  StartDate
}

public static class EventSortOptionResponseMapper
{
  public static EventSortOption MapFromDomain(this Domain.Events.repository.EventSortOption type)
    => type switch
    {
      Domain.Events.repository.EventSortOption.Title => EventSortOption.Title,
      Domain.Events.repository.EventSortOption.StartDate => EventSortOption.StartDate,
      _ => EventSortOption.Title
    };

  public static Domain.Events.repository.EventSortOption MapToDomain(this EventSortOption type)
    => type switch
    {
      EventSortOption.Title => Domain.Events.repository.EventSortOption.Title,
      EventSortOption.StartDate => Domain.Events.repository.EventSortOption.StartDate,
      _ => Domain.Events.repository.EventSortOption.Title
    };
}
