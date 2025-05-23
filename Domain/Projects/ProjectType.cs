using Ardalis.SmartEnum;

namespace Domain.Projects;

public sealed class ProjectType : SmartEnum<ProjectType>
{
  public static readonly ProjectType GubenerMarktplatz = new ProjectType("Gubener Marktplatz", 0);
  public static readonly ProjectType Stadtentwicklung = new ProjectType(nameof(Stadtentwicklung), 1);

  private ProjectType(string name, int value) : base(name, value) { }
}
