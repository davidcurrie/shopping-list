import { create } from 'zustand';
import { Item, Shop, ShoppingListData, SaveStatus } from '../types';
import { getUniqueHomeCategories, getUniqueShopCategories, ensureCategoryOrder } from '../utils/categoryHelpers';

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
  selection: {
    selectedItemIds: [],
  },
  homeCategoryOrder: [],
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
      const selectedIds = state.selection.selectedItemIds;
      const isSelected = selectedIds.includes(itemId);

      return {
        selection: {
          selectedItemIds: isSelected
            ? selectedIds.filter((id) => id !== itemId)
            : [...selectedIds, itemId],
        },
        saveStatus: 'unsaved',
      };
    }),

  deselectItem: (itemId) =>
    set((state) => ({
      selection: {
        selectedItemIds: state.selection.selectedItemIds.filter(
          (id) => id !== itemId
        ),
      },
      saveStatus: 'unsaved',
    })),

  selectItem: (itemId) =>
    set((state) => {
      if (state.selection.selectedItemIds.includes(itemId)) {
        return state;
      }
      return {
        selection: {
          selectedItemIds: [...state.selection.selectedItemIds, itemId],
        },
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

      // Ensure category order includes the new category
      const homeCategories = getUniqueHomeCategories(newItems);
      const homeCategoryOrder = ensureCategoryOrder(homeCategories, state.homeCategoryOrder);

      return {
        items: newItems,
        homeCategoryOrder,
        // Auto-select new items
        selection: {
          selectedItemIds: [...state.selection.selectedItemIds, newItem.id],
        },
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
      selection: {
        selectedItemIds: state.selection.selectedItemIds.filter(
          (id) => id !== itemId
        ),
      },
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

      // Ensure shop category order includes the new category
      const shopCategories = getUniqueShopCategories(updatedItems, shopId);
      const updatedShops = state.shops.map((shop) => {
        if (shop.id !== shopId) return shop;
        return {
          ...shop,
          categoryOrder: ensureCategoryOrder(shopCategories, shop.categoryOrder),
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
      const categoryOrder = state.homeCategoryOrder || [];
      const currentIndex = categoryOrder.findIndex((c) => c.name === categoryName);

      if (currentIndex <= 0) return state;

      const newOrder = [...categoryOrder];
      const temp = newOrder[currentIndex].order;
      newOrder[currentIndex].order = newOrder[currentIndex - 1].order;
      newOrder[currentIndex - 1].order = temp;

      return {
        homeCategoryOrder: newOrder,
        saveStatus: 'unsaved',
      };
    }),

  moveHomeCategoryDown: (categoryName) =>
    set((state) => {
      const categoryOrder = state.homeCategoryOrder || [];
      const currentIndex = categoryOrder.findIndex((c) => c.name === categoryName);

      if (currentIndex < 0 || currentIndex >= categoryOrder.length - 1) return state;

      const newOrder = [...categoryOrder];
      const temp = newOrder[currentIndex].order;
      newOrder[currentIndex].order = newOrder[currentIndex + 1].order;
      newOrder[currentIndex + 1].order = temp;

      return {
        homeCategoryOrder: newOrder,
        saveStatus: 'unsaved',
      };
    }),

  moveShopCategoryUp: (shopId, categoryName) =>
    set((state) => ({
      shops: state.shops.map((shop) => {
        if (shop.id !== shopId) return shop;

        const categoryOrder = shop.categoryOrder || [];
        const currentIndex = categoryOrder.findIndex((c) => c.name === categoryName);

        if (currentIndex <= 0) return shop;

        const newOrder = [...categoryOrder];
        const temp = newOrder[currentIndex].order;
        newOrder[currentIndex].order = newOrder[currentIndex - 1].order;
        newOrder[currentIndex - 1].order = temp;

        return {
          ...shop,
          categoryOrder: newOrder,
        };
      }),
      saveStatus: 'unsaved',
    })),

  moveShopCategoryDown: (shopId, categoryName) =>
    set((state) => ({
      shops: state.shops.map((shop) => {
        if (shop.id !== shopId) return shop;

        const categoryOrder = shop.categoryOrder || [];
        const currentIndex = categoryOrder.findIndex((c) => c.name === categoryName);

        if (currentIndex < 0 || currentIndex >= categoryOrder.length - 1) return shop;

        const newOrder = [...categoryOrder];
        const temp = newOrder[currentIndex].order;
        newOrder[currentIndex].order = newOrder[currentIndex + 1].order;
        newOrder[currentIndex + 1].order = temp;

        return {
          ...shop,
          categoryOrder: newOrder,
        };
      }),
      saveStatus: 'unsaved',
    })),

  // Data persistence
  loadData: (data) => {
    // Ensure all categories have orders
    const homeCategories = getUniqueHomeCategories(data.items);
    const homeCategoryOrder = ensureCategoryOrder(homeCategories, data.homeCategoryOrder);

    // Ensure shop category orders
    const shops = data.shops.map((shop) => {
      const shopCategories = getUniqueShopCategories(data.items, shop.id);
      return {
        ...shop,
        categoryOrder: ensureCategoryOrder(shopCategories, shop.categoryOrder),
      };
    });

    set({
      items: data.items,
      shops,
      selection: data.selection,
      homeCategoryOrder,
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
        return state.selection.selectedItemIds.includes(item.id);
      }

      return true;
    });
  },
}));
