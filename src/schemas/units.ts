import {z, ZodType} from "zod"
import {Abilities, ModelAdvantage, Faction, Feat, Option, Points, Statistics, Weapons} from "./primitives"

const Record = z.object({}).strict()

export const BaseUnit = Record.extend({
	abilities: Abilities,
	advantages: z.array(ModelAdvantage),
	baseSize: z.number().positive(),
	faction: Faction,
	fieldAllowance: z.union([z.number().positive(), z.literal('c')]),
	keywords: z.array(z.string()),
	name: z.string(),
	statistics: Statistics,
	type: z.enum(["attachment", "battleEngine", "solo", "structure", "unit", "warbeast", "warcaster", "warjack", "warlock"]),
})

export const Warcaster = BaseUnit.extend({
	feat: Feat,
	rackSlots: z.number().positive(),
	spells: z.array(z.string()),
	weapons: Weapons
})

export const Solo = BaseUnit.extend({
	points: Points,
	weapons: Weapons
})

export const Unit = BaseUnit.extend({
	grunts: z.number().positive(),
	points: Points,
	weapons: Weapons
})

export const Warjack = BaseUnit.extend({
	damageGrid: z.array(z.number()).length(6),
	options: z.record(z.string(), z.record(z.string(), Option)),
})

export const Attachment = BaseUnit.extend({
	points: Points,
	weapons: Weapons
})

/**
 * A simple method to return the appropriate schema based on the data record provided.
 */
export const unitSchema = (record: { type: string }): ZodType => {
	switch (record.type) {
		case 'attachment':
			return Attachment
		case 'solo':
			return Solo
		case 'unit':
			return Unit
		case 'warcaster':
			return Warcaster
		case 'warjack':
			return Warjack
	}
	
	throw new Error(`Invalid unit type ${record.type}`)
}
