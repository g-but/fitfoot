import { defineField, defineType } from 'sanity'

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
      name: 'heroSubline',
      type: 'string',
      title: 'Hero Subline (Gold Text)',
      initialValue: 'Last Forever',
      description: 'The golden highlighted text that appears below the main hero title',
    }),
    defineField({
      name: 'heroDescription',
      type: 'text',
      title: 'Hero Description',
      initialValue: 'Where precision meets purpose. Every product represents our commitment to exceptional quality and environmental responsibility.',
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
      name: 'collectionsTitle',
      type: 'string',
      title: 'Collections Section Title',
      initialValue: 'Our Product Lines',
    }),
    defineField({
      name: 'collectionsDescription',
      type: 'text',
      title: 'Collections Section Description',
      initialValue: 'Three collections, each designed with specific needs in mind, all sharing our commitment to quality and sustainability.',
    }),
    defineField({
      name: 'sustainabilityTitle',
      type: 'string',
      title: 'Sustainability Section Title',
      initialValue: "Don't Throw Away. Trade In.",
    }),
    defineField({
      name: 'sustainabilityDescription',
      type: 'text',
      title: 'Sustainability Section Description',
      initialValue: 'Your old shoes have value. We believe in circular fashion and zero waste. Send us your worn footwear and we\'ll give you a discount on your next purchase.',
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
          initialValue: 'Ready to Experience',
        },
        {
          name: 'subline',
          type: 'string',
          title: 'CTA Subline (Gold Text)',
          initialValue: 'Lasting Quality?',
        },
        {
          name: 'description',
          type: 'text',
          title: 'CTA Description',
          initialValue: 'Discover footwear that\'s built to last, designed to perform, and created with respect for our planet. Your perfect pair is waiting.',
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