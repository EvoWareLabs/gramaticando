export function copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text)
    } else {
      return Promise.reject("The Clipboard API is not supported in this browser.")
    }
  }
  
  