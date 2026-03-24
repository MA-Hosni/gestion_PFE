export async function fileToBase64(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result
      if (typeof result === "string") resolve(result)
      else reject(new Error("Failed to read file"))
    }

    reader.onerror = () => reject(new Error("Failed to read file"))

    reader.readAsDataURL(file)
  })
}

