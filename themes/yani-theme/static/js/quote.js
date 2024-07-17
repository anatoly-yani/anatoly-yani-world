function loadQuote() {
  const selected_poems_url = '/selected-poems.html';
  fetch('/quotes.json')
    .then(response => response.json())
    .then(quotes => {
      const today = new Date();
      const start = new Date(today.getFullYear(), 0, 0);
      const diff = today - start;
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      
      const index = dayOfYear % quotes.length;
      const quote = quotes[index];
      
      document.getElementById('quote-text').innerHTML = quote.text.replace(/\n/g, '<br>');
      document.getElementById('quote-source').innerHTML = `&laquo;${quote.source}&raquo;`;
      document.getElementById('quote-link').href = `${selected_poems_url}#${quote.id}`;
    });
}

document.addEventListener('DOMContentLoaded', loadQuote);
