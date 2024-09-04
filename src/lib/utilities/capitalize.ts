/**
 * This method accepts two parameters and first one is the string that needs to be capitalized and second parameter is a boolean that specifies if the entire string needs to be capitalized or just the first charcter of the string.
 * @param {string} str String that needs to br capitalized
 * @param {boolean} [all] capitalize all charancter or only the first one.
 * @returns {string} String that has been capitalized.
 */
export default function capitalize(str: string, all?: boolean): string {
    if (all)
        return str.split(' ').map(s => capitalize(s)).join(' ');
    return str.charAt(0).toUpperCase() + str.slice(1);
}