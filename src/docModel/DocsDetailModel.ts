import { AssetProtocol } from "../model/PickleModelJson";
import { SocialKeyValueObj } from "./DocsInterfaces";

/*
 * // ADD_CHAIN 
 * // ADD_CHAIN_PROTOCOL
 * // ADD_ASSET
 * Add some metadata here if you want protocols or tokens to be automatically documented
 */

export const PROTOCOL_SOCIAL_MODEL: {[key: string]: SocialKeyValueObj} = {};
PROTOCOL_SOCIAL_MODEL[AssetProtocol.AAVE] = { 
    "social.key.discord.withname": "https://discord.com/invite/CvKUrqM",
    "social.key.website.withname": "https://aave.com/",
};
PROTOCOL_SOCIAL_MODEL[AssetProtocol.SUSHISWAP] = { 
    "social.key.discord.withname": "https://discord.gg/CD2YdZzb7Z",
    "social.key.website.withname": "https://app.sushi.com/en/swap",
};


export const TOKEN_SOCIAL_MODEL: {[key: string]: SocialKeyValueObj} = {};
TOKEN_SOCIAL_MODEL["looks"] = { 
    "social.key.discord.withname": "https://discord.gg/looksrare",
    "social.key.website.withname": "https://looksrare.org/",
};
TOKEN_SOCIAL_MODEL["alcx"] = { 
    "social.key.discord.withname": "https://discord.gg/csa9mTRK6j",
    "social.key.website.withname": "https://app.alchemix.fi/",
};
TOKEN_SOCIAL_MODEL["matic"] = { 
    "social.key.discord.withname": "https://discord.gg/polygon",
    "social.key.website.withname": "https://polygon.technology/",
};
TOKEN_SOCIAL_MODEL["raider"] = { 
    "social.key.discord.withname": "https://www.discord.gg/ZhWgFNQFPF",
    "social.key.website.withname": "https://cryptoraiders.xyz/",
};
