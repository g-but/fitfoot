import { act, renderHook, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CartProvider, useCart } from '../CartContext'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Test wrapper component
const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

// Mock product data
const mockProduct = {
  product: {
    id: 'prod_123',
    title: 'Test Shoe',
    description: 'A great test shoe',
    handle: 'test-shoe',
    thumbnail: '/test-image.jpg',
    variants: [
      {
        id: 'variant_123',
        title: 'Default',
        prices: [{ amount: 9999, currency_code: 'CHF' }]
      }
    ]
  }
}

describe('CartContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    mockFetch.mockClear()
  })

  describe('Cart Initialization', () => {
    it('should initialize with empty cart', () => {
      const { result } = renderHook(() => useCart(), { wrapper })
      
      expect(result.current.cart).toBeNull()
      expect(result.current.getItemCount()).toBe(0)
      expect(result.current.getCartTotal()).toBe(0)
    })

    it('should load cart from localStorage if available', async () => {
      const savedCart = {
        id: 'cart_123',
        items: [{
          id: 'item_1',
          product_id: 'prod_123',
          variant_id: 'variant_123',
          title: 'Test Shoe',
          quantity: 1,
          unit_price: 9999,
          total: 9999
        }],
        total: 9999,
        subtotal: 9999,
        tax_total: 0,
        shipping_total: 0,
        currency_code: 'CHF',
        item_count: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedCart))

      const { result } = renderHook(() => useCart(), { wrapper })

      await waitFor(() => {
        expect(result.current.cart).toEqual(savedCart)
        expect(result.current.getItemCount()).toBe(1)
      })
    })
  })

  describe('Add to Cart', () => {
    it('should add new item to cart', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct)
      })

      const { result } = renderHook(() => useCart(), { wrapper })

      await act(async () => {
        await result.current.addToCart('prod_123')
      })

      await waitFor(() => {
        expect(result.current.cart?.items).toHaveLength(1)
        expect(result.current.cart?.items[0]).toMatchObject({
          product_id: 'prod_123',
          variant_id: 'variant_123',
          title: 'Test Shoe',
          quantity: 1,
          unit_price: 9999,
          total: 9999
        })
        expect(result.current.getItemCount()).toBe(1)
        expect(result.current.getCartTotal()).toBe(9999)
      })
    })

    it('should increase quantity if item already exists', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct)
      })

      const { result } = renderHook(() => useCart(), { wrapper })

      // Add item first time
      await act(async () => {
        await result.current.addToCart('prod_123')
      })

      // Add same item again
      await act(async () => {
        await result.current.addToCart('prod_123')
      })

      await waitFor(() => {
        expect(result.current.cart?.items).toHaveLength(1)
        expect(result.current.cart?.items[0].quantity).toBe(2)
        expect(result.current.getItemCount()).toBe(2)
        expect(result.current.getCartTotal()).toBe(19998)
      })
    })

    it('should handle product fetch errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      })

      const { result } = renderHook(() => useCart(), { wrapper })

      await act(async () => {
        await result.current.addToCart('invalid_product')
      })

      await waitFor(() => {
        expect(result.current.error).toContain('Product not found')
        expect(result.current.cart?.items).toHaveLength(0)
      })
    })
  })

  describe('Update Quantity', () => {
    it('should update item quantity', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct)
      })

      const { result } = renderHook(() => useCart(), { wrapper })

      // Add item first
      await act(async () => {
        await result.current.addToCart('prod_123')
      })

      // Update quantity
      await act(async () => {
        await result.current.updateQuantity(result.current.cart!.items[0].id, 3)
      })

      await waitFor(() => {
        expect(result.current.cart?.items[0].quantity).toBe(3)
        expect(result.current.cart?.items[0].total).toBe(29997)
        expect(result.current.getItemCount()).toBe(3)
        expect(result.current.getCartTotal()).toBe(29997)
      })
    })

    it('should remove item when quantity is 0', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct)
      })

      const { result } = renderHook(() => useCart(), { wrapper })

      // Add item first
      await act(async () => {
        await result.current.addToCart('prod_123')
      })

      // Set quantity to 0
      await act(async () => {
        await result.current.updateQuantity(result.current.cart!.items[0].id, 0)
      })

      await waitFor(() => {
        expect(result.current.cart?.items).toHaveLength(0)
        expect(result.current.getItemCount()).toBe(0)
        expect(result.current.getCartTotal()).toBe(0)
      })
    })
  })

  describe('Remove from Cart', () => {
    it('should remove item from cart', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct)
      })

      const { result } = renderHook(() => useCart(), { wrapper })

      // Add item first
      await act(async () => {
        await result.current.addToCart('prod_123')
      })

      const itemId = result.current.cart!.items[0].id

      // Remove item
      await act(async () => {
        await result.current.removeFromCart(itemId)
      })

      await waitFor(() => {
        expect(result.current.cart?.items).toHaveLength(0)
        expect(result.current.getItemCount()).toBe(0)
        expect(result.current.getCartTotal()).toBe(0)
      })
    })
  })

  describe('Clear Cart', () => {
    it('should clear all items from cart', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct)
      })

      const { result } = renderHook(() => useCart(), { wrapper })

      // Add item first
      await act(async () => {
        await result.current.addToCart('prod_123')
      })

      // Clear cart
      await act(async () => {
        await result.current.clearCart()
      })

      await waitFor(() => {
        expect(result.current.cart?.items).toHaveLength(0)
        expect(result.current.getItemCount()).toBe(0)
        expect(result.current.getCartTotal()).toBe(0)
      })

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('fitfoot_cart')
    })
  })

  describe('Cart Persistence', () => {
    it('should save cart to localStorage when cart changes', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct)
      })

      const { result } = renderHook(() => useCart(), { wrapper })

      await act(async () => {
        await result.current.addToCart('prod_123')
      })

      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'fitfoot_cart',
          expect.stringContaining('"id"')
        )
      })
    })
  })

  describe('Utility Functions', () => {
    it('should check if product is in cart', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProduct)
      })

      const { result } = renderHook(() => useCart(), { wrapper })

      expect(result.current.isInCart('prod_123')).toBe(false)

      await act(async () => {
        await result.current.addToCart('prod_123')
      })

      await waitFor(() => {
        expect(result.current.isInCart('prod_123')).toBe(true)
        expect(result.current.isInCart('prod_123', 'variant_123')).toBe(true)
        expect(result.current.isInCart('prod_456')).toBe(false)
      })
    })

    it('should calculate cart totals correctly', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockProduct)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            product: {
              ...mockProduct.product,
              id: 'prod_456',
              title: 'Another Shoe',
              variants: [
                {
                  id: 'variant_456',
                  title: 'Default',
                  prices: [{ amount: 14999, currency_code: 'CHF' }]
                }
              ]
            }
          })
        })

      const { result } = renderHook(() => useCart(), { wrapper })

      // Add first item
      await act(async () => {
        await result.current.addToCart('prod_123', undefined, 2)
      })

      // Add second item
      await act(async () => {
        await result.current.addToCart('prod_456', undefined, 1)
      })

      await waitFor(() => {
        expect(result.current.getItemCount()).toBe(3)
        expect(result.current.getCartTotal()).toBe(34997) // (9999 * 2) + 14999
        expect(result.current.cart?.subtotal).toBe(34997)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useCart(), { wrapper })

      await act(async () => {
        await result.current.addToCart('prod_123')
      })

      await waitFor(() => {
        expect(result.current.error).toBeTruthy()
        expect(result.current.cart?.items).toHaveLength(0)
      })
    })

    it('should clear errors when clearError is called', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useCart(), { wrapper })

      await act(async () => {
        await result.current.addToCart('prod_123')
      })

      await waitFor(() => {
        expect(result.current.error).toBeTruthy()
      })

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })
}) 