import { Item, HomeCategory, ShopCategory, Shop } from '../types';

/**
 * Group items by their home category and sort according to custom order
 */
export function groupItemsByHomeCategory(
  items: Item[],
  categories?: string[]
): HomeCategory[] {
  const categoryMap = new Map<string, Item[]>();

  items.forEach((item) => {
    const category = item.homeCategory;
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(item);
  });

  // Convert map to array
  const categoryGroups = Array.from(categoryMap.entries()).map(([name, items]) => ({
    name,
    items,
  }));

  // Sort by custom order if provided, otherwise alphabetically
  if (categories && categories.length > 0) {
    return categoryGroups.sort((a, b) => {
      const indexA = categories.indexOf(a.name);
      const indexB = categories.indexOf(b.name);

      // If both are in the custom order, use that order
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If only one is in the custom order, it comes first
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      // Neither in custom order, sort alphabetically
      return a.name.localeCompare(b.name);
    });
  }

  return categoryGroups.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Group items by their shop-specific category and sort according to custom order
 */
export function groupItemsByShopCategory(
  items: Item[],
  shop: Shop
): ShopCategory[] {
  const categoryMap = new Map<string, Item[]>();

  items.forEach((item) => {
    const availability = item.shopAvailability.find(
      (avail) => avail.shopId === shop.id
    );

    if (availability) {
      const category = availability.shopCategory || 'Uncategorized';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(item);
    }
  });

  // Convert map to array
  const categoryGroups = Array.from(categoryMap.entries()).map(([name, items]) => ({
    name,
    items,
  }));

  // Sort by custom order if provided, with Uncategorized always last
  const categories = shop.categories;
  if (categories && categories.length > 0) {
    return categoryGroups.sort((a, b) => {
      // Uncategorized always comes last
      if (a.name === 'Uncategorized') return 1;
      if (b.name === 'Uncategorized') return -1;

      const indexA = categories.indexOf(a.name);
      const indexB = categories.indexOf(b.name);

      // If both are in the custom order, use that order
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If only one is in the custom order, it comes first
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      // Neither in custom order, sort alphabetically
      return a.name.localeCompare(b.name);
    });
  }

  // No custom order - sort alphabetically with Uncategorized last
  return categoryGroups.sort((a, b) => {
    if (a.name === 'Uncategorized') return 1;
    if (b.name === 'Uncategorized') return -1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Get unique home categories from items
 */
export function getUniqueHomeCategories(items: Item[]): string[] {
  const categories = new Set(items.map((item) => item.homeCategory));
  return Array.from(categories).sort();
}

/**
 * Get unique shop categories for a given shop
 */
export function getUniqueShopCategories(
  items: Item[],
  shopId: string
): string[] {
  const categories = new Set<string>();

  items.forEach((item) => {
    const availability = item.shopAvailability.find(
      (avail) => avail.shopId === shopId
    );
    if (availability && availability.shopCategory) {
      categories.add(availability.shopCategory);
    }
  });

  return Array.from(categories).sort();
}

/**
 * Ensure all categories are in the list. Add new categories to the end.
 */
export function ensureCategories(
  categoryNames: string[],
  existingCategories?: string[]
): string[] {
  const result = [...(existingCategories || [])];
  const existingSet = new Set(result);

  // Add new categories to the end
  categoryNames.forEach((name) => {
    if (!existingSet.has(name)) {
      result.push(name);
      existingSet.add(name);
    }
  });

  return result;
}
