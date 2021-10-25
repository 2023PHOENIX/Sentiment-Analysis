const minimist = require("minimist");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

//  node index.js --url="https://www.instagram.com/"  --config="cred.json" --target="virat.kohli" 
// node index.js --url="https://www.instagram.com/"  --config="cred.json" --target="rohitsharma45"
// node index.js --url="https://www.instagram.com/"  --config="cred.json" --target="mdshami.11"
const scrapPage = require("./operation");
let args = minimist(process.argv);

console.log(args.url);

let cred = fs.readFileSync("./cred.json");
cred = JSON.parse(cred);
// console.log(cred.username);
async function run(){

    let browser = await puppeteer.launch({
        headless : false,
        args : [
            '--start-maximized'
        ],
        defaultViewport : null
    })

    let page = await browser.newPage();

    await page.goto(args.url,{waitUntil : "networkidle2"});


    await page.waitForSelector("input[name='username']");
    await page.type("input[name='username']",cred.username,{delay : 100});

    await page.waitForSelector("input[name='password']");
    await page.type("input[name='password']",cred.password,{delay : 100});


    await page.waitForSelector("button[type='submit']");
    await page.click("button[type='submit']");

 

    await page.waitForSelector("input[placeholder='Search']");
    await page.type("input[placeholder='Search']",args.target,{delay : 200});

    let id = path.join("/",args.target,"/");
    await page.waitForSelector(`a[href="${id}"]`);
    await page.click(`a[href="${id}"]`);


    await page.waitForSelector("div.v1Nh3.kIKUG");
    await page.click("div.v1Nh3.kIKUG");


    await page.waitForSelector("ul.XQXOT.pXf-y");
    await page.click("div.C4VMK");


    const html = await page.content();
    let filename = args.target + ".html"
    fs.writeFileSync(filename,html);

    scrapPage.extractData(filename);


    await page.waitForSelector("svg[aria-label='Close']");
    await page.click("svg[aria-label='Close']");

    await browser.close();
}



run();


