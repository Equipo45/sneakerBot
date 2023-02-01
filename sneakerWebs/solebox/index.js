import puppeteer from "puppeteer"
import { getShoeObject,getAllKeys,getPage } from "../utils/utils.js"
import { sendTheMsg } from "../../discord/discordSetter.js"
import dotenv from "dotenv"
import jsonData from "./uuidJson.js"

dotenv.config()

getAllKeys(jsonData).forEach(key => 
	(async (key) => {

		const shoeObject = getShoeObject(key,jsonData)
		const webPage = getShoeWeb(shoeObject.uuid)
		const browser = await puppeteer.launch({
			args: [
				process.env.ROTATING_PROXY_URL
			],
		})
		const page = await getPage(browser)

		await page.goto(webPage, {waitUntil: "domcontentloaded"})
		await page.waitForSelector(".b-swatch-value-wrapper")

		const shoesArr = await page.evaluate((webPage) => {
			const allElements = document.querySelectorAll(".b-swatch-value-wrapper")
			return Array.from(allElements)
				.filter(el => el.innerHTML.includes("orderable"))
				.map((el) => {
					return {
						link:webPage,
						size:el.textContent.trim(),
						image:document.querySelector(".b-dynamic_image_content").src,
						price:document.querySelector(".b-product-tile-price-item").textContent.trim()
					}
				})
		},(webPage))

		shoesArr.forEach((shoe) => {
			const object = {...shoe,...shoeObject}
			sendTheMsg(object,"1070370783978852414")
		})

		await browser.close()
	})(key))

export function getShoeWeb(uuid) {
	return `https://www.solebox.com/en_ES/p/${uuid}.html`
}
