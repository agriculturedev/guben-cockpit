using System.Text.Json.Serialization;
using Domain.MasterportalLinks;

namespace Api.Controllers.MasterportalLinks.Shared;

public class MasterportalLinkResponse
{
    public Guid Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string Folder { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public MasterportalLinkStatus Status { get; set; }
}