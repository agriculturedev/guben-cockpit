using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using Api.Infrastructure.JsonConverters;

namespace Api.Shared;

[DataContract]
[JsonConverter(typeof(EnumMemberConverter<SortDirection>))]
public enum SortDirection
{
  [EnumMember(Value = "Ascending")]
  Ascending,
  [EnumMember(Value = "Descending")]
  Descending
}


public static class SortDirectionMapper
{
  public static SortDirection MapFromDomain(this Domain.SortDirection type)
    => type switch
    {
      Domain.SortDirection.Ascending => SortDirection.Ascending,
      Domain.SortDirection.Descending => SortDirection.Descending,
      _ => SortDirection.Ascending
    };

  public static Domain.SortDirection MapToDomain(this SortDirection type)
    => type switch
    {
      SortDirection.Ascending => Domain.SortDirection.Ascending,
      SortDirection.Descending => Domain.SortDirection.Descending,
      _ => Domain.SortDirection.Ascending
    };
}
