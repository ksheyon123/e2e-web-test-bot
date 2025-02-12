const { ChatAnthropic } = require("@langchain/anthropic");
const { JsonOutputParser } = require("@langchain/core/output_parsers");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const {
  systemPrompt_new,
  humanPrompt_new,
  formatInstruction,
} = require("../prompt/prompt");

const parser = new JsonOutputParser();

const createModel = () => {
  console.log("Claude 모델 생성...");
  return new ChatAnthropic({
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    modelName: "claude-3-5-sonnet-latest",
    temperature: 0,
  });
};

const createPrompt = async () => {
  console.log("Claude 요청 메세지 생성...");

  // https://js.langchain.com/docs/how_to/multimodal_prompts/
  const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", `${systemPrompt_new}\n\n응답 형식:\n{format_instructions}`],
    [
      "user",
      [
        { type: "text", message: "{query}" },
        { type: "image_url", image_url: "data:image/png;base64,{base64}" },
      ],
    ],
  ]).partial({
    format_instructions: formatInstruction,
  });

  return chatPrompt;
};

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
    } catch (parseError) {
      console.warn("JSON 파싱 실패:", parseError);
      return response.content;
    }
  } catch (error) {
    console.error("Request error:", error);
    throw error;
  }
};

module.exports = {
  createModel,
  createPrompt,
  requestAnswer,
};
