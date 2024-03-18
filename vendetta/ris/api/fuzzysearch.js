export async function getData(url) {
	if(url) {
		const finalLink = `https://api-next.fuzzysearch.net/v1/url?url=${url}`

		const response = await fetch(finalLink, {
			method: 'GET',
			headers: {
				"x-api-key": "eluIOaOhIP1RXlgYetkcZCF8la7p3NoCPy8U0i8dKiT4xdIH",
				"Accept": "application/json"
			}
		})

		let data = await response.json();

		if(data == "unavailable") {
			data = null;
		}
		return data;
	}
}	