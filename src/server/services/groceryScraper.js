// https://stackoverflow.com/questions/76031310/scraping-price-from-countdown-co-nz-using-beautiful-soup-and-python-not-workin
// Countdown API
// Search API URL: https://www.woolworths.co.nz/api/v1/products?target=search&search=apples&inStockProductsOnly=false&size=48

async function setupCountdownAddress() {
    const url = 'https://www.countdown.co.nz/api/v1/fulfilment/my/pickup-addresses';
    const payload = {
      "addressId": 2673966  // For Woolworths Hamilton
    };
  
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'OnlineShopping.WebApp',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            body: JSON.stringify(payload)
        });
    
        if (!response.ok) {
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
        const [quantity, ...nameParts] = ingredient.trim().split(' ');
        const name = nameParts.join(' ');
    
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
                'Accept': 'application/json',
                'X-Requested-With': 'OnlineShopping.WebApp',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
    
            console.log('Data: ', data);
    
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