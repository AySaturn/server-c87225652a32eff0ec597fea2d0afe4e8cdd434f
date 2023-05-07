import { Channel, emitEvent, Member, TypingStartEvent } from "@fosscord/util";
import { route } from "@fosscord/api";
import { Router, Request, Response } from "express";

const router: Router = Router();

router.post("/", route({ permission: "SEND_MESSAGES" }), async (req: Request, res: Response) => {
	const { channel_id } = req.params;
	const user_id = req.user_id;
	const timestamp = Date.now();
	const channel = await Channel.findOneOrFail({ id: channel_id });
	const member = await Member.findOne({ where: { id: user_id, guild_id: channel.guild_id }, relations: ["roles", "user"] });

	await emitEvent({
		event: "TYPING_START",
		channel_id: channel_id,
		data: {
			...(member ? { member: { ...member, roles: member?.roles?.map((x) => x.id) } } : null),
			channel_id,
			timestamp,
			user_id,
			guild_id: channel.guild_id
		}
	} as TypingStartEvent);

	res.sendStatus(204);
});

export default router;
