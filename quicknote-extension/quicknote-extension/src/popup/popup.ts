document.getElementById("create")?.addEventListener("click", () => {
  chrome.tabs.create({ url: "create.html" });
});

document.getElementById("view")?.addEventListener("click", () => {
  chrome.tabs.create({ url: "view.html" });
});
