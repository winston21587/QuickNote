"use strict";
function renderNotes(notes) {
    const container = document.getElementById("notes");
    container.innerHTML = "";
    
    if (notes.length === 0) {
        container.innerHTML = '<div class="empty-state">No notes yet. Create your first note!</div>';
        return;
    }
    
    notes.forEach(note => {
        const noteDiv = document.createElement("div");
        noteDiv.className = "note";
        
        // Format datetime
        const createdDate = new Date(note.createdAt);
        const createdStr = createdDate.toLocaleDateString() + ' ' + createdDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const updatedStr = note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() + ' ' + new Date(note.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : null;
        
        noteDiv.innerHTML = `
      <h3>${note.title}</h3>
      <p class="truncated">${note.description}</p>
      <div class="datetime">
        Created: ${createdStr}
        ${updatedStr ? `<br>Updated: ${updatedStr}` : ''}
      </div>
      <div class="button-group">
        <button data-id="${note.id}" class="edit">Edit</button>
        <button data-id="${note.id}" class="delete">Delete</button>
      </div>
    `;
        container.appendChild(noteDiv);
        
        // Check if text needs expand button by measuring actual height
        const descriptionP = noteDiv.querySelector('p');
        const originalHeight = descriptionP.scrollHeight;
        const maxHeight = 60; // Same as CSS max-height
        
        if (originalHeight > maxHeight) {
            // Add expand button
            const expandBtn = document.createElement('button');
            expandBtn.className = 'expand-btn';
            expandBtn.textContent = 'Show More';
            descriptionP.parentNode.insertBefore(expandBtn, descriptionP.nextSibling);
            
            expandBtn.addEventListener('click', () => {
                if (descriptionP.classList.contains('expanded')) {
                    // Collapse
                    descriptionP.classList.remove('expanded');
                    descriptionP.classList.add('truncated');
                    expandBtn.textContent = 'Show More';
                } else {
                    // Expand
                    descriptionP.classList.remove('truncated');
                    descriptionP.classList.add('expanded');
                    expandBtn.textContent = 'Show Less';
                }
            });
        }
    });
    
    // Add edit functionality
    document.querySelectorAll(".edit").forEach(button => {
        button.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            const note = notes.find(n => n.id === id);
            if (note) {
                showEditForm(note);
            }
        });
    });
    
    // Add delete functionality with confirmation
    document.querySelectorAll(".delete").forEach(button => {
        button.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            if (confirm("Are you sure you want to delete this note?")) {
                chrome.storage.local.get(["notes"], (result) => {
                    const filtered = (result.notes || []).filter((n) => n.id !== id);
                    chrome.storage.local.set({ notes: filtered }, () => {
                        // Show notification
                        const notification = document.getElementById("notification");
                        notification.textContent = "Note deleted successfully!";
                        notification.classList.add("show");
                        setTimeout(() => {
                            notification.classList.remove("show");
                        }, 3000);
                        
                        renderNotes(filtered);
                    });
                });
            }
        });
    });
}

function showEditForm(note) {
    const noteDiv = document.querySelector(`[data-id="${note.id}"]`).closest('.note');
    noteDiv.innerHTML = `
      <div class="edit-form">
        <input type="text" id="edit-title-${note.id}" value="${note.title}" placeholder="Note Title" />
        <textarea id="edit-description-${note.id}" placeholder="Write your note here...">${note.description}</textarea>
        <div class="button-group">
          <button class="save" data-id="${note.id}">Save</button>
          <button class="cancel" data-id="${note.id}">Cancel</button>
        </div>
      </div>
    `;
    
    // Add save functionality
    document.querySelector(`.save[data-id="${note.id}"]`).addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const newTitle = document.getElementById(`edit-title-${id}`).value;
        const newDescription = document.getElementById(`edit-description-${id}`).value;
        
        if (!newTitle.trim() || !newDescription.trim()) {
            alert("Please fill in both title and description!");
            return;
        }
        
        if (confirm("Are you sure you want to save these changes?")) {
            chrome.storage.local.get(["notes"], (result) => {
                const updatedNotes = (result.notes || []).map(n => {
                    if (n.id === id) {
                        return { 
                            ...n, 
                            title: newTitle, 
                            description: newDescription,
                            updatedAt: Date.now()
                        };
                    }
                    return n;
                });
                chrome.storage.local.set({ notes: updatedNotes }, () => {
                    // Show notification
                    const notification = document.getElementById("notification");
                    notification.classList.add("show");
                    setTimeout(() => {
                        notification.classList.remove("show");
                    }, 3000);
                    
                    renderNotes(updatedNotes);
                });
            });
        }
    });
    
    // Add cancel functionality
    document.querySelector(`.cancel[data-id="${note.id}"]`).addEventListener("click", () => {
        chrome.storage.local.get(["notes"], (result) => {
            renderNotes(result.notes || []);
        });
    });
}

chrome.storage.local.get(["notes"], (result) => {
    renderNotes(result.notes || []);
});

 