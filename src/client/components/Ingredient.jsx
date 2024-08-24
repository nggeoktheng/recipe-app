import React, { useState, useEffect } from "react";

function Ingredient({ name }) {
    const [productInfo, setProductInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductInfo = async () => {
            try {
                const response = await fetch(`/api/ingredient-info`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ingredient: name }),
                });
                const data = await response.json();
                setProductInfo(data);
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