const { ChatAnthropic } = require("langchain/chat_models/anthropic");
const { PromptTemplate } = require("langchain/prompts");
const { LLMChain } = require("langchain/chains");

// Claude 모델 초기화
const chat = new ChatAnthropic({
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  modelName: "claude-3-opus-20240229",
  temperature: 0.7,
});

// 프롬프트 템플릿 생성
const promptTemplate = new PromptTemplate({
  template: "다음 주제에 대해 설명해주세요: {topic}",
  inputVariables: ["topic"],
});

// LLMChain 생성
const chain = new LLMChain({
  llm: chat,
  prompt: promptTemplate,
});

module.exports = {
  chain,
};
