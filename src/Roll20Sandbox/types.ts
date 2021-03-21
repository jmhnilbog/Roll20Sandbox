import { Roll20ObjectShapeTypeMap } from '../Roll20Object'
import { Id, PlayerId, Roll20ObjectType } from '../Roll20Object/types'

export type Roll20ChangeSubEvents = {
    [K in Roll20ObjectType]: Permuted<K, keyof Roll20ObjectShapeTypeMap[K], ':'>
}
export type Roll20ChangeEvent =
    | Permuted<
          'change',
          Roll20ChangeSubEvents[keyof Roll20ChangeSubEvents],
          ':'
      >
    | Permuted<'change', Roll20ObjectType, ':'>
    | 'change'
export type Roll20AddEvent = Permuted<'add', Roll20ObjectType, ':'> | 'add'
export type Roll20EventName =
    | 'ready'
    | Roll20ChangeEvent
    | Roll20AddEvent
    | 'destroy'
    | 'chat:message'
    | 'sheetWorkerCompleted'

export type ChatMessage = {
    who: string
    playerid?: PlayerId
    type:
        | 'general'
        | 'rollresult'
        | 'gmrollresult'
        | 'emote'
        | 'whisper'
        | 'desc'
        | 'api'
    content: string
    origRoll?: string
    inlinerolls?: string[]
    rolltemplate?: string
    target?: Id
    target_name: string
    selected: any[]
}

/**
 * "Normal" spawn fx types.
 */
export type SpawnFXType =
    | 'bomb'
    | 'bubbling'
    | 'burn'
    | 'burst'
    | 'explode'
    | 'glow'
    | 'missle'
    | 'nova'
/**
 * Types of fx that work between points.
 */
export type SpawnFXBetweenType = SpawnFXType | 'beam' | 'breath' | 'splatter'
/**
 * Colors of fx.
 */
export type SpawnFxColor =
    | 'acid'
    | 'blood'
    | 'charm'
    | 'death'
    | 'fire'
    | 'frost'
    | 'holy'
    | 'magic'
    | 'slime'
    | 'smoke'
    | 'water'
export type FxBetweenNames = Permuted<SpawnFXBetweenType, SpawnFxColor>
export type FxNames = Permuted<SpawnFXType, SpawnFxColor>

export type Coord2D = {
    x: number
    y: number
}