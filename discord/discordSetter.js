import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js"

export default class DiscordBot {
	constructor() {
		const client = new Client({
			intents: [
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.DirectMessageTyping,
				GatewayIntentBits.DirectMessages,
			]
		})

		client.on("ready", () => {
			console.log("Logged the discord bot!")
			client.guilds.cache.forEach(guild => {
				guild.channels.fetch()
			})
		})
		client.login("token")
		this.client = client
	}

	//MAIN FUNCTION
	sendTheMsg(object, channelId) {
		const channel = getChannel(channelId)
		const embeded = getShoeEmbeded(object)
		channel.send({ embeds: [embeded] })
		this.client.login("token")
	}

	sendErrorLog(err) {
		const channel = getChannel("1070729719118581801")
		const embeded = getErrorEmbeded(err)
		channel.send({ embeds: [embeded] })
		this.client.login("token")
	}

	getChannel(channelId) {
		const channel = this.client.channels.cache.get(channelId)
		return channel
	}

	getShoeEmbeded(object) {
		return new EmbedBuilder()
			.setColor(0x009D71)
			.setTitle(object.name)
			.setThumbnail(object.image)
			.addFields(
				{ name: "Price", value: object.price },
				{ name: "Size", value: object.size },
				{ name: "UUID", value: object.uuid }
			)
			.setURL(object.link)
			.setTimestamp()
			.setFooter({ text: "StakeBot" })
	}

	getErrorEmbeded(err) {
		return new EmbedBuilder()
			.setColor(0xcb3234)
			.setTitle("Error mesagge")
			.addFields(
				{ name: "Error", value: err }
			)
			.setTimestamp()
			.setFooter({ text: "StakeBot" })
	}
}






