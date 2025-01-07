namespace Domain.Time.Extensions;

public static class DateTimeExtensions
{
  public static DateTime LastDayOfMonth(this DateTime date)
  {
    return new DateTime(date.Year, date.Month, DateTime.DaysInMonth(date.Year, date.Month));
  }

  public static bool IsLargerThan(this DateTime datetime, DateOnly date, bool inclusive = false)
  {
    return new DateOnly(datetime.Year, datetime.Month, datetime.Day) > date ||
           (inclusive && new DateOnly(datetime.Year, datetime.Month, datetime.Day) == date);
  }

  public static bool IsLargerThan(this DateTime datetime, DateTime datetime2, bool inclusive = false)
  {
    return datetime > datetime2 || (inclusive && datetime == datetime2);
  }

  public static bool IsLargerThan(this DateTime datetime, DateTimeOffset datetimeoffset, bool inclusive = false)
  {
    return datetime > datetimeoffset || (inclusive && datetime == datetimeoffset);
  }

  public static bool IsSmallerThan(this DateTime datetime, DateOnly date, bool inclusive = false)
  {
    return new DateOnly(datetime.Year, datetime.Month, datetime.Day) < date ||
           (inclusive && new DateOnly(datetime.Year, datetime.Month, datetime.Day) == date);
  }


  public static bool IsSmallerThan(this DateTime datetime, DateTime datetime2, bool inclusive = false)
  {
    return datetime < datetime2 || (inclusive && datetime == datetime2);
  }

  public static bool IsSmallerThan(this DateTime datetime, DateTimeOffset datetimeoffset, bool inclusive = false)
  {
    return datetime < datetimeoffset || (inclusive && datetime == datetimeoffset);
  }


  public static bool IsWithin(this DateTime datetime, DateTime datetimeFrom, DateTime datetimeUntil,
    bool inclusive = false)
  {
    return datetime.IsLargerThan(datetimeFrom, inclusive) && datetime.IsSmallerThan(datetimeUntil, inclusive);
  }

  public static bool IsWithin(this DateTime datetime, DateOnly dateonlyFrom, DateOnly dateonlyUntil,
    bool inclusive = false)
  {
    return datetime.IsLargerThan(dateonlyFrom, inclusive) && datetime.IsSmallerThan(dateonlyUntil, inclusive);
  }

  public static bool IsWithin(this DateTime datetime, DateTimeOffset datetimeoffsetFrom,
    DateTimeOffset datetimeoffsetUntil, bool inclusive = false)
  {
    return datetime.IsLargerThan(datetimeoffsetFrom, inclusive) &&
           datetime.IsSmallerThan(datetimeoffsetUntil, inclusive);
  }

  public static DateTime? SetKindUtc(this DateTime? dateTime)
  {
    if (dateTime.HasValue)
    {
      return dateTime.Value.SetKindUtc();
    }
    else
    {
      return null;
    }
  }
  public static DateTime SetKindUtc(this DateTime dateTime)
  {
    if (dateTime.Kind == DateTimeKind.Utc) { return dateTime; }
    return DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
  }
}
