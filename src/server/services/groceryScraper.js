// https://stackoverflow.com/questions/76031310/scraping-price-from-countdown-co-nz-using-beautiful-soup-and-python-not-workin
// Countdown API
// Search API URL: https://www.woolworths.co.nz/api/v1/products?target=search&search=apples&inStockProductsOnly=false&size=48

const browserRequestHeaders = {
    'X-Requested-With': 'OnlineShopping.WebApp',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    // 'x-ui-ver': '7.46.138',
    // 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    // 'Accept': 'application/json, text/plain, */*',
    'referer': 'https://www.google.com/'
}

async function setupCountdownAddress() {
    const url = 'https://www.countdown.co.nz/api/v1/fulfilment/my/pickup-addresses';
    const payload = {
      "addressId": 2673966  // For Woolworths Hamilton
    };
  
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                ...browserRequestHeaders
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        });
    
        if (!response.ok) {
            console.error(`Failed to set up address:`, response);
            throw new Error(`Failed to set up address: ${response.status}`);
        }
    
        console.log("Address ID updated successfully!");
    } catch (error) {
        console.error("Error setting up Countdown address:", error);
    }
}

async function searchCountdownNZ(ingredients) {
    // Set up the address once
    await setupCountdownAddress();
  
    const results = [];
  
    for (const ingredient of ingredients) {
        console.log("Looking at", ingredient);

        const quantity = 1;
        const name = ingredient;
    
        const url = `https://www.woolworths.co.nz/api/v1/products`;
        const params = new URLSearchParams({
            target: 'search',
            search: name,
            inStockProductsOnly: 'false',
            size: '1'
        });
  
        try {
            const response = await fetch(`${url}?${params}`, {
                method: 'GET',
                headers: {
                    ...browserRequestHeaders
                },
                credentials: 'include'
            });
            
            let data;
            if (!response.ok) {
                // throw new Error(`HTTP error! status: ${response.status}`);
                console.log("Response FAILED");
            } else {
                data = await response.json();
            }
    
            if (data.products && data.products.items && data.products.items.length > 0) {
                const product = data.products.items[0];
                results.push({
                    quantity,
                    name,
                    product: {
                    name: product.name,
                    brand: product.brand,
                    size: product.size?.volumeSize,
                    unit: product.unit,
                    price: product.price?.salePrice,
                    image: product.images?.small,
                    stockLevel: product.stockLevel,
                    averageWeightPerUnit: product.averageWeightPerUnit
                    }
                });
            } else {
                console.log(`No products found for: ${name}`);
                results.push({ quantity, name, product: null });
            }
        } catch (error) {
            console.error(`Error searching Countdown for ${name}:`, error);
            results.push({ quantity, name, product: null });
        }
    
        // Wait for 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
  
    return results;
}
  
export { searchCountdownNZ };