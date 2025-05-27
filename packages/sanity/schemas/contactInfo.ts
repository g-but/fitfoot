import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'contactInfo',
  type: 'document',
  title: 'Contact Information',
  fields: [
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      type: 'string',
      title: 'Phone',
    }),
    defineField({
      name: 'address',
      type: 'object',
      title: 'Address',
      fields: [
        {
          name: 'street',
          type: 'string',
          title: 'Street',
        },
        {
          name: 'city',
          type: 'string',
          title: 'City',
        },
        {
          name: 'postalCode',
          type: 'string',
          title: 'Postal Code',
        },
        {
          name: 'country',
          type: 'string',
          title: 'Country',
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      type: 'object',
      title: 'Social Media Links',
      fields: [
        {
          name: 'instagram',
          type: 'url',
          title: 'Instagram',
        },
        {
          name: 'facebook',
          type: 'url',
          title: 'Facebook',
        },
        {
          name: 'twitter',
          type: 'url',
          title: 'Twitter',
        },
        {
          name: 'linkedin',
          type: 'url',
          title: 'LinkedIn',
        },
      ],
    }),
    defineField({
      name: 'businessHours',
      type: 'array',
      title: 'Business Hours',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'day',
              type: 'string',
              title: 'Day',
              options: {
                list: [
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday',
                ],
              },
            },
            {
              name: 'hours',
              type: 'string',
              title: 'Hours',
              description: 'e.g., "9:00 AM - 5:00 PM" or "Closed"',
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'email',
    },
    prepare(selection) {
      const {title} = selection
      return {
        title: 'Contact Information',
        subtitle: title,
      }
    },
  },
}) 