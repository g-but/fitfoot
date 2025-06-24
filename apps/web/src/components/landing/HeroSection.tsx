'use client';

import { ArrowRight, Leaf, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-white"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background/60"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-20 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200 mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Join 2,847 people walking sustainably</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Every step feels good.
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Inside and out.
            </span>
          </h1>

          {/* Value Proposition */}
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Premium Swiss footwear that's kind to your feet and the planet. Choose from brand new eco-friendly designs or expertly refurbished favorites.
          </p>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-2 mb-12">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white"></div>
            </div>
            <div className="flex items-center gap-1 ml-3">
              <div className="flex text-yellow-400">
                {'★'.repeat(5)}
              </div>
              <span className="text-sm text-gray-600 ml-2">4.9/5 from 847 reviews</span>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16">
            <Link href="/shop" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                Find Your Perfect Fit
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                How It Works
              </button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6 sm:gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-green-600" />
              <span>Free shipping over CHF 100</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>30-day guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-600" />
              <span>Carbon neutral delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 