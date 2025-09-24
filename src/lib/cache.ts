/**
 * Cache invalidation service for API endpoints
 * Used to invalidate caches when data is modified through admin operations
 */

// Import cache invalidation functions
import { invalidateSkillsCache } from '@/app/api/skills/route'
import { invalidateProjectsCache } from '@/app/api/projects/route'

export class CacheManager {
  /**
   * Invalidate all caches
   */
  static invalidateAll() {
    try {
      invalidateSkillsCache()
      invalidateProjectsCache()
      console.log('✅ All caches invalidated')
    } catch (error) {
      console.error('❌ Error invalidating caches:', error)
    }
  }

  /**
   * Invalidate skills cache
   */
  static invalidateSkills() {
    try {
      invalidateSkillsCache()
      console.log('✅ Skills cache invalidated')
    } catch (error) {
      console.error('❌ Error invalidating skills cache:', error)
    }
  }

  /**
   * Invalidate projects cache
   */
  static invalidateProjects() {
    try {
      invalidateProjectsCache()
      console.log('✅ Projects cache invalidated')
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
