import type { TypesaurusCore } from './core'
import type { TypesaurusUtils } from '../utils'

export namespace TypesaurusTransaction {
  export interface Function {
    <
      Schema extends TypesaurusCore.PlainSchema,
      Environment extends
        | TypesaurusCore.RuntimeEnvironment
        | undefined = undefined
    >(
      db: TypesaurusCore.DB<Schema>,
      options?: TypesaurusCore.OperationOptions<Environment>
    ): ReadChain<Schema, Environment>
  }

  /**
   * The document reference type.
   */
  export interface ReadRef<
    ModelPair extends TypesaurusCore.ModelPathPair,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > {
    type: 'ref'
    collection: ReadCollection<ModelPair, Environment>
    id: ModelPair[1] /* Id */
  }

  /**
   * The document reference type.
   */
  export interface WriteRef<
    ModelPair extends TypesaurusCore.ModelPathPair,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > extends DocAPI<ModelPair, Environment> {
    type: 'ref'
    collection: WriteCollection<ModelPair, Environment>
    id: ModelPair[1] /* Id */
  }

  export type DocAPI<
    ModelPair extends TypesaurusCore.ModelPathPair,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > = {
    set(
      data: TypesaurusCore.WriteModelArg<ModelPair[0] /* Model */, Environment>
    ): void

    update(
      data: TypesaurusCore.UpdateModelArg<ModelPair[0] /* Model */, Environment>
    ): void

    upset(
      data: TypesaurusCore.WriteModelArg<ModelPair[0] /* Model */, Environment>
    ): void

    remove(): void
  }

  /**
   * The document type. It contains the reference in the DB and the model data.
   */
  export type ReadDoc<
    ModelPair extends TypesaurusCore.ModelPathPair,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > = Environment extends 'server'
    ? ReadServerDoc<ModelPair>
    : Environment extends 'client'
    ? ReadClientDoc<ModelPair>
    : ReadServerDoc<ModelPair> | ReadClientDoc<ModelPair>

  export interface ReadServerDoc<
    ModelPair extends TypesaurusCore.ModelPathPair
  > {
    type: 'doc'
    ref: ReadRef<ModelPair, 'server'>
    data: TypesaurusCore.ModelNodeData<ModelPair[0] /* Model */>
    environment: 'server'
    source?: undefined
    dateStrategy?: undefined
    pendingWrites?: undefined
  }

  export interface ReadClientDoc<
    ModelPair extends TypesaurusCore.ModelPathPair
  > {
    type: 'doc'
    ref: ReadRef<ModelPair, 'client'>
    data: TypesaurusCore.AnyModelData<ModelPair[0] /* Model */, 'present'>
    environment: 'web'
    source: 'database'
    dateStrategy?: undefined
    pendingWrites?: undefined
  }

  /**
   * The document type. It contains the reference in the DB and the model data.
   */
  export type WriteDoc<
    ModelPair extends TypesaurusCore.ModelPathPair,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > = Environment extends 'server'
    ? WriteServerDoc<ModelPair>
    : Environment extends 'client'
    ? WriteClientDoc<ModelPair>
    : WriteServerDoc<ModelPair> | WriteClientDoc<ModelPair>

  export interface WriteServerDoc<
    ModelPair extends TypesaurusCore.ModelPathPair
  > extends DocAPI<ModelPair, 'server'> {
    type: 'doc'
    ref: WriteRef<ModelPair, 'server'>
    data: TypesaurusCore.ModelNodeData<ModelPair[0] /* Model */>
    environment: 'server'
    source?: undefined
    dateStrategy?: undefined
    pendingWrites?: undefined
  }

  export interface WriteClientDoc<
    ModelPair extends TypesaurusCore.ModelPathPair
  > extends DocAPI<ModelPair, 'client'> {
    type: 'doc'
    ref: WriteRef<ModelPair, 'client'>
    data: TypesaurusCore.AnyModelData<ModelPair[0] /* Model */, 'present'>
    environment: 'web'
    source: 'database'
    dateStrategy?: undefined
    pendingWrites?: undefined
  }

  export type AnyWriteCollection<
    ModelPair extends TypesaurusCore.ModelPathPair,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > =
    | WriteCollection<ModelPair, Environment>
    | NestedWriteCollection<ModelPair, WriteSchema<Environment>, Environment>

  export interface WriteSchema<
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > {
    [CollectionPath: string]: AnyWriteCollection<
      TypesaurusCore.ModelPathPair,
      Environment
    >
  }

  export interface NestedWriteCollection<
    ModelPair extends TypesaurusCore.ModelPathPair,
    NestedSchema extends WriteSchema<Environment>,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > extends WriteCollection<ModelPair, Environment> {
    (id: ModelPair[1] /* Id */): NestedSchema
  }

  /**
   *
   */
  export interface WriteCollection<
    ModelPair extends TypesaurusCore.ModelPathPair,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > extends TypesaurusCore.PlainCollection<ModelPair> {
    /** The Firestore path */
    path: string

    set(
      id: ModelPair[1] /* Id */,
      data: TypesaurusCore.WriteModelArg<ModelPair[0] /* Model */, Environment>
    ): void

    upset(
      id: ModelPair[1] /* Id */,
      data: TypesaurusCore.WriteModelArg<ModelPair[0] /* Model */, Environment>
    ): void

    update(
      id: ModelPair[1] /* Id */,
      data: TypesaurusCore.UpdateModelArg<ModelPair[0] /* Model */, Environment>
    ): void

    remove(id: ModelPair[1] /* Id */): void
  }

  export type AnyReadCollection<
    ModelPair extends TypesaurusCore.ModelPathPair,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > =
    | ReadCollection<ModelPair, Environment>
    | NestedReadCollection<ModelPair, ReadSchema<Environment>, Environment>

  export interface ReadSchema<
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > {
    [CollectionPath: string]: AnyReadCollection<
      TypesaurusCore.ModelPathPair,
      Environment
    >
  }

  export interface NestedReadCollection<
    ModelPair extends TypesaurusCore.ModelPathPair,
    NestedSchema extends ReadSchema<Environment>,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > extends ReadCollection<ModelPair, Environment> {
    (id: ModelPair[1] /* Id */): NestedSchema
  }

  export interface ReadCollection<
    ModelPair extends TypesaurusCore.ModelPathPair,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > extends TypesaurusCore.PlainCollection<ModelPair> {
    /** The Firestore path */
    path: string

    get(
      id: ModelPair[1] /* Id */
    ): Promise<ReadDoc<ModelPair, Environment> | null>
  }

  /**
   * The transaction read API object. It contains {@link ReadHelpers.get|get}
   * the function that allows reading documents from the database.
   */
  export interface ReadHelpers<
    Schema extends TypesaurusCore.PlainSchema,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > {
    db: ReadDB<Schema, Environment>
  }

  /**
   * The transaction write API object. It unions a set of functions ({@link WriteHelpers.set|set},
   * {@link WriteHelpers.update|update} and {@link WriteHelpers.remove|remove})
   * that are similar to regular set, update and remove with the only
   * difference that the transaction counterparts will retry writes if
   * the state of data received with {@link ReadHelpers.get|get} would change.
   */
  export interface WriteHelpers<
    Schema extends TypesaurusCore.PlainSchema,
    ReadResult,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > {
    /** The result of the read function. */
    data: ReadDocsToWriteDocs<ReadResult>

    db: WriteDB<Schema, Environment>
  }

  export type ReadDocsToWriteDocs<
    Result,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > = Result extends ReadDoc<infer Model, Environment>
    ? WriteDoc<Model, Environment>
    : Result extends Record<any, unknown> | Array<unknown>
    ? { [Key in keyof Result]: ReadDocsToWriteDocs<Result[Key], Environment> }
    : Result

  export interface ReadChain<
    Schema extends TypesaurusCore.PlainSchema,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > {
    read: <ReadResult>(
      callback: ReadFunction<Schema, ReadResult, Environment>
    ) => WriteChain<Schema, ReadResult, Environment>
  }

  /**
   * The transaction body function type.
   */
  export type ReadFunction<
    Schema extends TypesaurusCore.PlainSchema,
    ReadResult,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > = ($: ReadHelpers<Schema, Environment>) => Promise<ReadResult>

  export interface WriteChain<
    Schema extends TypesaurusCore.PlainSchema,
    ReadResult,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > {
    write: <WriteResult>(
      callback: WriteFunction<Schema, ReadResult, WriteResult, Environment>
    ) => WriteResult
  }

  /**
   * The transaction body function type.
   */
  export type WriteFunction<
    Schema extends TypesaurusCore.PlainSchema,
    ReadResult,
    WriteResult,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined
  > = ($: WriteHelpers<Schema, ReadResult, Environment>) => WriteResult

  export type ReadDB<
    Schema extends TypesaurusCore.PlainSchema,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined,
    BasePath extends string | undefined = undefined
  > = {
    [Path in keyof Schema]: Path extends string
      ? Schema[Path] extends TypesaurusCore.NestedPlainCollection<
          infer Model,
          infer Schema,
          infer CustomId
        >
        ? NestedReadCollection<
            [
              Model,
              CustomId extends TypesaurusCore.Id<any>
                ? CustomId
                : TypesaurusCore.Id<TypesaurusUtils.ComposePath<BasePath, Path>>
            ],
            ReadDB<Schema, Environment>,
            Environment
          >
        : Schema[Path] extends TypesaurusCore.PlainCollection<
            infer Model,
            infer CustomId
          >
        ? ReadCollection<
            [
              Model,
              CustomId extends TypesaurusCore.Id<any>
                ? CustomId
                : TypesaurusCore.Id<TypesaurusUtils.ComposePath<BasePath, Path>>
            ],
            Environment
          >
        : never
      : never
  }

  export type WriteDB<
    Schema extends TypesaurusCore.PlainSchema,
    Environment extends
      | TypesaurusCore.RuntimeEnvironment
      | undefined = undefined,
    BasePath extends string | undefined = undefined
  > = {
    [Path in keyof Schema]: Path extends string
      ? Schema[Path] extends TypesaurusCore.NestedPlainCollection<
          infer Model,
          infer Schema,
          infer CustomId
        >
        ? NestedWriteCollection<
            [
              Model,
              CustomId extends TypesaurusCore.Id<any>
                ? CustomId
                : TypesaurusCore.Id<TypesaurusUtils.ComposePath<BasePath, Path>>
            ],
            WriteDB<Schema, Environment>,
            Environment
          >
        : Schema[Path] extends TypesaurusCore.PlainCollection<
            infer Model,
            infer CustomId
          >
        ? WriteCollection<
            [
              Model,
              CustomId extends TypesaurusCore.Id<any>
                ? CustomId
                : TypesaurusCore.Id<TypesaurusUtils.ComposePath<BasePath, Path>>
            ],
            Environment
          >
        : never
      : never
  }
}
