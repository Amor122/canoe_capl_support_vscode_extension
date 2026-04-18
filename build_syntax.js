const fs = require('fs');

const CAPL_FUNCTIONS = require('./out/caplData.js').CAPL_FUNCTIONS;
const funcKeys = Object.keys(CAPL_FUNCTIONS);

const importantFuncs = [
    'write', 'writeLine', 'writeLineEx', 'writeDbg', 'putValue', 'getValue', 'setSignal', 'getSignal',
    'setTimer', 'setTimerCyclic', 'cancelTimer', 'elapsedTime', 'getLastTimer', 'setWriteDbgLevel',
    'output', 'memcpy', 'memset', 'strlen', 'strcpy', 'strcat', 'sprintf', 'strcmp', 'abs', 'max', 'min', 'round',
    'TestStepPass', 'TestStepFail', 'Check', 'CheckResp', 'CheckNoFault',
    '_mktime', '_timeToStr', '_tick', 'tickToMic', 'tickToMs',
    'NmActivateBusLoadReduction', 'NmNetworkRequest', 'NmNetworkRelease', 'NmGetState',
    'CanTpOpen', 'CanTpClose', 'CanTpSend', 'CanTpReceive', 'CanTpGetStatus',
    'LinSendRequest', 'LinSleepModeRequest', 'LinWakeup', 'LinGetStatus',
    'diagSendRequest', 'diagGetResult', 'diagConnect', 'diagDisconnect'
];

let content = JSON.stringify({
  "$schema": "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
  "name": "CAPL",
  "patterns": [
    {"include": "#comments"},
    {"include": "#strings"},
    {"include": "#keywords"},
    {"include": "#functions"},
    {"include": "#types"},
    {"include": "#numbers"},
    {"include": "#operators"}
  ],
  "repository": {
    "comments": {
      "patterns": [
        {"name": "comment.line.double-slash", "match": "//.*"}
      ]
    },
    "strings": {
      "patterns": [
        {"name": "string.quoted.double", "begin": "\"", "end": "\""},
        {"name": "string.quoted.single", "begin": "'", "end": "'"}
      ]
    },
    "keywords": {
      "patterns": [
        {"name": "keyword", "match": "\\bon\\b"},
        {"name": "keyword", "match": "\\bif\\b"},
        {"name": "keyword", "match": "\\belse\\b"},
        {"name": "keyword", "match": "\\bwhile\\b"},
        {"name": "keyword", "match": "\\bfor\\b"},
        {"name": "keyword", "match": "\\bswitch\\b"},
        {"name": "keyword", "match": "\\bcase\\b"},
        {"name": "keyword", "match": "\\bdefault\\b"},
        {"name": "keyword", "match": "\\bbreak\\b"},
        {"name": "keyword", "match": "\\bcontinue\\b"},
        {"name": "keyword", "match": "\\breturn\\b"},
        {"name": "keyword", "match": "\\bvoid\\b"},
        {"name": "keyword", "match": "\\bconst\\b"},
        {"name": "keyword", "match": "\\bstatic\\b"},
        {"name": "keyword", "match": "\\bextern\\b"},
        {"name": "keyword", "match": "\\bvolatile\\b"},
        {"name": "keyword", "match": "\\bdefine\\b"},
        {"name": "keyword", "match": "\\bifdef\\b"},
        {"name": "keyword", "match": "\\bifndef\\b"},
        {"name": "keyword", "match": "\\bendif\\b"}
      ]
    },
    "functions": {
      "patterns": [
        {"name": "entity.name.function.user", "match": "^(void|int|long|float|double|char|byte|word|dword|qword|boolean)\\s+\\w+\\s*\\("},
        {"name": "entity.name.function.user", "match": "^on\\s+\\w+\\s*\\("},
        ...importantFuncs.map(name => ({"name": "support.function", "match": `\\b${name}\\b|\\b${name.toUpperCase()}\\b`}))
      ]
    },
    "types": {
      "patterns": [
        {"name": "storage.type", "match": "\\bbyte\\b|\\bBYTE\\b"},
        {"name": "storage.type", "match": "\\bword\\b|\\bWORD\\b"},
        {"name": "storage.type", "match": "\\bdword\\b|\\bDWORD\\b"},
        {"name": "storage.type", "match": "\\bqword\\b|\\bQWORD\\b"},
        {"name": "storage.type", "match": "\\bint\\b|\\bINT\\b"},
        {"name": "storage.type", "match": "\\blong\\b|\\bLONG\\b"},
        {"name": "storage.type", "match": "\\bfloat\\b|\\bFLOAT\\b"},
        {"name": "storage.type", "match": "\\bdouble\\b|\\bDOUBLE\\b"},
        {"name": "storage.type", "match": "\\bchar\\b|\\bCHAR\\b"},
        {"name": "storage.type", "match": "\\bstring\\b|\\bSTRING\\b"},
        {"name": "storage.type", "match": "\\benum\\b|\\bENUM\\b"},
        {"name": "storage.type", "match": "\\bstruct\\b|\\bSTRUCT\\b"},
        {"name": "storage.type", "match": "\\btimer\\b|\\bTIMER\\b"},
        {"name": "storage.type", "match": "\\bmstimer\\b|\\bMSTIMER\\b"},
        {"name": "storage.type", "match": "\\bmessage\\b|\\bMESSAGE\\b"},
        {"name": "storage.type", "match": "\\bsignal\\b|\\bSIGNAL\\b"},
        {"name": "storage.type", "match": "\\benvvar\\b|\\bENVVAR\\b"},
        {"name": "storage.type", "match": "\\bsysvarInt\\b|\\bSYSVARINT\\b"},
        {"name": "storage.type", "match": "\\bsysvarFloat\\b|\\bSYSVARFLOAT\\b"},
        {"name": "storage.type", "match": "\\bsysvarString\\b|\\bSYSVARSTRING\\b"},
        {"name": "storage.type", "match": "\\bhandle\\b|\\bHANDLE\\b"},
        {"name": "storage.type", "match": "\\bbool\\b|\\bBOOL\\b"},
        {"name": "storage.type", "match": "\\bboolean\\b|\\bBOOLEAN\\b"}
      ]
    },
    "numbers": {
      "patterns": [
        {"name": "constant.numeric", "match": "\\b0x[0-9A-Fa-f]+\\b|\\b[0-9]+\\.?[0-9]*([eE][-+]?[0-9]+)?"}
      ]
    },
    "operators": {
      "patterns": [
        {"name": "keyword.operator", "match": "[+\\-*/%=<>!&|^~]+"}
      ]
    }
  }
}, null, 2);

fs.writeFileSync('./syntaxes/capl.tmLanguage.json', content);
console.log('Written syntax with ' + importantFuncs.length + ' important functions');