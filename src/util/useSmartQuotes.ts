const smartQuotes = [
    // triple prime
    [/'''/g, '\u2034'],
    // beginning "
    [/(\W|^)"(\w)/g, '$1\u201c$2'],
    // ending "
    [/(\u201c[^"]*)"([^"]*$|[^\u201c"]*\u201c)/g, '$1\u201d$2'],
    // remaining " at end of word
    [/([^0-9])"/g, '$1\u201d'],
    // double prime as two single quotes
    [/''/g, '\u2033'],
    // beginning '
    [/(\W|^)'(\S)/g, '$1\u2018$2'],
    // conjunction's possession
    [/([a-z0-9])'([a-z])/gi, '$1\u2019$2'],
    // abbrev. years like '93
    [
        /(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[a-z])/gi,
        '\u2019$2$3',
    ],
    // ending '
    [/((\u2018[^']*)|[a-z])'([^0-9]|$)/gi, '$1\u2019$3'],
    // backwards apostrophe
    [
        /(\B|^)\u2018(?=([^\u2018\u2019]*\u2019\b)*([^\u2018\u2019]*\B\W[\u2018\u2019]\b|[^\u2018\u2019]*$))/gi,
        '$1\u2019',
    ],
    // double prime
    [/"/g, '\u2033'],
    // prime
    [/'/g, '\u2032'],
]

export const useSmartQuotes = (str: string) => {
    return smartQuotes.reduce((acc, curr) => {
        return str.replace(curr[0], curr[1] as string)
    }, str)
}

export default useSmartQuotes
