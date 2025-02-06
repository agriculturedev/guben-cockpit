using Domain.Time.Extensions;
using Shared.Domain.Validation;

namespace Domain.Time;

public class DateTimePeriod : Period<DateTimeOffset>
{
  private DateTimePeriod()
  {
  } // EF Core

  private DateTimePeriod(DateTimeOffset from, DateTimeOffset until) : base(from, until)
  {
  }

  public static Result<DateTimePeriod> Create(DateTimeOffset from, DateTimeOffset until)
  {
    if (from > until)
      return Result.Error(TranslationKeys.FromCannotBeGreaterThanUntilDateTime, from, until);

    return new DateTimePeriod(from, until);
  }

  public bool Contains(DateTimePeriod dateTimePeriod)
  {
    return dateTimePeriod.From.IsLargerThan(From) && dateTimePeriod.Until.IsSmallerThan(Until);
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

  public bool Overlaps(DateTimePeriod dateTimePeriod)
  {
    return dateTimePeriod.From.IsSmallerThan(Until) && dateTimePeriod.Until.IsLargerThan(From);
  }

  public override Period<DateTimeOffset> Clone()
  {
    return new DateTimePeriod(From, Until);
  }
}
