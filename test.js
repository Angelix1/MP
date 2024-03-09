const axios = require("axios");

const apikey = "eluIOaOhIP1RXlgYetkcZCF8la7p3NoCPy8U0i8dKiT4xdIH"
const link = "https://static1.e621.net/data/96/01/96017653f46753beedd9c4ad21a7e959.png"


// https://api-next.fuzzysearch.net/v1/url?url=https%3A%2F%2Fstatic1.e621.net%2Fdata%2F4f%2Fae%2F4faecbef251cb5feb9213b7acdb3b180.png

const finalLink = `https://api-next.fuzzysearch.net/v1/url?url=${encodeURIComponent(link)}`
axios.get(finalLink, {
	headers: {
		"x-api-key": apikey,
		"Accept": "application/json"
	}
}).then(res => console.log(res.data))



// Furaffinity = https://www.furaffinity.net/view/POST_ID
// E621 = https://e621.net/posts/POST_ID
//  = 