namespace Shared.Domain;

public static class EnumerableExtensions
{
  /// <summary>
  /// Gets the first duplicate in the <paramref name="values"/> or null when none is found
  /// </summary>
  /// <param name="values">The values to find a duplicate in</param>
  /// <param name="keySelector">Function to select the key used to detect duplicates</param>
  public static TValue? FirstDuplicateOrDefault<TValue, TKey>(this IEnumerable<TValue> values,
    Func<TValue, TKey> keySelector)
  {
    var validated = new List<TKey>();
    foreach (var value in values)
    {
      var key = keySelector(value);
      if (validated.Contains(keySelector(value)))
        return value;
      validated.Add(key);
    }

    return default;
  }

  /// <summary>Returns a list of "windows" or viewports of the specified windowSize over the source list.  Returns empty list when the list has fewer elements than the windowsize.</summary>
  public static IEnumerable<T[]> SelectWindows<T>(this IEnumerable<T> source, int windowSize)
  {
    if (windowSize <= 0) throw new ArgumentException("Invalid window size");
    return source
      .SelectWindows((_, window) => window.Count() < windowSize)
      .Where(w => w.Length == windowSize);
  }

  /// <summary>Returns a list of "windows" or viewports over the source list.  Elements are added to a window as long as isInWindow returns true.  Never returns windows that are contained within another window.
  /// Returns one window if isInWindow always returns true, returns singleton windows if isInWindow always returns false.</summary>
  public static IEnumerable<T[]> SelectWindows<T>(this IEnumerable<T> source, Func<T, IEnumerable<T>, bool> isInWindow)
  {
    Queue<T> window = new Queue<T>();
    foreach (var item in source)
    {
      if (window.Count > 0 && !isInWindow(item, window))
      {
        yield return window.ToArray();
        window.Dequeue();
        // remove sub windows
        while (window.Count > 0 && !isInWindow(item, window))
        {
          window.Dequeue();
        }
      }

      window.Enqueue(item);
    }

    if (window.Count > 0) yield return window.ToArray();
  }
}
