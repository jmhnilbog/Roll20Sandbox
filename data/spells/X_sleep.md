// bad cast results
!import-table --%%SPELL-RESULT-1%%-sleep --show
!import-table-item --%%SPELL-RESULT-1%%-sleep ---100^Corruption and Misfire! --1 --
!import-table-item --%%SPELL-RESULT-1%%-sleep --1^Corruption. --1 --
!import-table-item --%%SPELL-RESULT-1%%-sleep --2^Misfire. --1 --

// misfire results
!import-table --%%SPELL-MISFIRE%%-sleep --show
!import-table-item --%%SPELL-MISFIRE%%-sleep --Caster immediately falls in natural sleep. --1 --
!import-table-item --%%SPELL-MISFIRE%%-sleep --Caster and <%%91%%><%%91%%>1d4<%%93%%><%%93%%> closest allies immediately fall into natural sleep!--1 --
!import-table-item --%%SPELL-MISFIRE%%-sleep --Caster slips into a coma, requiring medical or magical attention to awaken. --1 --
!import-table-item --%%SPELL-MISFIRE%%-sleep --Caster jolts all creatures within 50' to alertness, cancelling sleep, hallucinations, etc. --1 --

// manifestations

// corruption

// spell results
!import-table --%%SPELL%%-sleep --show
!import-table-item --%%SPELL%%-sleep ---100^Lost! Failure! Worse! --1 --
!import-table-item --%%SPELL%%-sleep --general|The caster lulls the target into a deep, sound sleep. --1 --
!import-table-item --%%SPELL%%-sleep --2^Lost! Failure! --1 --
!import-table-item --%%SPELL%%-sleep --12^One target within 60' must make its Will save or fall asleep for <%%91%%><%%91%%>1d6<%%93%%><%%93%%> turns. Target can be awakened through normal means. When casting the spell, the caster must specify an interrupt condition which automatical- ly awakens the target. For example, being kissed by a prince, smelling the fragrance of a rose, or hearing a clock strike midnight. The caster must possess material components related to the interrupt condition. --1 --
!import-table-item --%%SPELL%%-sleep --14^Up to two targets within 60' must make a Will save or fall asleep for <%%91%%><%%91%%>1d6<%%93%%><%%93%%> turns. Targets can be awakened through normal means. When casting the spell, the caster must specify an interrupt condition which automatical- ly awakens the target. For example, being kissed by a prince, smelling the fragrance of a rose, or hearing a clock strike midnight. The caster must possess material components related to the interrupt condition. --1 --
!import-table-item --%%SPELL%%-sleep --18^Up to three targets within 60' must make a Will save or fall asleep for <%%91%%><%%91%%>1d4<%%93%%><%%93%%> hours. Targets can be awakened through normal means. When casting the spell, the caster must specify an interrupt condition which automatical- ly awakens the target. For example, being kissed by a prince, smelling the fragrance of a rose, or hearing a clock strike midnight. The caster must possess material components related to the interrupt condition. --1 --
!import-table-item --%%SPELL%%-sleep --20^Up to four targets must make a Will save or fall into a normal sleep for <%%91%%><%%91%%>1d6<%%93%%><%%93%%> hours, or one target can be placed in a supernatural sleep for (<%%91%%><%%91%%>1d4<%%93%%><%%93%%> hours. While normal sleep can be interrupted by normal means, the supernatural sleep can be disrupted only via dispel magic or similar cancellation effects. However, both normal and supernatural sleep must have a specified interrupt condition which automatically awakens the target. For example, being kissed by a prince, smelling the fragrance of a rose, or hearing a clock strike midnight. The caster must possess material components related to the interrupt condition. --1 --

// easy to parser

# Sleep [Wiz:1][duration:?][range:60'?][time:1 action][save: Will DC SC?]

The caster lulls a target into a deep, sound sleep. In some cases, the sleep is of a supernatural kind. The caster must usually supply a condition upon which the spell will be cancelled, such as receiving a kiss from a prince.

## Manifestation

-   ray of shimmering dust
-   swan's wings rise from the earth to enfold the target
-   soft white clouds engulf target's head
-   waves of blue light

## Corruption

-   caster acquires persistent insomnia which manifests as -1 to all rolls after attempting to rest, -2 after a week, -3 after a month.
-   caster emits a noxious odor causing heads to turn within 20'
-   MINOR
-   MINOR
-   MAJOR
-   MAJOR

## Results::1 [type: ranked]

-   -100 - [Corruption] _and_ [Misfire]
-   1 - [Corruption]
-   2 - [Misfire]

## Results [type:ranked]

-   1 - Lost, Failure, and worse! [Results::1[1d6+LUCK]]
-   2 - Lost, failure.
-   12 - **One target** within range must save or fall asleep for **([[1d6]]) turns**. Target can be awakened through normal means. When casting the spell, the caster must specify an interrupt condition which automatical- ly awakens the target. For example, being kissed by a prince, smelling the fragrance of a rose, or hearing a clock strike midnight. The caster must possess material components related to the interrupt condition.
-   14 - Up to **two targets** within range must save or fall asleep for **([[1d6]]) turns**. Targets can be awakened through normal means. When casting the spell, the caster must specify an interrupt condition which automatically awakens the targets. For example, being kissed by a prince, smelling the fragrance of a rose, or hearing a clock strike midnight. The caster must possess material components related to the interrupt condition.
-   18 - Up to **three targets** within range must save or fall asleep for **([[1d4]]) hours**. Targets can be awakened through normal means. When casting the spell, the caster must specify an interrupt condition which automatically awakens the targets. For example, being kissed by a prince, smelling the fragrance of a rose, or hearing a clock strike midnight. The caster must possess material components related to the interrupt condition.
-   20 - Up to **four targets** within range must save or fall into a **normal sleep for ([[1d6]]) hours**, _or_ **one target** within range must save or fall into **supernatural sleep for ([[1d4]]) hours**. Supernatural sleep requires magical interventon to interrupt. When casting the spell, the caster must specify an interrupt condition which automatically awakens the targets. For example, being kissed by a prince, smelling the fragrance of a rose, or hearing a clock strike midnight. The caster must possess material components related to the interrupt condition.
-   24 - Up to **eight targets** within range must save or fall into a **normal sleep for ([[1d7]]) days**, _or_ **one target** within range falls into **supernatural sleep for ([[1d3]]) days without a save**. Supernatural sleep requires magical interventon to interrupt. When casting the spell, the caster must specify an interrupt condition which automatically awakens the targets. For example, being kissed by a prince, smelling the fragrance of a rose, or hearing a clock strike midnight. The caster must possess material components related to the interrupt condition.
-   28 - **Within 200'**, the caster can place **one target into supernatural, endless sleep without a saving throw** _or_ cause a group of up to **sixteen targets to fall into natural sleep**. The natural sleep ends normally, but the supernatural sleep may only be interrupted by a condition specified by the caster.
-   30 - Up to two targets within 60' must make a Will save or fall asleep for <%%91%%><%%91%%>1d6<%%93%%><%%93%%> turns. Targets can be awakened through normal means. When casting the spell, the caster must specify an interrupt condition which automatically awakens the target. For example, being kissed by a prince, smelling the fragrance of a rose, or hearing a clock strike midnight. The caster must possess material components related to the interrupt condition.
-   32 Natural slumber to all things. **NO SAVE** for creatures with 4 or fewer HD.

# Spell Result

sleep

!import-table --%%SPELL-RESULT-1%%-sleep --show
!import-table-item --%%SPELL-RESULT-1%%-sleep ---100^Corruption and Misfire! --1 --
!import-table-item --%%SPELL-RESULT-1%%-sleep --1^Corruption. --1 --
!import-table-item --%%SPELL-RESULT-1%-sleep --2^Misfire. --1 --

// as markdown?

# Sleep

Wiz1 range:? duration:? time:1action save:WillDC(SC)
The caster lulls a target into a deep, sound sleep.

## Manifestation

-   ray of shimmering dust
-   swan's wings rise from the earth to enfold the target
-   soft white clouds engulf target's head
-   waves of blue light

## Corruption

-   caster acquires persistent insomnia which manifests as -1 to all rolls after attempting to rest, -2 after a week, -3 after a month.
-   caster emits a noxious odor causing heads to turn within 20'
-   MINOR
-   MINOR
-   MAJOR
-   MAJOR

## Misfire

-   caster immediately falls into natural sleep
-   caster and (r[[1d4]]) closest allies immediately fall into natural sleep
-   caster immediately falls into coma, requiring medical or magical aid to awaken
-   caster jolts all creatures within 50' into total alertness, cancelling all sleep, dazes, hallucinations.

## Results

-   1 - Lost, Failure, and worse! [ranked syntax for 1d6+LUCK on bad-cast-results, nested rolls]
-   2 - Lost, failure.
-   12 - One target within range must save or fall asleep for ([[1d6]]) turns. Target can be awakened through normal means. When casting the spell, the caster must specify an interrupt condition which automatical- ly awakens the target. For example, being kissed by a prince, smelling the fragrance of a rose, or hearing a clock strike midnight. The caster must possess material components related to the interrupt condition. **Targets:1** **Range:60'** **Duration:10-60minutes** **Note:Natural Sleep**
-   14 - Up to two targets within range must save or fall asleep for ([[1d6]]) turns. Targets can be awakened through normal means. When casting the spell, the caster must specify an interrupt condition which automatically awakens the targets. For example, being kissed by a prince, smelling the fragrance of a rose, or hearing a clock strike midnight. The caster must possess material components related to the interrupt condition. **Targets:2** **Range:60'** **Duration:10-60minutes** **Note:Natural Sleep**
-   18 - Up to three targets within range must save or fall asleep for ([[1d4]]) hours. Targets can be awakened through normal means. When casting the spell, the caster must specify an interrupt condition which automatically awakens the targets. For example, being kissed by a prince, smelling the fragrance of a rose, or hearing a clock strike midnight. The caster must possess material components related to the interrupt condition. **Targets:3** **Range:60'** **Duration:1-4hours** **Note:Natural Sleep**
-   20 - Up to four targets within range must save or fall into a normal sleep for ([[1d6]]) hours, _or_ one target within range must save or fall into supernatural sleep for ([[1d4]]) hours. Supernatural sleep requires magical interventon to interrupt. When casting the spell, the caster must specify an interrupt condition which automatically awakens the targets. For example, being kissed by a prince, smelling the fragrance of a rose, or hearing a clock strike midnight. The caster must possess material components related to the interrupt condition. **Targets:4|1** **Range:60'** **Duration:1-6hours|1-4hours** **Note:Natural Sleep|Supernatural Sleep**
-   24 - Up to eight targets within range must save or fall into a normal sleep for ([[1d7]]) days, _or_ one target within range falls into supernatural sleep for ([[1d3]]) days without a save. Supernatural sleep requires magical interventon to interrupt. When casting the spell, the caster must specify an interrupt condition which automatically awakens the targets. For example, being kissed by a prince, smelling the fragrance of a rose, or hearing a clock strike midnight. The caster must possess material components related to the interrupt condition. **Targets:7|1** **Range:60'** **Duration:1-7days|1-3days** **Save:WillDC(SC)|None** **Note:Natural Sleep|Supernatural Sleep**
-   28 - Within 200', the caster can place one target into supernatural sleep, ongoing, endless sleep without a saving throw _or_ cause a group of up to sixteen targets to fall into natural sleep. The natural sleep ends normally, but the supernatural sleep may only be interrupted by a condition specified by the caster. **Targets:16|1** **Range:200'** **Duration:1-7days|1-3days** **Save:WillDC(SC)|None** **Note:Natural Sleep|Supernatural Sleep**
-   30 Up to two targets within 60' must make a Will save or fall asleep for <%%91%%><%%91%%>1d6<%%93%%><%%93%%> turns. Targets can be awakened through normal means. When casting the spell, the caster must specify an interrupt condition which automatical- ly awakens the target. For example, being kissed by a prince, smelling the fragrance of a rose, or hearing a clock strike midnight. The caster must possess material components related to the interrupt condition.
-   32 Natural slumber to all things. **NO SAVE** for creatures with 4 or fewer HD.
