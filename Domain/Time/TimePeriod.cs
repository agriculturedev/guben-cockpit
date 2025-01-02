using Domain.Time.Extensions;
using Shared.Domain.Validation;

namespace Domain.Time;

public class TimePeriod : Period<TimeOnly>
{
  private TimePeriod()
  {
  } // EF Core

  private TimePeriod(TimeOnly from, TimeOnly until) : base(from, until)
  {
  }

  public static Result<TimePeriod> Create(TimeOnly from, TimeOnly until)
  {
    if (from > until)
      return Result.Error(TranslationKeys.FromCannotBeGreaterThanUntilHour, from, until);

    return new TimePeriod(from, until);
  }

  public static TimePeriod CreateWithoutValidation(TimeOnly from, TimeOnly until)
  {
    if (from > until)
      throw new InvalidOperationException($"The from ({from}) is greater than the until ({until})");

    return new TimePeriod(from, until);
  }

  public bool Contains(TimePeriod timePeriod)
  {
    return timePeriod.From.IsLargerThan(From) && timePeriod.Until.IsSmallerThan(Until);
  }

  public bool Contains(TimeOnly time)
  {
    return time.IsWithin(From, Until);
  }

  public bool Overlaps(TimePeriod timePeriod)
  {
    return timePeriod.From.IsSmallerThan(Until) && timePeriod.Until.IsLargerThan(From);
  }

  public TimePeriod CalculateOverlap(TimePeriod timePeriod)
  {
    var overlapFrom = From > timePeriod.From ? From : timePeriod.From;
    var overlapUntil = Until < timePeriod.Until ? Until : timePeriod.Until;

    return CreateWithoutValidation(overlapFrom, overlapUntil);
  }

  public TimeSpan CalculateOverlapAsTimeSpan(TimePeriod timePeriod)
  {
    var overlap = CalculateOverlap(timePeriod);

    return overlap.Until - overlap.From;
  }

  public override Period<TimeOnly> Clone()
  {
    return new TimePeriod(From, Until);
  }

  public override string ToString()
  {
    return $"{From:HH:mm:ss} - {Until:HH:mm:ss}";
  }
}
