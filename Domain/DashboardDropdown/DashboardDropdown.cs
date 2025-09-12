using System.Globalization;
using System.Text.Json.Serialization;
using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.DashboardDropdown;

public sealed class DashbaordDropdown : Entity<Guid>
{
    public Dictionary<string, DashboardDropdownI18NData> Translations { get; private set; } = new();
    public bool IsLink { get; private set; }
    public int Rank { get; private set; }

    private DashbaordDropdown(bool isLink, int rank)
    {
        Id = Guid.CreateVersion7();
        IsLink = isLink;
        Rank = rank;
    }

    public static Result<DashbaordDropdown> Create(string title, CultureInfo cultureInfo, bool isLink, int rank = 0)
    {
        var dd = new DashbaordDropdown(isLink, rank);
        var updateResult = dd.UpdateTranslation(title, cultureInfo);
        if (updateResult.IsFailure)
            return updateResult;

        return dd;
    }

    public Result Update(string title, CultureInfo cultureInfo, bool isLink, int rank)
    {
        var tr = UpdateTranslation(title, cultureInfo);
        if (tr.IsFailure)
            return tr;

        IsLink = isLink;
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