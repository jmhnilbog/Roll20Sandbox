import { FontFamily, CommaDelimitedPlayerIds, CommaDelimitedCards, CommaDelimitedCoordinates, CommaDelimitedIds, CommaDelimitedMacros, CommaDelimitedStatusMarkers, HexColorString, JSONArray, Layer, RBGColorString, FXObject, StatusMarkerPseudoProperties, CharacterId, Id, JSONString, PageId, PlayerId, TurnOrder } from './types';
/**
 * Returns a hash of Roll20Object _types to functions "filling in" default values for each.
 */
export declare const getShapeDefaults: ({ idGenerator, }: {
    idGenerator: () => Id;
}) => {
    readonly ability: (obj?: any) => any;
    readonly attribute: (obj?: any) => any;
    readonly campaign: (obj?: any) => any;
    readonly card: (obj?: any) => any;
    readonly character: (obj?: any) => any;
    readonly custfx: (obj?: any) => any;
    readonly deck: (obj?: any) => any;
    readonly graphic: (obj?: any) => any;
    readonly hand: (obj?: any) => any;
    readonly handout: (obj?: any) => any;
    readonly jukeboxtrack: (obj?: any) => any;
    readonly macro: (obj?: any) => any;
    readonly page: (obj?: any) => any;
    readonly path: (obj?: any) => any;
    readonly player: (obj?: any) => any;
    readonly rollabletable: (obj?: any) => any;
    readonly text: (obj?: any) => any;
    readonly tableitem: (obj?: any) => any;
};
/**
 * Describes the shape of each type of Roll20Object.
 */
export declare type Roll20ObjectShapeTypeMap = {
    ability: {
        readonly _id: Id;
        readonly _type: 'ability';
        readonly _characterid: CharacterId;
        name: string;
        description: string;
        action: string;
        istokenaction: boolean;
    };
    attribute: {
        readonly _id: Id;
        readonly _type: 'attribute';
        readonly _characterid: CharacterId;
        name: string;
        current: string | number;
        max: string | number;
    };
    campaign: {
        readonly _type: 'campaign';
        readonly _id: Id;
        readonly _journalfolder: JSONString;
        readonly _jukeboxfolder: JSONString;
        turnorder: TurnOrder;
        initiativepage: PageId | false;
        playerpageid: PageId | false;
        playerspecificpages: Record<PlayerId, PageId>;
    };
    card: {
        readonly _type: 'card';
        readonly _id: Id;
        readonly _deckid: Id;
        name: string;
        avatar: string;
    };
    character: {
        readonly _id: CharacterId;
        readonly _type: 'character';
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
        readonly _type: 'custfx';
        name: string;
        definition: FXObject;
    };
    deck: {
        readonly _type: 'deck';
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
        cardsplayed: 'faceup' | 'facedown';
        defaultheight: string | number;
        defaultwidth: string | number;
        discardpilemode: 'none' | 'choosebacks' | 'choosefronts' | 'drawtop' | 'drawbottom';
        _discardPile: CommaDelimitedCards;
    };
    graphic: {
        readonly _type: 'graphic';
        readonly _subtype: 'token' | 'card';
        readonly _id: string;
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
        layer: Layer | '';
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
        aura1_radius: number | '';
        aura2_radius: number | '';
        aura1_color: HexColorString;
        aura2_color: HexColorString;
        aura1_square: boolean;
        aura2_square: boolean;
        tint_color: HexColorString | 'transparent';
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
        [key in StatusMarkerPseudoProperties]?: boolean | number | string | undefined;
    };
    hand: {
        readonly _id: Id;
        _parentid: PlayerId;
        readonly _type: 'hand';
        currentHand: CommaDelimitedCards;
        currentView: 'bydeck' | 'bycard';
    };
    handout: {
        readonly _id: Id;
        readonly _type: 'handout';
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
        readonly _type: 'jukeboxtrack';
        playing: boolean;
        softstop: boolean;
        title: string;
        volume: number;
        loop: boolean;
    };
    macro: {
        readonly _id: Id;
        readonly _type: 'macro';
        readonly _playerid: PlayerId;
        name: string;
        action: string;
        visibleto: CommaDelimitedPlayerIds;
        istokenaction: boolean;
    };
    page: {
        readonly _id: Id;
        readonly _type: 'page';
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
        grid_type: 'square' | 'hex' | 'hexr';
        scale_number: number;
        scale_units: 'ft' | string;
        gridlabels: boolean;
        diagonaltype: 'foure' | 'pythagorean' | 'threefive' | 'manhattan';
        archived: boolean;
        lightupdatedrop: boolean;
        lightenforcelos: boolean;
        lightrestrictmove: boolean;
        lightglobalillum: boolean;
    };
    path: {
        readonly _id: Id;
        readonly _type: 'path';
        readonly _pageid: PageId;
        _path: JSONString;
        fill: HexColorString | 'transparent';
        stroke: HexColorString | 'transparent';
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
        readonly _type: 'player';
        readonly _d20userid: Id;
        readonly _displayname: string;
        readonly _online: boolean;
        readonly _lastpage: PageId | '';
        readonly _macrobar: CommaDelimitedMacros;
        speakingas: Id | '';
        color: HexColorString;
        showmacrobar: boolean;
    };
    rollabletable: {
        readonly _id: Id;
        readonly _type: 'rollabletable';
        name: string;
        showplayers: boolean;
    };
    text: {
        readonly _id: Id;
        readonly _type: 'text';
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
        readonly _type: 'tableitem';
        readonly _rollabletableid: Id;
        avatar: string;
        name: string;
        weight: string;
    };
};
//# sourceMappingURL=shapes.d.ts.map