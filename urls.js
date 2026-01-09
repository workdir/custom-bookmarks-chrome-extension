export class Urls {
  static KEY = 'urls'
  static defaultValue = []
  static async getAll() {
    const result = await chrome.storage.local.get({ [this.KEY]: this.defaultValue })
    return this.deserialize(result[this.KEY])
  }
  static async setMany(urls) {
    return chrome.storage.local.set({ [this.KEY]: this.serialize(urls) })
  }
  static async set(url) {
    const urls = await this.getAll()
    urls.push(url)
    return this.setMany(urls) 
  }
  static async remove(url) {
    const urls = await this.getAll()
    const filtered = urls.filter(x => x !== url)
    return this.setMany(filtered)
  }
  static deserialize(urls) {
    return JSON.parse(urls)
  }
  static serialize(urls) {
    return JSON.stringify(urls)
  }
}
