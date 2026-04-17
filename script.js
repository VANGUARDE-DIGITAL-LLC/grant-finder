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
    resultsContainer.innerHTML = '<p>AI Agent scanning NYC databases...</p>';

    const boroughValue = categorySelect.value; // e.g., "BROOKLYN"
    const minAmount = minAmountInput.value || 0;

    // 1. Build a more flexible query
    // We use 'cascading' filters: if one fails, we can see why in the console
    let url = `${NYC_API_ENDPOINT}?$where=funded_amount >= '${minAmount}'`;
    
    // 2. Address Case Sensitivity
    // NYC Data often uses 'Brooklyn' instead of 'BROOKLYN'
    if (boroughValue) {
        const titleCaseBorough = boroughValue.charAt(0) + boroughValue.slice(1).toLowerCase();
        url += ` AND (borough='${boroughValue}' OR borough='${titleCaseBorough}')`;
    }

    // 3. Add a limit to ensure we get something back for testing
    url += "&$limit=50";

    console.log("Querying NYC API:", url); // Click this link in your Console to see raw data!

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
            const errorData = await response.json();
            console.error("NYC API Error Detail:", errorData);
            throw new Error(`NYC Data is temporarily unavailable (Status: ${response.status})`);
        }

        const data = await response.json();
        console.log("Data Received:", data);
        renderResults(data);
        
    } catch (error) {
        console.error("API Error:", error);
        resultsContainer.innerHTML = `<p style="color:red;">Error: ${error.message}.</p>`;
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
