import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptographyService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;

  /**
   * Gera uma chave de criptografia única para um usuário
   * @param userId - ID do usuário como seed para a chave
   * @param secret - Secret do sistema para misturar com o userId
   * @returns Buffer - Chave derivada para o usuário
   */
  private deriveKeyForUser(userId: number, secret: string): Buffer {
    const salt = `${secret}-${userId}`;
    return crypto.pbkdf2Sync(`user-${userId}-key-${secret}`, salt, 10000, this.keyLength, 'sha256');
  }

  /**
   * Criptografa um texto para um usuário específico
   * @param text - Texto a ser criptografado
   * @param userId - ID do usuário que poderá descriptografar
   * @returns objeto contendo o texto criptografado e o vetor de inicialização (IV)
   */
  encrypt(text: string, userId: number): { encryptedText: string; iv: string } {
    if (!text) {
      return { encryptedText: null, iv: null };
    }

    const iv = crypto.randomBytes(16);

    const key = this.deriveKeyForUser(userId, process.env.ENCRYPTION_SECRET);

    const cipher = crypto.createCipheriv(this.algorithm, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    const encryptedWithTag = encrypted + authTag.toString('hex');

    return {
      encryptedText: encryptedWithTag,
      iv: iv.toString('hex'),
    };
  }

  /**
   * Descriptografa um texto para um usuário específico
   * @param encryptedText - Texto criptografado
   * @param iv - Vetor de inicialização usado na criptografia
   * @param userId - ID do usuário que está tentando descriptografar
   * @returns string - Texto descriptografado ou null se falhar
   */
  decrypt(encryptedText: string, iv: string, userId: number): string {
    if (!encryptedText || !iv) {
      return null;
    }

    try {
      const key = this.deriveKeyForUser(userId, process.env.ENCRYPTION_SECRET);

      const ivBuffer = Buffer.from(iv, 'hex');

      const authTagLength = 32;
      const ciphertext = encryptedText.slice(0, -authTagLength);
      const authTag = Buffer.from(encryptedText.slice(-authTagLength), 'hex');

      const decipher = crypto.createDecipheriv(this.algorithm, key, ivBuffer);

      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      return null;
    }
  }
}
