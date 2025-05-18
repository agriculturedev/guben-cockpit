using System.Linq.Expressions;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Database.Comparers;

public class I18NComparer<T> : ValueComparer<Dictionary<string, T>>
{
  public I18NComparer(bool favorStructuralComparisons) : base(favorStructuralComparisons) { }

  public I18NComparer(Expression<Func<Dictionary<string, T>?, Dictionary<string, T>?, bool>> equalsExpression,
    Expression<Func<Dictionary<string, T>, int>> hashCodeExpression) : base(equalsExpression, hashCodeExpression) { }

  public I18NComparer(Expression<Func<Dictionary<string, T>?, Dictionary<string, T>?, bool>> equalsExpression,
    Expression<Func<Dictionary<string, T>, int>> hashCodeExpression,
    Expression<Func<Dictionary<string, T>, Dictionary<string, T>>> snapshotExpression) : base(equalsExpression,
    hashCodeExpression, snapshotExpression) { }

  public static I18NComparer<T> CreateNew()
  {
    var jsonOptions = new JsonSerializerOptions();

    return new I18NComparer<T>(
      (d1, d2) => JsonSerializer.Serialize(d1, jsonOptions) ==
                  JsonSerializer.Serialize(d2, jsonOptions), // Compare as JSON
      d => JsonSerializer.Serialize(d, jsonOptions).GetHashCode(), // Hash the JSON string
      d => JsonSerializer.Deserialize<Dictionary<string, T>>(JsonSerializer.Serialize(d, jsonOptions),
        jsonOptions)! // Clone via JSON
    );
  }
}
