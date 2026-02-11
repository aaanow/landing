/**
 * Parse a CSV string into an array of row objects keyed by column names.
 * Handles quoted fields with commas inside them.
 */
export function parseCSV(content: string, columns: string[]): Record<string, string>[] {
  const lines = content.split('\n')
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const fields: string[] = []
    let current = ''
    let inQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        fields.push(current)
        current = ''
      } else {
        current += char
      }
    }
    fields.push(current)

    const row: Record<string, string> = {}
    columns.forEach((col, idx) => {
      row[col] = fields[idx] || ''
    })
    rows.push(row)
  }

  return rows
}
