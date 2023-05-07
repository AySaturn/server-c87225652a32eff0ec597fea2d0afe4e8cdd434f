import { Guild, Config } from "@fosscord/util";

import { Router, Request, Response } from "express";
import { route } from "@fosscord/api";

const router = Router();

router.get("/", route({}), async (req: Request, res: Response) => {
	const { offset, limit, categories } = req.query;
	var showAllGuilds = Config.get().guild.discovery.showAllGuilds;
	var configLimit = Config.get().guild.discovery.limit;
	// ! this only works using SQL querys
	// TODO: implement this with default typeorm query
	// const guilds = await Guild.find({ where: { features: "DISCOVERABLE" } }); //, take: Math.abs(Number(limit)) });
	let guilds;
	if (categories == undefined) {
		guilds = showAllGuilds
			? await Guild.find({ take: Math.abs(Number(limit || configLimit)) })
			: await Guild.find({ where: `"features" LIKE '%DISCOVERABLE%'`, take: Math.abs(Number(limit || configLimit)) });
	} else {
		guilds = showAllGuilds
				? await Guild.find({ where: `"primary_category_id" = ${categories}`, take: Math.abs(Number(limit || configLimit)) })
				: await Guild.find({
						where: `"primary_category_id" = ${categories} AND "features" LIKE '%DISCOVERABLE%'`,
						take: Math.abs(Number(limit || configLimit))
				  });
	}

	const total = guilds ? guilds.length : undefined;

	res.send({ total: total, guilds: guilds, offset: Number(offset || Config.get().guild.discovery.offset), limit: Number(limit || configLimit) });
});

export default router;
