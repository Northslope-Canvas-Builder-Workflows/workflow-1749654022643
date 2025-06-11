import type { PropertyDef as $PropertyDef } from '@osdk/client';
import { $osdkMetadata } from '../../OntologyMetadata.js';
import type { ObjectTypeDefinition as $ObjectTypeDefinition } from '@osdk/client';
import type { ObjectSet as $ObjectSet, Osdk as $Osdk, PropertyValueWireToClient as $PropType } from '@osdk/client';
export declare namespace Candidate {
    type PropertyKeys = 'resume' | 'email' | 'name' | 'candidateId';
    type Links = {};
    interface Props {
        readonly candidateId: $PropType['string'];
        readonly email: $PropType['string'] | undefined;
        readonly name: $PropType['string'] | undefined;
        readonly resume: $PropType['string'] | undefined;
    }
    type StrictProps = Props;
    interface ObjectSet extends $ObjectSet<Candidate, Candidate.ObjectSet> {
    }
    type OsdkInstance<OPTIONS extends never | '$rid' = never, K extends keyof Candidate.Props = keyof Candidate.Props> = $Osdk.Instance<Candidate, OPTIONS, K>;
    /** @deprecated use OsdkInstance */
    type OsdkObject<OPTIONS extends never | '$rid' = never, K extends keyof Candidate.Props = keyof Candidate.Props> = OsdkInstance<OPTIONS, K>;
}
export interface Candidate extends $ObjectTypeDefinition {
    osdkMetadata: typeof $osdkMetadata;
    type: 'object';
    apiName: 'Candidate';
    __DefinitionMetadata?: {
        objectSet: Candidate.ObjectSet;
        props: Candidate.Props;
        linksType: Candidate.Links;
        strictProps: Candidate.StrictProps;
        apiName: 'Candidate';
        description: '';
        displayName: 'Candidate';
        icon: {
            type: 'blueprint';
            color: '#4C90F0';
            name: 'cube';
        };
        implements: [];
        interfaceMap: {};
        inverseInterfaceMap: {};
        links: {};
        pluralDisplayName: 'Candidate';
        primaryKeyApiName: 'candidateId';
        primaryKeyType: 'string';
        properties: {
            /**
             *   display name: 'Candidate Id'
             */
            candidateId: $PropertyDef<'string', 'non-nullable', 'single'>;
            /**
             *   display name: 'Email'
             */
            email: $PropertyDef<'string', 'nullable', 'single'>;
            /**
             *   display name: 'Name'
             */
            name: $PropertyDef<'string', 'nullable', 'single'>;
            /**
             *   display name: 'Resume'
             */
            resume: $PropertyDef<'string', 'nullable', 'single'>;
        };
        rid: 'ri.ontology.main.object-type.bd436ab3-d523-4341-9bf5-0106f0f5bb3e';
        status: 'EXPERIMENTAL';
        titleProperty: 'name';
        type: 'object';
        visibility: 'NORMAL';
    };
}
export declare const Candidate: Candidate;
