using System.Globalization;
using Api.Infrastructure.Extensions;
using Domain;
using Domain.DropdownLink.repository;
using Shared.Api;

namespace Api.Controllers.DropdownLink.EditDropdownLink;

public class EditDropdownLinkHandler : ApiRequestHandler<EditDropdownLinkQuery, EditDropdownLinkResponse>
{
    private readonly IDropdownLinkRepository _dropdownLinkRepository;
    private readonly CultureInfo _culture;

    public EditDropdownLinkHandler(IDropdownLinkRepository dropdownLinkRepository)
    {
        _dropdownLinkRepository = dropdownLinkRepository;
        _culture = CultureInfo.CurrentCulture;
    }

    public override async Task<EditDropdownLinkResponse> Handle(EditDropdownLinkQuery request, CancellationToken cancellationToken)
    {
        var dropdownLink = await _dropdownLinkRepository.Get(request.Id);
        if (dropdownLink is null)
            throw new ProblemDetailsException(TranslationKeys.DropdownLinkNotFound);
        
        var result = dropdownLink.Update(request.Title, request.Link, _culture);
        result.ThrowIfFailure();

        return new EditDropdownLinkResponse();
    }
}
