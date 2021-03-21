import {
    Roll20ObjectType,
    FontFamily,
    CommaDelimitedPlayerIds,
    CommaDelimitedCards,
    CommaDelimitedCoordinates,
    CommaDelimitedIds,
    CommaDelimitedMacros,
    CommaDelimitedStatusMarkers,
    HexColorString,
    JSONArray,
    Layer,
    RBGColorString,
    FXObject,
    StatusMarkerPseudoProperties,
    CharacterId,
    Id,
    JSONString,
    PageId,
    PlayerId,
    TurnOrder,
    CustomFXDefinition,
} from './types'

/**
 * Returns a hash of Roll20Object _types to functions "filling in" default values for each.
 */
export const getShapeDefaults = ({
    idGenerator,
}: {
    idGenerator: () => Id
}) => {
    return {
        ability: (obj: any = {}) => ({
            _id: idGenerator(),
            _characterid: '' as CharacterId,
            name: '',
            description: '',
            action: '',
            istokenaction: false,
            ...obj,
            _type: 'ability',
        }),
        attribute: (obj: any = {}) => ({
            _id: idGenerator(),
            _characterid: '' as CharacterId,
            name: '',
            current: '',
            max: '',
            ...obj,
            _type: 'attribute',
        }),
        campaign: (obj: any = {}) => ({
            _id: 'root' as Id,
            turnorder: '' as TurnOrder,
            initiativepage: false,
            playerpageid: false,
            playerspecificpages: false,
            _journalfolder: '' as JSONString,
            _jukeboxfolder: '' as JSONString,
            ...obj,
            _type: 'campaign',
        }),
        card: (obj: any = {}) => ({
            _id: idGenerator(),
            name: '',
            avatar: '',
            _deckid: '' as Id,
            ...obj,
            _type: 'card',
        }),
        character: (obj: any = {}) => ({
            _id: idGenerator() as CharacterId,
            name: '',
            avatar: '',
            bio: '',
            gmnotes: '',
            archived: false,
            inplayerjournals: '' as CommaDelimitedPlayerIds,
            controlledby: '' as CommaDelimitedPlayerIds,
            _defaulttoken: '',
            ...obj,
            _type: 'character',
        }),
        custfx: (obj: any = {}) => ({
            _id: idGenerator(),
            name: '',
            definition: {} as CustomFXDefinition,
            ...obj,
            _type: 'custfx',
        }),
        deck: (obj: any = {}) => ({
            _id: idGenerator(),
            name: '',
            _currentDeck: '' as CommaDelimitedCards,
            _currentIndex: -1,
            _currentCardShown: true,
            showplayers: true,
            playerscandraw: true,
            avatar: '',
            shown: false,
            players_seenumcards: true,
            players_seefrontofcards: false,
            gm_seenumcards: true,
            gm_seefrontofcards: false,
            infinitecards: false,
            _cardSequencer: -1,
            cardsplayed: 'faceup',
            defaultheight: '',
            defaultwidth: '',
            discardpilemode: 'none',
            _discardPile: '' as CommaDelimitedCards,
            ...obj,
            _type: 'deck',
        }),
        graphic: (obj: any = {}) => ({
            _id: idGenerator(),
            _subtype: 'token',
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            rotation: 0,
            layer: '',
            isdrawing: false,
            flipv: false,
            fliph: false,
            name: '',
            gmnotes: '',
            controlledby: '' as CommaDelimitedPlayerIds,
            bar1_value: '',
            bar2_value: '',
            bar3_value: '',
            bar1_max: '',
            bar2_max: '',
            bar3_max: '',
            aura1_radius: '',
            aura2_radius: '',
            aura1_color: '#FFFF99' as HexColorString,
            aura2_color: '#59E594' as HexColorString,
            aura1_square: false,
            aura2_square: false,
            tint_color: 'transparent',
            statusmarkers: '' as CommaDelimitedStatusMarkers,
            token_markers: '' as JSONArray,
            showname: false,
            showplayers_name: false,
            showplayers_bar1: false,
            showplayers_bar2: false,
            showplayers_bar3: false,
            showplayers_aura1: false,
            showplayers_aura2: false,
            playersedit_name: true,
            playersedit_bar1: true,
            playersedit_bar2: true,
            playersedit_bar3: true,
            playersedit_aura1: true,
            playersedit_aura2: true,
            light_radius: '',
            light_dimradius: '',
            light_otherplayers: false,
            light_hassight: false,
            light_angle: '360',
            light_losangle: '360',
            lastmove: '' as CommaDelimitedCoordinates,
            light_multiplier: '1',
            imgsrc: '',
            _pageid: idGenerator() as PageId,
            adv_fow_view_distance: '',
            ...obj,
            _type: 'graphic',
        }),
        hand: (obj: any = {}) => ({
            _id: idGenerator(),
            ...obj,
            _parentid: '' as PlayerId,
            currentView: 'bydeck',
            currentHand: '' as CommaDelimitedCards,
            _type: 'hand',
        }),
        handout: (obj: any = {}) => ({
            _id: idGenerator(),
            avatar: '',
            name: 'Mysterious Note',
            notes: '',
            gmnotes: '',
            inplayerjournals: '' as CommaDelimitedPlayerIds,
            archived: false,
            controlledby: '' as CommaDelimitedPlayerIds,
            ...obj,
            _type: 'handout',
        }),
        jukeboxtrack: (obj: any = {}) => ({
            _id: idGenerator(),
            playing: false,
            softstop: false,
            title: '',
            volume: 30,
            loop: false,
            ...obj,
            _type: 'jukeboxtrack',
        }),
        macro: (obj: any = {}) => ({
            _id: idGenerator(),
            _playerid: '' as PlayerId,
            name: '',
            action: '',
            visibleto: '' as CommaDelimitedPlayerIds,
            istokenaction: false,
            ...obj,
            _type: 'macro',
        }),
        page: (obj: any = {}) => ({
            _id: idGenerator(),
            _zorder: '' as CommaDelimitedIds,
            name: '',
            showgrid: true,
            showdarkness: false,
            showlighting: false,
            width: 25,
            height: 25,
            snapping_increment: 1,
            grid_opacity: 0.5,
            fog_opacity: 0.35,
            background_color: '#FFFFFF' as HexColorString,
            gridcolor: '#C0C0C0' as HexColorString,
            grid_type: 'square',
            scale_number: 5,
            scale_units: 'ft',
            gridlabels: false,
            diagonaltype: 'foure',
            archived: false,
            lightupdatedrop: false,
            lightenforcelos: false,
            lightrestrictmove: false,
            lightglobalillum: false,
            ...obj,
            _type: 'page',
        }),
        path: (obj: any = {}) => ({
            _id: idGenerator(),
            _pageid: idGenerator() as PageId,
            _path: '' as JSONString,
            fill: 'transparent',
            stroke: '#000000' as HexColorString,
            rotation: 0,
            layer: '' as Layer,
            stroke_width: 5,
            width: 0,
            height: 0,
            top: 0,
            left: 0,
            scaleX: 1,
            scaleY: 1,
            controlledby: '' as CommaDelimitedPlayerIds,
            ...obj,
            _type: 'path',
        }),
        player: (obj: any = {}) => ({
            _id: idGenerator() as PlayerId,
            _d20userid: idGenerator(),
            _displayname: '',
            _online: false,
            _lastpage: '',
            _macrobar: '' as CommaDelimitedMacros,
            speakingas: '',
            color: '#13B9F0' as HexColorString,
            showmacrobar: false,
            ...obj,
            _type: 'player',
        }),
        rollabletable: (obj: any = {}) => ({
            _id: idGenerator(),
            name: 'new-table',
            showplayers: true,
            ...obj,
            _type: 'rollabletable',
        }),
        text: (obj: any = {}) => ({
            _id: idGenerator(),
            _pageid: idGenerator() as PageId,
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            text: '',
            font_size: 16,
            rotation: 0,
            color: 'rgb(0, 0, 0)' as RBGColorString,
            font_family: 'Arial',
            layer: '' as Layer,
            controlledby: '' as CommaDelimitedPlayerIds,
            ...obj,
            _type: 'text',
        }),
        tableitem: (obj: any = {}) => ({
            _id: idGenerator(),
            _rollabletableid: '' as Id,
            name: 'new-table',
            avatar: '',
            weight: '1',
            ...obj,
            _type: 'tableitem',
        }),
    } as const
    // } as {
    //     [K in Roll20ObjectType]: (obj?: object) => Roll20ObjectShapeTypeMap[K]
    // }
}

/**
 * Describes the shape of each type of Roll20Object.
 */
export type Roll20ObjectShapeTypeMap = {
    ability: {
        readonly _id: Id
        readonly _type: 'ability'
        readonly _characterid: CharacterId
        name: string
        description: string
        action: string
        istokenaction: boolean
    }
    attribute: {
        readonly _id: Id
        readonly _type: 'attribute'
        readonly _characterid: CharacterId
        name: string
        current: string | number
        max: string | number
    }
    campaign: {
        readonly _type: 'campaign'
        readonly _id: Id
        readonly _journalfolder: JSONString
        readonly _jukeboxfolder: JSONString
        turnorder: TurnOrder
        initiativepage: PageId | false
        playerpageid: PageId | false
        playerspecificpages: Record<PlayerId, PageId>
    }
    card: {
        readonly _type: 'card'
        readonly _id: Id
        readonly _deckid: Id
        name: string
        avatar: string
    }
    character: {
        readonly _id: CharacterId
        readonly _type: 'character'
        avatar: string
        name: string
        bio: string
        gmnotes: string
        archived: boolean
        inplayerjournals: CommaDelimitedPlayerIds
        controlledby: CommaDelimitedPlayerIds
        readonly _defaulttoken: string
    }
    custfx: {
        readonly _id: Id
        readonly _type: 'custfx'
        name: string
        definition: FXObject
    }
    deck: {
        readonly _type: 'deck'
        readonly _id: Id
        name: string
        _currentDeck: CommaDelimitedCards
        _currentIndex: number
        _currentCardShown: boolean
        showplayers: boolean
        playerscandraw: boolean
        avatar: string
        shown: boolean
        players_seenumcards: boolean
        players_seefrontofcards: boolean
        gm_seenumcards: boolean
        gm_seefrontofcards: boolean
        infinitecards: boolean
        _cardSequencer: number
        cardsplayed: 'faceup' | 'facedown'
        defaultheight: string | number
        defaultwidth: string | number
        discardpilemode:
            | 'none'
            | 'choosebacks'
            | 'choosefronts'
            | 'drawtop'
            | 'drawbottom'
        _discardPile: CommaDelimitedCards
    }
    graphic: {
        readonly _type: 'graphic'
        readonly _subtype: 'token' | 'card'
        readonly _id: string
        readonly _pageid?: PageId
        readonly _cardid?: Id
        imgsrc?: string
        bar1_link?: Id
        bar2_link?: Id
        bar3_link?: Id
        represents?: Id
        left: number
        top: number
        width: number
        height: number
        rotation: number
        layer: Layer | ''
        isdrawing: boolean
        flipv: boolean
        fliph: boolean
        name: string
        gmnotes: string
        controlledby: CommaDelimitedPlayerIds
        bar1_value: number | string
        bar2_value: number | string
        bar3_value: number | string
        bar1_max: number | string
        bar2_max: number | string
        bar3_max: number | string
        aura1_radius: number | ''
        aura2_radius: number | ''
        aura1_color: HexColorString
        aura2_color: HexColorString
        aura1_square: boolean
        aura2_square: boolean
        tint_color: HexColorString | 'transparent'
        statusmarkers: CommaDelimitedStatusMarkers
        token_markers: JSONArray
        showname: boolean
        showplayers_name: boolean
        showplayers_bar1: boolean
        showplayers_bar2: boolean
        showplayers_bar3: boolean
        showplayers_aura1: boolean
        showplayers_aura2: boolean
        playersedit_name: boolean
        playersedit_bar1: boolean
        playersedit_bar2: boolean
        playersedit_bar3: boolean
        playersedit_aura1: boolean
        playersedit_aura2: boolean
        light_radius: number | string
        light_dimradius: number | string
        light_otherplayers: boolean
        light_hassight: boolean
        light_angle: string
        light_losangle: string
        lastmove: CommaDelimitedCoordinates
        light_multiplier: number | string
        adv_fow_view_distance: number | string
    } & {
        [key in StatusMarkerPseudoProperties]?:
            | boolean
            | number
            | string
            | undefined
    }
    hand: {
        readonly _id: Id
        _parentid: PlayerId
        readonly _type: 'hand'
        currentHand: CommaDelimitedCards
        currentView: 'bydeck' | 'bycard'
    }
    handout: {
        readonly _id: Id
        readonly _type: 'handout'
        avatar: string
        name: string
        notes: string
        gmnotes: string
        inplayerjournals: CommaDelimitedPlayerIds
        archived: boolean
        controlledby: CommaDelimitedPlayerIds
    }
    jukeboxtrack: {
        readonly _id: Id
        readonly _type: 'jukeboxtrack'
        playing: boolean
        softstop: boolean
        title: string
        volume: number
        loop: boolean
    }
    macro: {
        readonly _id: Id
        readonly _type: 'macro'
        readonly _playerid: PlayerId

        name: string
        action: string
        visibleto: CommaDelimitedPlayerIds
        istokenaction: boolean
    }
    page: {
        readonly _id: Id
        readonly _type: 'page'
        readonly _zorder: CommaDelimitedIds
        name: string
        showgrid: boolean
        showdarkness: boolean
        showlighting: boolean
        width: number
        height: number
        snapping_increment: number
        grid_opacity: number
        fog_opacity: number
        background_color: HexColorString
        gridcolor: HexColorString
        grid_type: 'square' | 'hex' | 'hexr'
        scale_number: number
        scale_units: 'ft' | string
        gridlabels: boolean
        diagonaltype: 'foure' | 'pythagorean' | 'threefive' | 'manhattan'
        archived: boolean
        lightupdatedrop: boolean
        lightenforcelos: boolean
        lightrestrictmove: boolean
        lightglobalillum: boolean
    }
    path: {
        readonly _id: Id
        readonly _type: 'path'
        readonly _pageid: PageId
        _path: JSONString
        fill: HexColorString | 'transparent'
        stroke: HexColorString | 'transparent'
        rotation: number
        layer: Layer
        stroke_width: number
        width: number
        height: number
        top: number
        left: number
        scaleX: number
        scaleY: number
        controlledby: CommaDelimitedPlayerIds
    }
    player: {
        readonly _id: PlayerId
        readonly _type: 'player'
        readonly _d20userid: Id
        readonly _displayname: string
        readonly _online: boolean
        readonly _lastpage: PageId | ''
        readonly _macrobar: CommaDelimitedMacros
        speakingas: Id | ''
        color: HexColorString
        showmacrobar: boolean
    }
    rollabletable: {
        readonly _id: Id
        readonly _type: 'rollabletable'
        name: string
        showplayers: boolean
    }
    text: {
        readonly _id: Id
        readonly _type: 'text'
        readonly _pageid: PageId
        top: number
        left: number
        width: number
        height: number
        text: string
        font_size: number
        rotation: number
        color: RBGColorString
        font_family: FontFamily
        layer: Layer
        controlledby: CommaDelimitedPlayerIds
    }
    tableitem: {
        readonly _id: Id
        readonly _type: 'tableitem'
        readonly _rollabletableid: Id
        avatar: string
        name: string
        weight: string
    }
}
