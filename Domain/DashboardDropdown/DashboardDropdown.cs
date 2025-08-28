using System.Globalization;
using System.Text.Json.Serialization;
using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.DashboardDropdown;

public sealed class DashbaordDropdown : Entity<Guid>
{
    public Dictionary<string, DashboardDropdownI18NData> Translations { get; private set; } = new();
    public string? Link { get; private set; }
    public int Rank { get; private set; }

    private DashbaordDropdown(int rank, string? link)
    {
        Id = Guid.CreateVersion7();
        Rank = rank;
        Link = link;
    }

    public static Result<DashbaordDropdown> Create(string title, CultureInfo cultureInfo, int rank = 0, string? link = null)
    {
        var dd = new DashbaordDropdown(rank, link);
        var updateResult = dd.UpdateTranslation(title, cultureInfo);
        if (updateResult.IsFailure)
            return updateResult;

        return dd;
    }

    public Result Update(string title, CultureInfo cultureInfo, string? link, int rank)
    {
        var tr = UpdateTranslation(title, cultureInfo);
        if (tr.IsFailure)
            return tr;

        Link = string.IsNullOrWhiteSpace(link) ? null : link;
        Rank = rank;
        return Result.Ok();
    }

    public Result UpdateTranslation(string title, CultureInfo cultureInfo)
    {
        var (res, i18n) = DashboardDropdownI18NData.Create(title);
        if (res.IsFailure)
            return res;

        Translations[cultureInfo.TwoLetterISOLanguageName] = i18n;
        return Result.Ok();
    }
}

public sealed class DashboardDropdownI18NData
{
    public string Title { get; private set; }

    [JsonConstructor]
    private DashboardDropdownI18NData(string title) { Title = title; }

    public static Result<DashboardDropdownI18NData> Create(string title)
    {
        return new DashboardDropdownI18NData(title);
    }
}