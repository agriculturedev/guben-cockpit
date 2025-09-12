using System.Globalization;
using Api.Infrastructure.Extensions;
using Domain.DropdownLink;
using Domain.DropdownLink.repository;
using Shared.Api;

namespace Api.Controllers.DropdownLink.CreateDropdownLink;

public class CreateDropdownLinkHandler : ApiRequestHandler<CreateDropdownLinkQuery, CreateDropdownLinkResponse>
{
    private readonly IDropdownLinkRepository _dropdownLinkRepository;
    private readonly CultureInfo _culture;

    public CreateDropdownLinkHandler(IDropdownLinkRepository dropdownLinkRepository)
    {
        _dropdownLinkRepository = dropdownLinkRepository;
        _culture = CultureInfo.CurrentCulture;
    }

    public override async Task<CreateDropdownLinkResponse> Handle(CreateDropdownLinkQuery request, CancellationToken cancellationToken)
    {
        int nextSequence = _dropdownLinkRepository.GetNextSequence();

        var (result, dropdownLink) = Domain.DropdownLink.DropdownLink.Create(
            request.Title,
            _culture,
            request.Link,
            nextSequence,
            request.DropdownId
        );
        result.ThrowIfFailure();

        await _dropdownLinkRepository.SaveAsync(dropdownLink);

        return new CreateDropdownLinkResponse();
    }
}
