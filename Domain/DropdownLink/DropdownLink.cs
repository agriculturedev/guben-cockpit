using System.Globalization;
using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.DropdownLink;

public sealed class DropdownLink : Entity<Guid>
{
    public Dictionary<string, DropdownLinkI18NData> Translations { get; private set; } = new();
    public string Link { get; private set; }
    public int Sequence { get; private set; }
    public Guid DropdownId { get; private set; }

    private DropdownLink(string link, int sequence)
    {
        Id = Guid.CreateVersion7();
        Link = link;
        Sequence = sequence;
    }

    public static Result<DropdownLink> Create(string title, CultureInfo cultureInfo, string link, int sequence = 0)
    {
        var dd = new DropdownLink(link, sequence);
        var updateResult = dd.UpdateTranslation(title, cultureInfo);
        if (updateResult.IsFailure)
            return updateResult;

        return dd;
    }

    public Result Update(string title, CultureInfo cultureInfo, string link, int sequence)
    {
        var tr = UpdateTranslation(title, cultureInfo);
        if (tr.IsFailure)
            return tr;

        Link = link;
        Sequence = sequence;
        return Result.Ok();
    }

    public Result UpdateTranslation(string title, CultureInfo cultureInfo)
    {
        var (res, i18n) = DropdownLinkI18NData.Create(title);
        if (res.IsFailure)
            return res;

        Translations[cultureInfo.TwoLetterISOLanguageName] = i18n;
        return Result.Ok();
    }
}

public sealed class DropdownLinkI18NData
{
    public string Title { get; private set; }
    private DropdownLinkI18NData(string title) { Title = title; }

    public static Result<DropdownLinkI18NData> Create(string title)
    {
        return new DropdownLinkI18NData(title);
    }
}