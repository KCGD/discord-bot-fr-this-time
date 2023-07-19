import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";
import { Log } from "../lib/util/debug";
import * as ErrorCodes from '../lib/util/errors';

export const MainCommand = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription("Plays a song from a youtube link (or song name)"),
    execute: async (interaction:CommandInteraction) => {
        interaction.reply("Command still under development!");
        console.log(interaction);
    }
}


/* 
    OLD VC CODE FROM LAST BOT (dont copy this directly)

    msg.member.voice.channel.join().then(connection => {
                that.audio.connection = connection;
                that.playNextInQueue();
    })
*/



/* 
    Interaction object structure

    ChatInputCommandInteraction {
        type: 2,
        id: '1131304467485163592',
        applicationId: '1124095468968878151',
        channelId: '1130193668523966615',
        guildId: '488245258887626783',
        user: User {
            id: '374072409411551233',
            bot: false,
            system: false,
            flags: UserFlagsBitField { bitfield: 0 },
            username: 'kcgd',
            discriminator: '0',
            avatar: '4616af7e8dede1e7ce7e90b616f2e2d4',
            banner: undefined,
            accentColor: undefined
        },
        member: GuildMember {
            guild: Guild {
            id: '488245258887626783',
            name: 'Me provate server',
            icon: null,
            features: [],
            commands: [GuildApplicationCommandManager],
            members: [GuildMemberManager],
            channels: [GuildChannelManager],
            bans: [GuildBanManager],
            roles: [RoleManager],
            presences: PresenceManager {},
            voiceStates: [VoiceStateManager],
            stageInstances: [StageInstanceManager],
            invites: [GuildInviteManager],
            scheduledEvents: [GuildScheduledEventManager],
            autoModerationRules: [AutoModerationRuleManager],
            available: true,
            shardId: 0,
            splash: null,
            banner: null,
            description: null,
            verificationLevel: 0,
            vanityURLCode: null,
            nsfwLevel: 0,
            premiumSubscriptionCount: 0,
            discoverySplash: null,
            memberCount: 7,
            large: false,
            premiumProgressBarEnabled: false,
            applicationId: null,
            afkTimeout: 300,
            afkChannelId: null,
            systemChannelId: null,
            premiumTier: 0,
            widgetEnabled: null,
            widgetChannelId: null,
            explicitContentFilter: 0,
            mfaLevel: 0,
            joinedTimestamp: 1688939847550,
            defaultMessageNotifications: 0,
            systemChannelFlags: [SystemChannelFlagsBitField],
            maximumMembers: 500000,
            maximumPresences: null,
            maxVideoChannelUsers: 25,
            maxStageVideoChannelUsers: 50,
            approximateMemberCount: null,
            approximatePresenceCount: null,
            vanityURLUses: null,
            rulesChannelId: null,
            publicUpdatesChannelId: null,
            preferredLocale: 'en-US',
            safetyAlertsChannelId: null,
            ownerId: '374072409411551233',
            emojis: [GuildEmojiManager],
            stickers: [GuildStickerManager]
            },
            joinedTimestamp: 1536477140927,
            premiumSinceTimestamp: null,
            nickname: null,
            pending: false,
            communicationDisabledUntilTimestamp: null,
            _roles: [],
            user: User {
            id: '374072409411551233',
            bot: false,
            system: false,
            flags: [UserFlagsBitField],
            username: 'kcgd',
            discriminator: '0',
            avatar: '4616af7e8dede1e7ce7e90b616f2e2d4',
            banner: undefined,
            accentColor: undefined
            },
            avatar: null,
            flags: GuildMemberFlagsBitField { bitfield: 0 }
        },
        version: 1,
        appPermissions: PermissionsBitField { bitfield: 137411140509249n },
        memberPermissions: PermissionsBitField { bitfield: 140737488355327n },
        locale: 'en-US',
        guildLocale: 'en-US',
        commandId: '1131304394038710433',
        commandName: 'play',
        commandType: 1,
        commandGuildId: null,
        deferred: false,
        replied: false,
        ephemeral: false,
        webhook: InteractionWebhook { id: '1124095468968878151' },
        options: CommandInteractionOptionResolver {
            _group: null,
            _subcommand: null,
            _hoistedOptions: []
        }
    }
*/