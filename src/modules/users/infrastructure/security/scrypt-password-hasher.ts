import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { PasswordHasher } from '../../application/ports/password-hasher.js';

const COST = 32768;
const BLOCK_SIZE = 8;
const PARALLELIZATION = 1;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const MAX_MEMORY_BYTES = 64 * 1024 * 1024;

function deriveKey(password: string, salt: Buffer, cost: number, blockSize: number, parallelization: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        scrypt(password, salt, KEY_LENGTH, { N: cost, r: blockSize, p: parallelization, maxmem: MAX_MEMORY_BYTES }, (error, derivedKey) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(derivedKey);
        },
        );
    });
}

@Injectable()
export class ScryptPasswordHasher implements PasswordHasher {
    async hash(plain: string): Promise<string> {
        const salt = randomBytes(SALT_LENGTH);
        const key = await deriveKey(plain, salt, COST, BLOCK_SIZE, PARALLELIZATION);
        return [
            'scrypt',
            COST,
            BLOCK_SIZE,
            PARALLELIZATION,
            salt.toString('hex'),
            key.toString('hex'),
        ].join('$');
    }

    async verify(plain: string, stored: string): Promise<boolean> {
        const [scheme, cost, blockSize, parallelization, saltHex, keyHex] = stored.split('$');
        if (scheme !== 'scrypt' || !cost || !blockSize || !parallelization || !saltHex || !keyHex) {
            return false;
        }

        const expected = Buffer.from(keyHex, 'hex');
        const actual = await deriveKey(plain, Buffer.from(saltHex, 'hex'), Number(cost), Number(blockSize), Number(parallelization));
        return expected.length === actual.length && timingSafeEqual(expected, actual);
    }
}