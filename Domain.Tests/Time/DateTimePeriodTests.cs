using Domain.Time;

namespace Domain.Tests.Time;

public class DateTimePeriodTests
{
  private static readonly DateOnly Date1 = new(2024, 1, 1);

  private static readonly TimeOnly Time1 = new(8, 15, 0);
  private static readonly TimeOnly Time2 = new(9, 15, 0);
  private static readonly TimeOnly Time3 = new(10, 15, 0);
  private static readonly TimeOnly Time4 = new(11, 15, 0);

  private static readonly DateTimeOffset DateTime1 = new(Date1, Time1, TimeSpan.Zero);
  private static readonly DateTimeOffset DateTime2 = new(Date1, Time2, TimeSpan.Zero);
  private static readonly DateTimeOffset DateTime3 = new(Date1, Time3, TimeSpan.Zero);
  private static readonly DateTimeOffset DateTime4 = new(Date1, Time4, TimeSpan.Zero);

  // from, until, expectedResult
  public static IEnumerable<object[]> CreateTestData =>
    new List<object[]>
    {
      new object[] { DateTime1, DateTime2, true },
      new object[] { DateTime1, DateTime3, true },
      new object[] { DateTime2, DateTime1, false },
    };

  // from, until, between, expectedResult
  public static IEnumerable<object[]> ContainsTestData =>
    new List<object[]>
    {
      new object[] { DateTime1, DateTime3, DateTime2, true },
      new object[] { DateTime1, DateTime2, DateTime3, false },
    };

  // from1, until1, from2, until2, expectedResult
  public static IEnumerable<object[]> OverlapTestData =>
    new List<object[]>
    {
      new object[] { DateTime1, DateTime3, DateTime2, DateTime4, true },
      new object[] { DateTime1, DateTime2, DateTime3, DateTime4, false },
      new object[] { DateTime1, DateTime2, DateTime2, DateTime4, false },
    };

  [Theory]
  [MemberData(nameof(CreateTestData))]
  public void From_Cannot_Be_Larger_Than_Until(DateTimeOffset from, DateTimeOffset until, bool expectedResult)
  {
    var result = DateTimePeriod.Create(from, until);

    Assert.Equal(expectedResult, result.IsSuccessful);
  }

  [Theory]
  [MemberData(nameof(ContainsTestData))]
  public void Contains(DateTimeOffset from, DateTimeOffset until, DateTimeOffset between, bool expectedResult)
  {
    var result = DateTimePeriod.Create(from, until);
    if (result.IsFailure)
      Assert.Fail();

    var contains = result.Value.Contains(between);

    Assert.Equal(expectedResult, contains);
  }

  [Theory]
  [MemberData(nameof(OverlapTestData))]
  public void Overlap(DateTimeOffset from, DateTimeOffset until, DateTimeOffset from2, DateTimeOffset until2,
    bool expectedResult)
  {
    var (result1, dateTimePeriod1) = DateTimePeriod.Create(from, until);
    var (result2, dateTimePeriod2) = DateTimePeriod.Create(from2, until2);

    if (result1.IsFailure)
      Assert.Fail();

    if (result2.IsFailure)
      Assert.Fail();

    var overlap1 = dateTimePeriod1.Overlaps(dateTimePeriod2);
    var overlap2 = dateTimePeriod2.Overlaps(dateTimePeriod1);

    Assert.Equal(expectedResult, overlap1);
    Assert.Equal(expectedResult, overlap2);
  }
}
