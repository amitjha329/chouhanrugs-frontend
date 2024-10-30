import { JWT, JWTDecodeParams, JWTEncodeParams } from 'next-auth/jwt';
import { jwtVerify, SignJWT } from 'jose';

const encodedSecret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)

const jwtConfig = {
    encode: async (params: JWTEncodeParams): Promise<string> => {
        const signedToken = await new SignJWT(params.token) // details to  encode in the token
            .setProtectedHeader({ alg: 'HS256' }) // algorithm
            .sign(encodedSecret); // secretKey generated from previous step
        if (!signedToken) {
            throw new Error('Failed to sign token');
        }
        return signedToken;
    },
    decode: async (params: JWTDecodeParams): Promise<JWT | null> => {
        if (!params.token) {
            throw new Error('Failed to verify token');
        }

        let token = params.token;

        if (params.token.startsWith('Bearer')) {
            token = params.token.replace('Bearer ', '');
        }

        try {
            const decoded = await jwtVerify(token, jwtConfig.encodedSecret);

            if (!decoded.payload) {
                throw new Error('Failed to verify token');
            }

            return decoded.payload;
        } catch (error) {
            console.log(error);
            throw new Error(`${error}`);
        }
    },
    encodedSecret
};

export default jwtConfig;