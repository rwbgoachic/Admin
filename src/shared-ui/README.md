# Paysurity Shared UI Components

This package contains a collection of reusable UI components for Paysurity applications.

## Installation

```bash
npm install @paysurity/shared-ui
```

## Components

### Button

A flexible button component with multiple variants and sizes.

```tsx
import { Button } from '@paysurity/shared-ui';

function Example() {
  return (
    <Button variant="primary" size="md">
      Click me
    </Button>
  );
}
```

Variants:
- `primary` (default)
- `secondary`
- `danger`
- `outline`
- `ghost`
- `link`

Sizes:
- `sm`
- `md` (default)
- `lg`
- `icon`

### Input

A form input component with support for labels, icons, and error states.

```tsx
import { Input } from '@paysurity/shared-ui';

function Example() {
  return (
    <Input
      label="Email"
      type="email"
      placeholder="Enter your email"
      error="Invalid email address"
    />
  );
}
```

### Table

A data table component with support for custom column rendering.

```tsx
import { Table } from '@paysurity/shared-ui';

function Example() {
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
  ];

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <Button onClick={() => handleAction(item)}>
          Edit
        </Button>
      ),
    },
  ];

  return <Table data={data} columns={columns} />;
}
```

### Form

A form component with built-in error handling and field grouping.

```tsx
import { Form, FormField } from '@paysurity/shared-ui';

function Example() {
  const errors = {
    email: 'Invalid email address',
  };

  return (
    <Form errors={errors} onSubmit={handleSubmit}>
      <FormField name="email" label="Email">
        <Input type="email" />
      </FormField>
    </Form>
  );
}
```

### Card

A card component for grouping related content.

```tsx
import { Card } from '@paysurity/shared-ui';

function Example() {
  return (
    <Card
      title="Card Title"
      footer={
        <Button>Action</Button>
      }
    >
      Card content goes here
    </Card>
  );
}
```

## Theming

Components use CSS variables for theming. You can customize the theme by overriding these variables in your CSS:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  /* ... other theme variables */
}
```

For dark mode support, use the `.dark` class:

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... other dark theme variables */
}
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start Storybook:
   ```bash
   npm run storybook
   ```

3. Build the package:
   ```bash
   npm run build
   ```

4. Run tests:
   ```bash
   npm test
   ```