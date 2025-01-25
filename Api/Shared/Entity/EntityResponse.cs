namespace Api.Shared.Entity;

public abstract class EntityResponse<T>
{
  public required T Id { get; set; }
}
