// 1. CONSTANTS & ENDPOINTS
const NYC_API_ENDPOINT = "https://data.cityofnewyork.us/resource/x4ud-jhxu.json";
const APP_TOKEN = "K4CShHFvxEN3pKWcdK6bd7v2c"; 

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const searchBtn = document.getElementById('search-btn');
    const resultsContainer = document.getElementById('results-container');
    const categorySelect = document.getElementById('category');
    const minAmountInput = document.getElementById('min-amount');

    // 2. THE FETCH FUNCTION
    const fetchGrants = async () => {
        resultsContainer.innerHTML = '<p>AI Agent fetching live NYC Open Data...</p>';

        const borough = categorySelect.value;
        const minAmount = minAmountInput.value || 0;

        // Construct the URL with Socrata Query Language (SoQL)
        let url = `${NYC_API_ENDPOINT}?$where=funded_amount >= ${minAmount}`;
        if (borough) {
            url += ` AND borough='${borough}'`;
        }

        const requestOptions = {
            method: 'GET',
            headers: {
                'X-App-Token': APP_TOKEN,
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch(url, requestOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            renderResults(data);
            
        } catch (error) {
            console.error("API Error:", error);
            resultsContainer.innerHTML = `<p>Error: ${error.message}. Check your App Token and network.</p>`;
        }
    };

    // 3. UI RENDERING FUNCTION
    const renderResults = (data) => {
        resultsContainer.innerHTML = '';

        if (!data || data.length === 0) {
            resultsContainer.innerHTML = `
                <div class="empty-state">
                    <p>No live tourism grants found matching these filters.</p>
                    <small>Try lowering the minimum amount or selecting "All Boroughs".</small>
                </div>`;
            return;
        }

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'grant-card';

            const title = item.project_title || "Untitled Project";
            const org = item.organization_name || "Unknown Organization";
            const amount = item.funded_amount ? parseFloat(item.funded_amount).toLocaleString() : "0";
            const borough = item.borough || "Not Specified";
            const agency = item.agency || "NYC Agency";
            const year = item.fy || "N/A";

            card.innerHTML = `
                <div class="grant-header">
                    <div>
                        <h3 style="margin: 0; color: #1e293b;">${title}</h3>
                        <p style="margin: 5px 0; font-size: 0.9rem; color: #64748b;">
                            <strong>Org:</strong> ${org}
                        </p>
                    </div>
                    <span class="amount-tag" style="white-space: nowrap;">$${amount}</span>
                </div>
                
                <div class="grant-details" style="margin-top: 15px; display: flex; gap: 15px; font-size: 0.8rem;">
                    <span>📍 <strong>Borough:</strong> ${borough}</span>
                    <span>📅 <strong>Fiscal Year:</strong> 20${year}</span>
                    <span>🏛️ <strong>Agency:</strong> ${agency}</span>
                </div>

                <div style="margin-top: 15px; border-top: 1px solid #f1f5f9; padding-top: 10px;">
                     <button class="view-details-btn" 
                             style="background: none; border: none; color: #2563eb; cursor: pointer; font-weight: 600;">
                             Analyze Opportunity →
                     </button>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    };

    // 4. EVENT LISTENERS (Must be inside DOMContentLoaded)
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        fetchGrants();
    });

}); // End of DOMContentLoaded
