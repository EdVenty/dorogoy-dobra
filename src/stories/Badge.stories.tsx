import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Badge } from '../Badge';

export default {
  title: 'DD/Badge',
  component: Badge,
  argTypes: {},
} as ComponentMeta<typeof Badge>;

const Template: ComponentStory<typeof Badge> = (args) => <Badge {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Facebook_like_thumb.png/1196px-Facebook_like_thumb.png',
};
