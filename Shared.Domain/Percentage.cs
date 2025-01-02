using System.Globalization;

namespace Shared.Domain;

public sealed class Percentage : ValueObject
{
  private Percentage()
  {
  }

  public Percentage(decimal value)
  {
    Value = value;
  }

  public decimal Value { get; private set; }

  public static Percentage Create(decimal one, decimal two)
  {
    if (one == 0 || two == 0)
      return new Percentage(0);

    var percentageValue = (one / two) * 100;

    return new Percentage(percentageValue);
  }

  public static Percentage Create(string percentage)
  {
    var value = decimal.Parse(percentage, CultureInfo.InvariantCulture);

    return new Percentage(value);
  }

  public decimal Round(int numberOfDecimals)
  {
    return Math.Round(Value, numberOfDecimals);
  }

  public decimal Factor => Value / 100;

  public static explicit operator Percentage(decimal value)
  {
    return new Percentage(value);
  }

  public static implicit operator decimal(Percentage percentage)
  {
    return percentage.Value;
  }

  public static decimal operator *(Percentage percentage, decimal decimalValue)
  {
    return decimalValue * percentage.Value / 100;
  }

  public static decimal operator *(decimal decimalValue, Percentage percentage)
  {
    return decimalValue * percentage.Value / 100;
  }

  public static Percentage operator *(Percentage percentage1, Percentage percentage2)
  {
    return new Percentage(percentage1.Value * percentage2.Value / 100);
  }

  public static Percentage operator +(Percentage percentage1, Percentage percentage2)
  {
    return new Percentage(percentage1.Value + percentage2.Value);
  }

  public static Percentage operator -(Percentage percentage1, Percentage percentage2)
  {
    return new Percentage(percentage1.Value - percentage2.Value);
  }

  public static Percentage operator -(Percentage percentage)
  {
    return new Percentage(-percentage.Value);
  }

  public override string ToString()
  {
    return $"{Value:0.######} %";
  }

  protected override IEnumerable<object> GetEqualityComponents()
  {
    yield return Value;
  }
}
