import { storage } from "@vendetta/plugin";
import { withinChance } from "../../../lib/utility";

const yapsArray = [
	"Rawr~", 
	"Nyaa", 
	"Don't touch my tail!", 
	"Maawww! Nappy!", 
	"Awowooo", 
	"I can chase butterflies all day!", 
	"Cuddles?!", 
	"These ears pick up everything :3", 
	"Shiny things~", 
	"Belly rubs, yay", 
	"Am cute", 
	"Snuggles", 
	"Tails", 
	"Pawbs", 
	"Boxes, owo", 
	"Feeling cuddly today!",
	"Feeling cute" 
	];


export function Cactus(event) {
	if(event.type == "MESSAGE_CREATE") {
		if(event?.message?.content?.length > 24 && withinChance(4)) { // This is 4% chance i hope

			const randomIndex = Math.floor(Math.random() * yapsArray.length);
			event.message.content = `${event?.message?.content}\n\n*${yapsArray[randomIndex]}* - \`${storage.utils.cactus.name || "Angel"}\``;
		}
	}	
}