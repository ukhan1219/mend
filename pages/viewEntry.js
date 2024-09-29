function loadEntryDetails() {
    // Get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const entryDate = urlParams.get('date');
    const entryContent = urlParams.get('content');

    // Display the details on the page
    document.getElementById('entry-date').textContent = entryDate;
    document.getElementById('entry-content').textContent = entryContent;
}
