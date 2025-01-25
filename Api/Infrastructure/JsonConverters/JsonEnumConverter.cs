using System.Reflection;
using System.Runtime.Serialization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Api.Infrastructure.JsonConverters;

public class EnumMemberConverter<T> : JsonConverter<T> where T : Enum
{
  public override T Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
  {
    var value = reader.GetString();
    foreach (var field in typeof(T).GetFields(BindingFlags.Public | BindingFlags.Static))
    {
      var attribute = field.GetCustomAttribute<EnumMemberAttribute>();
      if (attribute != null && attribute.Value == value)
      {
        return (T)field.GetValue(null);
      }
    }

    throw new JsonException($"Unable to convert \"{value}\" to Enum {typeof(T)}");
  }

  public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
  {
    var field = typeof(T).GetField(value.ToString());
    var attribute = field?.GetCustomAttribute<EnumMemberAttribute>();
    var stringValue = attribute?.Value ?? value.ToString();
    writer.WriteStringValue(stringValue);
  }
}
