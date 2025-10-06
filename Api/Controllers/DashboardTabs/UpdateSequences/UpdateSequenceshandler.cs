using System.Globalization;
using Api.Infrastructure.Extensions;
using Domain;
using Domain.DashboardTab;
using Domain.DashboardTab.repository;
using Shared.Api;
using Shared.Domain.Validation;

namespace Api.Controllers.DashboardTabs.UpdateSequences;

public class UpdateSequencesHandler : ApiRequestHandler<UpdateSequencesQuery, UpdateSequencesResponse>
{
  private readonly IDashboardRepository _dashboardRepository;

  public UpdateSequencesHandler(IDashboardRepository dashboardRepository)
  {
    _dashboardRepository = dashboardRepository;
  }

  public override async Task<UpdateSequencesResponse> Handle(UpdateSequencesQuery request, CancellationToken cancellationToken)
  {
    var tabs = await _dashboardRepository.GetTrackedByDropdownIdsAsync(request.DropdownId, cancellationToken);
    if (tabs == null || tabs.Count == 0)
      throw new ProblemDetailsException(TranslationKeys.DashboardDropdownNotFound);

    if (tabs.Count != request.OrderedTabIds.Count)
      throw new ProblemDetailsException(TranslationKeys.SequenceInterrupted);

    var unique = request.OrderedTabIds.Distinct().Count();
    if (unique != request.OrderedTabIds.Count)
      throw new ProblemDetailsException(TranslationKeys.SequenceInterrupted);

    var validIds = tabs.Select(t => t.Id).ToHashSet();
    if (!request.OrderedTabIds.All(validIds.Contains))
      throw new ProblemDetailsException(TranslationKeys.DashboardTabNotFound);

    var byId = tabs.ToDictionary(t => t.Id);
    for (int i = 0; i < request.OrderedTabIds.Count; i++)
    {
      byId[request.OrderedTabIds[i]].UpdateSequence(i);
    }

    return new UpdateSequencesResponse
    {
      DropdownId = request.DropdownId,
      UpdatedCount = request.OrderedTabIds.Count
    };
  }
}