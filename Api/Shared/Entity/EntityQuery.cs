namespace Api.Shared.Entity;

public abstract class EntityQuery<T>
{
  public required T Id { get; set; }
}
