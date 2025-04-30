import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../shared-ui/components/Card';
import { Button } from '../shared-ui/Button';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    title: 'Card Title',
    children: 'This is the card content.',
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Card with Footer',
    children: 'This card has a footer with actions.',
    footer: (
      <div className="flex justify-end space-x-2">
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </div>
    ),
  },
};

export const CustomTitle: Story = {
  args: {
    title: (
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Custom Title</h3>
        <Button variant="ghost" size="sm">Action</Button>
      </div>
    ),
    children: 'This card has a custom title component.',
  },
};