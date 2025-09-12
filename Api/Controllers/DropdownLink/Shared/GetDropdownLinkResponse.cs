using System.Globalization;
using Api.Infrastructure.Translations;
using Domain;
using Shared.Api;

namespace Api.Controllers.DropdownLink.Shared;

public struct DropdownLinkResponse
{
    public required Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Link { get; set; }
    public required int Sequence { get; set; }

    public static DropdownLinkResponse Map(Domain.DropdownLink.DropdownLink link, CultureInfo culture)
    {
        var i18n = link.Translations.GetTranslation(culture);
        if (i18n is null)
            throw new ProblemDetailsException(TranslationKeys.NoValidTranslationsFound);

        return new DropdownLinkResponse
        {
            Id = link.Id,
            Title = i18n.Title,
            Link = link.Link,
            Sequence = link.Sequence
        };
    }
}
