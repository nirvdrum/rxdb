/**
 * this is the default rxdb-export
 * It has a batteries-included guarantee.
 * It basically just rxdb-core with some default plugins
 */

import {
    addRxPlugin,
    createRxDatabase as createRxDatabaseCore
} from './core';

// default plugins
import { RxDBDevModePlugin } from './plugins/dev-mode';
import { RxDBValidatePlugin } from './plugins/validate';
import { RxDBKeyCompressionPlugin } from './plugins/key-compression';
import { RxDBMigrationPlugin } from './plugins/migration';
import { RxDBLeaderElectionPlugin } from './plugins/leader-election';
import { RxDBEncryptionPlugin } from './plugins/encryption';
import { RxDBUpdatePlugin } from './plugins/update';
import { RxDBReplicationCouchDBPlugin } from './plugins/replication-couchdb';
import { RxDBJsonDumpPlugin } from './plugins/json-dump';
import { RxDBInMemoryPlugin } from './plugins/in-memory';
import { RxDBAttachmentsPlugin } from './plugins/attachments';
import { RxDBLocalDocumentsPlugin } from './plugins/local-documents';
import { RxDBQueryBuilderPlugin } from './plugins/query-builder';
import type { CreateRxDatabaseFunction } from './types';


let defaultPluginsAdded: boolean = false;
export function addDefaultRxPlugins() {
    if (defaultPluginsAdded) {
        return;
    }
    defaultPluginsAdded = true;

    addRxPlugin(RxDBDevModePlugin);
    addRxPlugin(RxDBValidatePlugin);
    addRxPlugin(RxDBKeyCompressionPlugin);
    addRxPlugin(RxDBMigrationPlugin);
    addRxPlugin(RxDBLeaderElectionPlugin);
    addRxPlugin(RxDBEncryptionPlugin);
    addRxPlugin(RxDBUpdatePlugin);
    addRxPlugin(RxDBReplicationCouchDBPlugin);
    addRxPlugin(RxDBJsonDumpPlugin);
    addRxPlugin(RxDBInMemoryPlugin);
    addRxPlugin(RxDBAttachmentsPlugin);
    addRxPlugin(RxDBLocalDocumentsPlugin);
    addRxPlugin(RxDBQueryBuilderPlugin);
}

/**
 * Because we have set sideEffects: false
 * in the package.json, we have to ensure that the default plugins
 * are added before the first database is created.
 * So we have to wrap the createRxDatabase function.
 */
export const createRxDatabase: CreateRxDatabaseFunction = (params) => {
    addDefaultRxPlugins();
    return createRxDatabaseCore(params);
}

// re-export things from core
export * from './core';

export * from './plugins/pouchdb';
