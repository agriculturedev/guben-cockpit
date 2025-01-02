namespace Shared.Domain;

public abstract class ValueObject
{
  protected abstract IEnumerable<object> GetEqualityComponents();

  public override bool Equals(object? other)
  {
    if (ReferenceEquals(null, other)) return false;
    if (ReferenceEquals(this, other)) return true;

    // not sure why this was here, leave it here in case it ever goes wrong.
    // if (other is null)
    //     return false;

    if (GetType() != other.GetType())
      return false;

    return Equals(other as ValueObject);
  }

  public bool Equals(ValueObject? other)
  {
    if (ReferenceEquals(other, null)) return false;
    if (ReferenceEquals(other, this)) return true;

    return GetEqualityComponents().SequenceEqual(other.GetEqualityComponents());
    // not sure why this was here, leave it here in case it ever goes wrong.
    // return other is not null && GetEqualityComponents().SequenceEqual(other.GetEqualityComponents());
  }

  public static bool operator ==(ValueObject a, ValueObject b)
  {
    if (ReferenceEquals(a, null) && ReferenceEquals(b, null))
      return true;

    if (ReferenceEquals(a, null) || ReferenceEquals(b, null))
      return false;

    return a.Equals(b);
  }

  public static bool operator !=(ValueObject a, ValueObject b)
  {
    return !(a == b);
  }

  public override int GetHashCode()
  {
    return GetEqualityComponents()
      .Aggregate(1, (current, obj) =>
      {
        unchecked
        {
          return current * 23 + (obj?.GetHashCode() ?? 0);
        }
      });
  }
}
