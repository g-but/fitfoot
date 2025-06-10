import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('Utility Functions', () => {
  describe('cn (className merger)', () => {
    it('should merge class names correctly', () => {
      const result = cn('base', 'additional')
      expect(result).toBe('base additional')
    })
    
    it('should handle conditional classes', () => {
      const result = cn('base', false && 'hidden', 'visible')
      expect(result).toBe('base visible')
    })
    
    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'valid')
      expect(result).toBe('base valid')
    })
    
    it('should handle arrays of classes', () => {
      const result = cn(['base', 'test'], 'additional')
      expect(result).toBe('base test additional')
    })
    
    it('should handle duplicate classes (clsx behavior)', () => {
      const result = cn('base', 'base', 'different')
      expect(result).toBe('base base different')
    })
    
    it('should handle empty input', () => {
      const result = cn()
      expect(result).toBe('')
    })
  })
}) 