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


export function Cactus(message) {
	if(storage?.toggle?.cactus && message?.content?.length > 25 && withinChance(3)) { // This is 4% chance i hope

		const randomIndex = Math.floor(Math.random() * yapsArray.length);
		message.content = `${message?.content}\n\n*${yapsArray[randomIndex]}*  - \`${storage?.utils?.cactus?.name || "Angel"}\``;
	}	
}