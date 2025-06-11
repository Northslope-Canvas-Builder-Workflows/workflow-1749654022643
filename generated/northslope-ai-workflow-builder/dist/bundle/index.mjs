const $osdkMetadata = { extraUserAgent: 'typescript-sdk/1.0.0 typescript-sdk-generator/2.1.5' };
const $ontologyRid = 'ri.ontology.main.ontology.2a22e1b1-c62b-46cb-bb28-89c13ccd859c';

const editCandidate = {
    apiName: 'editCandidate',
    type: 'action',
    osdkMetadata: $osdkMetadata,
};

var actions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    editCandidate: editCandidate
});

var interfaces = /*#__PURE__*/Object.freeze({
    __proto__: null
});

const Candidate = {
    type: 'object',
    apiName: 'Candidate',
    osdkMetadata: $osdkMetadata,
};

var objects = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Candidate: Candidate
});

var queries = /*#__PURE__*/Object.freeze({
    __proto__: null
});

export { actions as $Actions, interfaces as $Interfaces, objects as $Objects, queries as $Queries, $ontologyRid, $osdkMetadata, Candidate, editCandidate };
