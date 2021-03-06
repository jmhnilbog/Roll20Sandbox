import { Roll20EventName } from "../Roll20Sandbox/types";

export interface Roll20ObjectInterface<
    T extends Roll20ObjectType = Roll20ObjectType,
    S extends Roll20ObjectShapeTypeMap[T] = Roll20ObjectShapeTypeMap[T],
    K extends keyof S = keyof S
> {
    id: Id;
    get(key: K, cb?: (x: any) => S[K]): S[K];
    set(changes: Partial<S>): void;
    set(key: K, value: S[K]): void;
    setWithWorker(changes: Partial<S>): void;
    remove(): Roll20ObjectInterface<T, S, K>;
}

export type JSONString = Brand<string, "JSONString">;
export type TurnOrder = Brand<string, "JSONStringTurnOrder">;
export type Id = string; //Brand<string, "Id">;

export type PageId = Id;
export type PlayerId = Id;
export type CharacterId = Id;

// player ids and 'all' for all of them
export type CommaDelimitedPlayerIds = Brand<string, "CommaDelimitedPlayerIds">;
export type Layer = "gmlayer" | "objects" | "map" | "walls";
export type FontFamily =
    | "Arial"
    | "Patrick Hand"
    | "Contrail One"
    | "Shadows Into Light"
    | "Candal";
export type CommaDelimitedStatusMarkers = Brand<
    string,
    "CommaDelimitedStatusMarkers"
>;
export type CommaDelimitedCoordinates = Brand<
    string,
    "CommaDelimitedCoordinates"
>;
export type CommaDelimitedCards = Brand<string, "CommaDelimitedCards">;
export type CommaDelimitedIds = Brand<string, "CommaDelimitedIds">;
export type CommaDelimitedMacros = Brand<string, "CommaDelimitedMacros">;

export type CustomFXDefinition = object;

export type FXObject = any;

export type RBGColorString = Brand<string, "RGBColorString">; // rgb(0,0,0)
export type HexColorString = Brand<string, "HexColorString">; // #FFFFFF

export type JSONArray = Brand<string, "JSONArray">;

export type StatusMarker =
    | "red"
    | "blue"
    | "green"
    | "brown"
    | "purple"
    | "pink"
    | "yellow"
    | "dead"
    | "skull"
    | "sleepy"
    | "half-heart"
    | "half-haze"
    | "interdiction"
    | "snail"
    | "lightning-helix"
    | "spanner"
    | "chained-heart"
    | "chemical-bolt"
    | "death-zone"
    | "drink-me"
    | "edge-crack"
    | "ninja-mask"
    | "stopwatch"
    | "fishing-net"
    | "overdrive"
    | "strong"
    | "fist"
    | "padlock"
    | "three-leaves"
    | "fluffy-wing"
    | "pummeled"
    | "tread"
    | "arrowed"
    | "aura"
    | "back-pain"
    | "black-flag"
    | "bleeding-eye"
    | "bolt-shield"
    | "broken-heart"
    | "cobweb"
    | "broken-shield"
    | "flying-flag"
    | "radioactive"
    | "trophy"
    | "broken-skull"
    | "frozen-orb"
    | "rolling-bomb"
    | "white-tower"
    | "grab"
    | "screaming"
    | "grenade"
    | "sentry-gun"
    | "all-for-one"
    | "angel-outfit"
    | "archery-target";

export type StatusMarkerPseudoProperties = StatusMarker extends string
    ? `status_${StatusMarker}`
    : never;
type StatusMarkerLegacyPseudoProperties = StatusMarkerPseudoProperties extends string
    ? `${StatusMarkerPseudoProperties}marker`
    : never;

export type Roll20ObjectType = keyof Roll20ObjectShapeTypeMap;

export interface Roll20ObjectConstructor<
    T extends Roll20ObjectType = Roll20ObjectType,
    S extends Roll20ObjectShapeTypeMap[T] = Roll20ObjectShapeTypeMap[T],
    K extends keyof S = keyof S
> {
    new (type: T, obj?: Partial<S>): Roll20ObjectInterface<T, S, K>;
}

export type Roll20ObjectShapeTypeMap = {
    ability: {
        readonly _id: Id;
        readonly _type: "ability";
        readonly _characterid: CharacterId;
        name: string;
        description: string;
        action: string;
        istokenaction: boolean;
    };
    attribute: {
        readonly _id: Id;
        readonly _type: "attribute";
        readonly _characterid: CharacterId;
        name: string;
        current: string | number;
        max: string | number;
    };
    campaign: {
        readonly _type: "campaign";
        readonly _id: Id;
        readonly _journalfolder: JSONString;
        readonly _jukeboxfolder: JSONString;
        turnorder: TurnOrder;
        initiativepage: PageId | false;
        playerpageid: PageId | false;
        playerspecificpages: Record<PlayerId, PageId>;
    };
    card: {
        readonly _type: "card";
        readonly _id: Id;
        readonly _deckid: Id;
        name: string;
        avatar: string;
    };
    character: {
        readonly _id: CharacterId;
        readonly _type: "character";
        avatar: string;
        name: string;
        bio: string;
        gmnotes: string;
        archived: boolean;
        inplayerjournals: CommaDelimitedPlayerIds;
        controlledby: CommaDelimitedPlayerIds;
        readonly _defaulttoken: string;
    };
    custfx: {
        readonly _id: Id;
        readonly _type: "custfx";
        name: string;
        definition: FXObject;
    };
    deck: {
        readonly _type: "deck";
        readonly _id: Id;
        name: string;
        _currentDeck: CommaDelimitedCards;
        _currentIndex: number;
        _currentCardShown: boolean;
        showplayers: boolean;
        playerscandraw: boolean;
        avatar: string;
        shown: boolean;
        players_seenumcards: boolean;
        players_seefrontofcards: boolean;
        gm_seenumcards: boolean;
        gm_seefrontofcards: boolean;
        infinitecards: boolean;
        _cardSequencer: number;
        cardsplayed: "faceup" | "facedown";
        defaultheight: string | number;
        defaultwidth: string | number;
        discardpilemode:
            | "none"
            | "choosebacks"
            | "choosefronts"
            | "drawtop"
            | "drawbottom";
        _discardPile: CommaDelimitedCards;
    };
    graphic: {
        readonly _type: "graphic";
        readonly _subtype: "token" | "card";
        readonly _id: Id;
        readonly _pageid?: PageId;
        readonly _cardid?: Id;
        imgsrc?: string;
        bar1_link?: Id;
        bar2_link?: Id;
        bar3_link?: Id;
        represents?: Id;
        left: number;
        top: number;
        width: number;
        height: number;
        rotation: number;
        layer: Layer | "";
        isdrawing: boolean;
        flipv: boolean;
        fliph: boolean;
        name: string;
        gmnotes: string;
        controlledby: CommaDelimitedPlayerIds;
        bar1_value: number | string;
        bar2_value: number | string;
        bar3_value: number | string;
        bar1_max: number | string;
        bar2_max: number | string;
        bar3_max: number | string;
        aura1_radius: number | "";
        aura2_radius: number | "";
        aura1_color: HexColorString;
        aura2_color: HexColorString;
        aura1_square: boolean;
        aura2_square: boolean;
        tint_color: HexColorString | "transparent";
        statusmarkers: CommaDelimitedStatusMarkers;
        token_markers: JSONArray;
        showname: boolean;
        showplayers_name: boolean;
        showplayers_bar1: boolean;
        showplayers_bar2: boolean;
        showplayers_bar3: boolean;
        showplayers_aura1: boolean;
        showplayers_aura2: boolean;
        playersedit_name: boolean;
        playersedit_bar1: boolean;
        playersedit_bar2: boolean;
        playersedit_bar3: boolean;
        playersedit_aura1: boolean;
        playersedit_aura2: boolean;
        light_radius: number | string;
        light_dimradius: number | string;
        light_otherplayers: boolean;
        light_hassight: boolean;
        light_angle: string;
        light_losangle: string;
        lastmove: CommaDelimitedCoordinates;
        light_multiplier: number | string;
        adv_fow_view_distance: number | string;
    } & {
        [key in StatusMarkerPseudoProperties]?:
            | boolean
            | number
            | string
            | undefined;
    };
    hand: {
        readonly _id: Id;
        _parentid: PlayerId;
        readonly _type: "hand";
        currentHand: CommaDelimitedCards;
        currentView: "bydeck" | "bycard";
    };
    handout: {
        readonly _id: Id;
        readonly _type: "handout";
        avatar: string;
        name: string;
        notes: string;
        gmnotes: string;
        inplayerjournals: CommaDelimitedPlayerIds;
        archived: boolean;
        controlledby: CommaDelimitedPlayerIds;
    };
    jukeboxtrack: {
        readonly _id: Id;
        readonly _type: "jukeboxtrack";
        playing: boolean;
        softstop: boolean;
        title: string;
        volume: number;
        loop: boolean;
    };
    macro: {
        readonly _id: Id;
        readonly _type: "macro";
        readonly _playerid: PlayerId;

        name: string;
        action: string;
        visibleto: CommaDelimitedPlayerIds;
        istokenaction: boolean;
    };
    page: {
        readonly _id: Id;
        readonly _type: "page";
        readonly _zorder: CommaDelimitedIds;
        name: string;
        showgrid: boolean;
        showdarkness: boolean;
        showlighting: boolean;
        width: number;
        height: number;
        snapping_increment: number;
        grid_opacity: number;
        fog_opacity: number;
        background_color: HexColorString;
        gridcolor: HexColorString;
        grid_type: "square" | "hex" | "hexr";
        scale_number: number;
        scale_units: "ft" | string;
        gridlabels: boolean;
        diagonaltype: "foure" | "pythagorean" | "threefive" | "manhattan";
        archived: boolean;
        lightupdatedrop: boolean;
        lightenforcelos: boolean;
        lightrestrictmove: boolean;
        lightglobalillum: boolean;
    };
    path: {
        readonly _id: Id;
        readonly _type: "path";
        readonly _pageid: PageId;
        _path: JSONString;
        fill: HexColorString | "transparent";
        stroke: HexColorString | "transparent";
        rotation: number;
        layer: Layer;
        stroke_width: number;
        width: number;
        height: number;
        top: number;
        left: number;
        scaleX: number;
        scaleY: number;
        controlledby: CommaDelimitedPlayerIds;
    };
    player: {
        readonly _id: PlayerId;
        readonly _type: "player";
        readonly _d20userid: Id;
        readonly _displayname: string;
        readonly _online: boolean;
        readonly _lastpage: PageId | "";
        readonly _macrobar: CommaDelimitedMacros;
        speakingas: Id | "";
        color: HexColorString;
        showmacrobar: boolean;
    };
    rollabletable: {
        readonly _id: Id;
        readonly _type: "rollabletable";
        name: string;
        showplayers: boolean;
    };
    text: {
        readonly _id: Id;
        readonly _type: "text";
        readonly _pageid: PageId;
        top: number;
        left: number;
        width: number;
        height: number;
        text: string;
        font_size: number;
        rotation: number;
        color: RBGColorString;
        font_family: FontFamily;
        layer: Layer;
        controlledby: CommaDelimitedPlayerIds;
    };
    tableitem: {
        readonly _id: Id;
        readonly _type: "tableitem";
        readonly _rollabletableid: Id;
        avatar: string;
        name: string;
        weight: string;
    };
};

export type Roll20ObjectShape = Values<Roll20ObjectShapeTypeMap>;
// export type Roll20ObjectTypedShape<T extends Roll20ObjectType> = Roll20ObjectShape['_type'] extends T ? Roll20ObjectShape : never;

// export type Roll20ObjectPartialShape<T extends Roll20ObjectType = Roll20ObjectType> = {
//     _type: T;
// } & Partial<Roll20ObjectShapeTypeMap[T]>

// export type Roll20ObjectPartialShape<T extends Roll20ObjectType> = Require<
//     Partial<Roll20ObjectShapeTypeMap[T]>,
//     "_type"
// >;

// type XXXX = Roll20ObjectPartialShape<"macro">['_type'];
// const xxxx: Roll20ObjectPartialShape = {
//     _type: "macro"
// }

// const c: Roll20ObjectPartialShape<"graphic"> = {
//     _type: "graphic",
// };

// const X:Roll20ObjectPartialShape = {
//     _type: "rollabletable"
// }

export type IdGenerator = () => Id;
export type EventGenerator = (
    eventName: Roll20EventName,
    ...rest: any[]
) => void;
