function renderNotes(notes: any[]) {
  const container = document.getElementById("notes")!;
  container.innerHTML = "";

  notes.forEach(note => {
    const noteDiv = document.createElement("div");
    noteDiv.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.description}</p>
      <button data-id="${note.id}" class="delete">Delete</button>
    `;
    container.appendChild(noteDiv);
  });

  document.querySelectorAll(".delete").forEach(button => {
    button.addEventListener("click", (e) => {
      const id = (e.target as HTMLElement).dataset.id!;
      chrome.storage.local.get(["notes"], (result) => {
        const filtered = (result.notes || []).filter((n: any) => n.id !== id);
        chrome.storage.local.set({ notes: filtered }, () => renderNotes(filtered));
      });
    });
  });
}

chrome.storage.local.get(["notes"], (result) => {
  renderNotes(result.notes || []);
});
