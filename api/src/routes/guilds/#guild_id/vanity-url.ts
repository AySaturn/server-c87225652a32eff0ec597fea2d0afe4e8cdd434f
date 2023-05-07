import { Channel, ChannelType, getPermission, Guild, Invite, trimSpecial } from "@fosscord/util";
import { Router, Request, Response } from "express";
import { route } from "@fosscord/api";
import { HTTPError } from "lambert-server";

const router = Router();

const InviteRegex = /\W/g;

router.get("/", route({ permission: "MANAGE_GUILD" }), async (req: Request, res: Response) => {
	const { guild_id } = req.params;
	const guild = await Guild.findOneOrFail({ id: guild_id });

	if (!guild.features.includes("ALIASABLE_NAMES")) {
		const invite = await Invite.findOne({ where: { guild_id: guild_id, vanity_url: true } });
		if (!invite) return res.json({ code: null });

		return res.json({ code: invite.code, uses: invite.uses });
	} else {
		const invite = await Invite.find({ where: { guild_id: guild_id, vanity_url: true } });
		if (!invite || invite.length == 0) return res.json({ code: null });

		return res.json(invite.map((x) => ({ code: x.code, uses: x.uses })));
	}
});

export interface VanityUrlSchema {
	/**
	 * @minLength 1
	 * @maxLength 20
	 */
	code?: string;
}

router.patch("/", route({ body: "VanityUrlSchema", permission: "MANAGE_GUILD" }), async (req: Request, res: Response) => {
	const { guild_id } = req.params;
	const body = req.body as VanityUrlSchema;
	const code = body.code?.replace(InviteRegex, "");

	const guild = await Guild.findOneOrFail({ id: guild_id });
	if (!guild.features.includes("VANITY_URL")) throw new HTTPError("Your guild doesn't support vanity urls");

	if (!code || code.length === 0) throw new HTTPError("Code cannot be null or empty");

	const invite = await Invite.findOne({ code });
	if (invite) throw new HTTPError("Invite already exists");

	const { id } = await Channel.findOneOrFail({ guild_id, type: ChannelType.GUILD_TEXT });

	await new Invite({
		vanity_url: true,
		code: code,
		temporary: false,
		uses: 0,
		max_uses: 0,
		max_age: 0,
		created_at: new Date(),
		expires_at: new Date(),
		guild_id: guild_id,
		channel_id: id
	}).save();

	return res.json({ code: code });
});

export default router;
