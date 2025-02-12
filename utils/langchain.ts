import { ChatAnthropic } from "@langchain/anthropic";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  systemPrompt_new,
  humanPrompt_new,
  formatInstruction,
} from "../prompt/prompt";
import {
  Runnable,
  RunnableLambda,
  RunnableSequence,
} from "@langchain/core/runnables";

const parser = new JsonOutputParser();

const createModel = (): ChatAnthropic => {
  console.log("Claude 모델 생성...");
  return new ChatAnthropic({
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    modelName: "claude-3-5-sonnet-latest",
    temperature: 0,
  });
};

const createPrompt = async (): Promise<ChatPromptTemplate> => {
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

const requestAnswer = async <T>(
  chain: Runnable,
  query: string,
  base64: string
): Promise<T> => {
  try {
    console.log("요청 전송 중...");
    try {
      const response = (await chain.invoke({
        query,
        base64,
      })) as T;
      return response;
    } catch (parseError) {
      console.warn("JSON 파싱 실패:", parseError);
      throw parseError;
    }
  } catch (e) {
    console.error("Request error:", e);
    throw e;
  }
};

const createChain = async (
  prompt: ChatPromptTemplate,
  model: ChatAnthropic
) => {
  try {
    const chain = prompt.pipe(model).pipe(parser);
    return chain;
  } catch (e) {
    console.error("Request error:", e);
    throw e;
  }
};

const runnables = async (chain: Runnable) => {
  try {
    new RunnableLambda({
      func: async (input: { topic: string }) => {
        const result = await chain.invoke(input);
        return { joke: result };
      },
    });
  } catch (e) {
    console.error("Request error:", e);
    throw e;
  }
};

export { createModel, createPrompt, createChain, requestAnswer };
