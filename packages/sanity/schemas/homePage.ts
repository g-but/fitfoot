import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  type: 'document',
  title: 'Home Page',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Page Title',
      initialValue: 'Home',
    }),
    defineField({
      name: 'heroTitle',
      type: 'string',
      title: 'Hero Title',
      initialValue: 'Elevate your everyday. Crafted to perfection.',
    }),
    defineField({
      name: 'heroSubtitle',
      type: 'text',
      title: 'Hero Subtitle',
      initialValue: 'Premium footwear and accessories made with genuine materials and uncompromising attention to detail.',
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
      name: 'featuredProducts',
      type: 'array',
      title: 'Featured Products',
      of: [
        {
          type: 'reference',
          to: [{type: 'product'}],
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'aboutSection',
      type: 'object',
      title: 'Quality Excellence Section',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Section Title',
          initialValue: 'Premium Craftsmanship',
        },
        {
          name: 'description',
          type: 'text',
          title: 'Description',
          initialValue: 'Every Fitfoot product is crafted using only the finest materials. Our commitment to quality ensures that each piece not only looks exceptional but stands the test of time.',
        },
        {
          name: 'features',
          type: 'array',
          title: 'Features',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'text',
                  type: 'string',
                  title: 'Feature Text',
                },
              ],
            },
          ],
          initialValue: [
            { text: '100% genuine leather' },
            { text: 'Artisan craftsmanship' },
            { text: 'Ethically made' },
          ],
        },
        {
          name: 'image',
          type: 'image',
          title: 'Section Image',
          options: {
            hotspot: true,
          },
        },
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
        },
        {
          name: 'description',
          type: 'text',
          title: 'CTA Description',
        },
        {
          name: 'buttonText',
          type: 'string',
          title: 'Button Text',
        },
        {
          name: 'buttonLink',
          type: 'string',
          title: 'Button Link',
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