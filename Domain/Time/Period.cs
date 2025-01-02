using Shared.Domain;

namespace Domain.Time;

public abstract class Period<T> : ValueObject where T : struct
{
  public T From { get; init; }
  public T Until { get; init; }

  protected Period()
  {
  } // EF Core

  protected Period(T from, T until)
  {
    From = from;
    Until = until;
  }

  public abstract Period<T> Clone();

  protected override IEnumerable<object> GetEqualityComponents()
  {
    yield return From;
    yield return Until;
  }

  public override bool Equals(object? obj)
  {
    if (ReferenceEquals(null, obj))
    {
      return false;
    }

    if (ReferenceEquals(this, obj))
    {
      return true;
    }

    if (obj.GetType() != GetType())
    {
      return false;
    }

    return Equals((DatePeriod)obj);
  }

  public override int GetHashCode()
  {
    return HashCode.Combine(base.GetHashCode(), From, Until);
  }
}
