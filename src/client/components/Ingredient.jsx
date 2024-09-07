import React, { useState, useEffect } from "react";
import { getCache, setCache } from "../utils/cache";

function Ingredient({ name }) {
    const [productInfo, setProductInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductInfo = async () => {
            try {
                let ingredientName = null;
                // Parsing for simple ingredients, like "2 Sausages"
                ingredientName = name.match(/^(\d*\.?\d+)\s*(.*)$/).slice(1);

                if (!ingredientName) {
                    // Parsing for multi word ingredients like "1 Slice Black Pudding"
                    ingredientName = name.replace(/^[\d.]+\s*[a-zA-Z]*\s*/, '').trim().split(' ').pop();
                }
                const searchTerm = ingredientName.pop(); // Get the last word

                const cachedData = getCache(searchTerm);
                if (cachedData) {
                    setProductInfo(cachedData);
                    setLoading(false);
                    return;
                }

                const response = await fetch(`/api/ingredient-info`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ingredient: searchTerm }),
                });
                const data = await response.json();
                // const data = null
                setProductInfo(data);
                setCache(searchTerm, data);
            } catch (error) {
                console.error("Error fetching product info: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductInfo();
    }, [name]);

    const handleProductClick = () => {
        if (productInfo && productInfo.product) {
            const searchQuery = encodeURIComponent(productInfo.product.name);
            window.open(`https://www.countdown.co.nz/shop/searchproducts?search=${searchQuery}`, "_blank");
        }
    };

    const formatPrice = (price) => {
        return typeof price === "number" ? `$${price.toFixed(2)}` : "N/A";
    };

    return (
        <div className="ingredient-item flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-800">{name}</span>
            {loading ? (
                <span className="text-sm text-gray-500">Loading...</span>
            ) : (
                productInfo && productInfo.product && (
                <div 
                    className="flex items-center cursor-pointer hover:bg-gray-200 p-1 rounded transition duration-300"
                    onClick={handleProductClick}
                    title="Click to view on Countdown"
                >
                    <span className="text-sm font-semibold text-gray-600 mr-2">
                    {formatPrice(productInfo.product.price)}
                    </span>
                    {productInfo.product.image && (
                    <img src={productInfo.product.image} alt={name} className="w-8 h-8 object-cover rounded" />
                    )}
                </div>
                )
            )}
        </div>
    )
}

export default Ingredient;