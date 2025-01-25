namespace Domain.Time.Extensions;

public static class DateTimeOffsetExtensions
{
  public static DateTimeOffset LastDayOfMonth(this DateTimeOffset date)
  {
    return new DateTimeOffset(date.Year, date.Month, DateTime.DaysInMonth(date.Year, date.Month), 0, 0, 0,
      date.Offset);
  }

  public static bool IsLargerThan(this DateTimeOffset datetimeoffset, DateOnly date, bool inclusive = false)
  {
    return new DateOnly(datetimeoffset.Year, datetimeoffset.Month, datetimeoffset.Day) > date ||
           (inclusive && new DateOnly(datetimeoffset.Year, datetimeoffset.Month, datetimeoffset.Day) == date);
  }

  public static bool IsLargerThan(this DateTimeOffset dateTimeOffset, DateTime dateTime, bool inclusive = false)
  {
    return dateTimeOffset > dateTime || (inclusive && dateTimeOffset == dateTime);
  }

  public static bool IsLargerThan(this DateTimeOffset datetimeoffset, DateTimeOffset datetimeoffset2,
    bool inclusive = false)
  {
    return datetimeoffset > datetimeoffset2 || (inclusive && datetimeoffset == datetimeoffset2);
  }

  public static bool IsSmallerThan(this DateTimeOffset datetimeoffset, DateOnly date, bool inclusive = false)
  {
    return new DateOnly(datetimeoffset.Year, datetimeoffset.Month, datetimeoffset.Day) < date ||
           (inclusive && new DateOnly(datetimeoffset.Year, datetimeoffset.Month, datetimeoffset.Day) == date);
  }

  public static bool IsSmallerThan(this DateTimeOffset datetimeoffset, DateTimeOffset datetimeoffset2,
    bool inclusive = false)
  {
    return datetimeoffset < datetimeoffset2 || (inclusive && datetimeoffset == datetimeoffset2);
  }

  public static bool IsSmallerThan(this DateTimeOffset datetimeoffset, DateTime datetime, bool inclusive = false)
  {
    return datetimeoffset < datetime || (inclusive && datetimeoffset == datetime);
  }


  public static bool IsWithin(this DateTimeOffset datetimeoffset, DateTimeOffset datetimeoffsetFrom,
    DateTimeOffset datetimeoffsetUntil, bool inclusive = false)
  {
    return datetimeoffset.IsLargerThan(datetimeoffsetFrom, inclusive) &&
           datetimeoffset.IsSmallerThan(datetimeoffsetUntil, inclusive);
  }

  public static bool IsWithin(this DateTimeOffset datetimeoffset, DateOnly dateonlyFrom, DateOnly dateonlyUntil,
    bool inclusive = false)
  {
    return datetimeoffset.IsLargerThan(dateonlyFrom, inclusive) &&
           datetimeoffset.IsSmallerThan(dateonlyUntil, inclusive);
  }

  public static bool IsWithin(this DateTimeOffset datetimeoffset, DateTime datetimeFrom, DateTime datetimeUntil,
    bool inclusive = false)
  {
    return datetimeoffset.IsLargerThan(datetimeFrom, inclusive) &&
           datetimeoffset.IsSmallerThan(datetimeUntil, inclusive);
  }
}
