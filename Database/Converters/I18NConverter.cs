using System.Linq.Expressions;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Database.Comparers;

public class I18NConverter<T> : ValueConverter<Dictionary<string, T>, string>
{
  public I18NConverter(Expression<Func<Dictionary<string, T>, string>> convertToProviderExpression,
    Expression<Func<string, Dictionary<string, T>>> convertFromProviderExpression,
    ConverterMappingHints? mappingHints = null) : base(convertToProviderExpression, convertFromProviderExpression,
    mappingHints) { }

  public I18NConverter(Expression<Func<Dictionary<string, T>, string>> convertToProviderExpression,
    Expression<Func<string, Dictionary<string, T>>> convertFromProviderExpression, bool convertsNulls,
    ConverterMappingHints? mappingHints = null) : base(convertToProviderExpression, convertFromProviderExpression,
    convertsNulls, mappingHints) { }

  public static I18NConverter<T> CreateNew()
  {
    var jsonOptions = new JsonSerializerOptions();

    return new I18NConverter<T>(
      v => JsonSerializer.Serialize(v, jsonOptions),
      v => JsonSerializer.Deserialize<Dictionary<string, T>>(v, jsonOptions) ??
           new Dictionary<string, T>()
    );
  }
}
