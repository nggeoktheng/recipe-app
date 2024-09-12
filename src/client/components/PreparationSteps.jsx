const PreparationSteps = ({ steps }) => {
    const stepsArr = steps.split("\n");

    return (
        <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Preparation Steps</h3>
            {/* <ol className="list-decimal list-inside space-y-2">
                {stepsArr.map((step, index) => (
                <li key={`step-${index}`} className="text-gray-700">{step}</li>
                ))}
            </ol> */}
            {/* <article class="prose">{steps}</article> */}
            <article className="prose">{stepsArr.map((step) => (<p>{step}</p>) )}</article>
        </div>
    )
}

export default PreparationSteps;