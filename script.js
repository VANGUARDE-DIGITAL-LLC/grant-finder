// 1. INITIALIZE SUPABASE
// const SUPABASE_URL = 'https://mnpomkifpkkifughwipe.supabase.co';
// const SUPABASE_ANON_KEY = 'sb_publishable_cnp_y3U5vggSgDIRsIa5sg_6FcKU98H';
// const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// NEW: NYC Open Data Endpoint
const NYC_API_ENDPOINT = "https://data.cityofnewyork.us/resource/x4ud-jhxu.json";

const fetchGrants = async () => {
    resultsContainer.innerHTML = '<p>AI Agent fetching live NYC Open Data...</p>';

    const borough = categorySelect.value;
    const minAmount = minAmountInput.value || 0;

    // Build the Socrata Query (SoQL)
    // $where clause handles the filtering logic
    let url = `${NYC_API_ENDPOINT}?$where=funded_amount >= ${minAmount}`;
    
    if (borough) {
        url += ` AND borough='${borough}'`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) throw new Error(data.message);
        
        renderResults(data);
    } catch (error) {
        console.error("API Error:", error);
        resultsContainer.innerHTML = '<p>Error fetching live data. The NYC API might be throttled.</p>';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const resultsContainer = document.getElementById('results-container');
    const categorySelect = document.getElementById('category');
    const minAmountInput = document.getElementById('min-amount');

    // 2. THE FETCH FUNCTION (The "Backend" Logic)
    const fetchGrants = async () => {
        resultsContainer.innerHTML = '<p>AI Agent querying live database...</p>';

        // Build the query
        let query = db
            .from('grants')
            .select('*');

        // Apply dynamic filters from the UI
        if (categorySelect.value) {
            query = query.ilike('category', `%${categorySelect.value}%`);
        }
        if (minAmountInput.value) {
            query = query.gte('amount', parseInt(minAmountInput.value));
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching grants:", error);
            resultsContainer.innerHTML = '<p>Error connecting to database.</p>';
            return;
        }

        renderResults(data);
    };

    // 3. UI RENDERING
    const renderResults = (data) => {
        resultsContainer.innerHTML = '';
        if (data.length === 0) {
            resultsContainer.innerHTML = '<p>No opportunities found matching these filters.</p>';
            return;
        }

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
            `;
            resultsContainer.appendChild(card);
        });
    };

    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        fetchGrants();
    });
});
