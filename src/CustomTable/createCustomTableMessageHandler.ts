import { Logger } from "../Logger";
import { Sandbox, ChatMessage } from "../Roll20Sandbox";
import { CustomTableConstructor } from "./types";

export const createCustomTableMessageHandler = <T>({
    sandbox,
    logger,
    TableConstructor,
}: {
    sandbox: Sandbox;
    logger?: Logger;
    TableConstructor: CustomTableConstructor<T>;
}) => {
    const inlineRegExp = /(\[\[1t\[([A-Z0-9]+) (\d+)\]\]\])/g;
    const handler = (msg: ChatMessage) => {
        //logger?.trace(`handler(${JSON.stringify(msg)})`);
        let result;
        let content = msg.content;
        while ((result = inlineRegExp.exec(content))) {
            const [_, all, tableName, key] = result;
            const tables = sandbox.findObjs({
                _type: "rollabletable",
                name: tableName,
            });
            if (tables.length !== 1) {
                logger?.warn(
                    `Wrong number of tables found: ${tables.length}. Ignoring.`
                );
                return;
            }

            const customTable = TableConstructor.getTable(tables[0]);
            const value = customTable.getAtKey(key);

            // replace the text of the message.
            content = content.replace(all, value.join(", "));
            logger?.info(`Replaced custom table reference: ${content}`);
        }
        // TODO: pass along change
        //sandbox.sendChat(msg.who, content);
    };
    return handler;
};

export default createCustomTableMessageHandler;
