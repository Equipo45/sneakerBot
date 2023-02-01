import {Client,GatewayIntentBits,EmbedBuilder} from "discord.js"

//When the modules is imported teh discords server start
const client = new Client({
	intents:[
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

export function sendTheMsg(object,channelId){
	const channel = getChannel(channelId)
	const embeded = getEmbeded(object)
	channel.send({ embeds : [embeded]})
}

function getChannel(channelId) {
	const channel = client.channels.cache.get(channelId)
	return channel
}
function getEmbeded(object){
	return new EmbedBuilder()
		.setColor(0x009D71)
		.setTitle(object.name)
		.setThumbnail(object.image)
		.addFields(
			{ name : "Price", value: object.price },
			{ name : "Size", value: object.size },
			{ name : "UUID", value: object.uuid }
		)
		.setURL(object.link)
		.setTimestamp()
		.setFooter({ text: "StakeBot"})
}
//Final log in
client.login("MTA2OTIwODgzMjg4ODI3NDk0NA.GgR56z.4WD9VuXTH_BJ0X2qY6V6wiUw8kHkFWOVga8vgE")





