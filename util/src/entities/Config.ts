import { Column, Entity } from "typeorm";
import { BaseClassWithoutId, PrimaryIdColumn } from "./BaseClass";
import crypto from "crypto";
import { Snowflake } from "../util/Snowflake";
import { SessionsReplace } from "..";
import { hostname } from "os";

@Entity("config")
export class ConfigEntity extends BaseClassWithoutId {
	@PrimaryIdColumn()
	key: string;

	@Column({ type: "simple-json", nullable: true })
	value: number | boolean | null | string | undefined;
}

export interface RateLimitOptions {
	bot?: number;
	count: number;
	window: number;
	onyIp?: boolean;
}

export interface Region {
	id: string;
	name: string;
	endpoint: string;
	location?: {
		latitude: number;
		longitude: number;
	};
	vip: boolean;
	custom: boolean;
	deprecated: boolean;
}

export interface KafkaBroker {
	ip: string;
	port: number;
}

export interface ConfigValue {
	gateway: {
		endpointClient: string | null;
		endpointPrivate: string | null;
		endpointPublic: string | null;
	};
	cdn: {
		endpointClient: string | null;
		endpointPublic: string | null;
		endpointPrivate: string | null;
	};
	api: {
		defaultVersion: string;
		activeVersions: string[];
		useFosscordEnhancements: boolean;
	};
	general: {
		instanceName: string;
		instanceDescription: string | null;
		frontPage: string | null;
		tosPage: string | null;
		correspondenceEmail: string | null;
		correspondenceUserID: string | null;
		image: string | null;
		instanceId: string;
	};
	limits: {
		user: {
			maxGuilds: number;
			maxUsername: number;
			maxFriends: number;
		};
		guild: {
			maxRoles: number;
			maxEmojis: number;
			maxMembers: number;
			maxChannels: number;
			maxChannelsInCategory: number;
			hideOfflineMember: number;
		};
		message: {
			maxCharacters: number;
			maxTTSCharacters: number;
			maxReactions: number;
			maxAttachmentSize: number;
			maxBulkDelete: number;
			maxEmbedDownloadSize: number;
		};
		channel: {
			maxPins: number;
			maxTopic: number;
			maxWebhooks: number;
		};
		rate: {
			disabled: boolean;
			ip: Omit<RateLimitOptions, "bot_count">;
			global: RateLimitOptions;
			error: RateLimitOptions;
			routes: {
				guild: RateLimitOptions;
				webhook: RateLimitOptions;
				channel: RateLimitOptions;
				auth: {
					login: RateLimitOptions;
					register: RateLimitOptions;
				};
				// TODO: rate limit configuration for all routes
			};
		};
	};
	security: {
		autoUpdate: boolean | number;
		requestSignature: string;
		jwtSecret: string;
		forwadedFor: string | null; // header to get the real user ip address
		captcha: {
			enabled: boolean;
			service: "recaptcha" | "hcaptcha" | null; // TODO: hcaptcha, custom
			sitekey: string | null;
			secret: string | null;
		};
		ipdataApiKey: string | null;
	};
	login: {
		requireCaptcha: boolean;
	};
	register: {
		email: {
			required: boolean;
			allowlist: boolean;
			blocklist: boolean;
			domains: string[];
		};
		dateOfBirth: {
			required: boolean;
			minimum: number; // in years
		};
		disabled: boolean;
		requireCaptcha: boolean;
		requireInvite: boolean;
		guestsRequireInvite: boolean;
		allowNewRegistration: boolean;
		allowMultipleAccounts: boolean;
		blockProxies: boolean;
		password: {
			required: boolean;
			minLength: number;
			minNumbers: number;
			minUpperCase: number;
			minSymbols: number;
		};
		incrementingDiscriminators: boolean; // random otherwise
	};
	regions: {
		default: string;
		useDefaultAsOptimal: boolean;
		available: Region[];
	};
	guild: {
		discovery: {
			showAllGuilds: boolean;
			useRecommendation: boolean; // TODO: Recommendation, privacy concern?
			offset: number;
			limit: number;
		};
		autoJoin: {
			enabled: boolean;
			guilds: string[];
			canLeave: boolean;
		};
	};
	gif: {
		enabled: boolean;
		provider: "tenor"; // more coming soon
		apiKey?: string;
	};
	rabbitmq: {
		host: string | null;
	};
	kafka: {
		brokers: KafkaBroker[] | null;
	};
	templates: {
		enabled: Boolean;
		allowTemplateCreation: Boolean;
		allowDiscordTemplates: Boolean;
		allowRaws: Boolean;
	},
	client: {
		useTestClient: Boolean;
		releases: {
			useLocalRelease: Boolean; //TODO
			upstreamVersion: string;
		}
	},
	metrics: {
		timeout: number;
	},
	sentry: {
		enabled: boolean;
		endpoint: string;
		traceSampleRate: number;
		environment: string;
	}
}

export const DefaultConfigOptions: ConfigValue = {
	gateway: {
		endpointClient: null,
		endpointPrivate: null,
		endpointPublic: null,
	},
	cdn: {
		endpointClient: null,
		endpointPrivate: null,
		endpointPublic: null,
	},
	api: {
		defaultVersion: "9",
		activeVersions: ["6", "7", "8", "9"],
		useFosscordEnhancements: true,
	},
	general: {
		instanceName: "Fosscord Instance",
		instanceDescription: "This is a Fosscord instance made in pre-release days",
		frontPage: null,
		tosPage: null,
		correspondenceEmail: "noreply@localhost.local",
		correspondenceUserID: null,
		image: null,
		instanceId: Snowflake.generate(),
	},
	limits: {
		user: {
			maxGuilds: 1048576,
			maxUsername: 127,
			maxFriends: 5000,
		},
		guild: {
			maxRoles: 1000,
			maxEmojis: 2000,
			maxMembers: 25000000,
			maxChannels: 65535,
			maxChannelsInCategory: 65535,
			hideOfflineMember: 3,
		},
		message: {
			maxCharacters: 1048576,
			maxTTSCharacters: 160,
			maxReactions: 2048,
			maxAttachmentSize: 1024 * 1024 * 1024,
			maxEmbedDownloadSize: 1024 * 1024 * 5,
			maxBulkDelete: 1000,
		},
		channel: {
			maxPins: 500,
			maxTopic: 1024,
			maxWebhooks: 100,
		},
		rate: {
			disabled: true,
			ip: {
				count: 500,
				window: 5,
			},
			global: {
				count: 250,
				window: 5,
			},
			error: {
				count: 10,
				window: 5,
			},
			routes: {
				guild: {
					count: 5,
					window: 5,
				},
				webhook: {
					count: 10,
					window: 5,
				},
				channel: {
					count: 10,
					window: 5,
				},
				auth: {
					login: {
						count: 5,
						window: 60,
					},
					register: {
						count: 2,
						window: 60 * 60 * 12,
					},
				},
			},
		},
	},
	security: {
		autoUpdate: true,
		requestSignature: crypto.randomBytes(32).toString("base64"),
		jwtSecret: crypto.randomBytes(256).toString("base64"),
		forwadedFor: null,
		// forwadedFor: "X-Forwarded-For" // nginx/reverse proxy
		// forwadedFor: "CF-Connecting-IP" // cloudflare:
		captcha: {
			enabled: false,
			service: null,
			sitekey: null,
			secret: null,
		},
		ipdataApiKey: "eca677b284b3bac29eb72f5e496aa9047f26543605efe99ff2ce35c9",
	},
	login: {
		requireCaptcha: false,
	},
	register: {
		email: {
			required: false,
			allowlist: false,
			blocklist: true,
			domains: [], // TODO: efficiently save domain blocklist in database
			// domains: fs.readFileSync(__dirname + "/blockedEmailDomains.txt", { encoding: "utf8" }).split("\n"),
		},
		dateOfBirth: {
			required: true,
			minimum: 13,
		},
		disabled: false,
		requireInvite: false,
		guestsRequireInvite: true,
		requireCaptcha: true,
		allowNewRegistration: true,
		allowMultipleAccounts: true,
		blockProxies: true,
		password: {
			required: false,
			minLength: 8,
			minNumbers: 2,
			minUpperCase: 2,
			minSymbols: 0,
		},
		incrementingDiscriminators: false,
	},
	regions: {
		default: "fosscord",
		useDefaultAsOptimal: true,
		available: [
			{
				id: "fosscord",
				name: "Fosscord",
				endpoint: "127.0.0.1:3004",
				vip: false,
				custom: false,
				deprecated: false,
			},
		],
	},
	guild: {
		discovery: {
			showAllGuilds: false,
			useRecommendation: false,
			offset: 0,
			limit: 24,
		},
		autoJoin: {
			enabled: true,
			canLeave: true,
			guilds: [],
		},
	},
	gif: {
		enabled: true,
		provider: "tenor",
		apiKey: "LIVDSRZULELA",
	},
	rabbitmq: {
		host: null,
	},
	kafka: {
		brokers: null,
	},
	templates: {
		enabled: true,
		allowTemplateCreation: true,
		allowDiscordTemplates: true,
		allowRaws: false
	},
	client: {
		useTestClient: true,
		releases: {
			useLocalRelease: true,
			upstreamVersion: "0.0.264"
		}
	},
	metrics: {
		timeout: 30000
	},
	sentry: {
		enabled: false,
		endpoint: "https://05e8e3d005f34b7d97e920ae5870a5e5@sentry.thearcanebrony.net/6",
		traceSampleRate: 1.0,
		environment: hostname()
	}
};
