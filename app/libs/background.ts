import { existsSync, mkdirSync } from "fs";
import puppeteer from "puppeteer";

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function takeScreenshot(storyId: string, episodeId: string, from: number, to: number , isEnd: boolean, data?: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`http://localhost:3300`);
    if (data) {
        await page.evaluate((data: string) => {
            localStorage.setItem('style', data);
        }, data);
    }
    await sleep(500);

    // if (!existsSync(`./assets/backgrounds/${storyId}`)) {
    //     mkdirSync(`./assets/backgrounds/${storyId}`, { recursive: true });
    // }

    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(`http://localhost:3300/screenshot?story=${storyId}&from=${from}&to=${to}&end=${isEnd}&view=true`);
    await sleep(10000);
    await page.screenshot({ path: `../`, quality: 90, type: 'jpeg' });

    await browser.close();
}

export async function takeScreenshots(storyId: string, chapFrom: number, chapTo: number, maxChap: number, isEnd: boolean, data?: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`http://localhost:3300`);
    if (data) {
        await page.evaluate((data: string) => {
            localStorage.setItem('style', data);
        }, data);
    }
    await sleep(500);

    if (!existsSync(`./assets/backgrounds/${storyId}`)) {
        mkdirSync(`./assets/backgrounds/${storyId}`, { recursive: true });
    }

    await page.setViewport({ width: 1920, height: 1080 });
    for (let i = 0; i < Math.ceil((chapTo - chapFrom) / 10); i++) {
        const from = (i * 10) + chapFrom;
        let to = from + 9;
        if (to > chapTo) {
            to = chapTo;
        }
        await page.goto(`http://localhost:3300/screenshot?story=${storyId}&from=${from}&to=${to}&max=${maxChap}&end=${isEnd}&view=true`);
        await sleep(10000);
        await page.screenshot({ path: `./assets/backgrounds/${storyId}/${from}-${to}.jpg`, quality: 90, type: 'jpeg' });
        console.log(`Done: ${from} - ${to}`);
    }

    await browser.close();
}

// takeScreenshots('manh-nhu-ky', 1, 92, 92, false, `{"general":{"url":"","maxChap":1000,"isEnd":false},"avatar":{"url":"https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/730c88d9-b9df-4c7d-8c0a-09ca7e9f380a/original=true/56298-388358377-(masterpiece,best%20quality,ultra_detailed,FULL%20HD,absurdres_1.2),dreamlike,ultra-realistic%20mix%20fantasy%20world,mixes%20realistic%20and.jpeg","position":{"x":200,"y":-140},"bgScale":190,"frameScale":120},"title":{"value":"Mạnh Như Ký","family":"Playball","color":"#e64980","size":110,"margin":{"top":0,"left":0},"shadow":{"enable":true,"value":"#e64980"}},"author":{"value":"Cửu Lộ Phi Hương","family":"Playball","color":"#fab005","size":55,"margin":{"top":50,"left":0},"shadow":{"enable":true,"value":"#fab005"}},"chap":{"from":1,"to":10,"family":"Playball","color":"#fd7e14","size":65,"margin":{"top":50,"left":0},"value":"","shadow":{"enable":true,"value":"#fd7e14"}},"background":{"url":"https://r4.wallpaperflare.com/wallpaper/537/436/991/pale-as-pale-wallpaper-8960988d81caedbb367788ef90c1361d.jpg","position":{"x":0,"y":-50},"bgScale":130},"scale":0.5}`);

// (async () => {
//     const chaps = 61;

//     // for (let i = 0; i < Math.ceil(chaps / 10); i++) {
//     //     const from = i * 10 + 1;
//     //     let to = from + 9;
//     //     if (to > chaps) {
//     //         to = chaps;
//     //     }
//     //     // console.log(`http://localhost:3300?from=${from}&to=${to}`, `./assets/backgrounds/my-nhan-nhap-vai/${from}-${to}.jpg`);
//     //     await takeScreenshot(`http://localhost:3300?from=${from}&to=${to}&view=true`, `./assets/backgrounds/nu-phu-muon-ly-hon/${from}-${to}.jpg`);
//     // }
//     await takeScreenshot(`http://localhost:3300?from=${61}&to=${61}&view=true`, `./assets/backgrounds/nu-phu-muon-ly-hon/${61}-${61}.jpg`);
// })()