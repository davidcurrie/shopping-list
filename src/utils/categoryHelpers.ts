import { Item, HomeCategory, ShopCategory } from '../types';

/**
 * Group items by their home category
 */
export function groupItemsByHomeCategory(items: Item[]): HomeCategory[] {
  const categoryMap = new Map<string, Item[]>();

  items.forEach((item) => {
    const category = item.homeCategory;
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(item);
  });

  // Convert map to array and sort by category name
  return Array.from(categoryMap.entries())
    .map(([name, items]) => ({ name, items }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Group items by their shop-specific category for a given shop
 */
export function groupItemsByShopCategory(
  items: Item[],
  shopId: string
): ShopCategory[] {
  const categoryMap = new Map<string, Item[]>();

  items.forEach((item) => {
    const availability = item.shopAvailability.find(
      (avail) => avail.shopId === shopId
    );

    if (availability) {
      const category = availability.shopCategory;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(item);
    }
  });

  // Convert map to array and sort by category name
  return Array.from(categoryMap.entries())
    .map(([name, items]) => ({ name, items }))
    .sort((a, b) => a.name.localeCompare(b.name));
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
    if (availability) {
      categories.add(availability.shopCategory);
    }
  });

  return Array.from(categories).sort();
}
