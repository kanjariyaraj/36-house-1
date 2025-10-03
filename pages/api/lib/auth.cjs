// --- JWT & Crypto Simulation (DO NOT USE IN PRODUCTION) ---
// In a real Node.js environment, you would use libraries like 'jsonwebtoken' and 'bcrypt'.

const JWT_SECRET = 'a-very-secret-key-that-should-be-in-env';

const createJwt = (payload) => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const signature = Buffer.from(`signature_for_${encodedPayload}_with_${JWT_SECRET}`).toString('base64');
    return `${encodedHeader}.${encodedPayload}.${signature}`;
};

const decodeJwt = (token) => {
    try {
        const [_, encodedPayload] = token.split('.');
        if (!encodedPayload) throw new Error("Invalid token format");
        return JSON.parse(Buffer.from(encodedPayload, 'base64').toString('utf-8'));
    } catch (e) {
        throw new Error("Invalid token");
    }
};

const generateResetToken = () => {
    // In a real app, use crypto.randomBytes(32).toString('hex')
    return Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64').replace(/=/g, '');
};

const hashPassword = (password) => `hashed_${password}_salted`;

const comparePassword = (password, hash) => hash === `hashed_${password}_salted`;

module.exports = {
    createJwt,
    decodeJwt,
    generateResetToken,
    hashPassword,
    comparePassword
};