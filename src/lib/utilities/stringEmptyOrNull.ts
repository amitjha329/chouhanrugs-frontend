/**
 * Accepts a string and check whether it is null or only contains empty spaces
 * @param {string} str Strick to check for empty or null
 * @returns {boolean}
 */
const stringEmptyOrNull = (str?: string|null): boolean => {
    return str === undefined || str === null || RegExp(/^ *$/).exec(str) !== null || str.length === 0;
}

/**
 * Accepts a string and asserts that it is not null or does not only contains empty spaces
 * @param {string} str Strick to check for empty or null
 * @returns {boolean}
 */
export const stringNotEmptyOrNull = (str?: string|null): boolean => {
    return !stringEmptyOrNull(str)
}

export default stringEmptyOrNull