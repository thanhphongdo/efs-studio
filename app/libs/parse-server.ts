
import Parse from 'parse/node';

Parse.initialize('myAppId', 'myJSKey', 'myMasterKey');
Parse.serverURL = 'http://localhost:3337/parse';

export default Parse;