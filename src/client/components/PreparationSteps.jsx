const PreparationSteps = ({ steps }) => {
    // Find all the sentences based on the periods and question marks and other punctuation
    const sentences = steps.match( /[^\.!\?]+[\.!\?]+/g );

    // Join the sentences with line breaks
    const sentencesWithBreaks = Array.isArray(sentences) ? sentences.join("\n") : '';

    const instructionsToDisplay = sentencesWithBreaks.length < steps.length ? steps : sentencesWithBreaks;

    return (
        <div className="mb-6 px-4">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Preparation Steps</h3>
            <article className="prose prose-lg max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{instructionsToDisplay}</p>
            </article>
        </div>
    )
}

export default PreparationSteps;