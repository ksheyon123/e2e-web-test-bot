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

const createPrompt = async (base64Image) => {
  console.log("Claude 요청 메세지 생성...");
  const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", `${systemPrompt_new}\n\n응답 형식:\n{format_instructions}`],
    ["human", `{query}`],
  ]).partial({
    format_instructions: formatInstruction,
  });

  return chatPrompt;
};

const requestMessage = async (prompt, model, base64Image) => {
  try {
    console.log("요청 전송 중...");
    try {
      const query = `${humanPrompt_new}${base64Image}`;
      const chain = prompt.pipe(model).pipe(parser);
      const response = await chain.invoke({
        query,
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
  requestMessage,
};
