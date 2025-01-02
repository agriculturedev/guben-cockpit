using System.Reflection;

namespace Shared.Domain
{
  public abstract class EnumType : IEquatable<EnumType>
  {
    protected EnumType()
    {
    } // Added for EF migrations

    protected EnumType(string id, string translationKey)
    {
      Id = id;
      TranslationKey = translationKey;
    }

    public string Id { get; private set; } // Private setter for EF migrations

    public string TranslationKey { get; }

    public static IEnumerable<T> GetAll<T>() where T : EnumType
    {
      var fields = typeof(T).GetFields(BindingFlags.Public |
                                       BindingFlags.Static |
                                       BindingFlags.DeclaredOnly);

      foreach (var field in fields)
      {
        var value = field.GetValue(null) as T;

        if (value != null)
          yield return value;
      }
    }

    public static T Get<T>(string id) where T : EnumType
    {
      var item = GetAll<T>().FirstOrDefault(i => i.Id.Equals(id, StringComparison.InvariantCultureIgnoreCase));

      return item;
    }

    public static T GetByName<T>(string id) where T : EnumType
    {
      var fields = typeof(T).GetFields(BindingFlags.Public |
                                       BindingFlags.Static |
                                       BindingFlags.DeclaredOnly);

      var field = fields.FirstOrDefault(i => i.Name.Equals(id, StringComparison.InvariantCultureIgnoreCase));
      if (field != null)
        return field.GetValue(null) as T;

      return null;
    }

    public static bool operator ==(EnumType enumType1, EnumType enumType2)
    {
      if (ReferenceEquals(enumType1, null))
      {
        return ReferenceEquals(enumType2, null);
      }

      return enumType1.Equals(enumType2);
    }

    public static bool operator !=(EnumType enumType1, EnumType enumType2)
    {
      return !(enumType1 == enumType2);
    }

    public bool Equals(EnumType other)
    {
      if (ReferenceEquals(other, null)) return false;
      if (ReferenceEquals(other, this)) return true;

      return other.Id == Id && GetType() == other.GetType();
    }

    public override bool Equals(object other)
    {
      if (ReferenceEquals(other, null)) return false;
      if (ReferenceEquals(other, this)) return true;

      return Equals(other as EnumType);
    }

    public override int GetHashCode()
    {
      return Id.GetHashCode();
    }

    public override string ToString()
    {
      return Id;
    }
  }
}
