document.getElementById("create")?.addEventListener("click", () => {
  chrome.windows.create({ 
    url: "create.html", 
    type: "popup", 
    width: 600, 
    height: 500 
  });
});

document.getElementById("view")?.addEventListener("click", () => {
  chrome.windows.create({ 
    url: "view.html", 
    type: "popup", 
    width: 600, 
    height: 600 
  });
});
