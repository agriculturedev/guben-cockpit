using System.Globalization;
using Database;
using Domain.Category;
using Domain.Category.repository;
using Shared.Database;

namespace Jobs.EventImporter;

public class CategoryImporter
{
  private readonly ICategoryRepository _categoryRepository;
  private readonly ICustomDbContextFactory<GubenDbContext> _dbContextFactory;

  public CategoryImporter(ICategoryRepository categoryRepository,
    ICustomDbContextFactory<GubenDbContext> dbContextFactory)
  {
    _categoryRepository = categoryRepository;
    _dbContextFactory = dbContextFactory;
  }

  public async Task ImportCategory(XmlEvent @event)
  {
    // foreach (var cultureInfo in EventImporter.Cultures)
    // {
      try
      {
        await SaveCategoriesAsync(@event, EventImporter.Cultures[0]); // TODO@JOREN: german only for now, but needs translations too
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
      }
    // }
  }

  private async Task SaveCategoriesAsync(XmlEvent xmlEvent, CultureInfo cultureInfo)
  {
    var categories = xmlEvent.GetUserCategories(cultureInfo)
        .Select(details =>
        {
          var id = details.Item1;
          var original = details.Item2;

          if (CategoryMapping.Map.TryGetValue(original, out var mapped) &&
              !string.IsNullOrWhiteSpace(mapped.Name))
          {
            return Category.Create(mapped.Id, mapped.Name);
          }

          return Category.Create(id, original);
        })
        .Where(result => result.IsSuccessful)
        .Select(result => result.Value);

    await ImporterTransactions.ExecuteTransactionAsync(
        _dbContextFactory,
        async (_) => await UpsertCategoriesAsync(categories.ToList())
    );
  }


  private async Task UpsertCategoriesAsync(IEnumerable<Category> categories)
  {
    foreach (var category in categories)
    {
      await UpsertCategoryAsync(category);
    }
  }

  private async Task UpsertCategoryAsync(Category category)
  {
    var existingCategory = await _categoryRepository.GetByCategoryId(category.CategoryId);
    if (existingCategory != null)
    {
      Console.WriteLine($"Updating existing category: {category.Id}");
      // TODO: Update logic
      return;
    }

    Console.WriteLine($"Creating new category: {category.Id}");
    await _categoryRepository.SaveAsync(category);
  }
}
