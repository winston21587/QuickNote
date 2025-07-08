"use strict";
var _a, _b;
(_a = document.getElementById("create")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    chrome.windows.create({ 
        url: "create.html", 
        type: "popup", 
        width: 600, 
        height: 500 
    });
});
(_b = document.getElementById("view")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    chrome.windows.create({ 
        url: "view.html", 
        type: "popup", 
        width: 600, 
        height: 600 
    });
});

 