import type { HTMLTagDefinition } from './types';

/**
 * Determines whether passed `val` argument is an object.
 * @param val Value to test.
 */
export const isObject = (val: unknown): val is Record<string, unknown> =>
  typeof val === 'object' && !Array.isArray(val) && val !== null;

/**
 * Transforms an object to a map.
 * (let's be honest it's mostly a generic-based type shortcut heh).
 * @param val Object to transform.
 */
export const toMap = <T = Map<string, any>>(val: Record<string, unknown>) =>
  new Map(Object.entries(val)) as T;

/**
 * Creates a HTML tag (including any attribute provided).
 * @params params.tagName HTML tag to create.
 * @params params.content HTML tag's inner HTML.
 * @params params.attributes List of attributes of the tag.
 */
export const createHtmlTag = ({ tagName, content, attributes }: HTMLTagDefinition) =>
  `<${tagName}${createAttributes(attributes)}>${content}</${tagName}>`;

/**
 * Generate stringified attributes definition for tags.
 * @param attributes List of attributes of the tag.
 */
const createAttributes = (attributes: HTMLTagDefinition['attributes']) => {
  if (!attributes) return '';
  return Object.keys(attributes).reduce(
    (output, attribute) => `${output} ${attribute}="${attributes[attribute]}"`,
    '',
  );
};
