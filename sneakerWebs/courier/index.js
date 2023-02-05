import puppeteer from "puppeteer"
import { getShoeObject, getAllKeys, getPage } from "../utils/utils.js"
import { sendTheMsg, sendErrorLog } from "../../discord/discordSetter.js"
import dotenv from "dotenv"
import jsonData from "./uuidJson.js"

dotenv.config()

export default getAllKeys(jsonData).forEach(key => {
	(async (key) => {

		const shoeObject = getShoeObject(key, jsonData)
		const webPage = getShoeWeb(shoeObject.uuid)
		const browser = await puppeteer.launch(
			{
				args: [process.env.ROTATING_PROXY_URL],
			}
		)
		const page = await getPage(browser)

		await page.goto(webPage, { waitUntil: "domcontentloaded" })
		await page.waitForSelector(".swatchanchor")

		const shoesArr = await page.evaluate((webPage) => {
			try {
				const allElements = document.querySelectorAll(".selectable")
				return Array.from(allElements)
					.map((el) => {
						return {
							link: webPage,
							size: el.textContent.trim(),
							image: document.querySelector("[itemprop=\"image\"]").src,//Make [itemprop="image"] selectable?
							price: document.querySelector("[itemprop=\"price\"]").textContent.trim()
						}
					})
			} catch (error) {
				return {
					error: error
				}
			}
		}, (webPage))

		if (shoesArr.error) sendErrorLog(`Error while searching for property in ${shoeObject.name} UUID ${shoeObject.uuid}`)

		shoesArr.forEach((shoe) => {
			const object = { ...shoe, ...shoeObject }
			sendTheMsg(object, "1069363362380648478")
		})

		await browser.close()
	})(key)
})

function getShoeWeb(uuid) {
	return `https://www.courir.es/p/${uuid}.html`
}