function parseObject(data: any) {
  return (typeof data === 'object' ? JSON.stringify(data) : data) ?? 'empty';
}

function verifyForStatusCode(endpoint: string, data: any, code: number, method: string) {
  switch (code) {
    case 400:
      throw new Error(`DiscordAPIError: Bad Request (400)\nEndpoint: ${endpoint}\nMethod: ${method}\nData: ${parseObject(data)}`);
    case 401:
      throw new Error(`DiscordAPIError: Not Authorized (401)\nEndpoint: ${endpoint}\nMethod: ${method}\nData: ${parseObject(data)}`);
    case 403:
      throw new Error(`DiscordAPIError: Missing Permissions (403)\nEndpoint: ${endpoint}\nMethod: ${method}\nData: ${parseObject(data)}`);
    case 404:
      throw new Error(`DiscordAPIError: Not Found (404)\nEndpoint: ${endpoint}\nMethod: ${method}\nData: ${parseObject(data)}`);
  }
}

function verifyForJSONStatusCode(jsonResponse: any, endpoint: string, data: any, method: string) {
  if (jsonResponse.code && jsonResponse.message) {
    throw new Error(`DiscordAPIError: ${jsonResponse.message} (${jsonResponse.code})\nEndpoint: ${endpoint}\nMethod: ${method}\nData: ${parseObject(data)}`);
  }
}

export default { verifyForJSONStatusCode, verifyForStatusCode };
