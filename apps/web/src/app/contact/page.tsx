import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getContactPage } from '@/lib/sanity.queries'

export default async function ContactPage() {
  // Fetch data from Sanity
  const contactPageData = await getContactPage()
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-neutral-light py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
            {contactPageData?.heroTitle || 'Get in Touch'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {contactPageData?.heroSubtitle || "Have questions about our products or want to learn more about Fitfoot? We'd love to hear from you."}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-8">
                {contactPageData?.contactInfoTitle || 'Contact Information'}
              </h2>
              
              <div className="space-y-8">
                {contactPageData?.contactMethods && contactPageData.contactMethods.length > 0 ? (
                  contactPageData.contactMethods.map((method, index: number) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-accent/10 p-3 rounded-lg">
                        {method.icon === 'email' ? (
                          <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        ) : method.icon === 'location' ? (
                          <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-2">{method.title}</h3>
                        {method.details?.map((detail: string, detailIndex: number) => (
                          <p key={detailIndex} className="text-gray-600">{detail}</p>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    {/* Email */}
                    <div className="flex items-start space-x-4">
                      <div className="bg-accent/10 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-2">Email</h3>
                        <p className="text-gray-600">info@fitfoot.ch</p>
                        <p className="text-gray-600">support@fitfoot.ch</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start space-x-4">
                      <div className="bg-accent/10 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-2">Location</h3>
                        <p className="text-gray-600">Switzerland</p>
                        <p className="text-gray-600">Designed with Swiss precision</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-8">
                {contactPageData?.formTitle || 'Send us a Message'}
              </h2>
              
              <form className="space-y-6">
                {contactPageData?.formFields && contactPageData.formFields.length > 0 ? (
                  contactPageData.formFields.map((field, index: number) => (
                    <div key={index}>
                      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          id={field.name}
                          name={field.name}
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder={field.placeholder}
                          required={field.required}
                        ></textarea>
                      ) : (
                        <input
                          type={field.type}
                          id={field.name}
                          name={field.name}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                          placeholder={field.placeholder}
                          required={field.required}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="Tell us how we can help you..."
                      ></textarea>
                    </div>
                  </>
                )}

                <Button type="submit" variant="accent" size="lg" className="w-full">
                  {contactPageData?.submitButtonText || 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 