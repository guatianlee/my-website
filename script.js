document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('diaryForm');
    const diaryEntry = document.getElementById('diaryEntry');
    const entriesList = document.getElementById('entriesList');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const entryText = diaryEntry.value;
        if (entryText) {
            const listItem = document.createElement('li');
            listItem.textContent = entryText;
            entriesList.appendChild(listItem);
            diaryEntry.value = '';
        }
    });
});
