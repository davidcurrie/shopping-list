import { Item, HomeCategory, ShopCategory, CategoryOrder, Shop } from '../types';

/**
 * Group items by their home category and sort according to custom order
 */
export function groupItemsByHomeCategory(
  items: Item[],
  categoryOrder?: CategoryOrder[]
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
  const categories = Array.from(categoryMap.entries()).map(([name, items]) => ({
    name,
    items,
  }));

  // Sort by custom order if provided, otherwise alphabetically
  if (categoryOrder && categoryOrder.length > 0) {
    const orderMap = new Map(categoryOrder.map((c) => [c.name, c.order]));

    return categories.sort((a, b) => {
      const orderA = orderMap.get(a.name) ?? Number.MAX_SAFE_INTEGER;
      const orderB = orderMap.get(b.name) ?? Number.MAX_SAFE_INTEGER;

      if (orderA === orderB) {
        return a.name.localeCompare(b.name);
      }
      return orderA - orderB;
    });
  }

  return categories.sort((a, b) => a.name.localeCompare(b.name));
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
      const category = availability.shopCategory;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(item);
    }
  });

  // Convert map to array
  const categories = Array.from(categoryMap.entries()).map(([name, items]) => ({
    name,
    items,
  }));

  // Sort by custom order if provided, otherwise alphabetically
  const categoryOrder = shop.categoryOrder;
  if (categoryOrder && categoryOrder.length > 0) {
    const orderMap = new Map(categoryOrder.map((c) => [c.name, c.order]));

    return categories.sort((a, b) => {
      const orderA = orderMap.get(a.name) ?? Number.MAX_SAFE_INTEGER;
      const orderB = orderMap.get(b.name) ?? Number.MAX_SAFE_INTEGER;

      if (orderA === orderB) {
        return a.name.localeCompare(b.name);
      }
      return orderA - orderB;
    });
  }

  return categories.sort((a, b) => a.name.localeCompare(b.name));
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

/**
 * Ensure all categories have an order. Create orders for new categories.
 */
export function ensureCategoryOrder(
  categoryNames: string[],
  existingOrder?: CategoryOrder[]
): CategoryOrder[] {
  const orderMap = new Map(
    (existingOrder || []).map((c) => [c.name, c.order])
  );

  const maxOrder = existingOrder && existingOrder.length > 0
    ? Math.max(...existingOrder.map((c) => c.order))
    : 0;

  let nextOrder = maxOrder + 1;
  const result: CategoryOrder[] = [];

  // Add existing orders
  if (existingOrder) {
    result.push(...existingOrder);
  }

  // Add new categories
  categoryNames.forEach((name) => {
    if (!orderMap.has(name)) {
      result.push({ name, order: nextOrder++ });
    }
  });

  return result;
}
