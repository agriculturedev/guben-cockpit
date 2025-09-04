using System.Globalization;
using Api.Controllers.DashboardTabs.Shared;
using Api.Infrastructure.Translations;
using Domain;
using Domain.DashboardDropdown;
using Shared.Api;

namespace Api.Controllers.DashboardDropdown.GetAllDashboardDropdown;

public struct GetAllDashboardDropdownResponse
{
    public required IEnumerable<DashboardDropdownResponse> DashboardDropdowns { get; set; }
}

public struct DashboardDropdownResponse
{
    public required Guid Id { get; set; }
    public required string Title { get; set; }
    public required int Rank { get; set; }
    public string? Link { get; set; }
    public IEnumerable<DashboardTabResponse> Tabs { get; set; }


    public static DashboardDropdownResponse Map(
        DashbaordDropdown dashbaordDropdown,
        CultureInfo culture,
        IEnumerable<DashboardTabResponse>? tabs = null
    )
    {
        var i18NData = dashbaordDropdown.Translations.GetTranslation(culture);
        if (i18NData is null)
            throw new ProblemDetailsException(TranslationKeys.NoValidTranslationsFound);

        return new DashboardDropdownResponse()
        {
            Id = dashbaordDropdown.Id,
            Title = i18NData.Title,
            Rank = dashbaordDropdown.Rank,
            Link = dashbaordDropdown.Link,
            Tabs = tabs ?? Enumerable.Empty<DashboardTabResponse>()
        };
    }
}