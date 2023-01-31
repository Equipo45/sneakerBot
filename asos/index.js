import puppeteer from 'puppeteer'
import { getShoeObject,getShoeWeb,getAllKeys } from './utils.js'
import { sendTheMsg } from '../discord/discordSetter.js';

getAllKeys().forEach(key => 
  (async (key) => {

  const shoeObject = getShoeObject(key)
  const webPage = getShoeWeb(shoeObject.uuid)
  const browser = await puppeteer.launch({
    args: [ '--proxy-server=http://p.webshare.io:80' ]
  });
  const page = await getPage(browser)
  
  await page.goto(webPage,{waitUntil: 'domcontentloaded'});
  await page.waitForSelector(`select`)
  
  const shoesArr = await page.evaluate((webPage) => {
    const allElements = $(`select`).options
    return Array.from(allElements)
      .filter(el => !el.value.includes('Agotado'))
      .map((el) => {
        return {
          link:webPage,
          size:el.value.trim(),
          image:$(`.gallery-image`).src,
          price:$(`[data-testid="current-price"]`).textContent.trim()
        }
      })
  },(webPage))

  shoesArr.forEach((shoe) => {
    const object = {...shoe,...shoeObject}
    sendTheMsg(object,"1069363416134848583")
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

