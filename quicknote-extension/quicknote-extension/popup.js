"use strict";
var _a, _b;
(_a = document.getElementById("create")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    chrome.tabs.create({ url: "create.html" });
});
(_b = document.getElementById("view")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    chrome.tabs.create({ url: "view.html" });
}); 