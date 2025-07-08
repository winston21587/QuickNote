type NoteProps = {
  id: string;
  title: string;
  description: string;
  createdAt: number;
}

// Function to update a note
function updateNote(id: string, updatedNote: NoteProps): void {
  chrome.storage.local.get(["notes"], (result) => {
    const notes = result.notes || [] as NoteProps[];
    const updatedNotes = notes.map((note: NoteProps) => 
      note.id === id ? updatedNote : note
    );
    chrome.storage.local.set({ notes: updatedNotes }, () => {
      renderNotes(updatedNotes);
    });
  });
}

// Function to create edit form with improved UI
function createEditForm(note: NoteProps): string {
  return `
    <div class="edit-form">
      <div class="edit-header">
        <h3>Edit Note</h3>
      </div>
      <div class="edit-content">
        <div class="form-group">
          <label for="edit-title-${note.id}">Title:</label>
          <input type="text" id="edit-title-${note.id}" value="${note.title}" class="edit-input" placeholder="Enter note title">
        </div>
        <div class="form-group">
          <label for="edit-description-${note.id}">Description:</label>
          <textarea id="edit-description-${note.id}" class="edit-textarea" placeholder="Enter note description">${note.description}</textarea>
        </div>
      </div>
              <div class="edit-buttons">
          <button data-id="${note.id}" class="save-edit">Save Changes</button>
          <button data-id="${note.id}" class="cancel-edit">Cancel</button>
        </div>
    </div>
  `;
}

function renderNotes(notes: NoteProps[]) {
  const container = document.getElementById("notes")!;
  container.innerHTML = "";
  notes.forEach((note, index) => {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note-item";
    noteDiv.innerHTML = `
      <div class="note-content" id="note-content-${note.id}">
        <div class="note-header">
          <h3>${index + 1}. ${note.title}</h3>
        </div>
        <div class="note-body">
          <p>${note.description}</p>
        </div>
        <div class="note-actions">
          <button data-id="${note.id}" class="edit"> Edit</button>
          <button data-id="${note.id}" class="delete"> Delete</button>
        </div>
      </div>
    `;

    container.appendChild(noteDiv);
  });

  // Add edit event listeners
  document.querySelectorAll(".edit").forEach(button => {
    button.addEventListener("click", (e) => {
      const id = (e.target as HTMLElement).dataset.id!;
      const note = notes.find(n => n.id === id);
      if (note) {
        const noteContent = document.getElementById(`note-content-${id}`);
        if (noteContent) {
          noteContent.innerHTML = createEditForm(note);
          
          // Focus on the title input for better UX
          const titleInput = document.getElementById(`edit-title-${id}`) as HTMLInputElement;
          if (titleInput) {
            titleInput.focus();
            titleInput.select(); // Select all text for easy editing
          }
          
          // Add save and cancel event listeners
          const saveBtn = noteContent.querySelector('.save-edit');
          const cancelBtn = noteContent.querySelector('.cancel-edit');
          
          saveBtn?.addEventListener('click', () => {
            const titleInput = document.getElementById(`edit-title-${id}`) as HTMLInputElement;
            const descriptionInput = document.getElementById(`edit-description-${id}`) as HTMLTextAreaElement;
            
            // Validate inputs
            if (!titleInput.value.trim()) {
              alert('Please enter a title for the note');
              titleInput.focus();
              return;
            }
            
            if (!descriptionInput.value.trim()) {
              alert('Please enter a description for the note');
              descriptionInput.focus();
              return;
            }
            
            const updatedNote: NoteProps = {
              ...note,
              title: titleInput.value.trim(),
              description: descriptionInput.value.trim()
            };
            
            updateNote(id, updatedNote);
          });
          
          cancelBtn?.addEventListener('click', () => {
            renderNotes(notes);
          });
        }
      }
    });
  });

  // Add delete event listeners
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
