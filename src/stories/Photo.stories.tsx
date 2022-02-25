import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Photo } from '../Photo';

export default {
  title: 'DD/Photo',
  component: Photo,
  argTypes: {},
} as ComponentMeta<typeof Photo>;

const Template: ComponentStory<typeof Photo> = (args) => <Photo {...args} />;

export const Circle = Template.bind({});
Circle.args = {
  variant: 'circle',
  src: 'https://images.unsplash.com/photo-1612151855475-877969f4a6cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&w=1000&q=80',
  alt: 'Some image'
};

export const Square = Template.bind({});
Square.args = {
  variant: 'square',
  src: 'https://images.unsplash.com/photo-1612151855475-877969f4a6cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&w=1000&q=80',
  alt: 'Some image'
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  src: 'https://images.unsplash.com/photo-1612151855475-877969f4a6cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&w=1000&q=80',
};

export const Small = Template.bind({});
Small.args = {
    size: 'small',
    src: 'https://images.unsplash.com/photo-1612151855475-877969f4a6cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&w=1000&q=80',
};
