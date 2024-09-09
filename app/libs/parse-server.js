"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = __importDefault(require("parse/node"));
node_1.default.initialize('myAppId', 'myJSKey', 'myMasterKey');
node_1.default.serverURL = 'http://localhost:3337/parse';
exports.default = node_1.default;
