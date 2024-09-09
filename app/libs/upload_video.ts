import * as fs from 'fs';
import * as readline from 'readline';
import { google, youtube_v3 } from 'googleapis';
const OAuth2 = google.auth.OAuth2;

const categoryIds: Record<string, number> = {
    Entertainment: 24,
    Education: 27,
    ScienceTechnology: 28
};

const SCOPES: string[] = [
    'https://www.googleapis.com/auth/youtube'
];
const TOKEN_PATH: string = 'client_oauth_token.json';

let playListId: string = '';

export function runUploadVideo(oauthIndex: number, video: {
    videoPath: string;
    thumbnailPath: string;
    title: string;
    description: string;
    tags: string[];
}, playListId?: string) {
    console.log(`===== Uploading video to Youtube ${video.videoPath.split('/')[video.videoPath.split('/').length - 1]} =====`);
    fs.readFile(`google-oauth/credentials-${oauthIndex}.json`, (err, content) => {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        authorize(JSON.parse(content.toString()), async (auth) => {
            // if (!playListId) {
            //     playListId = await createPlayList(auth, playlist.title, playlist.description);
            // }
            const videoId = await uploadVideo(auth, video);
            if (playListId && videoId) {
                addVideToPlaylist(auth, playListId, videoId);
            }
        }, `google-oauth/client_oauth_token-${oauthIndex}.json`);
    });
}

function uploadVideo(auth: any, video: {
    videoPath: string;
    thumbnailPath: string;
    title: string;
    description: string;
    tags: string[]
}) {
    return new Promise<string>((resolve, reject) => {
        const service = google.youtube('v3');
        service.videos.insert({
            auth: auth,
            part: ['snippet', 'status'],
            requestBody: {
                snippet: {
                    title: video.title,
                    description: video.description,
                    tags: video.tags,
                    categoryId: categoryIds.Entertainment.toString(),
                    defaultLanguage: 'vi',
                    defaultAudioLanguage: 'vi',
                },
                status: {
                    privacyStatus: "public"
                },
            },
            media: {
                body: fs.createReadStream(video.videoPath),
            },
        }, (err: any, response: any) => {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }

            console.log('Video uploaded. Uploading the thumbnail now.');
            service.thumbnails.set({
                auth: auth,
                videoId: response.data.id,
                media: {
                    body: fs.createReadStream(video.thumbnailPath)
                },
            }, function (err: any, response: any) {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    return;
                }
            });
            resolve(response.data.id);
        });
    });
}

function authorize(credentials: any, callback: (auth: any) => void, tokenPath = TOKEN_PATH) {
    const clientSecret: string = credentials.installed.client_secret;
    const clientId: string = credentials.installed.client_id;
    const redirectUrl: string = credentials.installed.redirect_uris[0];
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(tokenPath, (err, token) => {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token.toString());
            callback(oauth2Client);
        }
    });
}

function getNewToken(oauth2Client: any, callback: (auth: any) => void, tokenPath?: string) {
    const authUrl: string = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oauth2Client.getToken(code, (err: any, token: any) => {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token, tokenPath);
            callback(oauth2Client);
        });
    });
}

function storeToken(token: any, path: string = TOKEN_PATH) {
    fs.writeFile(path, JSON.stringify(token), (err) => {
        if (err) throw err;
        console.log('Token stored to ' + TOKEN_PATH);
    });
}

export function createPlayList(title: string, description: string) {
    return new Promise<string>((resolve, reject) => {
        console.log('Creating playlist...');
        fs.readFile(`google-oauth/credentials-1.json`, (err, content) => {
            if (err) {
                console.log('Error loading client secret file: ' + err);
                return;
            }
            authorize(JSON.parse(content.toString()), async (auth) => {
                const service = google.youtube('v3');
                service.playlists.insert({
                    auth: auth,
                    part: ['snippet', 'status'],
                    requestBody: {
                        snippet: {
                            title,
                            description
                        },
                        status: {
                            privacyStatus: "public"
                        },
                    }
                }, (err: any, response: any) => {
                    if (err) {
                        console.log('The API returned an error: ' + err);
                        reject(err);
                        return;
                    }
                    console.log(`The Playlist is created with id: ${response.data.id}`);
                    resolve(response.data.id);
                });
            }, `google-oauth/client_oauth_token-1.json`);
        });
    });
}

function addVideToPlaylist(auth: any, playlistId: string, videoId: string) {
    return new Promise<string>((resolve, reject) => {
        console.log('Adding video to playlist...');
        const service = google.youtube('v3');
        service.playlistItems.insert({
            auth: auth,
            part: ['snippet'],
            requestBody: {
                snippet: {
                    playlistId,
                    resourceId: {
                        kind: 'youtube#video',
                        videoId
                    }
                }
            }
        }, (err: any, response: any) => {
            if (err) {
                console.log('The API returned an error: ' + err);
                reject(err);
                return;
            }
            resolve(response.data.id);
        });
    })
}


export function getVideoList(oauthIndex: number) {
    fs.readFile(`google-oauth/credentials-${oauthIndex}.json`, (err, content) => {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        authorize(JSON.parse(content.toString()), async (auth) => {
            const service = google.youtube('v3');
            service.search.list({
                auth: auth,
                part: ['snippet'],
                channelId: "UCj1if-f55JrhIMhKia7iwQQ",
                type: ["video"],
            }, (err: any, response: any) => {
                console.log(err);
                console.log(response.data.items.length);
                const quota_usage = response.headers;
                console.log(quota_usage);
            });
        }, `google-oauth/client_oauth_token-${oauthIndex}.json`);
    });
}

export function makeToken(credentialsIndex: string) {
    return new Promise<boolean>((resolve, reject) => {
        fs.readFile(`google-oauth/credentials-${credentialsIndex}.json`, (err, content) => {
            if (err) {
                return;
            }
            const credentials = JSON.parse(content.toString());
            const clientSecret: string = credentials.installed.client_secret;
            const clientId: string = credentials.installed.client_id;
            const redirectUrl: string = credentials.installed.redirect_uris[0];
            const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
            getNewToken(oauth2Client, () => {
                resolve(true);
            }, `google-oauth/client_oauth_token-${credentialsIndex}.json`);
        });
    })
}