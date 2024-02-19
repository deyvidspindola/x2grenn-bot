"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotRunHandle = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const bot_diff_gols_use_case_1 = require("../application/bot-diff-gols/bot-diff-gols-use-case");
const bot_diff_gols_report_use_case_1 = require("../application/bot-diff-gols/bot-diff-gols-report-use-case");
const bot_diff_gols_edit_message_use_case_1 = require("../application/bot-diff-gols/bot-diff-gols-edit-message-use-case");
class BotRunHandle {
    constructor() { }
    async runBotDiffGols() {
        await typescript_ioc_1.Container.get(bot_diff_gols_use_case_1.BotDiffGolsUseCase).execute();
        await typescript_ioc_1.Container.get(bot_diff_gols_edit_message_use_case_1.BotDiffGolsEditMessageUseCase).execute();
        await typescript_ioc_1.Container.get(bot_diff_gols_report_use_case_1.BotDiffGolsReportUseCase).execute();
    }
}
exports.BotRunHandle = BotRunHandle;
//# sourceMappingURL=bot-run-handle.js.map