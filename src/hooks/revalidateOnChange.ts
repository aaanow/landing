import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Creates an afterChange hook that revalidates the given paths.
 * Paths can be static strings or a function that receives the doc and returns paths.
 */
export function revalidateAfterChange(
  paths: string[] | ((doc: Record<string, unknown>) => string[]),
): CollectionAfterChangeHook {
  return ({ doc }) => {
    const pathsToRevalidate = typeof paths === 'function' ? paths(doc) : paths

    for (const path of pathsToRevalidate) {
      revalidatePath(path)
    }

    return doc
  }
}

/**
 * Creates an afterDelete hook that revalidates the given paths.
 */
export function revalidateAfterDelete(
  paths: string[] | ((doc: Record<string, unknown>) => string[]),
): CollectionAfterDeleteHook {
  return ({ doc }) => {
    const pathsToRevalidate = typeof paths === 'function' ? paths(doc) : paths

    for (const path of pathsToRevalidate) {
      revalidatePath(path)
    }

    return doc
  }
}

/**
 * Creates a global afterChange hook that revalidates the given paths.
 */
export function revalidateGlobalAfterChange(paths: string[]): GlobalAfterChangeHook {
  return ({ doc }) => {
    for (const path of paths) {
      revalidatePath(path)
    }

    return doc
  }
}
