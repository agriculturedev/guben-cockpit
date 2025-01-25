using System.Runtime.Serialization;

namespace Domain.Events.repository;

public enum EventSortOption
{
  [EnumMember(Value = "Title")]
  Title,
  [EnumMember(Value = "StartDate")]
  StartDate
}
