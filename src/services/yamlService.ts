import yaml from 'js-yaml';
import { ShoppingListData } from '../types';

export class YamlService {
  /**
   * Serialize data to YAML format
   */
  serialize(data: ShoppingListData): string {
    return yaml.dump(data, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
      sortKeys: false,
    });
  }

  /**
   * Deserialize YAML string to data
   */
  deserialize(yamlString: string): ShoppingListData {
    try {
      const data = yaml.load(yamlString) as ShoppingListData;

      // Validate structure
      this.validateData(data);

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse YAML: ${error.message}`);
      }
      throw new Error('Failed to parse YAML: Unknown error');
    }
  }

  /**
   * Validate data structure
   */
  private validateData(data: any): void {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data: must be an object');
    }

    if (!Array.isArray(data.items)) {
      throw new Error('Invalid data: items must be an array');
    }

    if (!Array.isArray(data.shops)) {
      throw new Error('Invalid data: shops must be an array');
    }

    if (!data.selection || typeof data.selection !== 'object') {
      throw new Error('Invalid data: selection must be an object');
    }

    if (!Array.isArray(data.selection.selectedItemIds)) {
      throw new Error(
        'Invalid data: selection.selectedItemIds must be an array'
      );
    }

    // Validate items structure
    data.items.forEach((item: any, index: number) => {
      if (!item.id || typeof item.id !== 'string') {
        throw new Error(`Invalid item at index ${index}: id is required`);
      }
      if (!item.name || typeof item.name !== 'string') {
        throw new Error(`Invalid item at index ${index}: name is required`);
      }
      if (!item.homeCategory || typeof item.homeCategory !== 'string') {
        throw new Error(
          `Invalid item at index ${index}: homeCategory is required`
        );
      }
      if (!Array.isArray(item.shopAvailability)) {
        throw new Error(
          `Invalid item at index ${index}: shopAvailability must be an array`
        );
      }

      // Validate shop availability
      item.shopAvailability.forEach((avail: any, availIndex: number) => {
        if (!avail.shopId || typeof avail.shopId !== 'string') {
          throw new Error(
            `Invalid item at index ${index}, shopAvailability at index ${availIndex}: shopId is required`
          );
        }
        if (!avail.shopCategory || typeof avail.shopCategory !== 'string') {
          throw new Error(
            `Invalid item at index ${index}, shopAvailability at index ${availIndex}: shopCategory is required`
          );
        }
      });
    });

    // Validate shops structure
    data.shops.forEach((shop: any, index: number) => {
      if (!shop.id || typeof shop.id !== 'string') {
        throw new Error(`Invalid shop at index ${index}: id is required`);
      }
      if (!shop.name || typeof shop.name !== 'string') {
        throw new Error(`Invalid shop at index ${index}: name is required`);
      }
    });
  }

  /**
   * Create empty/default shopping list data
   */
  createDefaultData(): ShoppingListData {
    return {
      items: [],
      shops: [],
      selection: {
        selectedItemIds: [],
      },
    };
  }
}

export const yamlService = new YamlService();
