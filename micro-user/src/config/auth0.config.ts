import * as dotenv from 'dotenv';
dotenv.config();

export const auth0Config = {
  domain: `${process.env.AUTH0_DOMAIN}`.replace(/\/$/, ''),
  clientId: process.env.AUTH0_CLIENT_ID,
  clientApiClient: process.env.AUTH0_API_CLIENT_ID,
  clientApiSecret: process.env.AUTH0_API_CLIENT_SECRET,
  audience: process.env.AUTH0_AUDIENCE,
};
