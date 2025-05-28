export const encryptionUtils = {
  /**
   * Asynchronously generates a secure random key
   * Uses Web Crypto API for cryptographically strong random values
   */
  async generateRandomKey(length = 32): Promise<Uint8Array> {
    try {
      const randomBytes = new Uint8Array(length);
      window.crypto.getRandomValues(randomBytes);
      return randomBytes;
    } catch (error) {
      console.error('Error generating random key:', error);
      throw error;
    }
  },
  
  /**
   * Converts a Uint8Array to a hexadecimal string
   */
  arrayBufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  },
  
  /**
   * Converts a hexadecimal string to a Uint8Array
   */
  hexToArrayBuffer(hex: string): Uint8Array {
    const result = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      result[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return result;
  },
  
  /**
   * Generates a secure password with customizable parameters
   */
  generateSecurePassword(
    length = 12,
    options = {
      includeLowercase: true,
      includeUppercase: true,
      includeNumbers: true,
      includeSpecial: true,
    }
  ): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let chars = '';
    if (options.includeLowercase) chars += lowercase;
    if (options.includeUppercase) chars += uppercase;
    if (options.includeNumbers) chars += numbers;
    if (options.includeSpecial) chars += special;
    
    if (chars.length === 0) {
      throw new Error('At least one character type must be included');
    }
    
    const randomBytes = new Uint8Array(length);
    window.crypto.getRandomValues(randomBytes);
    
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(randomBytes[i] % chars.length);
    }
    
    // Ensure at least one character from each required set
    let finalPassword = password;
    
    if (options.includeLowercase && !/[a-z]/.test(finalPassword)) {
      const pos = Math.floor(Math.random() * finalPassword.length);
      const char = lowercase.charAt(Math.floor(Math.random() * lowercase.length));
      finalPassword = finalPassword.substring(0, pos) + char + finalPassword.substring(pos + 1);
    }
    
    if (options.includeUppercase && !/[A-Z]/.test(finalPassword)) {
      const pos = Math.floor(Math.random() * finalPassword.length);
      const char = uppercase.charAt(Math.floor(Math.random() * uppercase.length));
      finalPassword = finalPassword.substring(0, pos) + char + finalPassword.substring(pos + 1);
    }
    
    if (options.includeNumbers && !/[0-9]/.test(finalPassword)) {
      const pos = Math.floor(Math.random() * finalPassword.length);
      const char = numbers.charAt(Math.floor(Math.random() * numbers.length));
      finalPassword = finalPassword.substring(0, pos) + char + finalPassword.substring(pos + 1);
    }
    
    if (options.includeSpecial && !/[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(finalPassword)) {
      const pos = Math.floor(Math.random() * finalPassword.length);
      const char = special.charAt(Math.floor(Math.random() * special.length));
      finalPassword = finalPassword.substring(0, pos) + char + finalPassword.substring(pos + 1);
    }
    
    return finalPassword;
  },
  
  /**
   * Creates a hash of the given data using SHA-256
   * Uses Web Crypto API for secure hashing
   */
  async hashData(data: string): Promise<string> {
    try {
      // Convert the string to Uint8Array
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      // Hash the data
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
      
      // Convert the hash to a hex string
      return this.arrayBufferToHex(hashBuffer);
    } catch (error) {
      console.error('Error hashing data:', error);
      throw error;
    }
  },
  
  /**
   * Derives a key from a password using PBKDF2
   * Uses Web Crypto API for secure key derivation
   */
  async deriveKeyFromPassword(
    password: string, 
    salt: Uint8Array, 
    iterations = 100000
  ): Promise<CryptoKey> {
    try {
      // Convert the password to a key
      const encoder = new TextEncoder();
      const passwordBuffer = encoder.encode(password);
      
      const baseKey = await window.crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );
      
      // Derive a key using PBKDF2
      return await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations,
          hash: 'SHA-256',
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('Error deriving key from password:', error);
      throw error;
    }
  },
  
  /**
   * Encrypts data using AES-GCM
   * Uses Web Crypto API for secure encryption
   */
  async encryptData(
    data: string,
    key: CryptoKey
  ): Promise<{ ciphertext: string; iv: string }> {
    try {
      // Generate a random initialization vector
      const iv = await this.generateRandomKey(12);
      
      // Convert the data to Uint8Array
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      // Encrypt the data
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv,
        },
        key,
        dataBuffer
      );
      
      // Convert the encrypted data to a hex string
      return {
        ciphertext: this.arrayBufferToHex(encryptedBuffer),
        iv: this.arrayBufferToHex(iv),
      };
    } catch (error) {
      console.error('Error encrypting data:', error);
      throw error;
    }
  },
  
  /**
   * Decrypts data using AES-GCM
   * Uses Web Crypto API for secure decryption
   */
  async decryptData(
    ciphertext: string,
    iv: string,
    key: CryptoKey
  ): Promise<string> {
    try {
      // Convert the ciphertext and IV from hex to Uint8Array
      const ciphertextBuffer = this.hexToArrayBuffer(ciphertext);
      const ivBuffer = this.hexToArrayBuffer(iv);
      
      // Decrypt the data
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: ivBuffer,
        },
        key,
        ciphertextBuffer
      );
      
      // Convert the decrypted data to a string
      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    } catch (error) {
      console.error('Error decrypting data:', error);
      throw error;
    }
  },
};