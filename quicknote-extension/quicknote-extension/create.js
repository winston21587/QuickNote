"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
(_a = document.getElementById("save")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const id = crypto.randomUUID();
    const newNote = { id, title, description, createdAt: Date.now() };
    chrome.storage.local.get(["notes"], (result) => {
        const notes = result.notes || [];
        notes.push(newNote);
        chrome.storage.local.set({ notes });
        alert("Note saved!");
    });
})); 