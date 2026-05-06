// Get DOM elements
const collectionSelect = document.getElementById('collection-select');
const questionInput = document.getElementById('question-input');
const submitBtn = document.getElementById('submit-btn');
const responseSection = document.getElementById('response-section');
const answerText = document.getElementById('answer-text');
const loadingSpinner = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const closeBtn = document.getElementById('close-btn');

// Event listeners
submitBtn.addEventListener('click', handleSubmit);
closeBtn.addEventListener('click', closeResponse);
questionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        handleSubmit();
    }
});

async function handleSubmit() {
    // Validation
    if (!collectionSelect.value) {
        showError('Please select a report type');
        return;
    }

    if (!questionInput.value.trim()) {
        showError('Please enter a question');
        return;
    }

    // Clear previous errors
    hideError();

    // Show loading state
    responseSection.classList.remove('hidden');
    loadingSpinner.classList.remove('hidden');
    answerText.innerHTML = '';

    try {
        const payload = {
            collection: collectionSelect.value,
            question: questionInput.value.trim()
        };

        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const answer = await response.text();
        
        // Hide loading and show answer
        loadingSpinner.classList.add('hidden');
        answerText.innerHTML = formatAnswer(answer);

    } catch (error) {
        loadingSpinner.classList.add('hidden');
        showError('Failed to get an answer. Please try again.');
        console.error('Error:', error);
    }
}

function formatAnswer(text) {
    // Convert line breaks and format the text
    return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => `<p>${escapeHtml(line)}</p>`)
        .join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    responseSection.classList.add('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';
}

function closeResponse() {
    responseSection.classList.add('hidden');
    answerText.innerHTML = '';
}
