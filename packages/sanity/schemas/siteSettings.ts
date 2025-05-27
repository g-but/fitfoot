import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'siteSettings',
  type: 'document',
  title: 'Site Settings',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Site Title',
      initialValue: 'Fitfoot - Swiss-designed quality footwear',
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Site Description',
      initialValue: 'Step into quality. Designed in Switzerland. Premium footwear and accessories crafted with genuine materials.',
    }),
    defineField({
      name: 'keywords',
      type: 'array',
      title: 'SEO Keywords',
      of: [{ type: 'string' }],
      initialValue: ['footwear', 'shoes', 'Swiss design', 'quality', 'leather', 'accessories'],
    }),
    defineField({
      name: 'siteUrl',
      type: 'url',
      title: 'Site URL',
      initialValue: 'https://fitfoot.ch',
    }),
    defineField({
      name: 'logo',
      type: 'object',
      title: 'Logo',
      fields: [
        {
          name: 'text',
          type: 'string',
          title: 'Logo Text',
          initialValue: 'Fitfoot',
        },
        {
          name: 'image',
          type: 'image',
          title: 'Logo Image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'navigation',
      type: 'array',
      title: 'Main Navigation',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              type: 'string',
              title: 'Label',
            },
            {
              name: 'href',
              type: 'string',
              title: 'Link',
            },
          ],
        },
      ],
      initialValue: [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
    }),
    defineField({
      name: 'headerCta',
      type: 'object',
      title: 'Header Call-to-Action',
      fields: [
        {
          name: 'text',
          type: 'string',
          title: 'Button Text',
          initialValue: 'Shop Now',
        },
        {
          name: 'link',
          type: 'string',
          title: 'Button Link',
          initialValue: '/products',
        },
      ],
    }),
    defineField({
      name: 'footer',
      type: 'object',
      title: 'Footer',
      fields: [
        {
          name: 'brandDescription',
          type: 'text',
          title: 'Brand Description',
          initialValue: 'Step into quality. Designed in Switzerland. Premium footwear and accessories crafted with genuine materials.',
        },
        {
          name: 'quickLinks',
          type: 'object',
          title: 'Quick Links Section',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Section Title',
              initialValue: 'Quick Links',
            },
            {
              name: 'links',
              type: 'array',
              title: 'Links',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'label',
                      type: 'string',
                      title: 'Label',
                    },
                    {
                      name: 'href',
                      type: 'string',
                      title: 'Link',
                    },
                  ],
                },
              ],
              initialValue: [
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/products' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ],
            },
          ],
        },
        {
          name: 'productsSection',
          type: 'object',
          title: 'Products Section',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Section Title',
              initialValue: 'Products',
            },
            {
              name: 'links',
              type: 'array',
              title: 'Product Links',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'label',
                      type: 'string',
                      title: 'Label',
                    },
                    {
                      name: 'href',
                      type: 'string',
                      title: 'Link',
                    },
                  ],
                },
              ],
              initialValue: [
                { label: 'Sneakers', href: '/products?type=sneaker' },
                { label: 'Bags', href: '/products?type=bag' },
                { label: 'Caps', href: '/products?type=cap' },
              ],
            },
          ],
        },
        {
          name: 'contactSection',
          type: 'object',
          title: 'Contact Section',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Section Title',
              initialValue: 'Contact',
            },
            {
              name: 'location',
              type: 'string',
              title: 'Location',
              initialValue: 'Switzerland',
            },
            {
              name: 'email',
              type: 'string',
              title: 'Email',
              initialValue: 'info@fitfoot.ch',
            },
            {
              name: 'socialLinks',
              type: 'array',
              title: 'Social Media Links',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'platform',
                      type: 'string',
                      title: 'Platform',
                      options: {
                        list: [
                          { title: 'Twitter', value: 'twitter' },
                          { title: 'Facebook', value: 'facebook' },
                          { title: 'Instagram', value: 'instagram' },
                          { title: 'LinkedIn', value: 'linkedin' },
                          { title: 'Pinterest', value: 'pinterest' },
                        ],
                      },
                    },
                    {
                      name: 'url',
                      type: 'url',
                      title: 'URL',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'copyright',
          type: 'string',
          title: 'Copyright Text',
          initialValue: '© 2025 Fitfoot. All rights reserved. Designed in Switzerland.',
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
}) 