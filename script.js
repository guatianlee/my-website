document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('diaryForm');
    const diaryEntry = document.getElementById('diaryEntry');
    const entriesList = document.getElementById('entriesList');
    const entries = JSON.parse(localStorage.getItem('entries')) || [];

    function saveEntries() {
        localStorage.setItem('entries', JSON.stringify(entries));
    }

    function displayEntries() {
        entriesList.innerHTML = '';
        entries.forEach((entry, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="entry-text">${entry.text}</span>
                <span class="entry-date">${entry.date}</span>
                <button class="edit-btn" onclick="editEntry(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteEntry(${index})">Delete</button>
            `;
            entriesList.appendChild(listItem);
        });
    }

    function addEntry(text) {
        const date = new Date().toLocaleString();
        entries.push({ text, date });
        saveEntries();
        displayEntries();
    }

    function editEntry(index) {
        const newText = prompt('Edit your entry:', entries[index].text);
        if (newText) {
            entries[index].text = newText;
            saveEntries();
            displayEntries();
        }
    }

    function deleteEntry(index) {
        entries.splice(index, 1);
        saveEntries();
        displayEntries();
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const entryText = diaryEntry.value;
        if (entryText) {
            addEntry(entryText);
            diaryEntry.value = '';
        }
    });

    displayEntries();
});

function editEntry(index) {
    const newText = prompt('Edit your entry:', entries[index].text);
    if (newText) {
        entries[index].text = newText;
        saveEntries();
        displayEntries();
    }
}

function deleteEntry(index) {
    entries.splice(index, 1);
    saveEntries();
    displayEntries();
}
