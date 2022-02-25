import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Video } from '../Video';

export default {
  title: 'DD/Video',
  component: Video,
  argTypes: {},
} as ComponentMeta<typeof Video>;

const Template: ComponentStory<typeof Video> = (args) => <Video {...args} />;

export const YouTube = Template.bind({});
YouTube.args = {
  src: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
  title: "Заголовок",
  description: 'Описание'
};