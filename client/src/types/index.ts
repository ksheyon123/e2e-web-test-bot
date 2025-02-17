export type Response<T> = {
  success: boolean;
  data: T;
};

export type AISearchSpec = {
  viewort: {
    width: "number";
    height: "number";
    gridSize: "number";
    unitWidth: "number";
    unitHeight: "number";
  };
  elements: AISearchElement[];
};

export type AISearchElement = {
  type: string;
  purpose: string;
  text: string;
  test_case: string[];
};
