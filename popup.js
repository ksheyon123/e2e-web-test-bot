document.getElementById("changeColor").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log(tab, chrome);
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      document.body.style.backgroundColor =
        "#" + Math.floor(Math.random() * 16777215).toString(16);
    },
  });
});
