﻿using Domain.Category;
using Domain.Category.repository;
using Domain.Events;
using Domain.Events.repository;
using Domain.Locations;
using Domain.Locations.repository;
using Microsoft.EntityFrameworkCore;
using Shared.Database;

namespace Database.Repositories;

public class CategoryRepository
  : EntityFrameworkRepository<Category, Guid, GubenDbContext>, ICategoryRepository
{
  public CategoryRepository(ICustomDbContextFactory<GubenDbContext> dbContextFactory)
    : base(dbContextFactory)
  {
  }

  public IEnumerable<Category> GetByIds(IEnumerable<Guid> ids)
  {
    return Set.AsNoTracking()
      .Where(x => ids.Contains(x.Id));
  }
}
