"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestAnswer = exports.createPrompt = exports.createModel = void 0;
const anthropic_1 = require("@langchain/anthropic");
const output_parsers_1 = require("@langchain/core/output_parsers");
const prompts_1 = require("@langchain/core/prompts");
const prompt_1 = require("../prompt/prompt");
const parser = new output_parsers_1.JsonOutputParser();
const createModel = () => {
    console.log("Claude 모델 생성...");
    return new anthropic_1.ChatAnthropic({
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
        modelName: "claude-3-5-sonnet-latest",
        temperature: 0,
    });
};
exports.createModel = createModel;
const createPrompt = async () => {
    console.log("Claude 요청 메세지 생성...");
    // https://js.langchain.com/docs/how_to/multimodal_prompts/
    const chatPrompt = prompts_1.ChatPromptTemplate.fromMessages([
        ["system", `${prompt_1.systemPrompt_new}\n\n응답 형식:\n{format_instructions}`],
        [
            "user",
            [
                { type: "text", message: "{query}" },
                { type: "image_url", image_url: "data:image/png;base64,{base64}" },
            ],
        ],
    ]).partial({
        format_instructions: prompt_1.formatInstruction,
    });
    return chatPrompt;
};
exports.createPrompt = createPrompt;
const requestAnswer = async (prompt, model, query, base64) => {
    try {
        console.log("요청 전송 중...");
        try {
            const chain = prompt.pipe(model).pipe(parser);
            const response = await chain.invoke({
                query,
                base64,
            });
            return response;
        }
        catch (parseError) {
            console.warn("JSON 파싱 실패:", parseError);
            throw parseError;
        }
    }
    catch (error) {
        console.error("Request error:", error);
        throw error;
    }
};
exports.requestAnswer = requestAnswer;
