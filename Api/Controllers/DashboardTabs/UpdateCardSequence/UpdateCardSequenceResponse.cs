namespace Api.Controllers.DashboardTabs.UpdateCardSequence;

public readonly struct UpdateCardSequenceResponse
{
    public Guid TabId { get; init; }
    public int UpdatedCount { get; init; }
}