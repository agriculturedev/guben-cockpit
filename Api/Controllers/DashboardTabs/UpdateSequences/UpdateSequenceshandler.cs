using System.Globalization;
using Api.Infrastructure.Extensions;
using Domain;
using Domain.DashboardTab;
using Domain.DashboardTab.repository;
using Shared.Api;
using Shared.Domain.Validation;

namespace Api.Controllers.DashboardTabs.UpdateSequences;

public class UpdateSequenceshandler : ApiRequestHandler<UpdateSequencesQuery, UpdateSequencesResponse>
{
  private readonly IDashboardRepository _dashboardRepository;
  private readonly CultureInfo _culture;

  public UpdateSequenceshandler(IDashboardRepository dashboardRepository)
  {
    _dashboardRepository = dashboardRepository;
    _culture = CultureInfo.CurrentCulture;
  }

  public override async Task<UpdateSequencesResponse> Handle(UpdateSequencesQuery request,
    CancellationToken cancellationToken)
  {
    var dashboardTabs = await _dashboardRepository.GetAll();
    if (dashboardTabs is null)
      throw new ProblemDetailsException(TranslationKeys.NoDashboardTabsFound);

    foreach (var tab in dashboardTabs)
    {
      var newSequence = request.Sequences.FirstOrDefault(s => s.TabId == tab.Id);
      if (newSequence is null)
        throw new ProblemDetailsException(ValidationMessage.CreateError(TranslationKeys.SequenceNotFoundForTab,
          tab.Translations[_culture.TwoLetterISOLanguageName].Title));

      tab.UpdateSequence(newSequence.Sequence);
    }

    var sequenceResult = dashboardTabs.CheckSequenceIsValid();
    sequenceResult.ThrowIfFailure();

    return new UpdateSequencesResponse();
  }
}
