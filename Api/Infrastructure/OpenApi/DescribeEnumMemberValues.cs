using System.Runtime.Serialization;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;

namespace Api.Infrastructure.OpenApi;

public class DescribeEnumMemberValues : IOpenApiSchemaTransformer
{
  public Task TransformAsync(OpenApiSchema schema, OpenApiSchemaTransformerContext context,
    CancellationToken cancellationToken)
  {
    if (context.JsonTypeInfo.Type.IsEnum)
    {
      schema.Type = "string";
      schema.Format = null;

      schema.Enum.Clear();

      foreach (var enumValue in Enum.GetValues(context.JsonTypeInfo.Type))
      {
        var memberInfo = context.JsonTypeInfo.Type.GetMember(enumValue.ToString())[0];
        var enumMemberAttribute = memberInfo.GetCustomAttributes(typeof(EnumMemberAttribute), false)
          .FirstOrDefault() as EnumMemberAttribute;

        var enumValueString = enumMemberAttribute?.Value ?? enumValue.ToString();
        schema.Enum.Add(new OpenApiString(enumValueString));
      }
    }

    return Task.CompletedTask;
  }
}
