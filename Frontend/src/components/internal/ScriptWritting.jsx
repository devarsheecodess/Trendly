import React, { useState } from 'react';
import axios from 'axios';

const ScriptWriting = () => {
    const [topic, setTopic] = useState('');
    const [generatedScript, setGeneratedScript] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [duration, setDuration] = useState(0);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const handleGenerate = async () => {
        if (!topic) return;

        setIsGenerating(true);
        try {
            const prompt = `Write a script for a video about ${topic}. The video should be ${duration} minutes long.`;
            const response = await axios.post(`${BACKEND_URL}/script/generate`, { text: prompt });
            const parsedData = JSON.parse(response.data.data);
            setGeneratedScript(parsedData.response);
        } catch (err) {
            console.error('Error fetching script:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExport = () => {
        if (!generatedScript) return;

        let formattedScript = `Title: ${generatedScript.title}\n\n`;
        formattedScript += `Introduction: ${generatedScript.introduction.text}\n\n`;

        generatedScript.content.forEach(section => {
            formattedScript += `## ${section.heading}\n`;
            formattedScript += `${section.details}\n`;
            if (section.examples) {
                formattedScript += "Examples:\n";
                section.examples.forEach(example => {
                    formattedScript += `- ${example}\n`;
                });
            }
            formattedScript += "\n";
        });

        formattedScript += `Conclusion: ${generatedScript.conclusion.text}\n\n`;
        formattedScript += `Call to Action: ${generatedScript.call_to_action.text}`;

        const blob = new Blob([formattedScript], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${topic.replace(/\s+/g, '-').toLowerCase()}-script.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full max-w-full p-4 bg-stone-50 min-h-screen md:pl-[300px] lg:pl-[300px]">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 mb-4 md:mb-6">Script Writing</h1>

            <div className="mb-4 sm:mb-6 bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-stone-200">
                <label htmlFor="topic" className="block text-sm font-medium text-stone-700 mb-2">
                    Video Topic
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter the topic of your video"
                        className="flex-grow px-3 py-2 sm:py-3 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white text-stone-900 w-full"
                    />
                    <input
                        type="number"
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="Duration"
                        className="flex-grow px-3 py-2 sm:py-3 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white text-stone-900 w-full"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={!topic || isGenerating}
                        className={`mt-2 sm:mt-0 px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium text-center whitespace-nowrap ${!topic || isGenerating
                            ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                            : 'bg-stone-800 text-white hover:bg-stone-900'} transition-colors sm:w-auto w-full`}
                    >
                        {isGenerating ? 'Generating...' : 'Generate Script'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-stone-200">
                    <h2 className="text-md sm:text-lg font-medium text-stone-900 mb-2 sm:mb-0">Generated Script</h2>
                    <button
                        onClick={handleExport}
                        disabled={!generatedScript}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm font-medium w-full sm:w-auto ${!generatedScript
                            ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                            : 'bg-stone-100 text-stone-800 hover:bg-stone-200'} transition-colors flex items-center justify-center sm:justify-start`}
                    >
                        Export
                    </button>
                </div>

                <div className="p-3 sm:p-4 md:p-6">
                    {generatedScript ? (
                        <div className="whitespace-pre-wrap font-sans text-stone-800 min-h-[200px] sm:min-h-[250px] md:min-h-[300px] text-sm sm:text-base overflow-x-auto">
                            <h2 className="font-bold text-lg">{generatedScript.title}</h2>
                            <p>{generatedScript.introduction.text}</p>
                            {generatedScript.content.map((section, index) => (
                                <div key={index} className="mt-4">
                                    <h3 className="font-semibold text-md">{section.heading}</h3>
                                    <p>{section.details}</p>
                                    {section.examples && (
                                        <ul className="list-disc list-inside mt-2">
                                            {section.examples.map((example, idx) => (
                                                <li key={idx}>{example}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                            <p className="mt-4 font-bold">Conclusion:</p>
                            <p>{generatedScript.conclusion.text}</p>
                            <p className="mt-4 font-bold">Call to Action:</p>
                            <p>{generatedScript.call_to_action.text}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-8 sm:py-12 md:py-16">
                            <p className="text-stone-500 text-sm sm:text-base">Enter a topic and click "Generate Script" to create your content</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScriptWriting;
