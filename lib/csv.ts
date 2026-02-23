/**
 * Parse a CSV string into an array of row objects keyed by column names.
 * Handles quoted fields with commas, newlines, and escaped quotes ("") inside them.
 */
export function parseCSV(content: string, columns: string[]): Record<string, string>[] {
  const rows: Record<string, string>[] = []
  const fields: string[] = []
  let current = ''
  let inQuotes = false
  let i = 0

  // Skip the header line
  while (i < content.length && content[i] !== '\n') i++
  i++ // skip the newline

  function pushField() {
    fields.push(current)
    current = ''
  }

  function pushRow() {
    pushField()
    if (fields.some((f) => f.trim() !== '')) {
      const row: Record<string, string> = {}
      columns.forEach((col, idx) => {
        row[col] = (fields[idx] || '').trim()
      })
      rows.push(row)
    }
    fields.length = 0
  }

  while (i < content.length) {
    const char = content[i]

    if (inQuotes) {
      if (char === '"') {
        // Check for escaped quote ""
        if (i + 1 < content.length && content[i + 1] === '"') {
          current += '"'
          i += 2
          continue
        }
        // End of quoted field
        inQuotes = false
        i++
        continue
      }
      current += char
      i++
    } else {
      if (char === '"') {
        inQuotes = true
        i++
      } else if (char === ',') {
        pushField()
        i++
      } else if (char === '\n' || char === '\r') {
        pushRow()
        // Skip \r\n
        if (char === '\r' && i + 1 < content.length && content[i + 1] === '\n') {
          i++
        }
        i++
      } else {
        current += char
        i++
      }
    }
  }

  // Push the last row if there's remaining content
  if (current || fields.length > 0) {
    pushRow()
  }

  return rows
}
