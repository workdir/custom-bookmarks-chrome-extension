// Urls.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Urls } from './urls.js' // Adjust path as needed

// Mock chrome.storage.local
global.chrome = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn()
    }
  }
}

describe('Urls', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('should return empty array when no urls are stored', async () => {
      chrome.storage.local.get.mockResolvedValue({ urls: [] })
      
      const result = await Urls.getAll()
      
      expect(result).toEqual([])
      expect(chrome.storage.local.get).toHaveBeenCalledWith({ urls: [] })
    })

    it('should return urls', async () => {
      const mockUrls = ['https://example.com', 'https://test.com']
      chrome.storage.local.get.mockResolvedValue({ 
        urls: mockUrls
      })
      
      const result = await Urls.getAll()
      
      expect(result).toEqual(mockUrls)
    })
  })

  describe('set', () => {
    it('should add a new url to existing urls', async () => {
      const existingUrls = ['https://example.com']
      chrome.storage.local.get.mockResolvedValue({ 
        urls: existingUrls 
      })

      chrome.storage.local.set.mockResolvedValue(undefined)
      
      await Urls.set('https://newurl.com')
      
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        urls: [...existingUrls, 'https://newurl.com']
      })
    })

    it('should add url to empty list', async () => {
      chrome.storage.local.get.mockResolvedValue({ urls: [] })
      chrome.storage.local.set.mockResolvedValue(undefined)
      
      await Urls.set('https://first.com')
      
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        urls: ['https://first.com']
      })
    })
  })

  describe('setMany', () => {
    it('should save multiple urls', async () => {
      const urls = ['https://a.com', 'https://b.com', 'https://c.com']
      chrome.storage.local.set.mockResolvedValue(undefined)
      
      await Urls.setMany(urls)
      
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        urls: urls
      })
    })

    it('should save empty array', async () => {
      chrome.storage.local.set.mockResolvedValue(undefined)
      
      await Urls.setMany([])
      
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        urls: []
      })
    })
  })

  describe('remove', () => {
    it('should remove specific url from list', async () => {
      const urls = ['https://a.com', 'https://b.com', 'https://c.com']
      chrome.storage.local.get.mockResolvedValue({ 
        urls: urls 
      })
      chrome.storage.local.set.mockResolvedValue(undefined)
      
      await Urls.remove('https://b.com')
      
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        urls: ['https://a.com', 'https://c.com']
      })
    })

    it('should handle removing non-existent url', async () => {
      const urls = ['https://a.com']
      chrome.storage.local.get.mockResolvedValue({ 
        urls: urls 
      })
      chrome.storage.local.set.mockResolvedValue(undefined)
      
      await Urls.remove('https://nonexistent.com')
      
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        urls: ['https://a.com']
      })
    })

    it('should handle empty list', async () => {
      chrome.storage.local.get.mockResolvedValue({ urls: [] })
      chrome.storage.local.set.mockResolvedValue(undefined)
      
      await Urls.remove('https://any.com')
      
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        urls: []
      })
    })
  })
})
