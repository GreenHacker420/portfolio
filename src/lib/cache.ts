/**
 * Cache invalidation service for API endpoints
 * NOTE: Do not import from route files here. Next.js App Router route modules
 * must only export supported symbols (GET/POST/etc.). Importing helper
 * functions from routes can also cause circular dependencies during build.
 *
 * If we later adopt tag-based caching, we can use revalidateTag here instead.
 */

export class CacheManager {
  /**
   * Invalidate all caches
   */
  static invalidateAll() {
    try {
      // Placeholder invalidation hooks. Implement with revalidateTag or
      // application-level caches if needed.
      console.log('✅ All caches invalidated (noop)')
    } catch (error) {
      console.error('❌ Error invalidating caches:', error)
    }
  }

  /**
   * Invalidate skills cache
   */
  static invalidateSkills() {
    try {
      console.log('✅ Skills cache invalidated (noop)')
    } catch (error) {
      console.error('❌ Error invalidating skills cache:', error)
    }
  }

  /**
   * Invalidate projects cache
   */
  static invalidateProjects() {
    try {
      console.log('✅ Projects cache invalidated (noop)')
    } catch (error) {
      console.error('❌ Error invalidating projects cache:', error)
    }
  }

  /**
   * Invalidate cache based on resource type
   */
  static invalidateByResource(resource: string) {
    switch (resource) {
      case 'skills':
        this.invalidateSkills()
        break
      case 'projects':
        this.invalidateProjects()
        break
      case 'all':
        this.invalidateAll()
        break
      default:
        console.warn(`Unknown resource type for cache invalidation: ${resource}`)
    }
  }
}

/**
 * Middleware function to invalidate cache after successful operations
 */
export function withCacheInvalidation(resource: string) {
  return function(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function(...args: any[]) {
      try {
        const result = await method.apply(this, args)
        
        // Only invalidate cache if the operation was successful
        if (result && (result.ok !== false)) {
          CacheManager.invalidateByResource(resource)
        }
        
        return result
      } catch (error) {
        // Don't invalidate cache on errors
        throw error
      }
    }

    return descriptor
  }
}

export default CacheManager
