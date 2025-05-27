import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'product',
  type: 'document',
  title: 'Product',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      type: 'string',
      title: 'Product Type',
      options: {
        list: [
          {title: 'Sneaker', value: 'sneaker'},
          {title: 'Bag', value: 'bag'},
          {title: 'Cap', value: 'cap'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      type: 'image',
      title: 'Hero Image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      type: 'array',
      title: 'Gallery',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'description',
      type: 'blockContent',
      title: 'Description',
    }),
    defineField({
      name: 'materials',
      type: 'string',
      title: 'Materials',
      initialValue: '100% genuine leather',
    }),
    defineField({
      name: 'designedIn',
      type: 'string',
      title: 'Designed In',
      initialValue: 'Switzerland',
    }),
    defineField({
      name: 'madeIn',
      type: 'string',
      title: 'Made In',
      initialValue: 'Turkey',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
      subtitle: 'type',
    },
  },
}) 