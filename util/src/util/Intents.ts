import { BitField } from "./BitField";

export class Intents extends BitField {
	static FLAGS = {
		GUILDS: BigInt(1) << BigInt(0), // guilds and guild merge-split events affecting the user
		GUILD_MEMBERS: BigInt(1) << BigInt(1), // memberships
		GUILD_BANS: BigInt(1) << BigInt(2), // bans and ban lists
		GUILD_EMOJIS: BigInt(1) << BigInt(3), // custom emojis
		GUILD_INTEGRATIONS: BigInt(1) << BigInt(4), // applications
		GUILD_WEBHOOKS: BigInt(1) << BigInt(5), // webhooks
		GUILD_INVITES: BigInt(1) << BigInt(6), // mass invites (no user can receive user specific invites of another user)
		GUILD_VOICE_STATES: BigInt(1) << BigInt(7), // voice updates
		GUILD_PRESENCES: BigInt(1) << BigInt(8), // presence updates
		GUILD_MESSAGES_METADATA: BigInt(1) << BigInt(9), // guild message metadata
		GUILD_MESSAGE_REACTIONS: BigInt(1) << BigInt(10), // guild message reactions
		GUILD_MESSAGE_TYPING: BigInt(1) << BigInt(11), // guild channel typing notifications
		DIRECT_MESSAGES: BigInt(1) << BigInt(12), // DM or orphan channels
		DIRECT_MESSAGE_REACTIONS: BigInt(1) << BigInt(13), // DM or orphan channel message reactions
		DIRECT_MESSAGE_TYPING: BigInt(1) << BigInt(14), // DM typing notifications
		GUILD_MESSAGES_CONTENT: BigInt(1) << BigInt(15), // guild message content
		GUILD_POLICIES: BigInt(1) << BigInt(20), // guild policies
		GUILD_POLICY_EXECUTION: BigInt(1) << BigInt(21), // guild policy execution
		LIVE_MESSAGE_COMPOSITION: BigInt(1) << BigInt(32), // allow composing messages using the gateway
		GUILD_ROUTES: BigInt(1) << BigInt(41), // message routes affecting the guild
		DIRECT_MESSAGES_THREADS: BigInt(1) << BigInt(42),  // direct message threads
		JUMBO_EVENTS: BigInt(1) << BigInt(43), // jumbo events (size limits to be defined later)
		LOBBIES: BigInt(1) << BigInt(44), // lobbies
		INSTANCE_ROUTES: BigInt(1) << BigInt(60), // all message route changes 
		INSTANCE_GUILD_CHANGES: BigInt(1) << BigInt(61), // all guild create, guild object patch, split, merge and delete events
		INSTANCE_POLICY_UPDATES: BigInt(1) << BigInt(62), // all instance policy updates
		INSTANCE_USER_UPDATES: BigInt(1) << BigInt(63) // all instance user updates
	};
}

