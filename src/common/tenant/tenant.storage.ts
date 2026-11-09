import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContext {
  parishId: string;
}

export const tenantStorage = new AsyncLocalStorage<TenantContext>();