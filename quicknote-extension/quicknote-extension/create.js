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
    
    if (!title.trim() || !description.trim()) {
        alert("Please fill in both title and description!");
        return;
    }
    
    if (confirm("Are you sure you want to save this note?")) {
        const id = crypto.randomUUID();
        const newNote = { id, title, description, createdAt: Date.now() };
        chrome.storage.local.get(["notes"], (result) => {
            const notes = result.notes || [];
            notes.push(newNote);
            chrome.storage.local.set({ notes }, () => {
                // Show notification
                const notification = document.getElementById("notification");
                notification.classList.add("show");
                setTimeout(() => {
                    notification.classList.remove("show");
                }, 3000);
                
                // Clear form
                document.getElementById("title").value = "";
                document.getElementById("description").value = "";
            });
        });
    }
}));

// Display current datetime
document.addEventListener("DOMContentLoaded", () => {
    const datetimeDisplay = document.getElementById("datetime-display");
    const now = new Date();
    const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    datetimeDisplay.textContent = `Creating note on: ${dateStr}`;
});

 