import fs from "fs";

import glob from "glob";
import yaml from "yaml";

import useSmartQuotes from "../src/util/useSmartQuotes";

type SpellTable = {
  name: string;
  level: string;
  range: string;
  timeToCast: string;
  save: string;
  description: string;
  [k: string]: string | SpellTableItem[];
};

type SpellTableItem = {
  content: string;
  [k: string]: string;
};

// ((1d4))
const rawDiceNotation = /\(\((.+?)\)\)/g;

// (I-AM-A-TABLE)
// (I-AM-A-RANKED-TABLE ((1d4)))
const rawTableMention = /\(([A-Z0-9-]+(?:\s<%%91%%>.+<%%93%%>)?)\)/g;

const spellPaths = glob.sync("./data/spells/**/*.yaml");

const spells = spellPaths.map((spellPath, index) => {
  const data = yaml.parse(fs.readFileSync(spellPath, "utf8"));

  const safeName = data.name.replace(" ", "_");

  const tablePrefix = `DCC-SPELL-${safeName.toUpperCase()}-`;
  const internalTables = Object.keys(data).filter((key) =>
    /^([A-Z0-9-]+)$/.test(key)
  );

  const spellTable = {} as SpellTable;

  const processYamlString = (v: string) => {
    let text = useSmartQuotes(v);
    internalTables.forEach((t) => {
      text = text.replace(`(${t}`, `(${tablePrefix}${t}`);
    });
    return text;
  };

  Object.keys(data).forEach((key) => {
    const v = data[key];
    if (key !== key.toUpperCase()) {
      spellTable[key] = processYamlString(v);
    } else {
      const fullKey = `${tablePrefix}${key}`;
      const spellTableItems = Array.isArray(v)
        ? v.map((item) => ({ content: processYamlString(item) }))
        : Object.keys(v).map((k) => ({
            rank: k,
            content: processYamlString(v[k]),
          }));

      spellTable[fullKey] = spellTableItems;
    }
  });

  fs.writeFileSync(
    `./build/data/spells/${safeName.toUpperCase()}.json`,
    JSON.stringify(spellTable)
  );

  // convert to import-table format and save

  Object.keys(spellTable).forEach((key) => {
    // escape the values
    if (typeof spellTable[key] === "string") {
      const v = spellTable[key] as string;
      let temp = v.replace(
        rawDiceNotation,
        "<%%91%%><%%91%%>$1<%%93%%><%%93%%>"
      );
      temp = temp.replace(
        rawTableMention,
        "<%%91%%><%%91%%>1t<%%91%%>$1<%%93%%><%%93%%><%%93%%>"
      );
      temp = temp.replace(/\n/g, "\\n");
      spellTable[key] = temp;
    } else {
      const v = spellTable[key] as SpellTableItem[];
      spellTable[key] = v.map((item) => {
        let temp = item.content.replace(
          rawDiceNotation,
          "<%%91%%><%%91%%>$1<%%93%%><%%93%%>"
        );
        temp = temp.replace(
          rawTableMention,
          "<%%91%%><%%91%%>1t<%%91%%>$1<%%93%%><%%93%%><%%93%%>"
        );
        temp = temp.replace(/\n/g, "\\n");
        item.content = temp;
        return item;
      });
    }
  });

  const lines = [] as string[];
  const other = [] as string[];

  // build up tables
  Object.keys(spellTable).forEach((key) => {
    // uppercase keys are all tables
    if (key === key.toUpperCase()) {
      lines.push(`!import-table --${key} --show`);
      const items = spellTable[key] as SpellTableItem[];
      lines.push(
        ...items.map((item) => {
          if (typeof item.rank === "undefined") {
            return `!import-table-item --${key} --${item.content} --${
              item.weight || 1
            } --`;
          } else {
            return `!import-table-item --${key} --${item.rank}=${
              item.content
            } --${item.weight || 1} --`;
          }
        })
      );
      lines.push("\n");
    } else {
      other.push(`[${key}=${spellTable[key]}]`);
    }
  });
  lines.push(
    `!import-table-item --${tablePrefix}CAST --${other.join("")} --1 --`
  );

  fs.writeFileSync(
    `./build/data/spells/${safeName.toUpperCase()}.import-table`,
    lines.join("\n")
  );
});
