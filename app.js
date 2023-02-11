import snipes from "./sneakerWebs/snipes/index.js"
import DiscordBot from "./discord/discordSetter.js"

const discordCLient = new DiscordBot()

while (true) {
    snipes(discordCLient)
    setTimeout(() => console.log('Running snipes') , 10000)
}

