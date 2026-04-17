// 1. INITIALIZE SUPABASE
const SUPABASE_URL = 'https://mnpomkifpkkifughwipe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_cnp_y3U5vggSgDIRsIa5sg_6FcKU98H';
// const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// NEW: NYC Open Data Endpoint
const NYC_API_ENDPOINT = "https://data.cityofnewyork.us/resource/x4ud-jhxu.json";
const APP_TOKEN = "K4CShHFvxEN3pKWcdK6bd7v2c"; // Get this from data.cityofnewyork.us

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const resultsContainer = document.getElementById('results-container');
    const categorySelect = document.getElementById('category');
    const minAmountInput = document.getElementById('min-amount');

    const fetchGrants = async () => {
        resultsContainer.innerHTML = '<p>AI Agent fetching live NYC Open Data...</p>';

        const borough = categorySelect.value;
        const minAmount = minAmountInput.value || 0;

        // Construct the URL with Socrata Query Language (SoQL)
        let url = `${NYC_API_ENDPOINT}?$where=funded_amount >= ${minAmount}`;
        if (borough) {
            url += ` AND borough='${borough}'`;
        }

        // --- THE HEADERS SECTION ---
        const requestOptions = {
            method: 'GET',
            headers: {
                'X-App-Token': APP_TOKEN,
                'Content-Type': 'application/json'
            }
        };

        try {
            // Pass requestOptions as the second argument to fetch
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
// document.addEventListener('DOMContentLoaded', () => {
//     const searchBtn = document.getElementById('search-btn');
//     const resultsContainer = document.getElementById('results-container');
//     const categorySelect = document.getElementById('category');
//     const minAmountInput = document.getElementById('min-amount');

    // // 2. THE FETCH FUNCTION
    // const fetchGrants = async () => {
    //     resultsContainer.innerHTML = '<p>AI Agent querying Tourism Database...</p>';

    //     // Target the new table name: 'tourism_grants'
    //     let query = db
    //         .from('tourism_grants')
    //         .select('*');

    //     // Apply dynamic filters from the UI
    //     // Note: The CSV uses 'borough' or 'project_title'. 
    //     // We'll filter by 'borough' based on your category selection.
    //     if (categorySelect.value) {
    //         query = query.ilike('borough', `%${categorySelect.value}%`);
    //     }
        
    //     // CSV uses 'funded_amount' as the primary currency column
    //     if (minAmountInput.value) {
    //         query = query.gte('funded_amount', parseInt(minAmountInput.value));
    //     }

    //     const { data, error } = await query;

    //     if (error) {
    //         console.error("Error fetching grants:", error);
    //         resultsContainer.innerHTML = '<p>Error connecting to database.</p>';
    //         return;
    //     }

    //     renderResults(data);
    // };

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

    // 3. UI RENDERING
    const renderResults = (data) => {
        resultsContainer.innerHTML = '';
        if (data.length === 0) {
            resultsContainer.innerHTML = '<p>No tourism opportunities found matching these filters.</p>';
            return;
        }

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'grant-card';
            
            // Mapping CSV headers to UI elements:
            // project_title -> Title
            // borough -> Category
            // organization_name -> Source
            // funded_amount -> Amount
            card.innerHTML = `
                <div class="grant-header">
                    <div>
                        <h3>${item.project_title}</h3>
                        <small>Location: ${item.borough} | Organization: ${item.organization_name}</small>
                    </div>
                    <span class="amount-tag">$${(item.funded_amount || 0).toLocaleString()}</span>
                </div>
                <p style="font-size: 0.85rem; margin-top: 10px; color: #64748b;">
                    Fiscal Year: 20${item.fy} | Agency: ${item.agency}
                </p>
            `;
            resultsContainer.appendChild(card);
        });
    };

    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        fetchGrants();
    });
});
