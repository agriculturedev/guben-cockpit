using Shared.Domain;

namespace Shared.Api.Translations;

public interface ITranslator
{
  string Translate(string key);
  string Translate(string key, params string[] parameters);
}
