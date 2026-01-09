import { create } from 'zustand';
import { Item, Shop, ShoppingListData, SaveStatus } from '../types';
import { getUniqueHomeCategories, getUniqueShopCategories, ensureCategories } from '../utils/categoryHelpers';

interface ShoppingStore extends ShoppingListData {
  // File handle state
  fileHandle: FileSystemFileHandle | null;
  saveStatus: SaveStatus;

  // File handle actions
  setFileHandle: (handle: FileSystemFileHandle | null) => void;
  setSaveStatus: (status: SaveStatus) => void;

  // Selection actions
  toggleItemSelection: (itemId: string) => void;
  deselectItem: (itemId: string) => void;
  selectItem: (itemId: string) => void;

  // Item CRUD
  addItem: (item: Omit<Item, 'id'>) => void;
  updateItem: (itemId: string, updates: Partial<Omit<Item, 'id'>>) => void;
  deleteItem: (itemId: string) => void;

  // Shop CRUD
  addShop: (shop: Omit<Shop, 'id'>) => void;
  updateShop: (shopId: string, updates: Partial<Omit<Shop, 'id'>>) => void;
  deleteShop: (shopId: string) => void;

  // Shop availability
  setItemShopAvailability: (
    itemId: string,
    shopId: string,
    category: string
  ) => void;
  removeItemFromShop: (itemId: string, shopId: string) => void;

  // Category ordering
  moveHomeCategoryUp: (categoryName: string) => void;
  moveHomeCategoryDown: (categoryName: string) => void;
  moveShopCategoryUp: (shopId: string, categoryName: string) => void;
  moveShopCategoryDown: (shopId: string, categoryName: string) => void;

  // Data persistence
  loadData: (data: ShoppingListData) => void;
  reset: () => void;

  // Utility getters
  getItemById: (itemId: string) => Item | undefined;
  getShopById: (shopId: string) => Shop | undefined;
  getItemsForShop: (shopId: string, selectedOnly: boolean) => Item[];
}

const initialState: ShoppingListData = {
  items: [],
  shops: [],
  selection: [],
  homeCategories: [],
};

export const useShoppingStore = create<ShoppingStore>((set, get) => ({
  ...initialState,
  fileHandle: null,
  saveStatus: 'saved',

  // File handle actions
  setFileHandle: (handle) => set({ fileHandle: handle }),
  setSaveStatus: (status) => set({ saveStatus: status }),

  // Selection actions
  toggleItemSelection: (itemId) =>
    set((state) => {
      const selectedIds = state.selection;
      const isSelected = selectedIds.includes(itemId);

      return {
        selection: isSelected
          ? selectedIds.filter((id) => id !== itemId)
          : [...selectedIds, itemId],
        saveStatus: 'unsaved',
      };
    }),

  deselectItem: (itemId) =>
    set((state) => ({
      selection: state.selection.filter(
        (id) => id !== itemId
      ),
      saveStatus: 'unsaved',
    })),

  selectItem: (itemId) =>
    set((state) => {
      if (state.selection.includes(itemId)) {
        return state;
      }
      return {
        selection: [...state.selection, itemId],
        saveStatus: 'unsaved',
      };
    }),

  // Item CRUD
  addItem: (item) =>
    set((state) => {
      const newItem: Item = {
        ...item,
        id: crypto.randomUUID(),
      };
      const newItems = [...state.items, newItem];

      // Ensure category list includes the new category
      const uniqueHomeCategories = getUniqueHomeCategories(newItems);
      const homeCategories = ensureCategories(uniqueHomeCategories, state.homeCategories);

      return {
        items: newItems,
        homeCategories,
        // Auto-select new items
        selection: [...state.selection, newItem.id],
        saveStatus: 'unsaved',
      };
    }),

  updateItem: (itemId, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
      saveStatus: 'unsaved',
    })),

  deleteItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
      selection: state.selection.filter(
        (id) => id !== itemId
      ),
      saveStatus: 'unsaved',
    })),

  // Shop CRUD
  addShop: (shop) =>
    set((state) => {
      const newShop: Shop = {
        ...shop,
        id: crypto.randomUUID(),
      };
      return {
        shops: [...state.shops, newShop],
        saveStatus: 'unsaved',
      };
    }),

  updateShop: (shopId, updates) =>
    set((state) => ({
      shops: state.shops.map((shop) =>
        shop.id === shopId ? { ...shop, ...updates } : shop
      ),
      saveStatus: 'unsaved',
    })),

  deleteShop: (shopId) =>
    set((state) => ({
      shops: state.shops.filter((shop) => shop.id !== shopId),
      // Remove shop availability from all items
      items: state.items.map((item) => ({
        ...item,
        shopAvailability: item.shopAvailability.filter(
          (avail) => avail.shopId !== shopId
        ),
      })),
      saveStatus: 'unsaved',
    })),

  // Shop availability
  setItemShopAvailability: (itemId, shopId, category) =>
    set((state) => {
      const updatedItems = state.items.map((item) => {
        if (item.id !== itemId) return item;

        // Remove existing availability for this shop and add new one
        const filteredAvailability = item.shopAvailability.filter(
          (avail) => avail.shopId !== shopId
        );

        return {
          ...item,
          shopAvailability: [
            ...filteredAvailability,
            { shopId, shopCategory: category },
          ],
        };
      });

      // Ensure shop category list includes the new category
      const uniqueShopCategories = getUniqueShopCategories(updatedItems, shopId);
      const updatedShops = state.shops.map((shop) => {
        if (shop.id !== shopId) return shop;
        return {
          ...shop,
          categories: ensureCategories(uniqueShopCategories, shop.categories),
        };
      });

      return {
        items: updatedItems,
        shops: updatedShops,
        saveStatus: 'unsaved',
      };
    }),

  removeItemFromShop: (itemId, shopId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              shopAvailability: item.shopAvailability.filter(
                (avail) => avail.shopId !== shopId
              ),
            }
          : item
      ),
      saveStatus: 'unsaved',
    })),

  // Category ordering
  moveHomeCategoryUp: (categoryName) =>
    set((state) => {
      const categories = state.homeCategories || [];
      const currentIndex = categories.indexOf(categoryName);

      if (currentIndex <= 0) return state;

      // Swap with the category above
      const newCategories = [...categories];
      [newCategories[currentIndex - 1], newCategories[currentIndex]] =
        [newCategories[currentIndex], newCategories[currentIndex - 1]];

      return {
        homeCategories: newCategories,
        saveStatus: 'unsaved',
      };
    }),

  moveHomeCategoryDown: (categoryName) =>
    set((state) => {
      const categories = state.homeCategories || [];
      const currentIndex = categories.indexOf(categoryName);

      if (currentIndex < 0 || currentIndex >= categories.length - 1) return state;

      // Swap with the category below
      const newCategories = [...categories];
      [newCategories[currentIndex], newCategories[currentIndex + 1]] =
        [newCategories[currentIndex + 1], newCategories[currentIndex]];

      return {
        homeCategories: newCategories,
        saveStatus: 'unsaved',
      };
    }),

  moveShopCategoryUp: (shopId, categoryName) =>
    set((state) => ({
      shops: state.shops.map((shop) => {
        if (shop.id !== shopId) return shop;

        const categories = shop.categories || [];
        const currentIndex = categories.indexOf(categoryName);

        if (currentIndex <= 0) return shop;

        // Swap with the category above
        const newCategories = [...categories];
        [newCategories[currentIndex - 1], newCategories[currentIndex]] =
          [newCategories[currentIndex], newCategories[currentIndex - 1]];

        return {
          ...shop,
          categories: newCategories,
        };
      }),
      saveStatus: 'unsaved',
    })),

  moveShopCategoryDown: (shopId, categoryName) =>
    set((state) => ({
      shops: state.shops.map((shop) => {
        if (shop.id !== shopId) return shop;

        const categories = shop.categories || [];
        const currentIndex = categories.indexOf(categoryName);

        if (currentIndex < 0 || currentIndex >= categories.length - 1) return shop;

        // Swap with the category below
        const newCategories = [...categories];
        [newCategories[currentIndex], newCategories[currentIndex + 1]] =
          [newCategories[currentIndex + 1], newCategories[currentIndex]];

        return {
          ...shop,
          categories: newCategories,
        };
      }),
      saveStatus: 'unsaved',
    })),

  // Data persistence
  loadData: (data) => {
    // Ensure all categories are in the list
    const uniqueHomeCategories = getUniqueHomeCategories(data.items);
    const homeCategories = ensureCategories(uniqueHomeCategories, data.homeCategories);

    // Ensure shop categories
    const shops = data.shops.map((shop) => {
      const uniqueShopCategories = getUniqueShopCategories(data.items, shop.id);
      return {
        ...shop,
        categories: ensureCategories(uniqueShopCategories, shop.categories),
      };
    });

    set({
      items: data.items,
      shops,
      selection: data.selection,
      homeCategories,
      saveStatus: 'saved',
    });
  },

  reset: () =>
    set({
      ...initialState,
      fileHandle: null,
      saveStatus: 'saved',
    }),

  // Utility getters
  getItemById: (itemId) => get().items.find((item) => item.id === itemId),

  getShopById: (shopId) => get().shops.find((shop) => shop.id === shopId),

  getItemsForShop: (shopId, selectedOnly) => {
    const state = get();
    return state.items.filter((item) => {
      // Check if item is available at this shop
      const isAvailableAtShop = item.shopAvailability.some(
        (avail) => avail.shopId === shopId
      );

      if (!isAvailableAtShop) return false;

      // If selectedOnly, also check if item is selected
      if (selectedOnly) {
        return state.selection.includes(item.id);
      }

      return true;
    });
  },
}));
