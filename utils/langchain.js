const { ChatAnthropic } = require("@langchain/anthropic");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");

const createModel = () => {
  // Claude 모델 초기화
  const model = new ChatAnthropic({
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    model: "claude-3-5-sonnet-20240620",
    temperature: 0,
  });
  return model;
};

const createMessage = (base64_image) => {
  messages = [
    HumanMessage(
      (content = [
        {
          type: "image",
          image_url: `data:image/jpeg;base64,${base64_image}`,
        },
        {
          type: "text",
          text: "이 이미지를 분석해주세요.",
        },
      ])
    ),
  ];
  return message;
};

module.exports = {
  createModel,
  createMessage,
};
