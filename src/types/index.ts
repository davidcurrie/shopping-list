// Core data types
export interface Item {
  id: string;
  name: string;
  homeCategory: string;
  notes?: string;
  shopAvailability: ShopAvailability[];
}

export interface ShopAvailability {
  shopId: string;
  shopCategory?: string;
}

export interface Shop {
  id: string;
  name: string;
  categories?: string[];
}

// Root data structure - this is what gets saved to YAML
export interface ShoppingListData {
  items: Item[];
  shops: Shop[];
  selection: string[];
  homeCategories?: string[];
}

// UI-specific types for organizing items by category
export interface HomeCategory {
  name: string;
  items: Item[];
}

export interface ShopCategory {
  name: string;
  items: Item[];
}

// File system types
export interface FileHandleState {
  handle: FileSystemFileHandle | null;
  hasPermission: boolean;
}

// Save status for UI indicator
export type SaveStatus = 'saved' | 'saving' | 'error' | 'unsaved';
