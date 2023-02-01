import puppeteer from 'puppeteer'
import { getShoeObject,getShoeWeb,getAllKeys } from './utils.js'
import { sendTheMsg } from '../../discord/discordSetter.js';
import dotenv from "dotenv"

dotenv.config()

getAllKeys().forEach(key => 
  (async (key) => {

  const shoeObject = getShoeObject(key)
  const webPage = getShoeWeb(shoeObject.uuid)
  const browser = await puppeteer.launch(
    {
      args: [
        process.env.ROTATING_PROXY_URL
      ],
    }
  );
  const page = await getPage(browser)

  await page.goto(webPage, {waitUntil: 'domcontentloaded'});
  await page.waitForSelector(`[type="button"]`)

  const shoesArr = await page.evaluate((webPage) => {
    const allElements = document.querySelectorAll(`[type="button"]`)
    return Array.from(allElements)
      .filter(el => !el.innerHTML.includes("noStockOverlay"))
      .map((el) => {
        return {
          link:webPage,
          size:el.textContent.replace(/[^\d.]/g, ''),
          image:document.querySelector('.imgMed').src,
          price:document.querySelector('.pri').textContent.trim()//itemPrices
        }
      })
  },(webPage))

  shoesArr.forEach((shoe) => {
    const object = {...shoe,...shoeObject}
    sendTheMsg(object,"1070371512860819507")
  })

  await browser.close()
})(key))



//Function to set the user agent
async function getPage(browser){
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 
		'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', 
		'upgrade-insecure-requests': '1', 
		'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8', 
		'accept-encoding': 'gzip, deflate, br', 
		'accept-language': 'en-US,en;q=0.9,en;q=0.8' 
	}); 
  return page
}

