# Shopping List

A mobile application used to record items needed from the shops, designed to make it easier to regularly buy the same items.

## User Experience

At home, the user is presented with a list of items that they have purchased previously.
They can select those that they need to purchase.
The items are organised into categories that might represent, for example, cupboards at home.
New items can be added to the list.
Those new items are selected by default.

For example, the list might show:

- Fridge
  - Butter: Yes
  - Cheese: No
  - Chicken: Yes
  - Milk: Yes
- Cupboard 1
  - Porridge: Yes
  - Digestives: Yes
- Vegetable drawer
  - Carrots: Yes
  - Potatoes: No

When out, the user can select a shop.
The application shows the items that are needed, and that are available in that shop.
The items may be categorised differently for each shop.
Some shops might not have all of the items that are needed.

For example, from the list above, Sainsburys might show:

- Dairy
  - Butter
  - Milk
- Meat
  - Chicken
- Snacks
  - Digestives
- Cereals
  - Porridge

And the greengrocers might just show:

- Uncategorized
  - Carrots

In the shop, items are deselected as they are added to the basket.

## Technical

The application should be implemented as a Progressive Web Application (PWA) hosted on GitHub pages.
It should be implemented in Typescript, using React, and Material UI.
It should be installable locally, and usable offline.
The list should be stored as a human-readable file on the mobile device.
The user should be able to select the location of the file so that, for example, it can be in a location where it will by synchronized between devices by Google Drive.

### Data Storage

- **File format**: YAML for human-readability and ease of manual editing
- **File access**: Use the File System Access API to read/write user-chosen files
- **Data structure**:
  - Items have: name, home category, notes (optional), shop availability mappings
  - Shops have: name, available items with shop-specific categories
  - Selection state: which items are currently needed

### User Interface

- **Navigation**: Material UI drawer navigation (hamburger menu) with sections:
  - Home: View/edit items by home categories
  - Shops: Select a shop and view available items
  - Settings: Manage items, shops, and file location
- **Mobile-first design**: Optimized for mobile device usage

### Item and Shop Management

- **Shop configuration**: Users manually configure:
  - Which items are available at each shop
  - Shop-specific category for each item at that shop
- **Item metadata**: Items include an optional notes field for brand preferences, specifications, etc.

### Selection Behavior

- At home, users select items they need to purchase
- In shop view, users deselect items as they add them to their basket
- When an item is deselected in a shop, it is also deselected in the home view
- Items not purchased remain selected in the home view for the next shopping trip
