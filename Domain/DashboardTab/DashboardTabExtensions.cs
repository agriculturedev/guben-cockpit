using Shared.Domain.Validation;

namespace Domain.DashboardTab;

public static class DashboardTabExtensions
{
  public static Result CheckSequenceIsValid(this List<DashboardTab> dashboardTabs)
  {
    // Sort the dashboard tabs by their Sequence value
    var sortedTabs = dashboardTabs.OrderBy(tab => tab.Sequence).ToList();

    // Check if the sequence is uninterrupted, starting from 0
    for (int i = 0; i < sortedTabs.Count; i++)
    {
      if (sortedTabs[i].Sequence != i)
      {
        return Result.Error(TranslationKeys.SequenceInterrupted); // Sequence is interrupted
      }
    }

    return Result.Ok(); // Sequence is uninterrupted
  }
}
