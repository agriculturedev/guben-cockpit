namespace Shared.Domain.Validation
{
  public static class ResultExtensions
  {
    /// <summary>
    /// Combines multiple results into one result
    /// </summary>
    /// <param name="results"></param>
    /// <returns></returns>
    public static Result MergeResults(this IEnumerable<Result> results)
      => results.Aggregate(Result.Ok(), (result1, result2) => result1.Merge(result2));

    /// <summary>
    /// Combines multiple results into a result containing all values
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="results"></param>
    /// <returns></returns>
    public static Result<List<T>> MergeResults<T>(this IEnumerable<Result<T>> results)
      => results.Aggregate(Result.Ok(new List<T>()), Merge);

    /// <summary>
    /// Combines multiple asynchronous results into a asynchronous result containing all values
    /// </summary>
    public static async Task<Result> MergeResults(this IEnumerable<Task<Result>> resultTasks)
    {
      var list = Result.Ok();

      foreach (var resultTask in resultTasks)
      {
        var result = await resultTask;
        list = list.Merge(result);
      }

      return list;
    }

    /// <summary>
    /// Executes the next result when the previous result was successful
    /// </summary>
    /// <param name="result"></param>
    /// <param name="nextResult"></param>
    /// <returns></returns>
    public static Result OnSuccess(this Result result, Func<Result> nextResult)
    {
      if (result.IsFailure)
        return result;

      return nextResult();
    }

    /// <summary>
    /// Loops over results and executes the next result when the previous result was successful
    /// </summary>
    /// <param name="results"></param>
    /// <returns></returns>
    public static Result OnSuccess(this IEnumerable<Result> results)
    {
      var previousResult = Result.Ok();

      foreach (var result in results)
      {
        previousResult = previousResult.OnSuccess(() => result);

        if (previousResult.IsFailure)
          return previousResult;
      }

      return previousResult;
    }

    /// <summary>
    /// Combines a result with multiple values and a result with single value into a result containing all values
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="result"></param>
    /// <param name="nextResult"></param>
    /// <returns></returns>
    private static Result<List<T>> Merge<T>(this Result<List<T>> result, Result<T> nextResult)
    {
      if (result.IsFailure || nextResult.IsFailure)
        return Result.Create(result.ValidationMessages.Concat(nextResult.ValidationMessages));

      return Result.Ok(result.Value.Append(nextResult.Value).ToList());
    }

    /// <summary>
    /// Combines multiple asynchronous results into a asynchronous result containing all values
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="results"></param>
    /// <returns></returns>
    public static async Task<Result<List<T>>> MergeResults<T>(this IEnumerable<Task<Result<T>>> results)
    {
      var list = Result.Ok(new List<T>());

      foreach (var result in results)
      {
        var awaitedResult = await result;
        list = Merge(list, awaitedResult);
      }

      return list;
    }
  }
}
