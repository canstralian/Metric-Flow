// Fix storage.ts import in replitAuth.ts to avoid circular dependency or type mismatch
// We need to ensure replitAuth uses the `storage` export which implements IStorage
// but the original replitAuth.ts imported `authStorage`.
// Let's redirect `authStorage` to our main `storage` instance in `server/storage.ts`
// by overwriting `server/replit_integrations/auth/storage.ts` to re-export.

import { storage, type IStorage } from "../../storage";
export const authStorage = storage;
export type IAuthStorage = IStorage;
