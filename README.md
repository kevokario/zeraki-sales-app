### Zeraki Sales App

This is a responsive sales agent dashboard designed to facilitate the management of school accounts, invoicing, and collections. The dashboard provides comprehensive functionality and user access to various modules, including the Dashboard Module and Schools Module.

---

### Requirements

#### 1. Environment Setup
- Node 18 required.
- To run the application, execute `npm run start` to start the application and `npm run serve` to start json-server.
- After successful launch of app, register and login.

#### 2. Objective
Develop a responsive sales agent dashboard that facilitates the management of school accounts, invoicing, and collections, including data visualization for targets and sign-ups.

#### 3. Background
Zeraki is committed to revolutionizing education across Africa by providing high-quality tools. This dashboard is part of an internal system aimed at streamlining operations for sales agents, enabling them to manage relationships with schools efficiently.

#### 4. Features to Implement

**A. Side Navigation**
- Implement a side navigation bar dividing the application into two primary modules:
  - Dashboard Module: Display dynamic counters for Collections, Sign-ups, Total Revenue, and Bounced Cheques.
  - Schools Module: Manage relationships with schools, including detailed information on invoices and collections.

**B. Dashboard Overview**
- Implement top card metrics for monitoring key performance indicators:
  - Collections
  - Sign-ups breakdown by product
  - Total Revenue breakdown by product
  - Bounced Cheques

**C. Targets Visualization**
- Implement pie charts to visualize the progress towards signup targets for Zeraki's products.
- Each chart should differentiate between the set target and the target achieved.

**D. Signups Overview**
- Use bar graphs to represent the distribution of sign-ups across different types of schools for each product.
- Enable detailed analysis based on product performance in different educational sectors.

**E. Upcoming Invoices**
- Display a list of upcoming invoices with quick actions for payment collection.
- Enable direct payment collection from the list.

**F. School Management**
- Implement an interface to manage and view detailed information on each school.
- Provide comprehensive management of invoices per school with enhanced filtering and CRUD capabilities.
- Manage collections per school effectively with capabilities to update invoice statuses based on collection outcomes.

---

### Conclusion

The Zeraki Sales App meets all requirements for a comprehensive sales agent dashboard, facilitating efficient management of school accounts, invoicing, and collections. It provides valuable insights through data visualization and streamlines operations for sales agents, contributing to Zeraki's mission of revolutionizing education in Africa.
