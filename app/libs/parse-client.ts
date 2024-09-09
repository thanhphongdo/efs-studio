
import Parse from 'parse';

Parse.initialize('myAppId', 'myJSKey');
Parse.serverURL = 'http://localhost:3337/parse';

export default Parse;