# Admin Catalog Briefing

This project now includes an admin-only subscription catalog area where users with the `admin` role can manage the list of subscription products that regular users will later be able to select from.

## What the admin section does

The new admin area lives under the dashboard and is focused on catalog management, not user subscriptions.

From the UI, an admin can:

- View catalog entries in a table
- Sort rows by service name and price
- Search entries with a global filter
- Paginate through the list
- Create a new catalog entry through a modal form
- Edit an existing entry through a modal form
- Delete an entry with a confirmation dialog

The page is titled `Subscription Catalog` and describes its purpose as managing the subscription types and services available to users.

## Route and access control

Access to the admin area is protected after sign-in.

The main protection points are:

- `proxy.ts` checks every request before the page is rendered
- `auth.ts` also contains role awareness for admin routes
- `components/app-sidebar.tsx` only shows the Admin menu group when the current session role is `admin`

If a non-admin user tries to open an admin route, they are redirected back to the dashboard.

If a user is not signed in and tries to access the dashboard, they are redirected to the sign-in page.

The app is also locale-aware, so routes are handled with a language prefix such as `en` or `es`.

## Admin route structure

The catalog page is exposed under the dashboard admin area, using the localized route structure.

Relevant files:

- `app/[lang]/dashboard/admin/catalog/page.tsx`
- `app/[lang]/dashboard/layout.tsx`
- `components/app-sidebar.tsx`
- `proxy.ts`
- `auth.ts`

## How the catalog page works

The catalog page is currently implemented as a client component.

It uses:

- `@tanstack/react-table` for table rendering, sorting, filtering, and pagination
- `react-hook-form` plus `zod` for modal form validation
- `Dialog` for create/edit modals
- `AlertDialog` for delete confirmation
- `useState` for local page state

The page keeps catalog entries in local React state for now.

That means the current behavior is:

- Create adds a new row to the in-memory list
- Edit updates the row in the in-memory list
- Delete removes the row from the in-memory list

The page starts with sample data, so it behaves like a working admin UI prototype until real backend persistence is connected.

## Form fields

The catalog form supports the following fields:

- Service name
- Category
- Price
- Currency
- Billing cycle
- Description
- Logo URL
- Active / inactive status

Billing cycle values are defined in `src/types/catalog.ts` and include:

- weekly
- monthly
- quarterly
- yearly

## Create flow

When the admin clicks `Add Entry`, a create modal opens.

The create modal:

- Uses a shared form component inside the page
- Validates the entered values before submission
- Creates a new entry with a generated id and `created_at` timestamp
- Closes the dialog and resets the form after submission

## Edit flow

Each table row has an actions menu with an `Edit` option.

When edit is selected:

- The chosen row is loaded into the edit form
- The edit modal opens with the current values prefilled
- Saving changes updates the row and adds an `updated_at` timestamp

## Delete flow

Each row also has a `Delete` action.

Delete is protected by a confirmation dialog so the admin must confirm before the entry is removed from the list.

## Important current limitation

The admin catalog UI is functional, but it is still operating on local page state.

There is no backend persistence wired in yet, so:

- Refreshing the page resets the sample catalog data
- New entries are not saved to a server
- Edits and deletes are only temporary in the browser session

## Summary

This new admin section gives admins a dedicated catalog management screen with role-based access control, a searchable and sortable table, and modal-driven create/edit workflows.

The main thing to remember is that the UI is already in place, but the data handling is still local and will need API integration when you want the catalog to persist.
