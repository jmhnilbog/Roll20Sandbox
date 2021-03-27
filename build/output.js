var __dirname = "";
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 75:
/***/ (() => {

// @ts-nocheck

// Github:   https://github.com/shdwjk/Roll20API/blob/master/RecursiveTable/RecursiveTable.js
// By:       The Aaron, Arcane Scriptomancer
// Contact:  https://app.roll20.net/users/104025/the-aaron

var RecursiveTable =
    RecursiveTable ||
    (function () {
        'use strict'

        var version = '0.2.5',
            lastUpdate = 1571360894,
            schemaVersion = 0.1,
            clearURL =
                'https://s3.amazonaws.com/files.d20.io/images/4277467/iQYjFOsYC5JsuOPUCI9RGA/thumb.png?1401938659',
            defaults = {
                maxdepth: 10,
                delimiter: ', ',
                echo: false,
                prefix: '',
                suffix: '',
                dropempty: true,
                sort: false,
                prefaceuniquespace: false,
                showicons: false,
                iconlabel: true,
                emptydefault: '',
                iconscale: '5em',
                who: '',
            },
            regex = {
                rtCmd: /^(!rt)(?:\[([^\]]*)\])?(?:\s+|$)/,
                inlineRoll: /\[\[.*\]\]/,
                cssSize: /^(auto|0)$|^[+-]?[0-9]+.?([0-9]+)?(px|em|ex|%|in|cm|mm|pt|pc)$/,
            },
            checkInstall = function () {
                log(
                    '-=> RecursiveTable v' +
                        version +
                        ' <=-  [' +
                        new Date(lastUpdate * 1000) +
                        ']'
                )

                if (
                    !_.has(state, 'RecursiveTable') ||
                    state.RecursiveTable.version !== schemaVersion
                ) {
                    log('  > Updating Schema to v' + schemaVersion + ' <')
                    state.RecursiveTable = {
                        version: schemaVersion,
                    }
                }
            },
            sendChatP = function (msg) {
                return new Promise((resolve) => {
                    sendChat('', msg.replace(/\[\[\s+/g, '[['), (res) => {
                        resolve(res[0])
                    })
                })
            },
            ch = function (c) {
                var entities = {
                    '<': 'lt',
                    '>': 'gt',
                    "'": '#39',
                    '@': '#64',
                    '{': '#123',
                    '|': '#124',
                    '}': '#125',
                    '[': '#91',
                    '\\': '#92',
                    ']': '#93',
                    '&': 'amp',
                    '"': 'quot',
                    '-': 'mdash',
                    ' ': 'nbsp',
                }

                if (_.has(entities, c)) {
                    return '&' + entities[c] + ';'
                }
                return ''
            },
            esRE = function (s) {
                var escapeForRegexp = /(\\|\/|\[|\]|\(|\)|\{|\}|\?|\+|\*|\||\.|\^|\$)/g
                return s.replace(escapeForRegexp, '\\$1')
            },
            HE = (function () {
                var entities = {
                        //' ' : '&'+'nbsp'+';',
                        '<': '&' + 'lt' + ';',
                        '>': '&' + 'gt' + ';',
                        "'": '&' + '#39' + ';',
                        '@': '&' + '#64' + ';',
                        '{': '&' + '#123' + ';',
                        '|': '&' + '#124' + ';',
                        '}': '&' + '#125' + ';',
                        '[': '&' + '#91' + ';',
                        ']': '&' + '#93' + ';',
                        '"': '&' + 'quot' + ';',
                    },
                    re = new RegExp(
                        '(' + _.map(_.keys(entities), esRE).join('|') + ')',
                        'g'
                    )
                return function (s) {
                    return s.replace(re, function (c) {
                        return entities[c] || c
                    })
                }
            })(),
            makePrefixer = function (prefix) {
                let c = {}
                return (val) => {
                    val = val.trim()
                    c[val] = c[val] || 0
                    return prefix.repeat(c[val]++) + val
                }
            },
            //	makeSuffixer = function(suffix){
            //        let c = {};
            //		return (val)=>{
            //            val = val.trim();
            //            c[val]=c[val]||0;
            //            return val+suffix.repeat(c[val]++);
            //        };
            //	},

            _h = {
                outer: (...o) =>
                    `<div style="border: 1px solid black; background-color: white; padding: 3px 3px;">${o.join(
                        ' '
                    )}</div>`,
                title: (t, v) =>
                    `<div style="font-weight: bold; border-bottom: 1px solid black;font-size: 130%;">${t} v${v}</div>`,
                subhead: (...o) => `<b>${o.join(' ')}</b>`,
                minorhead: (...o) => `<u>${o.join(' ')}</u>`,
                optional: (...o) =>
                    `${ch('[')}${o.join(` ${ch('|')} `)}${ch(']')}`,
                required: (...o) =>
                    `${ch('<')}${o.join(` ${ch('|')} `)}${ch('>')}`,
                header: (...o) =>
                    `<div style="padding-left:10px;margin-bottom:3px;">${o.join(
                        ' '
                    )}</div>`,
                section: (s, ...o) => `${_h.subhead(s)}${_h.inset(...o)}`,
                paragraph: (...o) => `<p>${o.join(' ')}</p>`,
                items: (o) => `<li>${o.join('</li><li>')}</li>`,
                ol: (...o) => `<ol>${_h.items(o)}</ol>`,
                ul: (...o) => `<ul>${_h.items(o)}</ul>`,
                grid: (...o) =>
                    `<div style="padding: 12px 0;">${o.join(
                        ''
                    )}<div style="clear:both;"></div></div>`,
                cell: (o) =>
                    `<div style="width: 130px; padding: 0 3px; float: left;">${o}</div>`,
                inset: (...o) =>
                    `<div style="padding-left: 10px;padding-right:20px">${o.join(
                        ' '
                    )}</div>`,
                pre: (...o) =>
                    `<div style="border:1px solid #e1e1e8;border-radius:4px;padding:8.5px;margin-bottom:9px;font-size:12px;white-space:normal;word-break:normal;word-wrap:normal;background-color:#f7f7f9;font-family:monospace;overflow:auto;">${o.join(
                        ' '
                    )}</div>`,
                preformatted: (...o) =>
                    _h.pre(o.join('<br>').replace(/\s/g, ch(' '))),
                code: (...o) => `<code>${o.join(' ')}</code>`,
                attr: {
                    bare: (o) => `${ch('@')}${ch('{')}${o}${ch('}')}`,
                    selected: (o) =>
                        `${ch('@')}${ch('{')}selected${ch('|')}${o}${ch('}')}`,
                    target: (o) =>
                        `${ch('@')}${ch('{')}target${ch('|')}${o}${ch('}')}`,
                    char: (o, c) =>
                        `${ch('@')}${ch('{')}${c || 'CHARACTER NAME'}${ch(
                            '|'
                        )}${o}${ch('}')}`,
                },
                bold: (...o) => `<b>${o.join(' ')}</b>`,
                italic: (...o) => `<i>${o.join(' ')}</i>`,
                font: {
                    command: (...o) =>
                        `<b><span style="font-family:serif;">${o.join(
                            ' '
                        )}</span></b>`,
                },
            },
            showHelp = function (playerid) {
                let who = (
                    getObj('player', playerid) || { get: () => 'API' }
                ).get('_displayname')

                sendChat(
                    '',
                    '/w "' +
                        who +
                        '" ' +
                        _h.outer(
                            _h.title('RecursiveTable', version),
                            _h.header(
                                _h.paragraph(
                                    'RecursiveTable provides a way to expand the results of Rollable Tables which have inline rolls within them. Now with options and support for whispering Roll Templates.'
                                ),
                                _h.paragraph(
                                    `When using Rolltemplates, your message must have at least one ${_h.code(
                                        ch('{') + ch('{')
                                    )} that in not coming from a Rollable Table.  When using the ${_h.code(
                                        'PrefaceUniqueSpace'
                                    )} option, be sure your ${_h.code(
                                        `${ch('{')}${ch('{')}name=something${ch(
                                            '}'
                                        )}${ch('}')}`
                                    )} is first.`
                                )
                            ),
                            _h.subhead('Commands'),
                            _h.inset(
                                _h.font.command(
                                    `!rt${_h.optional('options')} ${_h.optional(
                                        '--help',
                                        '...'
                                    )}`
                                ),
                                _h.paragraph(
                                    'Performs all inline rolls, then continues to expand inline rolls (to a maximum depth of around 10).'
                                ),
                                _h.ul(
                                    `${_h.bold(
                                        '--help'
                                    )} -- Shows the Help screen`,
                                    `${_h.bold(
                                        '...'
                                    )} -- Anything following ${_h.code(
                                        '!rt'
                                    )} will be expanded, then sent to to the chat.`
                                ),

                                _h.section('Options'),
                                _h.paragraph(
                                    `These are inline settings to adjust how the rolls are put together.  Options are specified in ${_h.code(
                                        ch('[')
                                    )} ${_h.code(
                                        ch(']')
                                    )} right after the ${_h.code('!rt')}:`
                                ),
                                _h.inset(
                                    _h.pre(
                                        `!rt[delimiter:-|maxdepth:20] something`
                                    )
                                ),
                                _h.paragraph(
                                    `Options are separated with the verticle pipe symbol (${_h.code(
                                        ch('|')
                                    )}) and have an optional argument separated by a ${_h.code(
                                        ':'
                                    )} or by ${_h.code(
                                        '%%'
                                    )} (Useful for API Command buttons where : causes problems). Omitting the argument causes ${_h.bold(
                                        'true'
                                    )} to be used for switch options, or the default value.  All Options are case insenstive.  Options are one of 3 types: Number (any integer), Boolean (true values: ${_h.code(
                                        'on'
                                    )}, ${_h.code('yes')}, ${_h.code(
                                        'y'
                                    )}, ${_h.code(
                                        'true'
                                    )}.  false values: ${_h.code(
                                        'off'
                                    )}, ${_h.code('no')}, ${_h.code(
                                        'n'
                                    )}, ${_h.code(
                                        'false'
                                    )}), or text (any value except ${_h.code(
                                        ']'
                                    )}, use ${_h.code(
                                        ch('\\') + ch('|')
                                    )} for ${_h.code(ch('|'))})`
                                ),

                                _h.ul(
                                    `${_h.bold(
                                        'MaxDepth'
                                    )} -- Specifies the number of recursions to perform.  ${_h.bold(
                                        'Default: 10 (Number)'
                                    )}`,
                                    `${_h.bold(
                                        'Delimiter'
                                    )} -- A string of text to put between table items. The special value ${_h.code(
                                        'BR'
                                    )} will cause html line breaks to be used. ${_h.bold(
                                        `Default: ${_h.code(', ')} (String)`
                                    )}`,
                                    `${_h.bold(
                                        'DropEmpty'
                                    )} -- Causes empty table items to be dropped before joining with the delimiter. ${_h.bold(
                                        'Default: on (Boolean)'
                                    )}`,
                                    `${_h.bold(
                                        'Sort'
                                    )} -- Causes table items to be sorted before being joined by the delimiter.  Note that this happens at a single layer of recursion, so if you have table items made of of lists of table items, the sorting will only be at each level. ${_h.bold(
                                        'Default: off (Boolean)'
                                    )}`,
                                    `${_h.bold(
                                        'PrefaceUniqueSpace'
                                    )} -- Causes the final message to have a unique number of spaces inserted after each ${_h.code(
                                        ch('{') + ch('{')
                                    )}. This is useful if you${ch(
                                        "'"
                                    )}re building Roll Templates and might have multiple lines with the same label. ${_h.bold(
                                        'Default: off (Boolean)'
                                    )}`,
                                    `${_h.bold(
                                        'ShowIcons'
                                    )} -- Adds table avatars as inline icons, if they exist. ${_h.bold(
                                        'Default: off (Boolean)'
                                    )}`,
                                    `${_h.bold(
                                        'IconLabel'
                                    )} -- When table icons are shown, the text for the row is shown as a label below it. ${_h.bold(
                                        'Default: on (Boolean)'
                                    )}`,
                                    `${_h.bold(
                                        'IconScale'
                                    )} -- When table icons are shown, they are restricted to the provided scale. Any valid CSS size setting will work. ${_h.bold(
                                        'Default: 5em'
                                    )}`
                                ),

                                _h.section('Examples'),

                                _h.paragraph(
                                    'Basic usage, whispering treasure to the gm:'
                                ),
                                _h.inset(
                                    _h.pre(
                                        `!rt /w gm ${ch('[') + ch('[')}1t${ch(
                                            '['
                                        )}treasure-table${
                                            ch(']') + ch(']') + ch(']')
                                        }`
                                    )
                                ),

                                _h.paragraph('Whispering a roll template:'),
                                _h.inset(
                                    _h.pre(
                                        `!rt /w gm ${
                                            ch('&') + ch('{')
                                        }template:default${
                                            ch('}') + ch('{') + ch('{')
                                        }treasure=${ch('[') + ch('[')}1t${ch(
                                            '['
                                        )}treasure-table${
                                            ch(']') +
                                            ch(']') +
                                            ch(']') +
                                            ch('}') +
                                            ch('}')
                                        }`
                                    )
                                ),

                                _h.paragraph(
                                    'Whispering a roll template, with each item on a separate line:'
                                ),
                                _h.inset(
                                    _h.pre(
                                        `!rt${ch('[')}Delimiter:BR${ch(
                                            ']'
                                        )} /w gm ${
                                            ch('&') + ch('{')
                                        }template:default${
                                            ch('}') + ch('{') + ch('{')
                                        }treasure=${ch('[') + ch('[')}1t${ch(
                                            '['
                                        )}treasure-table${
                                            ch(']') +
                                            ch(']') +
                                            ch(']') +
                                            ch('}') +
                                            ch('}')
                                        }`
                                    )
                                ),

                                _h.paragraph(
                                    `Whispering a roll template, with each item on a separate line, with empty results replaced by ${_h.code(
                                        'Nothing'
                                    )}:`
                                ),
                                _h.inset(
                                    _h.pre(
                                        `!rt${ch(
                                            '['
                                        )}Delimiter:BR|EmptyDefault:Nothing${ch(
                                            ']'
                                        )} /w gm ${
                                            ch('&') + ch('{')
                                        }template:default${
                                            ch('}') + ch('{') + ch('{')
                                        }treasure=${ch('[') + ch('[')}1t${ch(
                                            '['
                                        )}treasure-table${
                                            ch(']') +
                                            ch(']') +
                                            ch(']') +
                                            ch('}') +
                                            ch('}')
                                        }`
                                    )
                                ),

                                _h.paragraph(
                                    `Whispering a roll template, with each item on a separate line, with a table that is returning ${_h.code(
                                        `${ch('{') + ch('{')}label=values${
                                            ch('}') + ch('}')
                                        }`
                                    )}:`
                                ),
                                _h.inset(
                                    _h.pre(
                                        `!rt${ch(
                                            '['
                                        )}Delimiter:BR|PrefaceUniqueSpace${ch(
                                            ']'
                                        )} ${
                                            ch('&') + ch('{')
                                        }template:default${
                                            ch('}') + ch('{') + ch('{')
                                        }name=Treasure Bundles${
                                            ch('}') +
                                            ch('}') +
                                            ch('[') +
                                            ch('[')
                                        }5t${ch('[')}treasure-bundle${
                                            ch(']') + ch(']') + ch(']')
                                        }`
                                    )
                                )
                            )
                        )
                )
            },
            getAsBoolean = function (val, defVal) {
                let isTrue = _.isBoolean(val)
                        ? val
                        : _.contains(
                              ['on', 'yes', 'y', 'true'],
                              (`${val}` || 'true').toLowerCase()
                          ),
                    isFalse = _.isBoolean(val)
                        ? !val
                        : _.contains(
                              ['off', 'no', 'n', 'false'],
                              (`${val}` || 'true').toLowerCase()
                          )
                if (isTrue || isFalse) {
                    return !isFalse
                }
                return !_.isUndefined(defVal) ? defVal : val
            },
            parseOptions = function (cmdOpts) {
                return _.chain(
                    (cmdOpts || '')
                        .replace(/((?:\\.|[^|])*)\|/g, '$1\n')
                        .replace(/\\/, '')
                        .split(/\n/)
                )
                    .filter((a) => a.length)
                    .reduce((m, o) => {
                        let tok = o.split(/(?:%%|:)/),
                            c = tok.shift().toLowerCase(),
                            a = tok.join(':') || true
                        switch (c) {
                            case 'maxdepth':
                                a = parseInt(a, 10) || defaults[c]
                                break
                            case 'iconscale':
                                {
                                    if (!regex.cssSize.test(a)) {
                                        a = defaults[c]
                                    }
                                }
                                break
                            case 'showicons':
                            case 'iconlabel':
                            case 'dropempty':
                            case 'sort':
                            case 'prefaceuniquespace':
                            case 'echo':
                                a = getAsBoolean(a, defaults[c])
                                break
                            case 'emptydefault':
                                break
                            case 'prefix':
                            case 'suffix':
                            case 'delimiter':
                                switch (a.toLowerCase()) {
                                    case 'br':
                                        a = '<br>'
                                        break
                                    default:
                                }
                                break
                        }

                        m[c] = a
                        return m
                    }, _.clone(defaults))
                    .value()
            },
            rollAndParseInlines = function (roll, opts) {
                return new Promise((returnText) => {
                    sendChatP(roll)
                        .then((msg) => {
                            parseInlines(msg.inlinerolls, opts)
                                .then((subs) => {
                                    returnText(
                                        _.reduce(
                                            subs,
                                            (m, v, k) => m.replace(k, v),
                                            msg.content
                                        )
                                    )
                                })
                                .catch((e) => {
                                    let eRoll = HE(roll)
                                    sendChat(
                                        `RecursiveTables`,
                                        `/w "${opts.who}" <div>An error occured while filling the results of this roll: <code>${eRoll}</code></div><div>Error: <code>${e.message}</code></div>`
                                    )
                                })
                        })
                        .catch((e) => {
                            let eRoll = HE(roll)
                            sendChat(
                                `RecursiveTables`,
                                `/w "${opts.who}" <div>An error occured parsing this roll: <code>${eRoll}</code></div><div>Error: <code>${e.message}</code></div>`
                            )
                        })
                })
            },
            avatarCache = {},
            lookupAvatar = (tableitemid) => {
                let avatar = (
                    getObj('tableitem', tableitemid) || { get: () => null }
                ).get('avatar')
                avatarCache[tableitemid] = avatar
                return avatar
            },
            getAvatar = (tableitemid) =>
                avatarCache[tableitemid] || lookupAvatar(tableitemid),
            parseInlines = function (inlines, opts) {
                const styles = {
                    o: {
                        display: 'inline-block',
                        'max-width': '20em',
                        'text-align': 'center',
                        border: '1px solid #aaa',
                        'border-radius': '3px',
                        'background-color': 'white',
                        margin: '.1em',
                    },
                    i: {
                        'max-width': opts.iconscale,
                        'max-height': opts.iconscale,
                    },
                    t: {
                        'border-top': '1px solid #aaa',
                        'background-color': '#eee',
                        padding: '.1em',
                    },
                }

                const s = (o) => _.map(o, (v, k) => `${k}:${v};`).join('')
                const formatPart = (part) =>
                    opts.showicons && part.avatar
                        ? `<div style="${s(styles.o)}">` +
                          `<img style="${s(styles.i)}" src="${
                              part.avatar || clearURL
                          }">` +
                          (opts.iconlabel
                              ? `<div style="${s(styles.t)}">${
                                    part.text || ch(' ')
                                }</div>`
                              : '') +
                          `</div>`
                        : part.text
                const composeParts = (parts) =>
                    _.compose(
                        (x) => _.map(x, formatPart),
                        opts.sort ? (x) => _.sortBy(x, 'text') : _.identity,
                        opts.dropempty
                            ? (x) =>
                                  _.filter(
                                      x,
                                      (v) =>
                                          `${v.text}${
                                              opts.showicons ? v.avatar : ''
                                          }`.trim().length
                                  )
                            : _.identity
                    )(parts)
                        .map((o) => `${opts.prefix}${o}${opts.suffix}`)
                        .join(opts.delimiter)

                return new Promise((returnSubs) => {
                    let subOpts = _.clone(opts),
                        subs = {},
                        context = {},
                        promises = []

                    --subOpts.maxdepth

                    _.each(inlines, (rollRecord, msgIdx) => {
                        const key = `$[[${msgIdx}]]`,
                            result = rollRecord.results.total

                        context[key] = {
                            result: rollRecord.results.total,
                        }

                        _.each(rollRecord.results.rolls, (roll) => {
                            if (_.has(roll, 'table')) {
                                context[key].hasText = false
                                context[key].parts = []
                                context[key].sentinal = 0

                                _.each(roll.results, (die, dieIdx) => {
                                    if (
                                        _.has(die, 'tableItem') &&
                                        _.isString(die.tableItem.name) &&
                                        !die.tableItem.name.match(/^\d+$/)
                                    ) {
                                        if (
                                            regex.inlineRoll.test(
                                                die.tableItem.name
                                            ) &&
                                            subOpts.maxdepth
                                        ) {
                                            ++context[key].sentinal

                                            promises.push(
                                                new Promise((done) => {
                                                    rollAndParseInlines(
                                                        die.tableItem.name,
                                                        subOpts
                                                    )
                                                        .then((text) => {
                                                            context[key].parts[
                                                                dieIdx
                                                            ] = {
                                                                text: text,
                                                                avatar:
                                                                    die
                                                                        .tableItem
                                                                        .avatar ||
                                                                    getAvatar(
                                                                        die
                                                                            .tableItem
                                                                            .id
                                                                    ),
                                                            }

                                                            --context[key]
                                                                .sentinal
                                                            if (
                                                                !context[key]
                                                                    .sentinal
                                                            ) {
                                                                subs[
                                                                    key
                                                                ] = composeParts(
                                                                    context[key]
                                                                        .parts
                                                                )
                                                            }
                                                            done(true)
                                                        })
                                                        .catch((e) => {
                                                            let eRoll = HE(
                                                                die.tableItem
                                                                    .name
                                                            )
                                                            sendChat(
                                                                `RecursiveTables`,
                                                                `/w "${opts.who}" <div>An Error occured with this TableItem: <code>${eRoll}</code></div><div>Error: <code>${e.message}</code></div>`
                                                            )
                                                        })
                                                })
                                            )
                                        } else {
                                            context[key].parts[dieIdx] = {
                                                text:
                                                    `${die.tableItem.name}`.trim() ||
                                                    opts.emptydefault,
                                                avatar:
                                                    die.tableItem.avatar ||
                                                    getAvatar(die.tableItem.id),
                                            }
                                        }
                                        context[key].hasText = true
                                    } else {
                                        context[key].parts[dieIdx] = die.v
                                    }
                                })

                                if (
                                    context[key].hasText &&
                                    !context[key].sentinal
                                ) {
                                    subs[key] = composeParts(context[key].parts)
                                } else {
                                    subs[key] = result
                                }
                            } else {
                                subs[key] = result
                            }
                        })
                    })

                    if (promises.length) {
                        Promise.all(promises)
                            .then(() => {
                                returnSubs(subs)
                            })
                            .catch((e) => {
                                let eRoll = HE(
                                    _.pluck(inlines, 'expression').join(', ')
                                )
                                sendChat(
                                    `RecursiveTables`,
                                    `/w "${opts.who}" <div>An Error occurred: <code>${eRoll}</code></div><div>Error: <code>${e.message}</code></div>`
                                )
                            })
                    } else {
                        returnSubs(subs)
                    }
                })
            },
            parseMessage = function (msg, opts) {
                parseInlines(msg.inlinerolls, opts)
                    .then((subs) => {
                        msg.content = _.reduce(
                            subs,
                            (m, v, k) => m.replace(k, v),
                            msg.content
                        )

                        let prefixer = opts.prefaceuniquespace
                            ? makePrefixer(' ')
                            : _.identity
                        msg.content = (msg.content || '[EMPTY]').replace(
                            /(?:\{\{)([^=]*)(?:=)/g,
                            (full, match) => `{{${prefixer(match)}=`
                        )

                        if (
                            _.has(msg, 'rolltemplate') &&
                            _.isString(msg.rolltemplate) &&
                            msg.rolltemplate.length
                        ) {
                            msg.content = msg.content.replace(
                                /\{\{/,
                                '&{template:' + msg.rolltemplate + '} {{'
                            )
                        }
                        if (
                            opts.echo &&
                            !(
                                /^\/w\s+gm\s+/.test(msg.content) &&
                                playerIsGM(msg.playerid)
                            )
                        ) {
                            sendChat(
                                `${msg.who} [echo]`,
                                `/w "${opts.who}" ${msg.content.replace(
                                    /^\/w\s+(?:"[^"]*"|'[^']'|\S+)\s*/,
                                    ''
                                )}`
                            )
                        }
                        sendChat(msg.who || '[BLANK]', msg.content)
                    })
                    .catch((e) => {
                        let eRoll = HE(msg.content)
                        sendChat(
                            `RecursiveTables`,
                            `/w "${opts.who}" <div>An Error occured with this message: <code>${eRoll}</code></div><div>Error: <code>${e.message}</code></div>`
                        )
                    })
            },
            handleInput = function (msg_orig) {
                var msg = _.clone(msg_orig),
                    args,
                    who,
                    cmd,
                    opts
                try {
                    if (msg.type !== 'api') {
                        return
                    }
                    who = (
                        getObj('player', msg.playerid) || { get: () => 'API' }
                    ).get('_displayname')

                    cmd = (msg.content.match(regex.rtCmd) || []).splice(1)
                    args = msg.content
                        .replace(regex.rtCmd, '')
                        .trim()
                        .split(/\s+/)
                    switch (cmd[0]) {
                        case '!rt':
                            if ('--help' === args[0]) {
                                showHelp(msg.playerid)
                            } else {
                                opts = parseOptions(cmd[1])
                                opts.who = who
                                msg.content = msg.content.replace(
                                    regex.rtCmd,
                                    ''
                                )
                                parseMessage(msg, opts)
                            }
                            break
                    }
                } catch (e) {
                    let who = (
                        getObj('player', msg_orig.playerid) || {
                            get: () => 'API',
                        }
                    ).get('_displayname')
                    sendChat(
                        'RecursiveTables',
                        `/w "${who}" ` +
                            `<div style="border:1px solid black; background-color: #ffeeee; padding: .2em; border-radius:.4em;" >` +
                            `<div>There was an error while trying to run your command:</div>` +
                            `<div style="margin: .1em 1em 1em 1em;"><code>${msg_orig.content}</code></div>` +
                            `<div>Please <a class="showtip tipsy" title="The Aaron's profile on Roll20." style="color:blue; text-decoration: underline;" href="https://app.roll20.net/users/104025/the-aaron">send me this information</a> so I can make sure this doesn't happen again (triple click for easy select in most browsers.):</div>` +
                            `<div style="font-size: .6em; line-height: 1em;margin:.1em .1em .1em 1em; padding: .1em .3em; color: #666666; border: 1px solid #999999; border-radius: .2em; background-color: white;">` +
                            JSON.stringify({ msg: msg_orig, stack: e.stack }) +
                            `</div>` +
                            `</div>`
                    )
                }
            },
            registerEventHandlers = function () {
                on('chat:message', handleInput)
            }

        return {
            CheckInstall: checkInstall,
            RegisterEventHandlers: registerEventHandlers,
        }
    })()

on('ready', function () {
    'use strict'

    RecursiveTable.CheckInstall()
    RecursiveTable.RegisterEventHandlers()
})


/***/ }),

/***/ 79:
/***/ (() => {

// @ts-nocheck
var bshields = bshields || {};
if (!bshields.splitArgs) {
  bshields.splitArgs = (function () {
    "use strict";

    var version = 1.1;

    function splitArgs(input, separator) {
      var singleQuoteOpen = false,
        doubleQuoteOpen = false,
        tokenBuffer = [],
        ret = [],
        arr = input.split(""),
        element,
        i,
        matches;
      separator = separator || /\s/g;

      for (i = 0; i < arr.length; i++) {
        element = arr[i];
        matches = element.match(separator);
        if (element === "'") {
          if (!doubleQuoteOpen) {
            singleQuoteOpen = !singleQuoteOpen;
            continue;
          }
        } else if (element === '"') {
          if (!singleQuoteOpen) {
            doubleQuoteOpen = !doubleQuoteOpen;
            continue;
          }
        }

        if (!singleQuoteOpen && !doubleQuoteOpen) {
          if (matches) {
            if (tokenBuffer && tokenBuffer.length > 0) {
              ret.push(tokenBuffer.join(""));
              tokenBuffer = [];
            }
          } else {
            tokenBuffer.push(element);
          }
        } else if (singleQuoteOpen || doubleQuoteOpen) {
          tokenBuffer.push(element);
        }
      }
      if (tokenBuffer && tokenBuffer.length > 0) {
        ret.push(tokenBuffer.join(""));
      }

      return ret;
    }

    return splitArgs;
  })();

  String.prototype.splitArgs =
    String.prototype.splitArgs ||
    function (separator) {
      return bshields.splitArgs(this, separator);
    };
}


/***/ }),

/***/ 574:
/***/ (() => {

// @ts-nocheck

// Github:   https://github.com/shdwjk/Roll20API/blob/master/TableExport/TableExport.js
// By:       The Aaron, Arcane Scriptomancer
// Contact:  https://app.roll20.net/users/104025/the-aaron

var TableExport =
    TableExport ||
    (function () {
        "use strict";

        var version = "0.2.4",
            lastUpdate = 1576529132,
            tableCache = {},
            escapes = {
                "[": "<%%91%%>",
                "]": "<%%93%%>",
                "--": "<%%-%%>",
                " --": "[TABLEEXPORT:ESCAPE]",
            },
            esRE = function (s) {
                var escapeForRegexp = /(\\|\/|\[|\]|\(|\)|\{|\}|\?|\+|\*|\||\.|\^|\$)/g;
                return s.replace(escapeForRegexp, "\\$1");
            },
            ch = function (c) {
                var entities = {
                    "<": "lt",
                    ">": "gt",
                    "'": "#39",
                    "@": "#64",
                    "*": "ast",
                    "`": "#96",
                    "{": "#123",
                    "|": "#124",
                    "}": "#125",
                    "[": "#91",
                    "]": "#93",
                    '"': "quot",
                    "-": "mdash",
                    " ": "nbsp",
                };

                if (_.has(entities, c)) {
                    return "&" + entities[c] + ";";
                }
                return "";
            },
            checkInstall = function () {
                log(
                    "-=> TableExport v" +
                        version +
                        " <=-  [" +
                        new Date(lastUpdate * 1000) +
                        "]"
                );
            },
            showHelp = function () {
                sendChat(
                    "",
                    "/w gm " +
                        '<div style="border: 1px solid black; background-color: white; padding: 3px 3px;">' +
                        '<div style="font-weight: bold; border-bottom: 1px solid black;font-size: 130%;">' +
                        "TableExport v" +
                        version +
                        "</div>" +
                        '<div style="padding-left:10px;margin-bottom:3px;">' +
                        "<p>This script dumps commands to the chat for reconstructing a rollable table on another campaign.  While this can be done on your own campaigns via the transmogrifier, this script allows you to pass those commands to a friend and thus share your own creative works with others.<p>" +
                        "<p><b>Caveat:</b> Avatar images that are not in your own library will be ignored by the API on import, but will not prevent creation of the table and table items.</p>" +
                        "</div>" +
                        "<b>Commands</b>" +
                        '<div style="padding-left:10px;">' +
                        '<b><span style="font-family: serif;">!export-table --' +
                        ch("<") +
                        "Table Name" +
                        ch(">") +
                        " [ --" +
                        ch("<") +
                        "Table Name" +
                        ch(">") +
                        " ...]</span></b>" +
                        '<div style="padding-left: 10px;padding-right:20px">' +
                        "<p>For all table names, case is ignored and you may use partial names so long as they are unique.  For example, " +
                        ch('"') +
                        "King Maximillian" +
                        ch('"') +
                        " could be called " +
                        ch('"') +
                        "max" +
                        ch('"') +
                        " as long as " +
                        ch('"') +
                        "max" +
                        ch('"') +
                        " does not appear in any other table names.  Exception:  An exact match will trump a partial match.  In the previous example, if a table named " +
                        ch('"') +
                        "Max" +
                        ch('"') +
                        " existed, it would be the only table matched for <b>--max</b>.</p>" +
                        "<ul>" +
                        '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">' +
                        '<b><span style="font-family: serif;">--' +
                        ch("<") +
                        "Table Name" +
                        ch(">") +
                        "</span></b> " +
                        ch("-") +
                        " This is the name of a table to export.  You can specify as many tables as you like in a single command." +
                        "</li> " +
                        "</ul>" +
                        "</div>" +
                        "</div>" +
                        '<div style="padding-left:10px;">' +
                        '<b><span style="font-family: serif;">!import-table --' +
                        ch("<") +
                        "Table Name" +
                        ch(">") +
                        " --" +
                        ch("<") +
                        "[ show | hide ]" +
                        ch(">") +
                        "</span></b>" +
                        '<div style="padding-left: 10px;padding-right:20px">' +
                        "<p>This is the command output by <b>!export-table</b> to create the new table.  You likely will not need issue these commands directly.</p>" +
                        "<ul>" +
                        '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">' +
                        '<b><span style="font-family: serif;">--' +
                        ch("<") +
                        "Table Name" +
                        ch(">") +
                        "</span></b> " +
                        ch("-") +
                        " This is the name of the table to be create." +
                        "</li> " +
                        '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">' +
                        '<b><span style="font-family: serif;">--' +
                        ch("<") +
                        "[ show | hide ]" +
                        ch(">") +
                        "</span></b> " +
                        ch("-") +
                        " This whether to show the table to players or hide it." +
                        "</li> " +
                        "</ul>" +
                        "</div>" +
                        "</div>" +
                        '<div style="padding-left:10px;">' +
                        '<b><span style="font-family: serif;">!import-table-item --' +
                        ch("<") +
                        "Table Name" +
                        ch(">") +
                        " --" +
                        ch("<") +
                        "Table Item Name" +
                        ch(">") +
                        " --" +
                        ch("<") +
                        "Weight" +
                        ch(">") +
                        " --" +
                        ch("<") +
                        "Avatar URL" +
                        ch(">") +
                        "</span></b>" +
                        '<div style="padding-left: 10px;padding-right:20px">' +
                        "<p>This is the command output by <b>!export-table</b> to create the new table.  You likely will not need issue these commands directly.</p>" +
                        "<ul>" +
                        '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">' +
                        '<b><span style="font-family: serif;">--' +
                        ch("<") +
                        "Table Name" +
                        ch(">") +
                        "</span></b> " +
                        ch("-") +
                        " This is the name of the table to add items to.  <b>Note:</b> unlike for <b>!export-table</b>, this must be an exact name match to the created table." +
                        "</li> " +
                        '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">' +
                        '<b><span style="font-family: serif;">--' +
                        ch("<") +
                        "Table Item Name" +
                        ch(">") +
                        "</span></b> " +
                        ch("-") +
                        " This is the name of the table item to create.  <b>Note:</b> Because the string " +
                        ch('"') +
                        " --" +
                        ch('"') +
                        " may occur in a table item name, you may see " +
                        ch('"') +
                        "[TABLEEXPORT:ESCAPE]" +
                        ch('"') +
                        " show up as a replacement in these commands.  This value is corrected internally to the correct " +
                        ch('"') +
                        " --" +
                        ch('"') +
                        " sequence on import." +
                        "</li> " +
                        '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">' +
                        '<b><span style="font-family: serif;">--' +
                        ch("<") +
                        "Weight" +
                        ch(">") +
                        "</span></b> " +
                        ch("-") +
                        " This is the weight for this table item and should be an integer value." +
                        "</li> " +
                        '<li style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;">' +
                        '<b><span style="font-family: serif;">--' +
                        ch("<") +
                        "Avatar URL" +
                        ch(">") +
                        "</span></b> " +
                        ch("-") +
                        " This is the URL for the avatar image of the table item." +
                        "</li> " +
                        "</ul>" +
                        "</div>" +
                        "</div>" +
                        "</div>"
                );
            },
            nameEscape = (function () {
                var re = new RegExp(
                    "(" + _.map(_.keys(escapes), esRE).join("|") + ")",
                    "g"
                );
                return function (s) {
                    return s.replace(re, function (c) {
                        return escapes[c] || c;
                    });
                };
            })(),
            nameUnescape = (function () {
                var sepacse = _.invert(escapes),
                    re = new RegExp(
                        "(" + _.map(_.keys(sepacse), esRE).join("|") + ")",
                        "g"
                    );
                return function (s) {
                    return s.replace(re, function (c) {
                        return sepacse[c] || c;
                    });
                };
            })(),
            handleInput = function (msg) {
                var args,
                    matches,
                    tables,
                    tableIDs = [],
                    errors = [],
                    items,
                    itemMatches,
                    accum = "";

                if (msg.type !== "api" || !playerIsGM(msg.playerid)) {
                    return;
                }

                args = msg.content.split(/\s+/);
                switch (args[0]) {
                    case "!import-table":
                        args = msg.content.split(/\s+--/);
                        if (args.length === 1) {
                            showHelp();
                            break;
                        }
                        if (_.has(tableCache, args[1])) {
                            sendChat(
                                "",
                                "/w gm " +
                                    '<div style="border: 1px solid black; background-color: white; padding: 3px 3px;">' +
                                    '<span style="font-weight:bold;color:#990000;">Warning:</span> ' +
                                    "Table [" +
                                    args[1] +
                                    "] already exists, skipping create." +
                                    "</div>"
                            );
                        } else {
                            tableIDs = findObjs({
                                type: "rollabletable",
                                name: args[1],
                            });
                            if (tableIDs.length) {
                                sendChat(
                                    "",
                                    "/w gm " +
                                        '<div style="border: 1px solid black; background-color: white; padding: 3px 3px;">' +
                                        '<span style="font-weight:bold;color:#990000;">Warning:</span> ' +
                                        "Table [" +
                                        args[1] +
                                        "] already exists, skipping create." +
                                        "</div>"
                                );
                            } else {
                                tableIDs = createObj("rollabletable", {
                                    name: args[1],
                                    showplayers: "show" === args[2],
                                });
                                tableCache[args[1]] = tableIDs.id;
                            }
                        }
                        break;

                    case "!import-table-item":
                        args = msg.content.split(/\s+--/);
                        if (args.length === 1) {
                            showHelp();
                            break;
                        }
                        args[2] = nameUnescape(args[2]);
                        if (!_.has(tableCache, args[1])) {
                            tableIDs = findObjs({
                                type: "rollabletable",
                                name: args[1],
                            });
                            if (!tableIDs.length) {
                                sendChat(
                                    "",
                                    "/w gm " +
                                        '<div style="border: 1px solid black; background-color: white; padding: 3px 3px;">' +
                                        '<span style="font-weight:bold;color:#990000;">Error:</span> ' +
                                        "Table [" +
                                        args[1] +
                                        "] doesn not exist.  Cannot create table item." +
                                        "</div>"
                                );
                                break;
                            } else {
                                tableCache[args[1]] = tableIDs[0].id;
                            }
                        }
                        createObj("tableitem", {
                            name: args[2],
                            rollabletableid: tableCache[args[1]],
                            weight: parseInt(args[3], 10) || 1,
                            avatar: args[4] || "",
                        });
                        break;

                    case "!export-table":
                        args = msg.content.split(/\s+--/);
                        if (args.length === 1) {
                            showHelp();
                            break;
                        }
                        tables = findObjs({ type: "rollabletable" });
                        matches = _.chain(args)
                            .rest()
                            .map(function (n) {
                                var l = _.filter(tables, function (t) {
                                    return (
                                        t.get("name").toLowerCase() ===
                                        n.toLowerCase()
                                    );
                                });
                                return 1 === l.length
                                    ? l
                                    : _.filter(tables, function (t) {
                                          return (
                                              -1 !==
                                              t
                                                  .get("name")
                                                  .toLowerCase()
                                                  .indexOf(n.toLowerCase())
                                          );
                                      });
                            })
                            .value();

                        _.each(
                            matches,
                            function (o, idx) {
                                if (1 !== o.length) {
                                    if (o.length) {
                                        errors.push(
                                            "Rollable Table [<b>" +
                                                args[idx + 1] +
                                                "</b>] is ambiguous and matches " +
                                                o.length +
                                                " names: <b><i> " +
                                                _.map(o, function (e) {
                                                    return e.get("name");
                                                }).join(", ") +
                                                "</i></b>"
                                        );
                                    } else {
                                        errors.push(
                                            "Rollable Table [<b>" +
                                                args[idx + 1] +
                                                "</b>] does not match any names."
                                        );
                                    }
                                }
                            },
                            errors
                        );

                        if (errors.length) {
                            sendChat(
                                "",
                                "/w gm " +
                                    '<div style="border: 1px solid black; background-color: white; padding: 3px 3px;">' +
                                    '<div><span style="font-weight:bold;color:#990000;">Error:</span> ' +
                                    errors.join(
                                        '</div><div><span style="font-weight:bold;color:#990000;">Error:</span> '
                                    ) +
                                    "</div>" +
                                    "</div>"
                            );
                            break;
                        }

                        if (!errors.length) {
                            matches = _.chain(matches)
                                .flatten(true)
                                .map(function (t) {
                                    tableIDs.push(t.id);
                                    return t;
                                })
                                .value();

                            items = findObjs({ type: "tableitem" });
                            itemMatches = _.chain(items)
                                .filter(function (i) {
                                    return _.contains(
                                        tableIDs,
                                        i.get("rollabletableid")
                                    );
                                })
                                .reduce(function (memo, e) {
                                    if (
                                        !_.has(memo, e.get("rollabletableid"))
                                    ) {
                                        memo[e.get("rollabletableid")] = [e];
                                    } else {
                                        memo[e.get("rollabletableid")].push(e);
                                    }
                                    return memo;
                                }, {})
                                .value();
                            _.each(matches, function (t) {
                                accum +=
                                    "!import-table --" +
                                    nameEscape(t.get("name")) +
                                    " --" +
                                    (t.get("showplayers") ? "show" : "hide") +
                                    "<br>";
                                _.each(itemMatches[t.id], function (i) {
                                    accum +=
                                        "!import-table-item --" +
                                        nameEscape(t.get("name")) +
                                        " --" +
                                        nameEscape(i.get("name")) +
                                        " --" +
                                        i.get("weight") +
                                        " --" +
                                        i.get("avatar") +
                                        "<br>";
                                });
                            });
                            sendChat("", "/w gm " + accum);
                        }
                        break;
                }
            },
            handleRemoveTable = function (obj) {
                tableCache = _.without(tableCache, obj.id);
            },
            registerEventHandlers = function () {
                on("chat:message", handleInput);
                on("destroy:rollabletable", handleRemoveTable);
            };

        return {
            CheckInstall: checkInstall,
            RegisterEventHandlers: registerEventHandlers,
        };
    })();

on("ready", function () {
    "use strict";

    TableExport.CheckInstall();
    TableExport.RegisterEventHandlers();
});


/***/ }),

/***/ 987:
/***/ (function(module) {

(function (global, factory) {
   true ? module.exports = factory() :
  0;
}(this, (function () {
  //     Underscore.js 1.12.1
  //     https://underscorejs.org
  //     (c) 2009-2020 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
  //     Underscore may be freely distributed under the MIT license.

  // Current version.
  var VERSION = '1.12.1';

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            Function('return this')() ||
            {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // Modern feature detection.
  var supportsArrayBuffer = typeof ArrayBuffer !== 'undefined',
      supportsDataView = typeof DataView !== 'undefined';

  // All **ECMAScript 5+** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create,
      nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;

  // Create references to these builtin functions because we override them.
  var _isNaN = isNaN,
      _isFinite = isFinite;

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  // The largest integer that can be represented exactly.
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  function restArguments(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  }

  // Is a given variable an object?
  function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }

  // Is a given value equal to null?
  function isNull(obj) {
    return obj === null;
  }

  // Is a given variable undefined?
  function isUndefined(obj) {
    return obj === void 0;
  }

  // Is a given value a boolean?
  function isBoolean(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  }

  // Is a given value a DOM element?
  function isElement(obj) {
    return !!(obj && obj.nodeType === 1);
  }

  // Internal function for creating a `toString`-based type tester.
  function tagTester(name) {
    var tag = '[object ' + name + ']';
    return function(obj) {
      return toString.call(obj) === tag;
    };
  }

  var isString = tagTester('String');

  var isNumber = tagTester('Number');

  var isDate = tagTester('Date');

  var isRegExp = tagTester('RegExp');

  var isError = tagTester('Error');

  var isSymbol = tagTester('Symbol');

  var isArrayBuffer = tagTester('ArrayBuffer');

  var isFunction = tagTester('Function');

  // Optimize `isFunction` if appropriate. Work around some `typeof` bugs in old
  // v8, IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if ( true && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  var isFunction$1 = isFunction;

  var hasObjectTag = tagTester('Object');

  // In IE 10 - Edge 13, `DataView` has string tag `'[object Object]'`.
  // In IE 11, the most common among them, this problem also applies to
  // `Map`, `WeakMap` and `Set`.
  var hasStringTagBug = (
        supportsDataView && hasObjectTag(new DataView(new ArrayBuffer(8)))
      ),
      isIE11 = (typeof Map !== 'undefined' && hasObjectTag(new Map));

  var isDataView = tagTester('DataView');

  // In IE 10 - Edge 13, we need a different heuristic
  // to determine whether an object is a `DataView`.
  function ie10IsDataView(obj) {
    return obj != null && isFunction$1(obj.getInt8) && isArrayBuffer(obj.buffer);
  }

  var isDataView$1 = (hasStringTagBug ? ie10IsDataView : isDataView);

  // Is a given value an array?
  // Delegates to ECMA5's native `Array.isArray`.
  var isArray = nativeIsArray || tagTester('Array');

  // Internal function to check whether `key` is an own property name of `obj`.
  function has(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  }

  var isArguments = tagTester('Arguments');

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  (function() {
    if (!isArguments(arguments)) {
      isArguments = function(obj) {
        return has(obj, 'callee');
      };
    }
  }());

  var isArguments$1 = isArguments;

  // Is a given object a finite number?
  function isFinite$1(obj) {
    return !isSymbol(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
  }

  // Is the given value `NaN`?
  function isNaN$1(obj) {
    return isNumber(obj) && _isNaN(obj);
  }

  // Predicate-generating function. Often useful outside of Underscore.
  function constant(value) {
    return function() {
      return value;
    };
  }

  // Common internal logic for `isArrayLike` and `isBufferLike`.
  function createSizePropertyCheck(getSizeProperty) {
    return function(collection) {
      var sizeProperty = getSizeProperty(collection);
      return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
    }
  }

  // Internal helper to generate a function to obtain property `key` from `obj`.
  function shallowProperty(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  }

  // Internal helper to obtain the `byteLength` property of an object.
  var getByteLength = shallowProperty('byteLength');

  // Internal helper to determine whether we should spend extensive checks against
  // `ArrayBuffer` et al.
  var isBufferLike = createSizePropertyCheck(getByteLength);

  // Is a given value a typed array?
  var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
  function isTypedArray(obj) {
    // `ArrayBuffer.isView` is the most future-proof, so use it when available.
    // Otherwise, fall back on the above regular expression.
    return nativeIsView ? (nativeIsView(obj) && !isDataView$1(obj)) :
                  isBufferLike(obj) && typedArrayPattern.test(toString.call(obj));
  }

  var isTypedArray$1 = supportsArrayBuffer ? isTypedArray : constant(false);

  // Internal helper to obtain the `length` property of an object.
  var getLength = shallowProperty('length');

  // Internal helper to create a simple lookup structure.
  // `collectNonEnumProps` used to depend on `_.contains`, but this led to
  // circular imports. `emulatedSet` is a one-off solution that only works for
  // arrays of strings.
  function emulatedSet(keys) {
    var hash = {};
    for (var l = keys.length, i = 0; i < l; ++i) hash[keys[i]] = true;
    return {
      contains: function(key) { return hash[key]; },
      push: function(key) {
        hash[key] = true;
        return keys.push(key);
      }
    };
  }

  // Internal helper. Checks `keys` for the presence of keys in IE < 9 that won't
  // be iterated by `for key in ...` and thus missed. Extends `keys` in place if
  // needed.
  function collectNonEnumProps(obj, keys) {
    keys = emulatedSet(keys);
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = isFunction$1(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (has(obj, prop) && !keys.contains(prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  function keys(obj) {
    if (!isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  }

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  function isEmpty(obj) {
    if (obj == null) return true;
    // Skip the more expensive `toString`-based type checks if `obj` has no
    // `.length`.
    var length = getLength(obj);
    if (typeof length == 'number' && (
      isArray(obj) || isString(obj) || isArguments$1(obj)
    )) return length === 0;
    return getLength(keys(obj)) === 0;
  }

  // Returns whether an object has a given set of `key:value` pairs.
  function isMatch(object, attrs) {
    var _keys = keys(attrs), length = _keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = _keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  }

  // If Underscore is called as a function, it returns a wrapped object that can
  // be used OO-style. This wrapper holds altered versions of all functions added
  // through `_.mixin`. Wrapped objects may be chained.
  function _(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  }

  _.VERSION = VERSION;

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxies for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  // Internal function to wrap or shallow-copy an ArrayBuffer,
  // typed array or DataView to a new view, reusing the buffer.
  function toBufferView(bufferSource) {
    return new Uint8Array(
      bufferSource.buffer || bufferSource,
      bufferSource.byteOffset || 0,
      getByteLength(bufferSource)
    );
  }

  // We use this string twice, so give it a name for minification.
  var tagDataView = '[object DataView]';

  // Internal recursive comparison function for `_.isEqual`.
  function eq(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  }

  // Internal recursive comparison function for `_.isEqual`.
  function deepEq(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    // Work around a bug in IE 10 - Edge 13.
    if (hasStringTagBug && className == '[object Object]' && isDataView$1(a)) {
      if (!isDataView$1(b)) return false;
      className = tagDataView;
    }
    switch (className) {
      // These types are compared by value.
      case '[object RegExp]':
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
      case '[object ArrayBuffer]':
      case tagDataView:
        // Coerce to typed array so we can fall through.
        return deepEq(toBufferView(a), toBufferView(b), aStack, bStack);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays && isTypedArray$1(a)) {
        var byteLength = getByteLength(a);
        if (byteLength !== getByteLength(b)) return false;
        if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
        areArrays = true;
    }
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(isFunction$1(aCtor) && aCtor instanceof aCtor &&
                               isFunction$1(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var _keys = keys(a), key;
      length = _keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = _keys[length];
        if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  }

  // Perform a deep comparison to check if two objects are equal.
  function isEqual(a, b) {
    return eq(a, b);
  }

  // Retrieve all the enumerable property names of an object.
  function allKeys(obj) {
    if (!isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  }

  // Since the regular `Object.prototype.toString` type tests don't work for
  // some types in IE 11, we use a fingerprinting heuristic instead, based
  // on the methods. It's not great, but it's the best we got.
  // The fingerprint method lists are defined below.
  function ie11fingerprint(methods) {
    var length = getLength(methods);
    return function(obj) {
      if (obj == null) return false;
      // `Map`, `WeakMap` and `Set` have no enumerable keys.
      var keys = allKeys(obj);
      if (getLength(keys)) return false;
      for (var i = 0; i < length; i++) {
        if (!isFunction$1(obj[methods[i]])) return false;
      }
      // If we are testing against `WeakMap`, we need to ensure that
      // `obj` doesn't have a `forEach` method in order to distinguish
      // it from a regular `Map`.
      return methods !== weakMapMethods || !isFunction$1(obj[forEachName]);
    };
  }

  // In the interest of compact minification, we write
  // each string in the fingerprints only once.
  var forEachName = 'forEach',
      hasName = 'has',
      commonInit = ['clear', 'delete'],
      mapTail = ['get', hasName, 'set'];

  // `Map`, `WeakMap` and `Set` each have slightly different
  // combinations of the above sublists.
  var mapMethods = commonInit.concat(forEachName, mapTail),
      weakMapMethods = commonInit.concat(mapTail),
      setMethods = ['add'].concat(commonInit, forEachName, hasName);

  var isMap = isIE11 ? ie11fingerprint(mapMethods) : tagTester('Map');

  var isWeakMap = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester('WeakMap');

  var isSet = isIE11 ? ie11fingerprint(setMethods) : tagTester('Set');

  var isWeakSet = tagTester('WeakSet');

  // Retrieve the values of an object's properties.
  function values(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[_keys[i]];
    }
    return values;
  }

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of `_.object` with one argument.
  function pairs(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [_keys[i], obj[_keys[i]]];
    }
    return pairs;
  }

  // Invert the keys and values of an object. The values must be serializable.
  function invert(obj) {
    var result = {};
    var _keys = keys(obj);
    for (var i = 0, length = _keys.length; i < length; i++) {
      result[obj[_keys[i]]] = _keys[i];
    }
    return result;
  }

  // Return a sorted list of the function names available on the object.
  function functions(obj) {
    var names = [];
    for (var key in obj) {
      if (isFunction$1(obj[key])) names.push(key);
    }
    return names.sort();
  }

  // An internal function for creating assigner functions.
  function createAssigner(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  }

  // Extend a given object with all the properties in passed-in object(s).
  var extend = createAssigner(allKeys);

  // Assigns a given object with all the own properties in the passed-in
  // object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  var extendOwn = createAssigner(keys);

  // Fill in a given object with default properties.
  var defaults = createAssigner(allKeys, true);

  // Create a naked function reference for surrogate-prototype-swapping.
  function ctor() {
    return function(){};
  }

  // An internal function for creating a new object that inherits from another.
  function baseCreate(prototype) {
    if (!isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    var Ctor = ctor();
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  }

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  function create(prototype, props) {
    var result = baseCreate(prototype);
    if (props) extendOwn(result, props);
    return result;
  }

  // Create a (shallow-cloned) duplicate of an object.
  function clone(obj) {
    if (!isObject(obj)) return obj;
    return isArray(obj) ? obj.slice() : extend({}, obj);
  }

  // Invokes `interceptor` with the `obj` and then returns `obj`.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  function tap(obj, interceptor) {
    interceptor(obj);
    return obj;
  }

  // Normalize a (deep) property `path` to array.
  // Like `_.iteratee`, this function can be customized.
  function toPath(path) {
    return isArray(path) ? path : [path];
  }
  _.toPath = toPath;

  // Internal wrapper for `_.toPath` to enable minification.
  // Similar to `cb` for `_.iteratee`.
  function toPath$1(path) {
    return _.toPath(path);
  }

  // Internal function to obtain a nested property in `obj` along `path`.
  function deepGet(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  }

  // Get the value of the (deep) property on `path` from `object`.
  // If any property in `path` does not exist or if the value is
  // `undefined`, return `defaultValue` instead.
  // The `path` is normalized through `_.toPath`.
  function get(object, path, defaultValue) {
    var value = deepGet(object, toPath$1(path));
    return isUndefined(value) ? defaultValue : value;
  }

  // Shortcut function for checking if an object has a given property directly on
  // itself (in other words, not on a prototype). Unlike the internal `has`
  // function, this public version can also traverse nested properties.
  function has$1(obj, path) {
    path = toPath$1(path);
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (!has(obj, key)) return false;
      obj = obj[key];
    }
    return !!length;
  }

  // Keep the identity function around for default iteratees.
  function identity(value) {
    return value;
  }

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  function matcher(attrs) {
    attrs = extendOwn({}, attrs);
    return function(obj) {
      return isMatch(obj, attrs);
    };
  }

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indices.
  function property(path) {
    path = toPath$1(path);
    return function(obj) {
      return deepGet(obj, path);
    };
  }

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  function optimizeCb(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  }

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `_.identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  function baseIteratee(value, context, argCount) {
    if (value == null) return identity;
    if (isFunction$1(value)) return optimizeCb(value, context, argCount);
    if (isObject(value) && !isArray(value)) return matcher(value);
    return property(value);
  }

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only `argCount` argument.
  function iteratee(value, context) {
    return baseIteratee(value, context, Infinity);
  }
  _.iteratee = iteratee;

  // The function we call internally to generate a callback. It invokes
  // `_.iteratee` if overridden, otherwise `baseIteratee`.
  function cb(value, context, argCount) {
    if (_.iteratee !== iteratee) return _.iteratee(value, context);
    return baseIteratee(value, context, argCount);
  }

  // Returns the results of applying the `iteratee` to each element of `obj`.
  // In contrast to `_.map` it returns an object.
  function mapObject(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var _keys = keys(obj),
        length = _keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = _keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  }

  // Predicate-generating function. Often useful outside of Underscore.
  function noop(){}

  // Generates a function for a given object that returns a given property.
  function propertyOf(obj) {
    if (obj == null) return noop;
    return function(path) {
      return get(obj, path);
    };
  }

  // Run a function **n** times.
  function times(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  }

  // Return a random integer between `min` and `max` (inclusive).
  function random(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  // A (possibly faster) way to get the current timestamp as an integer.
  var now = Date.now || function() {
    return new Date().getTime();
  };

  // Internal helper to generate functions for escaping and unescaping strings
  // to/from HTML interpolation.
  function createEscaper(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  }

  // Internal list of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  // Function for escaping strings to HTML interpolation.
  var _escape = createEscaper(escapeMap);

  // Internal list of HTML entities for unescaping.
  var unescapeMap = invert(escapeMap);

  // Function for unescaping strings from HTML interpolation.
  var _unescape = createEscaper(unescapeMap);

  // By default, Underscore uses ERB-style template delimiters. Change the
  // following template settings to use alternative delimiters.
  var templateSettings = _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `_.templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  function escapeChar(match) {
    return '\\' + escapes[match];
  }

  var bareIdentifier = /^\s*(\w|\$)+\s*$/;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  function template(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    var argument = settings.variable;
    if (argument) {
      if (!bareIdentifier.test(argument)) throw new Error(argument);
    } else {
      // If a variable is not specified, place data values in local scope.
      source = 'with(obj||{}){\n' + source + '}\n';
      argument = 'obj';
    }

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(argument, '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  }

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  function result(obj, path, fallback) {
    path = toPath$1(path);
    var length = path.length;
    if (!length) {
      return isFunction$1(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = isFunction$1(prop) ? prop.call(obj) : prop;
    }
    return obj;
  }

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  function uniqueId(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  }

  // Start chaining a wrapped Underscore object.
  function chain(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  }

  // Internal function to execute `sourceFunc` bound to `context` with optional
  // `args`. Determines whether to execute a function as a constructor or as a
  // normal function.
  function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (isObject(result)) return result;
    return self;
  }

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. `_` acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  var partial = restArguments(function(func, boundArgs) {
    var placeholder = partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  partial.placeholder = _;

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally).
  var bind = restArguments(function(func, context, args) {
    if (!isFunction$1(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Internal helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var isArrayLike = createSizePropertyCheck(getLength);

  // Internal implementation of a recursive `flatten` function.
  function flatten(input, depth, strict, output) {
    output = output || [];
    if (!depth && depth !== 0) {
      depth = Infinity;
    } else if (depth <= 0) {
      return output.concat(input);
    }
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (isArray(value) || isArguments$1(value))) {
        // Flatten current level of array or arguments object.
        if (depth > 1) {
          flatten(value, depth - 1, strict, output);
          idx = output.length;
        } else {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  }

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  var bindAll = restArguments(function(obj, keys) {
    keys = flatten(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = bind(obj[key], obj);
    }
    return obj;
  });

  // Memoize an expensive function by storing its results.
  function memoize(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  }

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  var delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  var defer = partial(delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var _now = now();
      if (!previous && options.leading === false) previous = _now;
      var remaining = wait - (_now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = _now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  }

  // When a sequence of calls of the returned function ends, the argument
  // function is triggered. The end of a sequence is defined by the `wait`
  // parameter. If `immediate` is passed, the argument function will be
  // triggered at the beginning of the sequence instead of at the end.
  function debounce(func, wait, immediate) {
    var timeout, previous, args, result, context;

    var later = function() {
      var passed = now() - previous;
      if (wait > passed) {
        timeout = setTimeout(later, wait - passed);
      } else {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
        // This check is needed because `func` can recursively invoke `debounced`.
        if (!timeout) args = context = null;
      }
    };

    var debounced = restArguments(function(_args) {
      context = this;
      args = _args;
      previous = now();
      if (!timeout) {
        timeout = setTimeout(later, wait);
        if (immediate) result = func.apply(context, args);
      }
      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = args = context = null;
    };

    return debounced;
  }

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  function wrap(func, wrapper) {
    return partial(wrapper, func);
  }

  // Returns a negated version of the passed-in predicate.
  function negate(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  }

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  function compose() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  }

  // Returns a function that will only be executed on and after the Nth call.
  function after(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  }

  // Returns a function that will only be executed up to (but not including) the
  // Nth call.
  function before(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  }

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  var once = partial(before, 2);

  // Returns the first key on an object that passes a truth test.
  function findKey(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = keys(obj), key;
    for (var i = 0, length = _keys.length; i < length; i++) {
      key = _keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  }

  // Internal function to generate `_.findIndex` and `_.findLastIndex`.
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a truth test.
  var findIndex = createPredicateIndexFinder(1);

  // Returns the last index on an array-like that passes a truth test.
  var findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  function sortedIndex(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  }

  // Internal function to generate the `_.indexOf` and `_.lastIndexOf` functions.
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), isNaN$1);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  var indexOf = createIndexFinder(1, findIndex, sortedIndex);

  // Return the position of the last occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  var lastIndexOf = createIndexFinder(-1, findLastIndex);

  // Return the first value which passes a truth test.
  function find(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? findIndex : findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  }

  // Convenience version of a common use case of `_.find`: getting the first
  // object containing specific `key:value` pairs.
  function findWhere(obj, attrs) {
    return find(obj, matcher(attrs));
  }

  // The cornerstone for collection functions, an `each`
  // implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  function each(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var _keys = keys(obj);
      for (i = 0, length = _keys.length; i < length; i++) {
        iteratee(obj[_keys[i]], _keys[i], obj);
      }
    }
    return obj;
  }

  // Return the results of applying the iteratee to each element.
  function map(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  }

  // Internal helper to create a reducing function, iterating left or right.
  function createReduce(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var _keys = !isArrayLike(obj) && keys(obj),
          length = (_keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[_keys ? _keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = _keys ? _keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  var reduce = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  var reduceRight = createReduce(-1);

  // Return all the elements that pass a truth test.
  function filter(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  }

  // Return all the elements for which a truth test fails.
  function reject(obj, predicate, context) {
    return filter(obj, negate(cb(predicate)), context);
  }

  // Determine whether all of the elements pass a truth test.
  function every(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  }

  // Determine if at least one element in the object passes a truth test.
  function some(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  }

  // Determine if the array or object contains a given item (using `===`).
  function contains(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return indexOf(obj, item, fromIndex) >= 0;
  }

  // Invoke a method (with arguments) on every item in a collection.
  var invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (isFunction$1(path)) {
      func = path;
    } else {
      path = toPath$1(path);
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `_.map`: fetching a property.
  function pluck(obj, key) {
    return map(obj, property(key));
  }

  // Convenience version of a common use case of `_.filter`: selecting only
  // objects containing specific `key:value` pairs.
  function where(obj, attrs) {
    return filter(obj, matcher(attrs));
  }

  // Return the maximum element (or element-based computation).
  function max(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  }

  // Return the minimum element (or element-based computation).
  function min(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  }

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `_.map`.
  function sample(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = values(obj);
      return obj[random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? clone(obj) : values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  }

  // Shuffle a collection.
  function shuffle(obj) {
    return sample(obj, Infinity);
  }

  // Sort the object's values by a criterion produced by an iteratee.
  function sortBy(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return pluck(map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  }

  // An internal function used for aggregate "group by" operations.
  function group(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  }

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  var groupBy = group(function(result, value, key) {
    if (has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `_.groupBy`, but for
  // when you know that your index values will be unique.
  var indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  var countBy = group(function(result, value, key) {
    if (has(result, key)) result[key]++; else result[key] = 1;
  });

  // Split a collection into two arrays: one whose elements all pass the given
  // truth test, and one whose elements all do not pass the truth test.
  var partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Safely create a real, live array from anything iterable.
  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  function toArray(obj) {
    if (!obj) return [];
    if (isArray(obj)) return slice.call(obj);
    if (isString(obj)) {
      // Keep surrogate pair characters together.
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return map(obj, identity);
    return values(obj);
  }

  // Return the number of elements in a collection.
  function size(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : keys(obj).length;
  }

  // Internal `_.pick` helper function to determine whether `key` is an enumerable
  // property name of `obj`.
  function keyInObj(value, key, obj) {
    return key in obj;
  }

  // Return a copy of the object only containing the allowed properties.
  var pick = restArguments(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (isFunction$1(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the disallowed properties.
  var omit = restArguments(function(obj, keys) {
    var iteratee = keys[0], context;
    if (isFunction$1(iteratee)) {
      iteratee = negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = map(flatten(keys, false, false), String);
      iteratee = function(value, key) {
        return !contains(keys, key);
      };
    }
    return pick(obj, iteratee, context);
  });

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  function initial(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  }

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. The **guard** check allows it to work with `_.map`.
  function first(array, n, guard) {
    if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
    if (n == null || guard) return array[0];
    return initial(array, array.length - n);
  }

  // Returns everything but the first entry of the `array`. Especially useful on
  // the `arguments` object. Passing an **n** will return the rest N values in the
  // `array`.
  function rest(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  }

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  function last(array, n, guard) {
    if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return rest(array, Math.max(0, array.length - n));
  }

  // Trim out all falsy values from an array.
  function compact(array) {
    return filter(array, Boolean);
  }

  // Flatten out an array, either recursively (by default), or up to `depth`.
  // Passing `true` or `false` as `depth` means `1` or `Infinity`, respectively.
  function flatten$1(array, depth) {
    return flatten(array, depth, false);
  }

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  var difference = restArguments(function(array, rest) {
    rest = flatten(rest, true, true);
    return filter(array, function(value){
      return !contains(rest, value);
    });
  });

  // Return a version of the array that does not contain the specified value(s).
  var without = restArguments(function(array, otherArrays) {
    return difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  function uniq(array, isSorted, iteratee, context) {
    if (!isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  }

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  var union = restArguments(function(arrays) {
    return uniq(flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  function intersection(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  }

  // Complement of zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  function unzip(array) {
    var length = array && max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = pluck(array, index);
    }
    return result;
  }

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  var zip = restArguments(unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of `_.pairs`.
  function object(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  }

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](https://docs.python.org/library/functions.html#range).
  function range(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  }

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  function chunk(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  }

  // Helper function to continue chaining intermediate results.
  function chainResult(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  }

  // Add your own custom functions to the Underscore object.
  function mixin(obj) {
    each(functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  }

  // Add all mutator `Array` functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      if (obj != null) {
        method.apply(obj, arguments);
        if ((name === 'shift' || name === 'splice') && obj.length === 0) {
          delete obj[0];
        }
      }
      return chainResult(this, obj);
    };
  });

  // Add all accessor `Array` functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      if (obj != null) obj = method.apply(obj, arguments);
      return chainResult(this, obj);
    };
  });

  // Named Exports

  var allExports = {
    __proto__: null,
    VERSION: VERSION,
    restArguments: restArguments,
    isObject: isObject,
    isNull: isNull,
    isUndefined: isUndefined,
    isBoolean: isBoolean,
    isElement: isElement,
    isString: isString,
    isNumber: isNumber,
    isDate: isDate,
    isRegExp: isRegExp,
    isError: isError,
    isSymbol: isSymbol,
    isArrayBuffer: isArrayBuffer,
    isDataView: isDataView$1,
    isArray: isArray,
    isFunction: isFunction$1,
    isArguments: isArguments$1,
    isFinite: isFinite$1,
    isNaN: isNaN$1,
    isTypedArray: isTypedArray$1,
    isEmpty: isEmpty,
    isMatch: isMatch,
    isEqual: isEqual,
    isMap: isMap,
    isWeakMap: isWeakMap,
    isSet: isSet,
    isWeakSet: isWeakSet,
    keys: keys,
    allKeys: allKeys,
    values: values,
    pairs: pairs,
    invert: invert,
    functions: functions,
    methods: functions,
    extend: extend,
    extendOwn: extendOwn,
    assign: extendOwn,
    defaults: defaults,
    create: create,
    clone: clone,
    tap: tap,
    get: get,
    has: has$1,
    mapObject: mapObject,
    identity: identity,
    constant: constant,
    noop: noop,
    toPath: toPath,
    property: property,
    propertyOf: propertyOf,
    matcher: matcher,
    matches: matcher,
    times: times,
    random: random,
    now: now,
    escape: _escape,
    unescape: _unescape,
    templateSettings: templateSettings,
    template: template,
    result: result,
    uniqueId: uniqueId,
    chain: chain,
    iteratee: iteratee,
    partial: partial,
    bind: bind,
    bindAll: bindAll,
    memoize: memoize,
    delay: delay,
    defer: defer,
    throttle: throttle,
    debounce: debounce,
    wrap: wrap,
    negate: negate,
    compose: compose,
    after: after,
    before: before,
    once: once,
    findKey: findKey,
    findIndex: findIndex,
    findLastIndex: findLastIndex,
    sortedIndex: sortedIndex,
    indexOf: indexOf,
    lastIndexOf: lastIndexOf,
    find: find,
    detect: find,
    findWhere: findWhere,
    each: each,
    forEach: each,
    map: map,
    collect: map,
    reduce: reduce,
    foldl: reduce,
    inject: reduce,
    reduceRight: reduceRight,
    foldr: reduceRight,
    filter: filter,
    select: filter,
    reject: reject,
    every: every,
    all: every,
    some: some,
    any: some,
    contains: contains,
    includes: contains,
    include: contains,
    invoke: invoke,
    pluck: pluck,
    where: where,
    max: max,
    min: min,
    shuffle: shuffle,
    sample: sample,
    sortBy: sortBy,
    groupBy: groupBy,
    indexBy: indexBy,
    countBy: countBy,
    partition: partition,
    toArray: toArray,
    size: size,
    pick: pick,
    omit: omit,
    first: first,
    head: first,
    take: first,
    initial: initial,
    last: last,
    rest: rest,
    tail: rest,
    drop: rest,
    compact: compact,
    flatten: flatten$1,
    without: without,
    uniq: uniq,
    unique: uniq,
    union: union,
    intersection: intersection,
    difference: difference,
    unzip: unzip,
    transpose: unzip,
    zip: zip,
    object: object,
    range: range,
    chunk: chunk,
    mixin: mixin,
    'default': _
  };

  // Default Export

  // Add all of the Underscore functions to the wrapper object.
  var _$1 = mixin(allExports);
  // Legacy Node.js API.
  _$1._ = _$1;

  return _$1;

})));
//# sourceMappingURL=underscore.js.map


/***/ }),

/***/ 209:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createCustomTableConstructor = void 0;
const getTopLevelScope_1 = __importDefault(__nccwpck_require__(992));
/**
 * Creates a typed CustomTable constructor.
 *
 * NOTE: while you can use this without a supplied sandbox object, it is only guaranteed
 * to actually work within the actual Roll20 sandbox environment.
 */
const createCustomTableConstructor = ({ parser, getter, sandbox, logger, }) => {
    const CustomTable = class CustomTable {
        /**
         * @param table - a rollabletable object 'backing' this table.
         * @param options - options specific to the parser/getters.
         */
        constructor(table, options = {}) {
            logger === null || logger === void 0 ? void 0 : logger.trace(`constructor(${table.id}, ${options})`);
            this._rollabletableid = table.id;
        }
        /**
         * Get all custom table items as understood by the supplied parser.
         */
        getAllItems() {
            logger === null || logger === void 0 ? void 0 : logger.trace(`getAllItems()`);
            const { findObjs } = sandbox || getTopLevelScope_1.default();
            if (!findObjs) {
                throw new Error(`No findObjs() function found.`);
            }
            const rawTableItems = findObjs({
                _type: "tableitem",
                _rollabletableid: this._rollabletableid,
            });
            return rawTableItems.map(parser);
        }
        /**
         *
         * @param key  - a key as interpreted by the supplied getter.
         */
        getAtKey(key) {
            logger === null || logger === void 0 ? void 0 : logger.trace(`getAtKey(${key})`);
            const picked = getter(this.getAllItems(), key);
            logger === null || logger === void 0 ? void 0 : logger.trace(`getAtKey(${key}): ${picked}`);
            return picked;
        }
    };
    return CustomTable;
};
exports.createCustomTableConstructor = createCustomTableConstructor;
exports.default = exports.createCustomTableConstructor;


/***/ }),

/***/ 312:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createRankedTableConstructor = void 0;
const createCustomTableConstructor_1 = __importDefault(__nccwpck_require__(209));
/**
 * Creates a RankedTable constructor.
 */
const createRankedTableConstructor = ({ sandbox, logger, } = {}) => {
    const RankedTable = createCustomTableConstructor_1.default({
        logger,
        sandbox,
        /**
         * The RankedTable parser splits a TableItem's name by the first
         * instance of the supplied delimiter, into a number ("minValue")
         * and a string ("result").
         * @param obj - a tableitem
         * @param index - the index at which the tableitem was found within the associated table.
         * @param options.delimiter - a string, which must be escaped for RegExps.
         */
        parser: (obj, index, { delimiter = "=", } = {}) => {
            logger === null || logger === void 0 ? void 0 : logger.trace(`parser(${JSON.stringify(obj)}, ${index}, { delimiter: ${delimiter} })`);
            const weight = obj.get("weight");
            const name = obj.get("name");
            const tmp = new RegExp(`^(.+?)${delimiter}(.+)$`).exec(name);
            const [minValue, result] = tmp
                ? [tmp[1], tmp[2]]
                : [undefined, name];
            const asNumber = Number(minValue);
            const parsed = {
                tableItemId: obj.id,
                tableIndex: index,
                rollableTableId: obj.get("_rollabletableid"),
                minValue: asNumber,
                result,
                weight,
            };
            logger === null || logger === void 0 ? void 0 : logger.trace(`parser(${JSON.stringify(obj)}, ${index}, { delimiter: ${delimiter} }) : ${JSON.stringify(parsed)}`);
            return parsed;
        },
        /**
         * The RankedTable getter finds the item with the least minValue equal to
         * or less than the supplied key.
         * @param items
         * @param key
         * @param options
         */
        getter: (items, key, options = {}) => {
            logger === null || logger === void 0 ? void 0 : logger.trace(`getter(${items}, ${key}, ${options})`);
            const pickable = items.filter((item) => typeof item.minValue !== "undefined");
            logger === null || logger === void 0 ? void 0 : logger.info(`${pickable.length} pickable items`);
            const sorted = pickable.sort((a, b) => a.minValue - b.minValue);
            logger === null || logger === void 0 ? void 0 : logger.info(sorted);
            let smallest = items[0];
            let picked = smallest;
            // let largest = items[items.length - 1];
            sorted.forEach((item) => {
                if (item.minValue <= key) {
                    picked = item;
                }
            });
            logger === null || logger === void 0 ? void 0 : logger.trace(`getter(${items}, ${key}, ${options}): ${[picked]}`);
            return [picked];
        },
    });
    return RankedTable;
};
exports.createRankedTableConstructor = createRankedTableConstructor;


/***/ }),

/***/ 544:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createRankedTableConstructor = exports.RankedTable = exports.createCustomTableConstructor = void 0;
var createCustomTableConstructor_1 = __nccwpck_require__(209);
Object.defineProperty(exports, "createCustomTableConstructor", ({ enumerable: true, get: function () { return createCustomTableConstructor_1.createCustomTableConstructor; } }));
const createRankedTableConstructor_1 = __nccwpck_require__(312);
Object.defineProperty(exports, "createRankedTableConstructor", ({ enumerable: true, get: function () { return createRankedTableConstructor_1.createRankedTableConstructor; } }));
exports.RankedTable = createRankedTableConstructor_1.createRankedTableConstructor();


/***/ }),

/***/ 401:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Roll20Sandbox_1 = __nccwpck_require__(392);
const Logger_1 = __nccwpck_require__(698);
const CustomTable_1 = __nccwpck_require__(544);
const logger = Logger_1.getLogger({
    logLevel: "TRACE",
    logName: "Elfward",
    // @ts-ignore
    emissionFn: log,
});
// const tracer = (name: string) => {
//     return (fn: Function) => {
//         return (...rest: any[]) => {
//             const rString = `${rest}`;
//             const argString =
//                 rString.length > 50 ? rString.substr(0, 50) + "..." : rString;
//             logger.trace(`ENTERING ${name}(${argString})`);
//             const r = fn(...rest);
//             logger.trace(`EXITING  ${name}(${argString})`);
//             return r;
//         };
//     };
// };
logger.info("About to createRoll20Sandbox.");
Roll20Sandbox_1.createRoll20Sandbox({
    idGenerator: () => Math.random().toString(),
    logger: logger.child({
        logName: "Roll20Sandbox",
    }),
    // wrappers: {
    //     on: tracer("on"),
    //     sendChat: tracer("sendChat"),
    // },
}).then((sandbox) => __awaiter(void 0, void 0, void 0, function* () {
    // Once we're ready...
    sandbox.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
        logger.trace("on(ready) heard.");
        // make the sandbox functions 'global' so other libraries think they are
        // within the sandbox.
        if (!sandbox._isWithinSandbox()) {
            sandbox._promote();
        }
        // add the libraries we directly require.
        // @ts-ignore
        yield Promise.resolve().then(() => __importStar(__nccwpck_require__(574)));
        // @ts-ignore
        yield Promise.resolve().then(() => __importStar(__nccwpck_require__(75)));
        const { _registerCommand } = sandbox;
        const c = sandbox.Campaign();
        logger.warn(c);
        const RankedTable = CustomTable_1.createRankedTableConstructor({
            sandbox,
            logger: logger.child({
                logName: "RankedTable",
            }),
        });
        // Add a spell (using Table Export script)
        const importDCCSpell = _registerCommand(
        // !import-dcc-spell [data]
        "import-dcc-spell", (...rest) => {
            logger.info("Importing DCC spell.");
            sandbox.sendChat("", rest.join("\n"), undefined, {
                noarchive: true,
            });
        });
        // Export a spell (using Table Export script)
        const exportDCCSpell = _registerCommand(
        // !export-dcc-spell name
        "export-dcc-spell", (name) => {
            logger.info(`Exporting DCC spell: "${name}"`);
            // find all the tables related to the spell.
            const tables = getDCCSpellTables(name);
            tables.forEach((table) => {
                sandbox.sendChat("", `!export-table ${table.get("name")}`);
            });
        });
        // Remove all of a spell's tables
        const deleteDCCSpell = _registerCommand(
        // !remove-dcc-spell name
        "delete-dcc-spell", (name) => {
            logger.info(`Removing DCC spell: "${name}"`);
            // find all the tables related to the spell.
            const tables = getDCCSpellTables(name);
            tables.forEach((table) => {
                // TODO: do we need to remove the items as well?
                table.remove();
            });
        });
        const castDCCSpell = _registerCommand(
        // !cast NAME ROLL_OR_RANK
        "cast", (name, roll) => {
            logger.info(`Casting a spell! "${name}" "${roll}"`);
            const rollAsNumber = Number(roll);
            if (isNaN(rollAsNumber)) {
                logger.error(`Roll "${roll}" could not be parsed into a number.`);
                return;
            }
            const castTable = new RankedTable(getDCCSpellTable(name));
            const value = castTable === null || castTable === void 0 ? void 0 : castTable.getAtKey(rollAsNumber);
            if (value.length !== 1) {
                logger.error(`Expected a result, but found ${value.length === 0 ? "none" : "more than one."}`);
                return;
            }
            sandbox.sendChat("", `!rt ${value[0].result}`);
            return;
        });
        const manifestDCCSpell = _registerCommand("manifest", (name) => {
            logger.info(`Manifesting a spell! "${name}`);
            sandbox.sendChat("", `!rt [[1t[DCC-SPELL-${name.toUpperCase()}-MANIFESTATION]]]`);
            return;
        });
        const dccSpellCommands = {
            importDCCSpell,
            exportDCCSpell,
            deleteDCCSpell,
            castDCCSpell,
            manifestDCCSpell,
        };
        const getDCCSpellTables = (name) => {
            const tables = sandbox.filterObjs((obj) => {
                return (obj._type === "rollabletable" &&
                    obj
                        .get("name")
                        .indexOf(`DCC-SPELL-${name.toUpperCase()}-`) === 0);
            });
            logger.info(`Found ${tables.length} tables.`);
            return tables;
        };
        const getDCCSpellTable = (name, subtable = "CAST") => {
            return sandbox.findObjs({
                _type: "rollabletable",
                name: `DCC-SPELL-${name.toUpperCase()}-${subtable.toUpperCase()}`,
            })[0];
        };
        if (sandbox._isWithinSandbox()) {
            return;
        }
        testElfwardLocally(sandbox);
    }));
}));
const testElfwardLocally = (sandbox) => {
    logger.info("Starting local Elfward tests.");
    sandbox._setAsGM("GM");
    sandbox.Campaign();
    // try a table import
    sandbox.sendChat("", "!import-table --TEST-TABLE --show");
};


/***/ }),

/***/ 722:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
__nccwpck_require__(401);


/***/ }),

/***/ 839:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLogger = void 0;
const util_1 = __nccwpck_require__(604);
const types_1 = __nccwpck_require__(321);
/**
 * Returns a basic logger.
 */
const getLogger = ({ logLevel = "INFO", logName = "LOG", emissionFn, } = {}) => {
    var _a;
    let outFn = emissionFn ||
        util_1.getTopLevelScope().log ||
        ((_a = util_1.getTopLevelScope().console) === null || _a === void 0 ? void 0 : _a.log) ||
        (() => { });
    const logLevelAsNumber = isNaN(Number(logLevel))
        ? types_1.LOG_LEVEL[logLevel]
        : Number(logLevel);
    const level = logLevelAsNumber === undefined ? types_1.LOG_LEVEL.INFO : logLevelAsNumber;
    const _emit = (msgLevel, ...rest) => {
        if (level <= types_1.LOG_LEVEL[msgLevel]) {
            // @ts-ignore
            return outFn(`${logName} [${msgLevel}]: ${rest}`);
        }
    };
    return {
        trace: (...rest) => {
            // get a stack trace
            const err = new Error();
            _emit("TRACE", ...rest, err.stack);
        },
        debug: (...rest) => _emit("DEBUG", ...rest),
        info: (...rest) => _emit("INFO", ...rest),
        warn: (...rest) => _emit("WARN", ...rest),
        error: (...rest) => _emit("ERROR", ...rest),
        fatal: (...rest) => {
            const err = rest[0] instanceof Error ? rest.shift() : new Error(`${rest}`);
            _emit("FATAL", err, ...rest);
            throw err;
        },
        child: (obj = {}) => {
            _emit("TRACE", `child(${obj})`);
            return exports.getLogger({
                logName: `${logName}::${obj.logName || "(child)"}`,
                logLevel: obj.logLevel || logLevel,
                emissionFn: obj.emissionFn || outFn,
            });
        },
    };
};
exports.getLogger = getLogger;


/***/ }),

/***/ 698:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LOG_LEVEL = exports.getLogger = void 0;
var getLogger_1 = __nccwpck_require__(839);
Object.defineProperty(exports, "getLogger", ({ enumerable: true, get: function () { return getLogger_1.getLogger; } }));
var types_1 = __nccwpck_require__(321);
Object.defineProperty(exports, "LOG_LEVEL", ({ enumerable: true, get: function () { return types_1.LOG_LEVEL; } }));


/***/ }),

/***/ 321:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LOG_LEVEL = void 0;
exports.LOG_LEVEL = {
    TRACE: 1,
    DEBUG: 5,
    INFO: 10,
    WARN: 20,
    ERROR: 40,
    FATAL: 100,
};


/***/ }),

/***/ 533:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createRoll20ObjectConstructor = void 0;
const shapes_1 = __nccwpck_require__(163);
// Fields that can't be changed in the normal ways.
const ImmutableFields = ["_id", "_type"];
// Additional rules applied to certain subtypes.
const Rules = {
    ability: {
        creatable: true,
    },
    attribute: {
        maySetWithWorker: true,
        creatable: true,
    },
    character: {
        asyncFields: ["gmnotes", "bio"],
        creatable: true,
    },
    handout: {
        asyncFields: ["notes", "gmnotes"],
        creatable: true,
    },
    macro: {
        creatable: true,
    },
    rollabletable: {
        creatable: true,
    },
    path: {
        creatable: true,
    },
    tableitem: {
        creatable: true,
    },
    text: {
        creatable: true,
    },
};
/**
 * Get a Roll20Object constructor.
 */
const createRoll20ObjectConstructor = ({ logger, idGenerator, pool, eventGenerator, }) => {
    var _a;
    const shapeDefaults = shapes_1.getShapeDefaults({ idGenerator });
    const Roll20Object = (_a = class Roll20Object {
            constructor(type, obj = {}) {
                logger === null || logger === void 0 ? void 0 : logger.trace(`Creating Roll20Object from: ${type}", ${JSON.stringify(obj)}".`);
                this._obj = Roll20Object._createShape(type, obj);
            }
            get(key, cb) {
                var _a, _b;
                logger === null || logger === void 0 ? void 0 : logger.trace(`get(${key})`);
                if ((_b = (_a = Rules[this._obj._type]) === null || _a === void 0 ? void 0 : _a.asyncFields) === null || _b === void 0 ? void 0 : _b.includes(key)) {
                    if (!cb) {
                        throw new Error(`Callback required to get key "#{key}".`);
                    }
                }
                const value = this._obj[key];
                logger === null || logger === void 0 ? void 0 : logger.trace(`get(${key}) found "${value}".`);
                // TODO: allow a delay before callback is called.
                //return (cb ? cb(value) : value) as S[K]
                return value;
            }
            get id() {
                return this._obj._id;
            }
            set(changesOrKey, value) {
                const allChanges = typeof changesOrKey !== "object"
                    ? { [changesOrKey]: value }
                    : changesOrKey;
                logger === null || logger === void 0 ? void 0 : logger.trace(`set(${JSON.stringify(allChanges)})`);
                Object.keys(allChanges).forEach((key) => {
                    if (ImmutableFields.includes(key)) {
                        logger === null || logger === void 0 ? void 0 : logger.error(`You may not set key "${key}".`);
                    }
                    else {
                        // @ts-ignore
                        this._obj[key] =
                            allChanges[key];
                        eventGenerator(`change:${this._obj._type}:${key}`);
                    }
                });
            }
            /**
             * Makes a set of changes to a Roll20Object via webworker. To receive
             * notice that the change has completed, you must register an
             * @param changes
             */
            setWithWorker(changes) {
                logger === null || logger === void 0 ? void 0 : logger.trace(`setWithWorkers(${JSON.stringify(changes)})`);
                if (this._obj._type !== "attribute") {
                    throw new Error(`Can't call setWithWorker on non-attribute objects.`);
                }
                Object.keys(changes).forEach((key) => {
                    if (ImmutableFields.includes(key)) {
                        logger === null || logger === void 0 ? void 0 : logger.error(`You may not set key "${key}".`);
                    }
                    else {
                        // @ts-ignore
                        this._obj[key] = changes[key];
                    }
                });
                eventGenerator("sheetWorkerCompleted");
            }
            remove() {
                logger === null || logger === void 0 ? void 0 : logger.trace(`remove()`);
                if (pool) {
                    if (pool[this.id] !== this) {
                        logger === null || logger === void 0 ? void 0 : logger.warn(`Can't remove obj; id ${this._obj._id} not found in pool.`);
                    }
                    delete pool[this.id];
                }
                eventGenerator(`remove:${this._obj._type}`);
                return this;
            }
        },
        _a._createShape = (type, obj) => {
            return shapeDefaults[type](obj);
        },
        _a);
    return Roll20Object;
};
exports.createRoll20ObjectConstructor = createRoll20ObjectConstructor;


/***/ }),

/***/ 333:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createRoll20ObjectConstructor = exports.getShapeDefaults = void 0;
var shapes_1 = __nccwpck_require__(163);
Object.defineProperty(exports, "getShapeDefaults", ({ enumerable: true, get: function () { return shapes_1.getShapeDefaults; } }));
const Roll20Object_1 = __nccwpck_require__(533);
Object.defineProperty(exports, "createRoll20ObjectConstructor", ({ enumerable: true, get: function () { return Roll20Object_1.createRoll20ObjectConstructor; } }));


/***/ }),

/***/ 163:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getShapeDefaults = void 0;
/**
 * Returns a hash of Roll20Object _types to functions "filling in" default values for each.
 */
const getShapeDefaults = ({ idGenerator, }) => {
    return {
        ability: (obj = {}) => (Object.assign(Object.assign({ _id: idGenerator(), _characterid: "", name: "", description: "", action: "", istokenaction: false }, obj), { _type: "ability" })),
        attribute: (obj = {}) => (Object.assign(Object.assign({ _id: idGenerator(), _characterid: "", name: "", current: "", max: "" }, obj), { _type: "attribute" })),
        campaign: (obj = {}) => (Object.assign(Object.assign({ _id: "root", turnorder: "", initiativepage: false, playerpageid: false, playerspecificpages: false, _journalfolder: "", _jukeboxfolder: "" }, obj), { _type: "campaign" })),
        card: (obj = {}) => (Object.assign(Object.assign({ _id: idGenerator(), name: "", avatar: "", _deckid: "" }, obj), { _type: "card" })),
        character: (obj = {}) => (Object.assign(Object.assign({ _id: idGenerator(), name: "", avatar: "", bio: "", gmnotes: "", archived: false, inplayerjournals: "", controlledby: "", _defaulttoken: "" }, obj), { _type: "character" })),
        custfx: (obj = {}) => (Object.assign(Object.assign({ _id: idGenerator(), name: "", definition: {} }, obj), { _type: "custfx" })),
        deck: (obj = {}) => (Object.assign(Object.assign({ _id: idGenerator(), name: "", _currentDeck: "", _currentIndex: -1, _currentCardShown: true, showplayers: true, playerscandraw: true, avatar: "", shown: false, players_seenumcards: true, players_seefrontofcards: false, gm_seenumcards: true, gm_seefrontofcards: false, infinitecards: false, _cardSequencer: -1, cardsplayed: "faceup", defaultheight: "", defaultwidth: "", discardpilemode: "none", _discardPile: "" }, obj), { _type: "deck" })),
        graphic: (obj = {}) => (Object.assign(Object.assign({ _id: idGenerator(), _subtype: "token", left: 0, top: 0, width: 0, height: 0, rotation: 0, layer: "", isdrawing: false, flipv: false, fliph: false, name: "", gmnotes: "", controlledby: "", bar1_value: "", bar2_value: "", bar3_value: "", bar1_max: "", bar2_max: "", bar3_max: "", aura1_radius: "", aura2_radius: "", aura1_color: "#FFFF99", aura2_color: "#59E594", aura1_square: false, aura2_square: false, tint_color: "transparent", statusmarkers: "", token_markers: "", showname: false, showplayers_name: false, showplayers_bar1: false, showplayers_bar2: false, showplayers_bar3: false, showplayers_aura1: false, showplayers_aura2: false, playersedit_name: true, playersedit_bar1: true, playersedit_bar2: true, playersedit_bar3: true, playersedit_aura1: true, playersedit_aura2: true, light_radius: "", light_dimradius: "", light_otherplayers: false, light_hassight: false, light_angle: "360", light_losangle: "360", lastmove: "", light_multiplier: "1", imgsrc: "", _pageid: idGenerator(), adv_fow_view_distance: "" }, obj), { _type: "graphic" })),
        hand: (obj = {}) => (Object.assign(Object.assign({ _id: idGenerator() }, obj), { _parentid: "", currentView: "bydeck", currentHand: "", _type: "hand" })),
        handout: (obj = {}) => (Object.assign(Object.assign({ _id: idGenerator(), avatar: "", name: "Mysterious Note", notes: "", gmnotes: "", inplayerjournals: "", archived: false, controlledby: "" }, obj), { _type: "handout" })),
        jukeboxtrack: (obj = {}) => (Object.assign(Object.assign({ _id: idGenerator(), playing: false, softstop: false, title: "", volume: 30, loop: false }, obj), { _type: "jukeboxtrack" })),
        macro: (obj = {}) => (Object.assign(Object.assign({ _id: idGenerator(), _playerid: "", name: "", action: "", visibleto: "", istokenaction: false }, obj), { _type: "macro" })),
        page: (obj = {}) => (Object.assign(Object.assign({ _id: idGenerator(), _zorder: "", name: "", showgrid: true, showdarkness: false, showlighting: false, width: 25, height: 25, snapping_increment: 1, grid_opacity: 0.5, fog_opacity: 0.35, background_color: "#FFFFFF", gridcolor: "#C0C0C0", grid_type: "square", scale_number: 5, scale_units: "ft", gridlabels: false, diagonaltype: "foure", archived: false, lightupdatedrop: false, lightenforcelos: false, lightrestrictmove: false, lightglobalillum: false }, obj), { _type: "page" })),
        path: (obj = {}) => (Object.assign(Object.assign({ _id: idGenerator(), _pageid: idGenerator(), _path: "", fill: "transparent", stroke: "#000000", rotation: 0, layer: "", stroke_width: 5, width: 0, height: 0, top: 0, left: 0, scaleX: 1, scaleY: 1, controlledby: "" }, obj), { _type: "path" })),
        player: (obj = {}) => (Object.assign(Object.assign({ _id: idGenerator(), _d20userid: idGenerator(), _displayname: "", _online: false, _lastpage: "", _macrobar: "", speakingas: "", color: "#13B9F0", showmacrobar: false }, obj), { _type: "player" })),
        rollabletable: (obj = {}) => (Object.assign(Object.assign({ _id: idGenerator(), name: "new-table", showplayers: true }, obj), { _type: "rollabletable" })),
        text: (obj = {}) => (Object.assign(Object.assign({ _id: idGenerator(), _pageid: idGenerator(), top: 0, left: 0, width: 0, height: 0, text: "", font_size: 16, rotation: 0, color: "rgb(0, 0, 0)", font_family: "Arial", layer: "", controlledby: "" }, obj), { _type: "text" })),
        tableitem: (obj = {}) => (Object.assign(Object.assign({ _id: idGenerator(), _rollabletableid: "", name: "new-table", avatar: "", weight: "1" }, obj), { _type: "tableitem" })),
    };
};
exports.getShapeDefaults = getShapeDefaults;


/***/ }),

/***/ 392:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createRoll20Sandbox = void 0;
var sandbox_1 = __nccwpck_require__(746);
Object.defineProperty(exports, "createRoll20Sandbox", ({ enumerable: true, get: function () { return sandbox_1.createRoll20Sandbox; } }));


/***/ }),

/***/ 746:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createRoll20Sandbox = void 0;
__nccwpck_require__(79);
const Roll20Object_1 = __nccwpck_require__(333);
const getTopLevelScope_1 = __importDefault(__nccwpck_require__(992));
const createRoll20Sandbox = ({ campaign, state, logger, pool = {}, idGenerator, 
// @ts-ignore
scope = getTopLevelScope_1.default(), wrappers = {}, }) => __awaiter(void 0, void 0, void 0, function* () {
    // private variables for things handled behind the scenes
    // by the sandbox.
    const _private = {
        _campaign: undefined,
        _pool: pool,
        _readyEventEmitted: false,
        _handlers: {},
        _GM: undefined,
        _withinSandbox: true,
    };
    const _fireEvent = (eventName, ...rest) => {
        logger === null || logger === void 0 ? void 0 : logger.trace(`_fireEvent('${eventName}').`, ...rest);
        if (eventName === "sheetWorkerCompleted") {
            // Unlike other events, this one clears out each queued
            // handler as it is called.
            const handlers = _private._handlers[eventName] || [];
            handlers.forEach((handler) => handler(...rest));
            _private._handlers[eventName] = [];
            return;
        }
        if (eventName === "ready") {
            // Unlike other events, we only fire this once.
            if (!_private._readyEventEmitted) {
                const handlers = _private._handlers[eventName] || [];
                handlers.forEach((handler) => handler(...rest));
                _private._readyEventEmitted = true;
            }
            return;
        }
        const subEvents = eventName.split(":");
        while (subEvents.length) {
            const n = subEvents.join(":");
            logger === null || logger === void 0 ? void 0 : logger.info(`_fireEvent: Firing event '${n}'.`, ...rest);
            const handlers = _private._handlers[n] || [];
            handlers.forEach((handler) => handler(...rest));
            subEvents.pop();
        }
    };
    const Roll20Object = Roll20Object_1.createRoll20ObjectConstructor({
        logger: logger === null || logger === void 0 ? void 0 : logger.child({
            logName: "Roll20Object",
        }),
        idGenerator,
        pool,
        eventGenerator: _fireEvent,
    });
    const filterObjs = (cb) => {
        logger === null || logger === void 0 ? void 0 : logger.trace(`filterObjs()`);
        return Object.keys(_private._pool)
            .map((key) => _private._pool[key])
            .filter(cb);
    };
    const sandbox = {
        _: undefined,
        state: state || getTopLevelScope_1.default().state || {},
        Campaign: () => {
            if (!_private._campaign) {
                const cmp = campaign ||
                    new Roll20Object("campaign");
                _private._campaign = cmp;
                _private._pool[cmp.id] = cmp;
            }
            return _private._campaign;
        },
        createObj: (_type, obj) => {
            logger === null || logger === void 0 ? void 0 : logger.trace(`createObj(${_type}, ${JSON.stringify(obj)})`);
            const r = new Roll20Object(_type, obj);
            _private._pool[r.id] = r;
            return r;
        },
        filterObjs,
        findObjs: (obj, { caseInsensitive = false } = {}) => {
            logger === null || logger === void 0 ? void 0 : logger.trace(`findObjs(${JSON.stringify(obj)}, { caseInsensitive: ${caseInsensitive} })`);
            return filterObjs((testObj) => {
                let found = true;
                Object.keys(testObj).forEach((key) => {
                    const testValue = testObj[key];
                    const objValue = obj[key];
                    if (found && caseInsensitive) {
                        if (typeof objValue === "string" ||
                            typeof testValue === "string") {
                            if (testValue.toString().toLowerCase() !=
                                objValue.toString().toLowerCase()) {
                                found = false;
                            }
                        }
                    }
                    if (found && testObj[key] != obj[key]) {
                        found = false;
                    }
                });
                return found;
            });
        },
        getObj: (type, id) => {
            logger === null || logger === void 0 ? void 0 : logger.trace(`getObj(${type}, ${id})`);
            return _private._pool[id];
        },
        getAllObjs: () => {
            logger === null || logger === void 0 ? void 0 : logger.trace(`getAllObjs()`);
            return Object.keys(_private._pool).map((key) => _private._pool[key]);
        },
        getAttrByName: (id, name, curOrMax = "current") => {
            logger === null || logger === void 0 ? void 0 : logger.trace(`getAttrByName(${id}, ${name}, ${curOrMax})`);
            // @ts-ignore
            const findObjs = findObjs || sandbox.findObjs;
            const char = findObjs({ type: "character", id })[0];
            if (!char) {
                throw new Error(`Can't find character with id "${id}".`);
            }
            return char.get(`${name}_${curOrMax}`);
        },
        log: (...rest) => { var _a; return (_a = (logger ? logger : console ? console : null)) === null || _a === void 0 ? void 0 : _a.info(...rest); },
        on: (eventName, handler) => {
            logger === null || logger === void 0 ? void 0 : logger.trace(`on(${eventName})`);
            const subEvents = eventName.split(":");
            if (subEvents[0] === "ready") {
                // If we've emitted a "ready" event already, immediately
                // call additional on("ready") handlers.
                logger === null || logger === void 0 ? void 0 : logger.info("Ready event", _private._readyEventEmitted);
                if (_private._readyEventEmitted) {
                    logger === null || logger === void 0 ? void 0 : logger.info(`on(${eventName}) handler set after initial "ready" event. Immediately calling it.`);
                    handler();
                    return;
                }
                // handler()
            }
            else if (subEvents[0] === "change") {
                // handler(obj, prev)
                // prev is a regular obj, not a Roll20Object.
                // async fields will have ids, not data, in prev
            }
            else if (subEvents[0] === "add") {
                // handler(obj)
            }
            else if (subEvents[0] === "destroy") {
                // handler(obj)
            }
            else if (subEvents[0] === "chat") {
                // handler(msg)
            }
            _private._handlers[eventName] = _private._handlers[eventName] || [];
            _private._handlers[eventName].push(handler);
            logger === null || logger === void 0 ? void 0 : logger.info(`on(${eventName}) handler set.`);
        },
        onSheetWorkerCompleted: (cb) => {
            logger === null || logger === void 0 ? void 0 : logger.trace(`onSheetWorkerCompleted()`);
            _private._handlers["sheetWorkerCompleted"] =
                _private._handlers["sheetWorkerCompleted"] || [];
            _private._handlers["sheetWorkerCompleted"].push(cb);
        },
        playerIsGM: (playerId) => {
            logger === null || logger === void 0 ? void 0 : logger.trace(`playerIsGM(${playerId})`);
            return _private._GM === playerId;
        },
        playJukeboxPlaylist: () => {
            logger === null || logger === void 0 ? void 0 : logger.trace(`playJukeboxPlaylist()`);
        },
        randomInteger: (max) => {
            logger === null || logger === void 0 ? void 0 : logger.trace(`randomInteger(${max})`);
            return Math.floor(Math.random() * max) + 1;
        },
        sendChat: (speakingAs, message, cb, { noarchive = false, use3d = false } = {}) => {
            logger === null || logger === void 0 ? void 0 : logger.info(`sendChat(${speakingAs}, ${message})`);
            cb && cb([]);
            // TODO: player management
            if (!_private._withinSandbox) {
                const type = message.indexOf("!") === 0 ? "api" : "general";
                const msg = {
                    who: speakingAs,
                    content: message,
                    playerid: "GM",
                    type,
                    target_name: "",
                    selected: [],
                };
                // TODO: find additional message info
                _fireEvent("chat:message", msg);
            }
        },
        sendPing: (left, top, pageId, playerId, moveAll = false, visibleTo) => {
            logger === null || logger === void 0 ? void 0 : logger.trace(`sendPing(${left}, ${top}, ${pageId}, ${playerId}, ${moveAll}, ${visibleTo})`);
        },
        spawnFx: (left, top, typeColor, pageId) => {
            logger === null || logger === void 0 ? void 0 : logger.trace(`spawnFx(${left}, ${top}, ${typeColor}, ${pageId})`);
        },
        spawnFxBetweenPoints: (start, end, typeColor, pageId) => {
            logger === null || logger === void 0 ? void 0 : logger.trace(`spawnFxBetweenPoints(${JSON.stringify(start)}, ${JSON.stringify(end)}, ${typeColor}, ${pageId})`);
        },
        spawnFxWithDefinition: (left, top, definition, pageId) => {
            logger === null || logger === void 0 ? void 0 : logger.trace(`spawnFxWithDefinition(${left}, ${top}, ${JSON.stringify(definition)}, ${pageId})`);
        },
        /**
         * Mocked version of stopJukeboxPlaylist(), which does nothing.
         */
        stopJukeboxPlaylist: () => {
            logger === null || logger === void 0 ? void 0 : logger.trace(`stopJukeboxPlaylist()`);
        },
        /**
         * Mocked version of toBack(), which does nothing.
         */
        toBack: (obj) => {
            // TODO: mock zindex
            logger === null || logger === void 0 ? void 0 : logger.trace(`toBack(${JSON.stringify(obj)})`);
        },
        /**
         * Mocked version of toFront(), which does nothing.
         */
        toFront: (obj) => {
            logger === null || logger === void 0 ? void 0 : logger.trace(`toFront(${JSON.stringify(obj)})`);
        },
    };
    // We look at the environment. If the functions defined in the sandbox object
    // also exist in the global scope, we'll use those instead.
    // If wrappers were passed in, we wrap whichever function we've found to use with them.
    const realSandbox = {};
    yield Promise.all(Object.keys(sandbox).map((k) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const topLevelScope = scope;
        const key = k;
        if (typeof topLevelScope[key] !== "undefined") {
            logger === null || logger === void 0 ? void 0 : logger.info(`Found Roll20's "${key}". Copying to Roll20Sandbox.`);
            realSandbox[key] = topLevelScope[key];
        }
        else {
            logger === null || logger === void 0 ? void 0 : logger.info(`Roll20 "${key}" not found. Installing mock.`);
            _private._withinSandbox = false;
            // The underscore library is an outlier here. We only want to include the library
            // if necessary, and other libraries expect it available globally from the jump.
            if (key === "_") {
                logger === null || logger === void 0 ? void 0 : logger.info("Dynamically importing underscore library.");
                const _b = yield Promise.resolve().then(() => __importStar(__nccwpck_require__(987))), { default: myDefault } = _b, rest = __rest(_b, ["default"]);
                const _ = Object.assign(myDefault, rest);
                logger === null || logger === void 0 ? void 0 : logger.info("Imported as", _);
                topLevelScope._ = _;
                realSandbox._ = _;
            }
            else {
                if (typeof sandbox[key] === "undefined") {
                    logger === null || logger === void 0 ? void 0 : logger.info(`No mock found for "${key}"`);
                }
                // @ts-ignore
                realSandbox[key] = sandbox[key];
                logger === null || logger === void 0 ? void 0 : logger.info(`Using mocked "${key}": ${(_a = sandbox[key]) === null || _a === void 0 ? void 0 : _a.toString()}.`);
            }
        }
        // if ((wrappers as Record<string, any>)[key]) {
        //     logger?.info(`Custom wrapper found for "${key}". Applying.`);
        //     realSandbox[key] = (wrappers as Record<string, any>)[key](
        //         realSandbox[key]
        //     );
        // }
    })));
    const _registerCommand = (name, handler) => {
        logger === null || logger === void 0 ? void 0 : logger.info("registering command " + name);
        realSandbox.on("chat:message", (msg) => {
            if (msg.type !== "api") {
                return;
            }
            logger === null || logger === void 0 ? void 0 : logger.info(msg.content);
            if (msg.content.indexOf(name) !== 1) {
                return;
            }
            logger === null || logger === void 0 ? void 0 : logger.info("invoked" + name);
            // @ts-ignore
            const [command, ...args] = msg.content.splitArgs();
            logger === null || logger === void 0 ? void 0 : logger.info("split up command" + args.length);
            handler(...args);
        });
    };
    const _isWithinSandbox = () => {
        return _private._withinSandbox;
    };
    if (!_isWithinSandbox()) {
        /**
         * If, after a full second, we're not within the real Roll20 sandbox, fire a ready event.
         */
        // @ts-ignore
        setTimeout(() => {
            if (_isWithinSandbox()) {
                logger === null || logger === void 0 ? void 0 : logger.info(`Within real sandbox, so ignoring need to fire ready event.`);
                if (_private._readyEventEmitted) {
                    logger === null || logger === void 0 ? void 0 : logger.info(`Ready event was already heard, anyway.`);
                }
                return;
            }
            if (_private._readyEventEmitted) {
                logger === null || logger === void 0 ? void 0 : logger.info(`Outside of real sandbox, but ready event already fired. Huh. Not firing again.`);
                return;
            }
            logger === null || logger === void 0 ? void 0 : logger.info(`Outside of real sandbox and ready event not fired within 1 second, so firing ready event manually.`);
            _fireEvent("ready");
        }, 1000);
    }
    const _promote = (keys, 
    // @ts-ignore
    scope = getTopLevelScope_1.default()) => {
        logger === null || logger === void 0 ? void 0 : logger.info("_PROMOTE");
        let promotionKeys = keys || Object.keys(realSandbox);
        logger === null || logger === void 0 ? void 0 : logger.info(`_PROMOTING: ${promotionKeys}`);
        promotionKeys.forEach((key) => {
            logger === null || logger === void 0 ? void 0 : logger.info(`${key}, ${realSandbox[key] === scope[key]}`);
            scope[key] = realSandbox[key];
        });
        return scope;
    };
    const _setAsGM = (playerId) => {
        _private._GM = playerId;
    };
    return Object.assign(Object.assign({}, realSandbox), { _fireEvent,
        _registerCommand,
        _isWithinSandbox, _global: getTopLevelScope_1.default(), _promote,
        _setAsGM });
});
exports.createRoll20Sandbox = createRoll20Sandbox;


/***/ }),

/***/ 992:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getTopLevelScope = void 0;
let _root;
const getTopLevelScope = () => {
    // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.
    if (!_root) {
        _root =
            (typeof self == "object" && self.self === self && self) ||
                // @ts-ignore
                (typeof global == "object" && global.global === global && global) ||
                Function("return this")() ||
                {};
    }
    return _root;
};
exports.getTopLevelScope = getTopLevelScope;
exports.default = exports.getTopLevelScope;


/***/ }),

/***/ 604:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useSmartQuotes = exports.getTopLevelScope = void 0;
var getTopLevelScope_1 = __nccwpck_require__(992);
Object.defineProperty(exports, "getTopLevelScope", ({ enumerable: true, get: function () { return getTopLevelScope_1.getTopLevelScope; } }));
var useSmartQuotes_1 = __nccwpck_require__(870);
Object.defineProperty(exports, "useSmartQuotes", ({ enumerable: true, get: function () { return useSmartQuotes_1.useSmartQuotes; } }));


/***/ }),

/***/ 870:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useSmartQuotes = void 0;
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
];
const useSmartQuotes = (str) => {
    return smartQuotes.reduce((acc, curr) => {
        return str.replace(curr[0], curr[1]);
    }, str);
};
exports.useSmartQuotes = useSmartQuotes;
exports.default = exports.useSmartQuotes;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __nccwpck_require__(722);
/******/ })()
;