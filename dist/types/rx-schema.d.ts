import type { DeepMutable, DeepReadonly, PrimaryKey, RxJsonSchema } from './types';
export declare class RxSchema<T = any> {
    readonly jsonSchema: RxJsonSchema<T>;
    indexes: string[][];
    primaryPath: keyof T;
    finalFields: string[];
    constructor(jsonSchema: RxJsonSchema<T>);
    get version(): number;
    get normalized(): RxJsonSchema<T>;
    get topLevelFields(): (keyof T)[];
    get defaultValues(): {
        [P in keyof T]: T[P];
    };
    /**
        * true if schema contains at least one encrypted path
        */
    get crypt(): boolean;
    /**
     * get all encrypted paths
     */
    get encryptedPaths(): string[];
    /**
     * @overrides itself on the first call
     */
    get hash(): string;
    /**
     * checks if a given change on a document is allowed
     * Ensures that:
     * - primary is not modified
     * - final fields are not modified
     * @throws {Error} if not valid
     */
    validateChange(dataBefore: any, dataAfter: any): void;
    /**
     * validate if the obj matches the schema
     * @overwritten by plugin (required)
     * @param schemaPath if given, validates agains deep-path of schema
     * @throws {Error} if not valid
     * @param obj equal to input-obj
     */
    validate(_obj: any, _schemaPath?: string): void;
    /**
     * fills all unset fields with default-values if set
     */
    fillObjectWithDefaults(obj: any): any;
    /**
     * creates the schema-based document-prototype,
     * see RxCollection.getDocumentPrototype()
     */
    getDocumentPrototype(): any;
    getPrimaryOfDocumentData(documentData: Partial<T>): string;
    fillPrimaryKey(documentData: T): T;
}
export declare function getIndexes<T = any>(jsonSchema: RxJsonSchema<T>): string[][];
export declare function getPrimaryFieldOfPrimaryKey<RxDocType>(primaryKey: PrimaryKey<RxDocType>): keyof RxDocType;
/**
 * Returns the composed primaryKey of a document by its data.
 */
export declare function getComposedPrimaryKeyOfDocumentData<RxDocType>(jsonSchema: RxJsonSchema<RxDocType>, documentData: Partial<RxDocType>): string;
/**
 * array with previous version-numbers
 */
export declare function getPreviousVersions(schema: RxJsonSchema<any>): number[];
/**
 * returns the final-fields of the schema
 * @return field-names of the final-fields
 */
export declare function getFinalFields<T = any>(jsonSchema: RxJsonSchema<T>): string[];
/**
 * orders the schemas attributes by alphabetical order
 * @return jsonSchema - ordered
 */
export declare function normalize<T>(jsonSchema: RxJsonSchema<T>): RxJsonSchema<T>;
/**
 * fills the schema-json with default-settings
 * @return cloned schemaObj
 */
export declare function fillWithDefaultSettings<T = any>(schemaObj: RxJsonSchema<T>): RxJsonSchema<T>;
export declare function createRxSchema<T>(jsonSchema: RxJsonSchema<T>, runPreCreateHooks?: boolean): RxSchema<T>;
export declare function isInstanceOf(obj: any): boolean;
/**
 * Used as helper function the generate the document type out of the schema via typescript.
 * @link https://github.com/pubkey/rxdb/discussions/3467
 */
export declare function toTypedRxJsonSchema<T extends DeepReadonly<RxJsonSchema<any>>>(schema: T): DeepMutable<T>;
