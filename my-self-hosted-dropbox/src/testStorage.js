// const Amplify = require('aws-amplify');
// console.log(Amplify); // Logs all exports from aws-amplify


// const { Storage } = require('aws-amplify');
// console.log(Storage);

const AmplifyLib = require('aws-amplify');

console.log('All Exports from aws-amplify:', AmplifyLib);

const { Amplify, Storage } = AmplifyLib;
console.log('Amplify:', Amplify);
console.log('Storage:', Storage);

