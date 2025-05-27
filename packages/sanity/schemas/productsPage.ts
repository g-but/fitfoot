import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'productsPage',
  type: 'document',
  title: 'Products Page',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Page Title',
      initialValue: 'Products',
    }),
    defineField({
      name: 'heroTitle',
      type: 'string',
      title: 'Hero Title',
      initialValue: 'Our Products',
    }),
    defineField({
      name: 'heroSubtitle',
      type: 'text',
      title: 'Hero Subtitle',
      initialValue: 'Discover our collection of premium footwear and accessories, each piece designed in Switzerland and crafted with the finest materials.',
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
      name: 'filterButtons',
      type: 'array',
      title: 'Filter Buttons',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              type: 'string',
              title: 'Button Label',
            },
            {
              name: 'value',
              type: 'string',
              title: 'Filter Value',
              description: 'The product type to filter by (e.g., "sneaker", "bag", "cap") or "all" for all products',
            },
          ],
        },
      ],
      initialValue: [
        { label: 'All Products', value: 'all' },
        { label: 'Sneakers', value: 'sneaker' },
        { label: 'Bags', value: 'bag' },
        { label: 'Caps', value: 'cap' },
      ],
    }),
    defineField({
      name: 'ctaSection',
      type: 'object',
      title: 'Call to Action Section',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'CTA Title',
          initialValue: "Can't find what you're looking for?",
        },
        {
          name: 'description',
          type: 'text',
          title: 'CTA Description',
          initialValue: "Get in touch with our team. We're always working on new designs and would love to hear from you.",
        },
        {
          name: 'buttonText',
          type: 'string',
          title: 'Button Text',
          initialValue: 'Contact Us',
        },
        {
          name: 'buttonLink',
          type: 'string',
          title: 'Button Link',
          initialValue: '/contact',
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