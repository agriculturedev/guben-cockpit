namespace Domain.Time.Extensions;

public static class DateOnlyExtensions
{
  public static DateOnly Today(this DateOnly date)
  {
    return DateOnly.FromDateTime(DateTime.Today);
  }

  public static DateOnly LastDayOfMonth(this DateOnly date)
  {
    return new DateOnly(date.Year, date.Month, DateTime.DaysInMonth(date.Year, date.Month));
  }

  public static bool IsLargerThan(this DateOnly date, DateOnly date2, bool inclusive = false)
  {
    return date > date2 || (inclusive && date == date2);
  }

  public static bool IsLargerThan(this DateOnly date, DateTime datetime, bool inclusive = false)
  {
    return date > new DateOnly(datetime.Year, datetime.Month, datetime.Day) ||
           (inclusive && date == new DateOnly(datetime.Year, datetime.Month, datetime.Day));
  }

  public static bool IsLargerThan(this DateOnly date, DateTimeOffset datetimeoffset, bool inclusive = false)
  {
    return date > new DateOnly(datetimeoffset.Year, datetimeoffset.Month, datetimeoffset.Day) || (inclusive &&
      date == new DateOnly(datetimeoffset.Year, datetimeoffset.Month, datetimeoffset.Day));
  }


  public static bool IsSmallerThan(this DateOnly date, DateOnly date2, bool inclusive = false)
  {
    return date < date2 || (inclusive && date == date2);
  }

  public static bool IsSmallerThan(this DateOnly date, DateTime datetime, bool inclusive = false)
  {
    return date < new DateOnly(datetime.Year, datetime.Month, datetime.Day) ||
           (inclusive && date == new DateOnly(datetime.Year, datetime.Month, datetime.Day));
  }

  public static bool IsSmallerThan(this DateOnly date, DateTimeOffset datetimeoffset, bool inclusive = false)
  {
    return date < new DateOnly(datetimeoffset.Year, datetimeoffset.Month, datetimeoffset.Day) || (inclusive &&
      date == new DateOnly(datetimeoffset.Year, datetimeoffset.Month, datetimeoffset.Day));
  }


  public static bool IsWithin(this DateOnly date, DateOnly dateFrom, DateOnly dateUntil, bool inclusive = false)
  {
    return date.IsLargerThan(dateFrom, inclusive) && date.IsSmallerThan(dateUntil, inclusive);
  }

  public static bool IsWithin(this DateOnly date, DateTime datetimeFrom, DateTime datetimeUntil, bool inclusive = false)
  {
    return date.IsLargerThan(datetimeFrom, inclusive) && date.IsSmallerThan(datetimeUntil, inclusive);
  }

  public static bool IsWithin(this DateOnly date, DateTimeOffset datetimeoffsetFrom,
    DateTimeOffset datetimeoffsetUntil, bool inclusive = false)
  {
    return date.IsLargerThan(datetimeoffsetFrom, inclusive) && date.IsSmallerThan(datetimeoffsetUntil, inclusive);
  }
}
