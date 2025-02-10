export class ProviderBackup {
  static async exportConfig(providerId) {
    try {
      const config = await this.fetchProviderConfig(providerId)
      const backup = {
        timestamp: new Date().toISOString(),
        provider: providerId,
        config,
        version: "1.0"
      }

      // Create downloadable file
      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: 'application/json'
      })
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `provider-${providerId}-backup-${new Date().toISOString()}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      return true
    } catch (error) {
      console.error('Export failed:', error)
      throw new Error('Failed to export provider configuration')
    }
  }

  static async importConfig(file) {
    try {
      const content = await this.readFileContent(file)
      const config = JSON.parse(content)
      
      // Validate backup format
      if (!this.validateBackup(config)) {
        throw new Error('Invalid backup file format')
      }

      return config
    } catch (error) {
      console.error('Import failed:', error)
      throw new Error('Failed to import provider configuration')
    }
  }

  static validateBackup(config) {
    const requiredFields = ['timestamp', 'provider', 'config', 'version']
    return requiredFields.every(field => config.hasOwnProperty(field))
  }

  static async readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(e)
      reader.readAsText(file)
    })
  }
}