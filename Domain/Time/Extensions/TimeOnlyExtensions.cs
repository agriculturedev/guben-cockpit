namespace Domain.Time.Extensions;

public static class TimeOnlyExtensions
{
  public static bool IsLargerThan(this TimeOnly time, TimeOnly time2, bool inclusive = false)
  {
    return time > time2 || (inclusive && time == time2);
  }

  public static bool IsSmallerThan(this TimeOnly time, TimeOnly time2, bool inclusive = false)
  {
    return time < time2 || (inclusive && time == time2);
  }

  public static bool IsWithin(this TimeOnly time, TimeOnly timeFrom, TimeOnly timeUntil, bool inclusive = false)
  {
    return time.IsLargerThan(timeFrom, inclusive) && time.IsSmallerThan(timeUntil, inclusive);
  }
}
