import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'contactPage',
  type: 'document',
  title: 'Contact Page',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Page Title',
      initialValue: 'Contact',
    }),
    defineField({
      name: 'heroTitle',
      type: 'string',
      title: 'Hero Title',
      initialValue: 'Get in Touch',
    }),
    defineField({
      name: 'heroSubtitle',
      type: 'text',
      title: 'Hero Subtitle',
      initialValue: "Have questions about our products or want to learn more about Fitfoot? We'd love to hear from you.",
    }),
    defineField({
      name: 'contactInfoTitle',
      type: 'string',
      title: 'Contact Information Title',
      initialValue: 'Contact Information',
    }),
    defineField({
      name: 'contactMethods',
      type: 'array',
      title: 'Contact Methods',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              type: 'string',
              title: 'Contact Type',
              options: {
                list: [
                  { title: 'Email', value: 'email' },
                  { title: 'Phone', value: 'phone' },
                  { title: 'Location', value: 'location' },
                  { title: 'Hours', value: 'hours' },
                ],
              },
            },
            {
              name: 'title',
              type: 'string',
              title: 'Title',
            },
            {
              name: 'details',
              type: 'array',
              title: 'Details',
              of: [{ type: 'string' }],
            },
            {
              name: 'icon',
              type: 'string',
              title: 'Icon Name',
              description: 'Icon identifier for the contact method',
            },
          ],
        },
      ],
      initialValue: [
        {
          type: 'email',
          title: 'Email',
          details: ['info@fitfoot.ch', 'support@fitfoot.ch'],
          icon: 'email',
        },
        {
          type: 'location',
          title: 'Location',
          details: ['Switzerland', 'Designed with Swiss precision'],
          icon: 'location',
        },
      ],
    }),
    defineField({
      name: 'formTitle',
      type: 'string',
      title: 'Contact Form Title',
      initialValue: 'Send us a Message',
    }),
    defineField({
      name: 'formFields',
      type: 'array',
      title: 'Form Fields',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              type: 'string',
              title: 'Field Name',
            },
            {
              name: 'label',
              type: 'string',
              title: 'Field Label',
            },
            {
              name: 'type',
              type: 'string',
              title: 'Field Type',
              options: {
                list: [
                  { title: 'Text', value: 'text' },
                  { title: 'Email', value: 'email' },
                  { title: 'Textarea', value: 'textarea' },
                ],
              },
            },
            {
              name: 'placeholder',
              type: 'string',
              title: 'Placeholder Text',
            },
            {
              name: 'required',
              type: 'boolean',
              title: 'Required Field',
              initialValue: false,
            },
          ],
        },
      ],
      initialValue: [
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'your.email@example.com',
          required: true,
        },
        {
          name: 'message',
          label: 'Message',
          type: 'textarea',
          placeholder: 'Tell us how we can help you...',
          required: true,
        },
      ],
    }),
    defineField({
      name: 'submitButtonText',
      type: 'string',
      title: 'Submit Button Text',
      initialValue: 'Send Message',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}) 