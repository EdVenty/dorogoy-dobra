import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { News } from '../News';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'DD/News',
  component: News,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof News>;

const Template: ComponentStory<typeof News> = (args) => <News {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
    image: 'https://cdn.eso.org/images/thumb300y/eso1907a.jpg',
    alt: 'Black hole',
    date: '16.02.22',
    description: 'Lorem ipsum sit ametLorem ipsum sit ametLorem ipsum sit ametLorem ipsum sit ametLorem ipsum sit amet',
    title: 'Lorem ipsum'
};