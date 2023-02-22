const HEX_REGEX = /^[A-F0-9]{40}$/

/**
 * Tests if hex is a valid hex-string
 */
function isHex(hex: string): boolean {
  return HEX_REGEX.test(hex)
}

/**
 * Tests if a string is a valid representation of a currency
 */
function isStringRepresentation(input: string): boolean {
  return input.length === 3 || isHex(input)
}

/**
 * Tests if a Buffer is a valid representation of a currency
 */
function isBytesArray(bytes: Buffer): boolean {
  return bytes.byteLength === 20
}

/**
 * Ensures that a value is a valid representation of a currency
 */
export function isValidRepresentation(input: Buffer | string): boolean {
  return input instanceof Buffer ? isBytesArray(input) : isStringRepresentation(input)
}
