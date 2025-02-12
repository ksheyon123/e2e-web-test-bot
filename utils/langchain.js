const { ChatAnthropic } = require("@langchain/anthropic");
const { MessagesPlaceholder } = require("@langchain/core/prompts");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { systemPrompt_new, humanPrompt_new } = require("../prompt/prompt");

const createModel = () => {
  console.log("Claude 모델 생성...");
  return new ChatAnthropic({
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    modelName: "claude-3-5-sonnet-latest",
    temperature: 0,
  });
};

const createMessage = async (base64Image) => {
  console.log("Claude 요청 메세지 생성...");

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt_new],
    ["human", humanPrompt_new],
    new MessagesPlaceholder("chat_history"),
  ]);

  const formattedPrompt = await chatPrompt.formatMessages({
    base64_image: base64Image ? `data:image/jpeg;base64,${base64Image}` : "",
    chat_history: [],
  });

  return formattedPrompt;
};

const requestMessage = async (model, messages) => {
  try {
    console.log("요청 전송 중...");
    const response = await model.invoke(messages);

    try {
      const parsedResponse = JSON.parse(response.content);
      return parsedResponse;
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
  createMessage,
  requestMessage,
};
