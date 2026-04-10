document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const resultsContainer = document.getElementById('results-container');

    // Simulated search results
    const mockData = [
        { title: "National STEM Excellence Grant", amount: 5000, category: "Academic", source: "Dept of Ed" },
        { title: "State Varsity Scholar Award", amount: 2500, category: "Sports", source: "State Athletic Org" },
        { title: "Future Leaders Tech Fund", amount: 10000, category: "Academic", source: "Private Tech Corp" }
    ];

    const performSearch = (e) => {
        e.preventDefault();
        
        // Show loading state
        resultsContainer.innerHTML = '<p>AI Agent scanning global databases...</p>';

        // Simulate "Speedy" network delay
        setTimeout(() => {
            renderResults(mockData);
        }, 800);
    };

    const renderResults = (data) => {
        resultsContainer.innerHTML = '';
        
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'grant-card';
            card.innerHTML = `
                <div class="grant-header">
                    <div>
                        <h3>${item.title}</h3>
                        <small>Category: ${item.category} | Source: ${item.source}</small>
                    </div>
                    <span class="amount-tag">$${item.amount.toLocaleString()}</span>
                </div>
                <p style="margin-top: 10px; font-size: 0.9rem;">Relevant to your students' profile based on current news feed analysis.</p>
                <button style="background:none; color:#2563eb; border:none; cursor:pointer; padding:0; font-size:0.9rem;">View Details →</button>
            `;
            resultsContainer.appendChild(card);
        });
    };

    searchBtn.addEventListener('click', performSearch);
});
