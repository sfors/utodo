interface TokenData {
  token: string;
  expiresAt: Date;
}

interface TokenResponse {
  access_token: string;
  expires_in?: number;
}

interface Email {
  recipients: string[];
  subject: string;
  body: string;
  contentType?: "HTML" | "Text";
}

let tokenCache: TokenData | null = null;
const tenantId = process.env.GRAPH_TENANT_ID || "";
const clientId = process.env.GRAPH_CLIENT_ID || "";
const clientSecret = process.env.GRAPH_CLIENT_SECRET || "";
const graphUserId = process.env.GRAPH_USER_ID || "";

function tokenExpired(tokenData: TokenData | null) {
  if (!tokenData) {
    return true;
  }

  const expiresAt = tokenData.expiresAt;
  const now = new Date();
  const bufferSeconds = 300; // 5 minutes
  const expiresWithBuffer = new Date(expiresAt.getTime() - bufferSeconds * 1000);

  return now > expiresWithBuffer;
}

function parseTokenResponse(responseBody: string): TokenData {
  const tokenData: TokenResponse = JSON.parse(responseBody);
  const accessToken = tokenData.access_token;
  const expiresIn = tokenData.expires_in || 3600;
  const expiresAt = new Date(Date.now() + (expiresIn * 1000));

  return {
    token: accessToken,
    expiresAt: expiresAt
  };
}

async function getAccessToken() {
  if (!tokenExpired(tokenCache)) {
    return tokenCache!.token;
  }

  console.log("Requesting new Microsoft Graph access token");


  const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const formParams = new URLSearchParams({
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret
  });

  const response = await fetch(authUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formParams.toString()
  });

  if (response.status === 200) {
    const body = await response.text();
    const tokenData = parseTokenResponse(body);
    tokenCache = tokenData;
    console.log("Microsoft Graph access token obtained successfully");
    return tokenData.token;
  } else {
    const body = await response.text();
    const errorMsg = `Failed to get access token. Status: ${response.status}`;
    console.error(errorMsg, {status: response.status, body});
    throw new Error(errorMsg);
  }
}

async function graphRequest(token: string, method: string, endpoint: string, payload?: any) {
  const url = `https://graph.microsoft.com/v1.0${endpoint}`;
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  console.log("Making Microsoft Graph API request", {method, endpoint});

  const options: RequestInit = {
    method,
    headers
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(url, options);

  if (response.status >= 200 && response.status <= 299) {
    console.log("Microsoft Graph API request successful", {status: response.status});
    return response;
  } else {
    const body = await response.text();
    const errorMsg = `Graph API request failed. Status: ${response.status}`;
    console.error(errorMsg, {status: response.status, endpoint, body});
    throw new Error(errorMsg);
  }
}

export async function sendEmail(email: Email) {
  const token = await getAccessToken();
  const {recipients, subject, body, contentType = "Text"} = email;
  const endpoint = `/users/${graphUserId}/sendMail`;
  const emailContentType = contentType === "HTML" ? "HTML" : "Text";

  const payload = {
    message: {
      subject,
      body: {
        contentType: emailContentType,
        content: body
      },
      toRecipients: recipients.map(email => ({
        emailAddress: {address: email}
      }))
    },
    saveToSentItems: false
  };

  console.log("Sending email via Microsoft Graph API", {
    to: recipients,
    subject,
    contentType: emailContentType
  });

  await graphRequest(token, "POST", endpoint, payload);

  console.log("Email sent successfully via Microsoft Graph API", {
    to: recipients,
    subject
  });
}