using Domain.Time.Extensions;
using Shared.Domain.Validation;

namespace Domain.Time;

public class DatePeriod : Period<DateOnly>
{
  private DatePeriod()
  {
  } // EF Core

  private DatePeriod(DateOnly from, DateOnly until) : base(from, until)
  {
  }

  public static Result<DatePeriod> Create(DateOnly from, DateOnly until)
  {
    if (from > until)
      return Result.Error(TranslationKeys.FromCannotBeGreaterThanUntilDay, from, until);

    return new DatePeriod(from, until);
  }

  public bool Contains(DatePeriod datePeriod)
  {
    return datePeriod.From.IsLargerThan(From) && datePeriod.Until.IsSmallerThan(Until);
  }

  public bool Contains(DateOnly date)
  {
    return date.IsWithin(From, Until);
  }

  public bool Contains(DateTime datetime)
  {
    return datetime.IsWithin(From, Until);
  }

  public bool Contains(DateTimeOffset datetimeoffset)
  {
    return datetimeoffset.IsWithin(From, Until);
  }

  public bool Overlaps(DatePeriod datePeriod)
  {
    return datePeriod.From.IsSmallerThan(Until) && datePeriod.Until.IsLargerThan(From);
  }

  public override Period<DateOnly> Clone()
  {
    return new DatePeriod(From, Until);
  }
}
