export class Urls {
  static KEY = 'urls'
  static defaultValue = []
  static async getAll() {
    const result = await chrome.storage.local.get({ [this.KEY]: this.defaultValue })
    return result[this.KEY]
  }
  static async setMany(urls) {
    return chrome.storage.local.set({ [this.KEY]: urls })
  }
  static async set(url) {
    const urls = await this.getAll()
    return this.setMany([...urls, url]) 
  }
  static async remove(url) {
    const urls = await this.getAll()
    const filtered = urls.filter(x => x !== url)
    return this.setMany(filtered)
  }
}
