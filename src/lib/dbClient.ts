/**
 * Database Client with Automatic Fallback
 * Automatically switches to filesystem-based mock database when PostgreSQL is unavailable
 */

import { PrismaClient } from '@prisma/client';
import { mockDb, MockRecord } from './mockDb';

// Check if we should use mock database
const USE_MOCK_DB = process.env.USE_MOCK_DB === 'true' || process.env.DATABASE_URL === undefined;

let prismaInstance: PrismaClient | null = null;
let dbMode: 'postgres' | 'mock' = USE_MOCK_DB ? 'mock' : 'postgres';

/**
 * Get Prisma client instance
 */
function getPrismaClient(): PrismaClient | null {
  if (dbMode === 'mock') return null;
  
  if (!prismaInstance) {
    try {
      prismaInstance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      });
    } catch (error) {
      console.error('❌ Failed to initialize Prisma client:', error);
      dbMode = 'mock';
      return null;
    }
  }
  
  return prismaInstance;
}

/**
 * Test database connection
 */
async function testConnection(): Promise<boolean> {
  if (dbMode === 'mock') return false;
  
  try {
    const client = getPrismaClient();
    if (!client) return false;
    
    await client.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.warn('⚠️ PostgreSQL connection failed, falling back to mock database');
    dbMode = 'mock';
    return false;
  }
}

/**
 * Database Client Proxy
 * Automatically routes queries to PostgreSQL or mock database
 */
class DatabaseClient {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    if (dbMode === 'postgres') {
      const connected = await testConnection();
      if (!connected) {
        console.log('🔄 Switching to mock database mode');
        dbMode = 'mock';
      } else {
        console.log('✅ Connected to PostgreSQL database');
      }
    } else {
      console.log('📁 Using mock filesystem database');
      await mockDb.initialize();
    }
    
    this.initialized = true;
  }

  /**
   * Get the current database mode
   */
  getMode(): 'postgres' | 'mock' {
    return dbMode;
  }

  /**
   * Force switch to mock mode
   */
  async switchToMock() {
    dbMode = 'mock';
    await mockDb.initialize();
    console.log('🔄 Switched to mock database mode');
  }

  /**
   * Create a model proxy that routes to appropriate database
   */
  private createModelProxy(modelName: string) {
    return new Proxy({}, {
      get: (_, prop: string) => {
        return async (...args: any[]) => {
          await this.initialize();

          if (dbMode === 'postgres') {
            try {
              const client = getPrismaClient();
              if (!client) throw new Error('Prisma client not available');
              
              const model = (client as any)[modelName];
              if (!model || typeof model[prop] !== 'function') {
                throw new Error(`Method ${prop} not found on model ${modelName}`);
              }
              
              return await model[prop](...args);
            } catch (error) {
              console.error(`❌ PostgreSQL error on ${modelName}.${prop}:`, error);
              console.log('🔄 Falling back to mock database');
              dbMode = 'mock';
              await mockDb.initialize();
              // Retry with mock database
            }
          }

          // Use mock database
          const options = args[0] || {};
          
          switch (prop) {
            case 'findMany':
              return mockDb.findMany(modelName, options);
            case 'findUnique':
              return mockDb.findUnique(modelName, options);
            case 'findFirst':
              return mockDb.findFirst(modelName, options);
            case 'create':
              return mockDb.create(modelName, options);
            case 'update':
              return mockDb.update(modelName, options);
            case 'updateMany':
              return mockDb.updateMany(modelName, options);
            case 'delete':
              return mockDb.delete(modelName, options);
            case 'deleteMany':
              return mockDb.deleteMany(modelName, options);
            case 'count':
              return mockDb.count(modelName, options);
            case 'upsert':
              return mockDb.upsert(modelName, options);
            default:
              throw new Error(`Method ${prop} not implemented in mock database`);
          }
        };
      },
    });
  }

  // Model proxies
  get adminUser() { return this.createModelProxy('adminUser'); }
  get auditLog() { return this.createModelProxy('auditLog'); }
  get personalInfo() { return this.createModelProxy('personalInfo'); }
  get skill() { return this.createModelProxy('skill'); }
  get project() { return this.createModelProxy('project'); }
  get workExperience() { return this.createModelProxy('workExperience'); }
  get education() { return this.createModelProxy('education'); }
  get certification() { return this.createModelProxy('certification'); }
  get achievement() { return this.createModelProxy('achievement'); }
  get contact() { return this.createModelProxy('contact'); }
  get contactReply() { return this.createModelProxy('contactReply'); }
  get socialLink() { return this.createModelProxy('socialLink'); }
  get media() { return this.createModelProxy('media'); }
  get faq() { return this.createModelProxy('faq'); }
  get chatInteraction() { return this.createModelProxy('chatInteraction'); }
  get gitHubProfileCache() { return this.createModelProxy('gitHubProfileCache'); }
  get gitHubRepoCache() { return this.createModelProxy('gitHubRepoCache'); }
  get gitHubContributionCache() { return this.createModelProxy('gitHubContributionCache'); }
  get gitHubStatsCache() { return this.createModelProxy('gitHubStatsCache'); }
  get gitHubCacheAnalytics() { return this.createModelProxy('gitHubCacheAnalytics'); }
  get motiaWorkflow() { return this.createModelProxy('motiaWorkflow'); }
  get motiaExecution() { return this.createModelProxy('motiaExecution'); }
  get motiaAutomation() { return this.createModelProxy('motiaAutomation'); }
  get motiaAnalytics() { return this.createModelProxy('motiaAnalytics'); }
  get emailTemplate() { return this.createModelProxy('emailTemplate'); }
  get systemSettings() { return this.createModelProxy('systemSettings'); }

  /**
   * Execute raw query (PostgreSQL only)
   */
  async $queryRaw(query: any, ...args: any[]) {
    await this.initialize();
    
    if (dbMode === 'mock') {
      throw new Error('Raw queries are not supported in mock database mode');
    }
    
    const client = getPrismaClient();
    if (!client) throw new Error('Prisma client not available');
    
    return client.$queryRaw(query, ...args);
  }

  /**
   * Execute raw query (PostgreSQL only)
   */
  async $executeRaw(query: any, ...args: any[]) {
    await this.initialize();
    
    if (dbMode === 'mock') {
      throw new Error('Raw queries are not supported in mock database mode');
    }
    
    const client = getPrismaClient();
    if (!client) throw new Error('Prisma client not available');
    
    return client.$executeRaw(query, ...args);
  }

  /**
   * Disconnect from database
   */
  async $disconnect() {
    if (prismaInstance) {
      await prismaInstance.$disconnect();
      prismaInstance = null;
    }
  }
}

// Export singleton instance
export const db = new DatabaseClient();

// Export for backward compatibility
export { db as prisma };

// Initialize on import
db.initialize().catch(console.error);
