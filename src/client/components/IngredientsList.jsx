import Ingredient from "./Ingredient";

const IngredientsList = ({ ingredients }) => {
    let ingredientsArr;
    try {
        ingredientsArr = JSON.parse(ingredients);
    } catch (error) {
        console.error("Error parsing ingredients:", error);
        ingredientsArr = [];
    };

    return (
        <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Ingredients</h3>
            <p className="text-sm text-gray-600 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Click on product info to view on Countdown
            </p>
            <ul className="space-y-2">
                {ingredientsArr.map((ingredient, index) => (
                <li key={`ingredient-${index}`}>
                    <Ingredient name={ingredient} />
                </li>
                ))}
            </ul>
        </div>
    )
}

export default IngredientsList;