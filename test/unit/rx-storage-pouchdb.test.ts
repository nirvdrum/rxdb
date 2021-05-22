import assert from 'assert';

import config from './config';
import * as humansCollection from './../helper/humans-collection';
import * as schemaObjects from '../helper/schema-objects';
import {
    getRxStoragePouch,
    addRxPlugin,
    RxStoragePouch,
    randomCouchString,
    getPseudoSchemaForVersion,
    getFromMapOrThrow
} from '../../plugins/core';

import { RxDBKeyCompressionPlugin } from '../../plugins/key-compression';
addRxPlugin(RxDBKeyCompressionPlugin);
import { RxDBValidatePlugin } from '../../plugins/validate';
addRxPlugin(RxDBValidatePlugin);

import { RxDBQueryBuilderPlugin } from '../../plugins/query-builder';
addRxPlugin(RxDBQueryBuilderPlugin);

config.parallel('rx-storage-pouchdb.test.js', () => {
    const storage: RxStoragePouch = getRxStoragePouch('memory');

    describe('.getSortComparator()', () => {
        it('should sort in the correct order', async () => {
            const col = await humansCollection.create(1);

            const query = col
                .find()
                .limit(1000)
                .sort('age')
                .toJSON();
            const comparator = col.storageInstance.getSortComparator(
                query
            );
            const doc1: any = schemaObjects.human();
            doc1._id = 'aa';
            doc1.age = 1;
            const doc2: any = schemaObjects.human();
            doc2._id = 'bb';
            doc2.age = 100;

            // should sort in the correct order
            assert.deepStrictEqual(
                [doc1, doc2],
                [doc1, doc2].sort(comparator)
            );
            col.database.destroy();
        });
    });
    describe('.getQueryMatcher()', () => {
        it('should match the right docs', async () => {
            const col = await humansCollection.create(1);

            const queryMatcher = col.storageInstance.getQueryMatcher(
                col.find({
                    selector: {
                        age: {
                            $gt: 10,
                            $ne: 50
                        }
                    }
                }).toJSON()
            );

            const doc1: any = schemaObjects.human();
            doc1._id = 'aa';
            doc1.age = 1;
            const doc2: any = schemaObjects.human();
            doc2._id = 'bb';
            doc2.age = 100;

            assert.strictEqual(queryMatcher(doc1), false);
            assert.strictEqual(queryMatcher(doc2), true);

            col.database.destroy();
        });
    });
    describe('RxStorageInstance', () => {
        describe('RxStorageInstance.bulkWrite()', () => {
            it('should write the documents', async () => {
                const storageInstance = await storage.createStorageInstance(
                    randomCouchString(12),
                    randomCouchString(12),
                    getPseudoSchemaForVersion(0, 'key'),
                    {}
                );

                const writeResponse = await storageInstance.bulkWrite(
                    false,
                    [{
                        key: 'foobar',
                        value: 'barfoo'
                    }]
                );

                assert.strictEqual(writeResponse.error.size, 0);
                const first = getFromMapOrThrow(writeResponse.success, 'foobar');
                assert.strictEqual(first.key, 'foobar');
                assert.strictEqual(first.value, 'barfoo');
                assert.ok(first._rev);

                storageInstance.close();
            });
            it('should error on conflict', async () => {
                const storageInstance = await storage.createStorageInstance(
                    randomCouchString(12),
                    randomCouchString(12),
                    getPseudoSchemaForVersion(0, 'key'),
                    {}
                );

                const writeData = [{
                    key: 'foobar',
                    value: 'barfoo'
                }];

                await storageInstance.bulkWrite(
                    false,
                    writeData
                );
                const writeResponse = await storageInstance.bulkWrite(
                    false,
                    writeData
                );

                assert.strictEqual(writeResponse.success.size, 0);
                const first = getFromMapOrThrow(writeResponse.error, 'foobar');
                assert.strictEqual(first.status, 409);
                assert.strictEqual(first.documentId, 'foobar');
                assert.ok(first.document);

                storageInstance.close();
            });
        });
    });
    describe('RxStorageKeyObjectInstance', () => {
        describe('RxStorageKeyObjectInstance.bulkWrite()', () => {
            it('should write the documents', async () => {
                const storageInstance = await storage.createKeyObjectStorageInstance(
                    randomCouchString(12),
                    {}
                );

                const writeResponse = await storageInstance.bulkWrite(
                    false,
                    [{
                        _id: 'foobar',
                        value: 'barfoo'
                    }]
                );

                assert.strictEqual(writeResponse.error.size, 0);
                const first = getFromMapOrThrow(writeResponse.success, 'foobar');
                assert.strictEqual(first._id, 'foobar');
                assert.strictEqual(first.value, 'barfoo');

                storageInstance.close();
            });
            it('should error on conflict', async () => {
                const storageInstance = await storage.createKeyObjectStorageInstance(
                    randomCouchString(12),
                    {}
                );

                const writeData = [{
                    _id: 'foobar',
                    value: 'barfoo'
                }];

                await storageInstance.bulkWrite(
                    false,
                    writeData
                );
                const writeResponse = await storageInstance.bulkWrite(
                    false,
                    writeData
                );

                assert.strictEqual(writeResponse.success.size, 0);
                const first = getFromMapOrThrow(writeResponse.error, 'foobar');
                assert.strictEqual(first.status, 409);
                assert.strictEqual(first.documentId, 'foobar');
                assert.ok(first.document);

                storageInstance.close();
            });
        });
    });
});
