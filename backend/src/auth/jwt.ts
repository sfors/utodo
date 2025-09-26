import * as jose from "jose";

const alg = "Ed25519";
const publicKeyStr = process.env.JWT_PUBLIC_KEY || "";
const privateKeyStr = process.env.JWT_PRIVATE_KEY || "";
const publicKey = await jose.importSPKI(publicKeyStr, alg);
const privateKey = await jose.importPKCS8(privateKeyStr, alg);

interface Claims {
  userId: string;
  email: string;
}

async function sign(claims: Claims) {
  return await new jose.SignJWT(claims as any)
    .setProtectedHeader({alg})
    .setIssuedAt()
    .setIssuer("utodo")
    .setAudience("utodo")
    .setExpirationTime("1y")
    .sign(privateKey);
}

async function verify(jwt: string): Promise<Claims> {
  const {payload}: {payload: Claims} = await jose.jwtVerify(jwt, publicKey, {
    issuer: "utodo",
    audience: "utodo"
  });

  return payload;
}

export default {
  sign,
  verify
};