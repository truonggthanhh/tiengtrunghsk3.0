export type PolicyChoice = { terms: boolean; processing: boolean; age: boolean };
export const emptyPolicyChoice: PolicyChoice = { terms: false, processing: false, age: false };
export const acceptedPolicy = (choice: PolicyChoice) => choice.terms && choice.processing && choice.age;
