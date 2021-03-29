// Type definitions for the roll20sandbox
// Project: Roll20Sandbox
// Definitions by: basiliskasterisk <jmh@nilbog.com>

import type underscore from "underscore";
import {
    Id,
    PlayerId,
    Roll20ObjectInterface,
    Roll20ObjectShapeTypeMap,
    Roll20ObjectType,
} from "./src/Roll20Object";
import {
    ChatMessage,
    FxNames,
    FxBetweenNames,
    Coord2D,
    Roll20EventName,
} from "./src/Roll20Sandbox/types";

declare global {
    declare var _: underscore.UnderscoreStatic;
    declare var state: Record<string, any>;
    declare function Campaign(): Roll20ObjectInterface<"campaign">;
    declare function createObj<T extends Roll20ObjectType>(
        _type: T,
        obj: any
    ): Roll20ObjectInterface<T>;
    declare function filterObjs(
        cb: (obj: any) => boolean
    ): Roll20ObjectInterface[];
    declare function findObjs<T extends Roll20ObjectType = Roll20ObjectType>(
        obj: Partial<Roll20ObjectShapeTypeMap<T>>,
        options?: { caseInsensitive?: boolean }
    ): Roll20ObjectInterface<T>[];
    declare function getObj<T extends Roll20ObjectType>(
        type: Roll20ObjectShapeTypeMap[T],
        id: Id
    ): Roll20ObjectInterface<T> | undefined;
    declare function getAllObjs(): Roll20ObjectInterface[];
    declare function getAttrByName(
        id: string,
        name: string,
        curOrMax?: "current" | "max"
    ): any;
    declare function log(...rest: any[]): void;
    declare function on(eventName: Roll20EventName, handler: Function): void;
    declare function onSheetWorkerCompleted(cb: () => void): void;
    declare function playerIsGM(playerId: PlayerId): boolean;
    declare function playJukeboxPlaylist(): void;
    declare function randomInteger(max: number): number;
    declare function sendChat(
        speakingAs: ChatMessage["who"],
        message: ChatMessage["content"],
        cb?: (msgs: ChatMessage[]) => void
    ): void;
    declare function sendPing(
        left: number,
        top: number,
        pageId: Id,
        playerId: PlayerId | undefined,
        moveAll: boolean,
        visibleTo?: string | string[]
    ): void;
    declare function spawnFx(
        left: number,
        top: number,
        typeColor: FxNames,
        pageId: string
    ): void;
    declare function spawnFxBetweenPoints(
        start: Coord2D,
        end: Coord2D,
        typeColor: FxBetweenNames,
        pageId: Id
    ): void;
    declare function spawnFxWithDefinition(
        left: string,
        top: string,
        definition: Record<string, any>,
        pageId: Id
    ): void;
    declare function stopJukeboxPlaylist(): void;
    declare function toBack(obj: Roll20ObjectInterface): void;
    declare function toFront(obj: Roll20ObjectInterface): void;
    declare interface String {
        splitArgs(separator?: any): string[];
    }
}
