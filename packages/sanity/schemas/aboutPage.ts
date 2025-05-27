import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'aboutPage',
  type: 'document',
  title: 'About Page',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Page Title',
      initialValue: 'About',
    }),
    defineField({
      name: 'content',
      type: 'blockContent',
      title: 'Main Content',
    }),
    defineField({
      name: 'heroImage',
      type: 'image',
      title: 'Hero Image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'teamSection',
      type: 'object',
      title: 'Team Section',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Section Title',
        },
        {
          name: 'description',
          type: 'blockContent',
          title: 'Description',
        },
        {
          name: 'teamMembers',
          type: 'array',
          title: 'Team Members',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'name',
                  type: 'string',
                  title: 'Name',
                },
                {
                  name: 'role',
                  type: 'string',
                  title: 'Role',
                },
                {
                  name: 'image',
                  type: 'image',
                  title: 'Photo',
                  options: {
                    hotspot: true,
                  },
                },
                {
                  name: 'bio',
                  type: 'text',
                  title: 'Bio',
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'valuesSection',
      type: 'object',
      title: 'Values Section',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Section Title',
        },
        {
          name: 'values',
          type: 'array',
          title: 'Values',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'title',
                  type: 'string',
                  title: 'Value Title',
                },
                {
                  name: 'description',
                  type: 'text',
                  title: 'Description',
                },
                {
                  name: 'icon',
                  type: 'string',
                  title: 'Icon Name',
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
    },
  },
}) 