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
				args: [process.env.ROTATING_PROXY_URL]
			}
		)
		const page = await getPage(browser)

		await page.goto(webPage, { waitUntil: "domcontentloaded" })
		await page.waitForSelector(".b-swatch-value-wrapper")

		const shoesArr = await page.evaluate((webPage) => {
			try {
				const allElements = document.querySelectorAll(".b-swatch-value-wrapper")
				return Array.from(allElements)
					.filter(el => el.innerHTML.includes("orderable"))
					.map((el) => {
						return {
							link: webPage,
							size: el.textContent.trim(),
							image: document.querySelector(".b-dynamic_image_content").src,
							price: document.querySelector(".b-product-tile-price-item").textContent.trim()
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
			sendTheMsg(object, "1069226460939833394")
		})

		await browser.close()
	})(key)
})

function getShoeWeb(uuid) {
	return `https://www.snipes.es/p/${uuid}.html`
}

