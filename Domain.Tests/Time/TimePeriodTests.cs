using Domain.Time;

namespace Domain.Tests.Time;

public class TimePeriodTests
{
  private static readonly TimeOnly Time1 = new(12, 1, 1);
  private static readonly TimeOnly Time2 = new(12, 1, 2);
  private static readonly TimeOnly Time3 = new(12, 1, 3);
  private static readonly TimeOnly Time4 = new(12, 1, 4);


  // from, until, expectedResult
  public static IEnumerable<object[]> CreateTestData =>
    new List<object[]>
    {
      new object[] { Time1, Time2, true },
      new object[] { Time1, Time3, true },
      new object[] { Time2, Time1, false },
    };

  // from, until, between, expectedResult
  public static IEnumerable<object[]> ContainsTestData =>
    new List<object[]>
    {
      new object[] { Time1, Time3, Time2, true },
      new object[] { Time1, Time2, Time3, false },
    };

  public static IEnumerable<object[]> OverlapTestData =>
    new List<object[]>
    {
      new object[] { Time1, Time3, Time2, Time4, true },
      new object[] { Time1, Time2, Time3, Time4, false },
      new object[] { Time1, Time2, Time2, Time4, false },
    };

  [Theory]
  [MemberData(nameof(CreateTestData))]
  public void From_Cannot_Be_Larger_Than_Until(TimeOnly from, TimeOnly until, bool expectedResult)
  {
    var result = TimePeriod.Create(from, until);

    Assert.Equal(expectedResult, result.IsSuccessful);
  }

  [Theory]
  [MemberData(nameof(ContainsTestData))]
  public void Contains(TimeOnly from, TimeOnly until, TimeOnly between, bool expectedResult)
  {
    var result = TimePeriod.Create(from, until);
    if (result.IsFailure)
      Assert.Fail();

    var contains = result.Value.Contains(between);

    Assert.Equal(expectedResult, contains);
  }

  [Theory]
  [MemberData(nameof(OverlapTestData))]
  public void Overlap(TimeOnly from1, TimeOnly until1, TimeOnly from2, TimeOnly until2, bool expectedResult)
  {
    var (timePeriodResult1, timePeriod1) = TimePeriod.Create(from1, until1);
    var (timePeriodResult2, timePeriod2) = TimePeriod.Create(from2, until2);

    if (timePeriodResult1.IsFailure)
      Assert.Fail();

    if (timePeriodResult2.IsFailure)
      Assert.Fail();

    var overlap1 = timePeriod1.Overlaps(timePeriod2);
    var overlap2 = timePeriod2.Overlaps(timePeriod1);

    Assert.Equal(expectedResult, overlap1);
    Assert.Equal(expectedResult, overlap2);
  }
}
