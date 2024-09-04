const removeExtraSpaceandIllegealChars = (data: string) => {
    const newText = data
        .replace(/\s+/g, " ")
        .replace(/_+/g, "-")
        .replace(/\\+/g, "-")
        .replace(/\(+/g, "-")
        .replace(/\)+/g, "-")
        .replace(/\[+/g, "-")
        .replace(/\]+/g, "-")
        .replace(/\{+/g, "-")
        .replace(/\}+/g, "-")
        .replace(/\:+/g, "-")
        .replace(/\@+/g, "-")
        .replace(/\|+/g, "-")
        .replace(/^\s+|\s+$/g, "")
        .replace(/ +(\W)/g, "$1");
    return newText
};

export default removeExtraSpaceandIllegealChars