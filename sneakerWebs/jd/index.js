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
		const browser = await puppeteer.launch(
			{
				args: [
					process.env.ROTATING_PROXY_URL
				],
			}
		)
		const page = await getPage(browser)

		await page.goto(webPage, {waitUntil: "domcontentloaded"})
		await page.waitForSelector("[type=\"button\"]")

		const shoesArr = await page.evaluate((webPage) => {
			const allElements = document.querySelectorAll("[type=\"button\"]")
			return Array.from(allElements)
				.filter(el => !el.innerHTML.includes("noStockOverlay"))
				.map((el) => {
					return {
						link:webPage,
						size:el.textContent.replace(/[^\d.]/g, ""),
						image:document.querySelector(".imgMed").src,
						price:document.querySelector(".pri").textContent.trim()//itemPrices
					}
				})
		},(webPage))

		shoesArr.forEach((shoe) => {
			const object = {...shoe,...shoeObject}
			sendTheMsg(object,"1070371512860819507")
		})

		await browser.close()
	})(key))

export function getShoeWeb(uuid) {
	return `https://www.jdsports.es/product/!/${uuid}_jdsportses/`
}

