using Domain.Time;

namespace Domain.Tests.Time;

public class DatePeriodTests
{
  private static readonly DateOnly Date1 = new(2024, 1, 1);
  private static readonly DateOnly Date2 = new(2024, 1, 2);
  private static readonly DateOnly Date3 = new(2024, 1, 3);
  private static readonly DateOnly Date4 = new(2024, 1, 4);


  // from, until, expectedResult
  public static IEnumerable<object[]> CreateTestData =>
    new List<object[]>
    {
      new object[] { Date1, Date2, true },
      new object[] { Date1, Date3, true },
      new object[] { Date2, Date1, false },
    };

  // from, until, between, expectedResult
  public static IEnumerable<object[]> ContainsTestData =>
    new List<object[]>
    {
      new object[] { Date1, Date3, Date2, true },
      new object[] { Date1, Date2, Date3, false },
    };

  public static IEnumerable<object[]> OverlapTestData =>
    new List<object[]>
    {
      new object[] { Date1, Date3, Date2, Date4, true },
      new object[] { Date1, Date2, Date3, Date4, false },
      new object[] { Date1, Date2, Date2, Date4, false },
    };

  [Theory]
  [MemberData(nameof(CreateTestData))]
  public void From_Cannot_Be_Larger_Than_Until(DateOnly from, DateOnly until, bool expectedResult)
  {
    var result = DatePeriod.Create(from, until);

    Assert.Equal(expectedResult, result.IsSuccessful);
  }

  [Theory]
  [MemberData(nameof(ContainsTestData))]
  public void Contains(DateOnly from, DateOnly until, DateOnly between, bool expectedResult)
  {
    var result = DatePeriod.Create(from, until);
    if (result.IsFailure)
      Assert.Fail();

    var contains = result.Value.Contains(between);

    Assert.Equal(expectedResult, contains);
  }

  [Theory]
  [MemberData(nameof(OverlapTestData))]
  public void Overlap(DateOnly from1, DateOnly until1, DateOnly from2, DateOnly until2, bool expectedResult)
  {
    var (result1, datePeriod1) = DatePeriod.Create(from1, until1);
    var (result2, datePeriod2) = DatePeriod.Create(from2, until2);

    if (result1.IsFailure)
      Assert.Fail();

    if (result2.IsFailure)
      Assert.Fail();

    var overlap1 = datePeriod1.Overlaps(datePeriod2);
    var overlap2 = datePeriod2.Overlaps(datePeriod1);

    Assert.Equal(expectedResult, overlap1);
    Assert.Equal(expectedResult, overlap2);
  }
}
