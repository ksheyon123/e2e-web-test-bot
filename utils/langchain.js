const { ChatAnthropic } = require("@langchain/anthropic");
const { MessagesPlaceholder } = require("@langchain/core/prompts");
const { ChatPromptTemplate } = require("@langchain/core/prompts");

const createModel = () => {
  console.log("Claude 모델 생성...");
  return new ChatAnthropic({
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    modelName: "claude-3-5-sonnet-20240620",
    temperature: 0,
  });
};

const createMessage = async (base64Image) => {
  console.log("Claude 요청 메세지 생성...");

  const systemPrompt = `당신은 웹 UI 테스트 자동화 전문가입니다. 
주어진 웹 페이지 스크린샷을 분석하여 다음 작업을 수행하세요:

1. 페이지에서 발견된 모든 상호작용 가능한 UI 요소를 식별하고 분류합니다:
   - 입력 필드 (텍스트, 이메일, 비밀번호 등)
   - 버튼
   - 드롭다운 메뉴
   - 체크박스
   - 라디오 버튼
   - 링크
   - 기타 클릭 가능한 요소

2. 각 요소에 대해 다음 정보를 제공하세요:
   - 요소의 유형
   - 예상되는 기능이나 목적
   - 권장되는 테스트 시나리오

3. 결과는 다음 JSON 형식으로 구조화하여 제공하세요:

   {{
     "elements": [
       {{
         "type": "요소 유형",
         "purpose": "예상 목적",
         "testScenarios": ["테스트 시나리오 1", "테스트 시나리오 2"]
       }}
     ]
   }}

JSON 형식으로만 응답하세요.`;

  const humanPrompt = `다음 웹 페이지 스크린샷을 분석하여 테스트 가능한 UI 요소들의 목록을 제공해주세요: {base64_image}`;

  const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", humanPrompt],
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
