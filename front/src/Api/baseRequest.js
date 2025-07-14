let baseApiUrl = process.env.REACT_APP_API_URL;
if (!baseApiUrl) {
  baseApiUrl = "https://interracial-volunteer-sacramento-do.trycloudflare.com/api/"
}

export async function baseRequest(endpoint, method = "GET", data = null, headers = {}) {
  const options = {
    method: method,
    headers: headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(baseApiUrl + endpoint, options);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}