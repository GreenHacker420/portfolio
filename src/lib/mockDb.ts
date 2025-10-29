/**
 * Mock Database Service - Filesystem-based fallback
 * Used when PostgreSQL database is unavailable
 */

import fs from 'fs/promises';
import path from 'path';

const MOCK_DATA_DIR = path.join(process.cwd(), 'mock', 'data');

// Type definitions for mock data
export interface MockRecord {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export type WhereClause = {
  [key: string]: any;
};

export type OrderByClause = {
  [key: string]: 'asc' | 'desc';
};

export interface FindManyOptions {
  where?: WhereClause;
  orderBy?: OrderByClause | OrderByClause[];
  take?: number;
  skip?: number;
  select?: { [key: string]: boolean };
  include?: { [key: string]: boolean };
}

export interface FindUniqueOptions {
  where: WhereClause;
  select?: { [key: string]: boolean };
  include?: { [key: string]: boolean };
}

export interface CreateOptions {
  data: Partial<MockRecord>;
}

export interface UpdateOptions {
  where: WhereClause;
  data: Partial<MockRecord>;
}

export interface DeleteOptions {
  where: WhereClause;
}

class MockDatabase {
  private cache: Map<string, MockRecord[]> = new Map();
  private isInitialized = false;

  /**
   * Initialize the mock database by loading all JSON files
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const files = await fs.readdir(MOCK_DATA_DIR);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const tableName = file.replace('.json', '');
          const filePath = path.join(MOCK_DATA_DIR, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(content);
          this.cache.set(tableName, Array.isArray(data) ? data : [data]);
        }
      }

      this.isInitialized = true;
      console.log('✅ Mock database initialized with', this.cache.size, 'tables');
    } catch (error) {
      console.error('❌ Failed to initialize mock database:', error);
      throw error;
    }
  }

  /**
   * Get table name from model name (convert camelCase to kebab-case)
   */
  private getTableName(modelName: string): string {
    return modelName
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');
  }

  /**
   * Load data from file
   */
  private async loadTable(tableName: string): Promise<MockRecord[]> {
    if (!this.cache.has(tableName)) {
      await this.initialize();
    }
    return this.cache.get(tableName) || [];
  }

  /**
   * Save data to file
   */
  private async saveTable(tableName: string, data: MockRecord[]): Promise<void> {
    const filePath = path.join(MOCK_DATA_DIR, `${tableName}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    this.cache.set(tableName, data);
  }

  /**
   * Match a record against a where clause
   */
  private matchesWhere(record: MockRecord, where: WhereClause): boolean {
    for (const [key, value] of Object.entries(where)) {
      if (typeof value === 'object' && value !== null) {
        // Handle operators like { contains, equals, in, etc. }
        if ('equals' in value && record[key] !== value.equals) return false;
        if ('contains' in value && !String(record[key]).includes(value.contains)) return false;
        if ('in' in value && !value.in.includes(record[key])) return false;
        if ('not' in value && record[key] === value.not) return false;
        if ('gt' in value && !(record[key] > value.gt)) return false;
        if ('gte' in value && !(record[key] >= value.gte)) return false;
        if ('lt' in value && !(record[key] < value.lt)) return false;
        if ('lte' in value && !(record[key] <= value.lte)) return false;
      } else {
        if (record[key] !== value) return false;
      }
    }
    return true;
  }

  /**
   * Apply ordering to records
   */
  private applyOrderBy(records: MockRecord[], orderBy?: OrderByClause | OrderByClause[]): MockRecord[] {
    if (!orderBy) return records;

    const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
    
    return [...records].sort((a, b) => {
      for (const order of orderByArray) {
        for (const [key, direction] of Object.entries(order)) {
          const aVal = a[key];
          const bVal = b[key];
          
          if (aVal === bVal) continue;
          
          const comparison = aVal > bVal ? 1 : -1;
          return direction === 'asc' ? comparison : -comparison;
        }
      }
      return 0;
    });
  }

  /**
   * Apply select to records
   */
  private applySelect(record: MockRecord, select?: { [key: string]: boolean }): MockRecord {
    if (!select) return record;

    const result: MockRecord = { id: record.id };
    for (const [key, include] of Object.entries(select)) {
      if (include && key in record) {
        result[key] = record[key];
      }
    }
    return result;
  }

  /**
   * Find many records
   */
  async findMany(modelName: string, options: FindManyOptions = {}): Promise<MockRecord[]> {
    const tableName = this.getTableName(modelName);
    let records = await this.loadTable(tableName);

    // Apply where clause
    if (options.where) {
      records = records.filter(record => this.matchesWhere(record, options.where!));
    }

    // Apply ordering
    records = this.applyOrderBy(records, options.orderBy);

    // Apply skip
    if (options.skip) {
      records = records.slice(options.skip);
    }

    // Apply take
    if (options.take) {
      records = records.slice(0, options.take);
    }

    // Apply select
    if (options.select) {
      records = records.map(record => this.applySelect(record, options.select));
    }

    return records;
  }

  /**
   * Find unique record
   */
  async findUnique(modelName: string, options: FindUniqueOptions): Promise<MockRecord | null> {
    const tableName = this.getTableName(modelName);
    const records = await this.loadTable(tableName);

    const record = records.find(r => this.matchesWhere(r, options.where));
    
    if (!record) return null;

    return options.select ? this.applySelect(record, options.select) : record;
  }

  /**
   * Find first record
   */
  async findFirst(modelName: string, options: FindManyOptions = {}): Promise<MockRecord | null> {
    const results = await this.findMany(modelName, { ...options, take: 1 });
    return results[0] || null;
  }

  /**
   * Create a record
   */
  async create(modelName: string, options: CreateOptions): Promise<MockRecord> {
    const tableName = this.getTableName(modelName);
    const records = await this.loadTable(tableName);

    const newRecord: MockRecord = {
      id: options.data.id || `${tableName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...options.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    records.push(newRecord);
    await this.saveTable(tableName, records);

    return newRecord;
  }

  /**
   * Update a record
   */
  async update(modelName: string, options: UpdateOptions): Promise<MockRecord> {
    const tableName = this.getTableName(modelName);
    const records = await this.loadTable(tableName);

    const index = records.findIndex(r => this.matchesWhere(r, options.where));
    
    if (index === -1) {
      throw new Error(`Record not found in ${tableName}`);
    }

    records[index] = {
      ...records[index],
      ...options.data,
      updatedAt: new Date().toISOString(),
    };

    await this.saveTable(tableName, records);

    return records[index];
  }

  /**
   * Update many records
   */
  async updateMany(modelName: string, options: UpdateOptions): Promise<{ count: number }> {
    const tableName = this.getTableName(modelName);
    const records = await this.loadTable(tableName);

    let count = 0;
    const updatedRecords = records.map(record => {
      if (this.matchesWhere(record, options.where)) {
        count++;
        return {
          ...record,
          ...options.data,
          updatedAt: new Date().toISOString(),
        };
      }
      return record;
    });

    await this.saveTable(tableName, updatedRecords);

    return { count };
  }

  /**
   * Delete a record
   */
  async delete(modelName: string, options: DeleteOptions): Promise<MockRecord> {
    const tableName = this.getTableName(modelName);
    const records = await this.loadTable(tableName);

    const index = records.findIndex(r => this.matchesWhere(r, options.where));
    
    if (index === -1) {
      throw new Error(`Record not found in ${tableName}`);
    }

    const [deleted] = records.splice(index, 1);
    await this.saveTable(tableName, records);

    return deleted;
  }

  /**
   * Delete many records
   */
  async deleteMany(modelName: string, options: DeleteOptions): Promise<{ count: number }> {
    const tableName = this.getTableName(modelName);
    const records = await this.loadTable(tableName);

    const filtered = records.filter(r => !this.matchesWhere(r, options.where));
    const count = records.length - filtered.length;

    await this.saveTable(tableName, filtered);

    return { count };
  }

  /**
   * Count records
   */
  async count(modelName: string, options: { where?: WhereClause } = {}): Promise<number> {
    const tableName = this.getTableName(modelName);
    let records = await this.loadTable(tableName);

    if (options.where) {
      records = records.filter(record => this.matchesWhere(record, options.where!));
    }

    return records.length;
  }

  /**
   * Upsert a record (update if exists, create if not)
   */
  async upsert(modelName: string, options: {
    where: WhereClause;
    create: Partial<MockRecord>;
    update: Partial<MockRecord>;
  }): Promise<MockRecord> {
    const existing = await this.findUnique(modelName, { where: options.where });

    if (existing) {
      return this.update(modelName, {
        where: options.where,
        data: options.update,
      });
    } else {
      return this.create(modelName, {
        data: { ...options.create, ...options.where },
      });
    }
  }
}

// Export singleton instance
export const mockDb = new MockDatabase();

// Initialize on import
mockDb.initialize().catch(console.error);
