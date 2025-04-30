import type { Meta, StoryObj } from '@storybook/react';
import { Table } from '../shared-ui/Table';

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
];

export const Basic: Story = {
  args: {
    data: sampleData,
    columns: [
      { key: 'name', header: 'Name' },
      { key: 'email', header: 'Email' },
      { key: 'role', header: 'Role' },
    ],
  },
};

export const WithCustomRendering: Story = {
  args: {
    data: sampleData,
    columns: [
      { key: 'name', header: 'Name' },
      { key: 'email', header: 'Email' },
      {
        key: 'role',
        header: 'Role',
        render: (item) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.role === 'Admin' ? 'bg-blue-100 text-blue-800' :
            item.role === 'Editor' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {item.role}
          </span>
        ),
      },
    ],
  },
};