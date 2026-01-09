# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Progressive Web Application (PWA) for managing shopping lists with offline capability and multi-device synchronization. The app allows users to maintain a master list of items at home, then view shop-specific filtered lists when out shopping.

**Key Technical Requirements:**
- Typescript + React + Material UI
- PWA with offline support
- Deployed to GitHub Pages
- User-selectable file storage location (for cloud sync via Google Drive, etc.)
- Human-readable file format for the shopping list data

## Architecture Principles

### Data Model
The application has a dual-category system:
- **Home categories**: Organize items by storage location (e.g., "Fridge", "Cupboard 1")
- **Shop-specific categories**: Each shop has its own category mapping (e.g., "Dairy", "Meat" at Sainsburys)
- Items can be available at some shops but not others

### User Workflow
1. **At home**: Select items from master list organized by home categories
2. **At shop**: Choose a shop, see filtered list of needed items in shop-specific categories
3. **While shopping**: Deselect items as they're added to basket

### File Storage Strategy
The list must be stored as a human-readable file that:
- Lives on the mobile device
- Can be placed in a user-chosen location (e.g., Google Drive folder)
- Enables cross-device synchronization through the user's chosen cloud service

## Development Commands

- **Development server**: `npm run dev` (runs on http://localhost:5173/shopping-list/)
- **Build**: `npm run build` (outputs to dist/)
- **Preview build**: `npm run preview`
- **Deploy to GitHub Pages**: `npm run deploy`
- **Linting**: `npm run lint`

## PWA Requirements

The application must:
- Include a valid manifest.json with app metadata
- Register a service worker for offline functionality
- Be installable on mobile devices
- Function completely offline once installed
- Handle file system access for user-chosen storage locations

## GitHub Pages Deployment

Configure the repository for GitHub Pages deployment from the appropriate branch (typically `gh-pages` or `main`/`docs` folder).
