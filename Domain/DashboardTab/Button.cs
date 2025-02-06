using Shared.Domain;
using Shared.Domain.Validation;

namespace Domain.DashboardTab;

public class Button : ValueObject
{
  public string Title { get; private set; }
  public string Url { get; private set; }
  public bool OpenInNewTab { get; private set; }

  private Button(string title, string url, bool openInNewTab)
  {
    Title = title;
    Url = url;
    OpenInNewTab = openInNewTab;
  }

  public static Result<Button> Create(string title, string url, bool openInNewTab)
  {
    return new Button(title, url, openInNewTab);
  }

  protected override IEnumerable<object> GetEqualityComponents()
  {
    yield return Title;
    yield return Url;
    yield return OpenInNewTab;
  }
}
