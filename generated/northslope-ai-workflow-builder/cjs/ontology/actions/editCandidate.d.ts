import type { ActionDefinition, ActionMetadata, ActionParam, ActionReturnTypeForOptions, ApplyActionOptions, ApplyBatchActionOptions } from '@osdk/client';
import { $osdkMetadata } from '../../OntologyMetadata.js';
import type { Candidate } from '../objects/Candidate.js';
export declare namespace editCandidate {
    type ParamsDefinition = {
        Candidate: {
            multiplicity: false;
            nullable: false;
            type: ActionMetadata.DataType.Object<Candidate>;
        };
        email: {
            multiplicity: false;
            nullable: false;
            type: 'string';
        };
        name: {
            multiplicity: false;
            nullable: false;
            type: 'string';
        };
        resume: {
            multiplicity: false;
            nullable: false;
            type: 'string';
        };
    };
    interface Params {
        readonly Candidate: ActionParam.ObjectType<Candidate>;
        readonly email: ActionParam.PrimitiveType<'string'>;
        readonly name: ActionParam.PrimitiveType<'string'>;
        readonly resume: ActionParam.PrimitiveType<'string'>;
    }
    interface Signatures {
        applyAction<P extends editCandidate.Params, OP extends ApplyActionOptions>(args: P, options?: OP): Promise<ActionReturnTypeForOptions<OP>>;
        batchApplyAction<P extends ReadonlyArray<editCandidate.Params>, OP extends ApplyBatchActionOptions>(args: P, options?: OP): Promise<ActionReturnTypeForOptions<OP>>;
    }
}
/**
 * @param {ActionParam.ObjectType<Candidate>} Candidate
 * @param {ActionParam.PrimitiveType<"string">} email
 * @param {ActionParam.PrimitiveType<"string">} name
 * @param {ActionParam.PrimitiveType<"string">} resume
 */
export interface editCandidate extends ActionDefinition<editCandidate.Signatures> {
    __DefinitionMetadata?: {
        apiName: 'editCandidate';
        displayName: 'Edit Candidate';
        modifiedEntities: {
            Candidate: {
                created: false;
                modified: true;
            };
        };
        parameters: editCandidate.ParamsDefinition;
        rid: 'ri.actions.main.action-type.a68f0655-b4aa-4512-a848-b70a1da89330';
        status: 'EXPERIMENTAL';
        type: 'action';
        signatures: editCandidate.Signatures;
    };
    apiName: 'editCandidate';
    type: 'action';
    osdkMetadata: typeof $osdkMetadata;
}
export declare const editCandidate: editCandidate;
