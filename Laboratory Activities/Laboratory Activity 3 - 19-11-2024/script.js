document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const wordCount = document.getElementById('wordCount');
    const sentenceCount = document.getElementById('sentenceCount');

    textInput.addEventListener('input', function() {
        const text = this.value.trim();
        
        // Count words
        const words = text.split(/\s+/).filter(word => word !== '');
        wordCount.textContent = `Words: ${words.length}`;

        // Count sentences
        const sentences = text.split(/[.!?]+\s/).filter(sentence => sentence !== '');
        sentenceCount.textContent = `Sentences: ${sentences.length}`;
    });
});
