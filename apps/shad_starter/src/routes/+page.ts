// Fetch data from API

export async function load() {
	const response = await fetch('https://api.restful-api.dev/objects');
	const data = await response.json();
	return { data };
}
