using Domain;
using Domain.DashboardTab.repository;
using Shared.Api;

namespace Api.Controllers.DashboardTabs.UpdateCardSequence;

public class UpdateCardSequenceHandler : ApiRequestHandler<UpdateCardSequenceQuery, UpdateCardSequenceResponse>
{
    private readonly IDashboardRepository _dashboardRepository;

    public UpdateCardSequenceHandler(IDashboardRepository dashboardRepository)
    {
        _dashboardRepository = dashboardRepository;
    }

    public override async Task<UpdateCardSequenceResponse> Handle(
        UpdateCardSequenceQuery request,
        CancellationToken cancellationToken
    )
    {
        var tab = await _dashboardRepository.Get(request.TabId);
        if (tab is null)
            throw new ProblemDetailsException(TranslationKeys.DashboardTabNotFound);

        var cards = tab.InformationCards.ToList();

        if (cards.Count != request.OrderedCardIds.Count)
            throw new ProblemDetailsException(TranslationKeys.SequenceInterrupted);

        var unique = request.OrderedCardIds.Distinct().Count();
        if (unique != request.OrderedCardIds.Count)
            throw new ProblemDetailsException(TranslationKeys.SequenceInterrupted);

        var validIds = cards.Select(c => c.Id).ToHashSet();
        if (!request.OrderedCardIds.All(validIds.Contains))
            throw new ProblemDetailsException(TranslationKeys.InformationCardNotFound);

        var byId = cards.ToDictionary(c => c.Id);
        for (int i = 0; i < request.OrderedCardIds.Count; i++)
        {
            byId[request.OrderedCardIds[i]].UpdateSequence(i);
        }

        return new UpdateCardSequenceResponse
        {
            TabId = request.TabId,
            UpdatedCount = request.OrderedCardIds.Count
        };
    }
}