document.getElementById("save")?.addEventListener("click", async () => {
  const title = (document.getElementById("title") as HTMLInputElement).value;
  const description = (document.getElementById("description") as HTMLTextAreaElement).value;
  const id = crypto.randomUUID();

  const newNote: NoteProps = { id, title, description, createdAt: Date.now() };

  chrome.storage.local.get(["notes"], (result) => {
    const notes = result.notes || [] as NoteProps[];
    notes.push(newNote);
    chrome.storage.local.set({ notes });
    alert("Note saved!");
  });
});
