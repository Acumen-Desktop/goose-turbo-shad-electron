// Fetch data from API

export async function load() {
  const response = await fetch('https://api.restful-api.dev/objects?id=3&id=5&id=10');
  const data = await response.json();

  return { data };
}
