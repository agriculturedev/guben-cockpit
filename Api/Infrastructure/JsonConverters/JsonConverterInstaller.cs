using System.Reflection;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Api.Infrastructure.JsonConverters;

public static class JsonConverterInstaller
{
  public static IMvcBuilder AddJsonConverters(this IMvcBuilder builder)
  {
    builder.AddJsonOptions(options =>
    {
      var assembly = Assembly.GetExecutingAssembly();

      var dataContractEnums = assembly.GetTypes()
        .Where(type => type.IsEnum)
        .Where(type => type.GetCustomAttributes(typeof(DataContractAttribute), false).Any());

      foreach (var enumType in dataContractEnums)
      {
        var converterType = typeof(EnumMemberConverter<>).MakeGenericType(enumType);
        var converter = Activator.CreateInstance(converterType);
        if (converter is null) throw new NullReferenceException("JsonConverter is null");
        options.JsonSerializerOptions.Converters.Add((JsonConverter)converter);
      }
    });

    return builder;
  }
}
