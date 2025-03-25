import React, { useState } from 'react';
import axios from 'axios';

const ScriptWriting = () => {
    const [topic, setTopic] = useState('');
    const [generatedScript, setGeneratedScript] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [duration, setDuration] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editableScript, setEditableScript] = useState(null);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const handleGenerate = async () => {
        if (!topic) return;

        setIsGenerating(true);
        try {
            const prompt = `Write a script for a video about ${topic}. The video should be ${duration} minutes long.`;
            const response = await axios.post(`${BACKEND_URL}/script/generate`, { text: prompt });
            const parsedData = JSON.parse(response.data.data);
            setGeneratedScript(parsedData.response);
            setEditableScript(parsedData.response);
        } catch (err) {
            console.error('Error fetching script:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExport = () => {
        if (!editableScript) return;

        let formattedScript = `Title: ${editableScript.title}\n\n`;
        formattedScript += `Introduction: ${editableScript.introduction.text}\n\n`;

        editableScript.content.forEach(section => {
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

        formattedScript += `Conclusion: ${editableScript.conclusion.text}\n\n`;
        formattedScript += `Call to Action: ${editableScript.call_to_action.text}`;

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

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveEdits = () => {
        setGeneratedScript(editableScript);
        console.log(editableScript);
        setIsEditing(false);
    };

    const handleSave = async () => {
        console.log('Saving script...');
        const FormData = {
            userId: localStorage.getItem('userId'),
            ...generatedScript
        }
        const response = await axios.post(`${BACKEND_URL}/history/script`, FormData);
        if (response.data.success) {
            alert('Script saved successfully!');
        }
    };

    const handleCancelEdits = () => {
        setEditableScript(generatedScript);
        setIsEditing(false);
    };

    const handleTitleChange = (e) => {
        setEditableScript({
            ...editableScript,
            title: e.target.value
        });
    };

    const handleIntroductionChange = (e) => {
        setEditableScript({
            ...editableScript,
            introduction: {
                ...editableScript.introduction,
                text: e.target.value
            }
        });
    };

    const handleSectionChange = (index, field, value) => {
        const updatedContent = [...editableScript.content];
        updatedContent[index] = {
            ...updatedContent[index],
            [field]: value
        };
        setEditableScript({
            ...editableScript,
            content: updatedContent
        });
    };

    const handleExampleChange = (sectionIndex, exampleIndex, value) => {
        const updatedContent = [...editableScript.content];
        const updatedExamples = [...updatedContent[sectionIndex].examples];
        updatedExamples[exampleIndex] = value;

        updatedContent[sectionIndex] = {
            ...updatedContent[sectionIndex],
            examples: updatedExamples
        };

        setEditableScript({
            ...editableScript,
            content: updatedContent
        });
    };

    const handleConclusionChange = (e) => {
        setEditableScript({
            ...editableScript,
            conclusion: {
                ...editableScript.conclusion,
                text: e.target.value
            }
        });
    };

    const handleCtaChange = (e) => {
        setEditableScript({
            ...editableScript,
            call_to_action: {
                ...editableScript.call_to_action,
                text: e.target.value
            }
        });
    };

    // AI Loader Component
    const AILoader = () => (
        <div className="flex flex-col items-center justify-center w-full py-12 sm:py-16">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                {/* Outer circle */}
                <div className="absolute inset-0 border-4 border-t-stone-800 border-r-stone-400 border-b-stone-300 border-l-stone-500 rounded-full animate-spin"></div>
                {/* Middle circle */}
                <div className="absolute inset-2 border-3 border-t-stone-700 border-r-stone-300 border-b-stone-400 border-l-stone-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                {/* Inner circle */}
                <div className="absolute inset-4 border-2 border-t-stone-600 border-r-stone-200 border-b-stone-500 border-l-stone-300 rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
                {/* Dot in the center */}
                <div className="absolute inset-1/3 bg-stone-800 rounded-full animate-pulse"></div>
            </div>
            <p className="mt-6 text-sm sm:text-base text-stone-700 font-medium">Generating your script...</p>
            <div className="mt-2 flex justify-center space-x-1">
                <span className="h-2 w-2 bg-stone-600 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                <span className="h-2 w-2 bg-stone-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="h-2 w-2 bg-stone-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-full p-4 bg-stone-50 min-h-screen md:pl-[300px] lg:pl-[300px]">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 mb-4 md:mb-6">Script Writing</h1>

            <div className="mb-4 sm:mb-6 bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-stone-200">
                <div className="flex flex-row flex-wrap gap-3 mb-2">
                    <div className="flex-1 min-w-[250px]">
                        <label htmlFor="topic" className="block text-sm font-medium text-stone-700 mb-2">
                            Video Topic
                        </label>
                        <input
                            type="text"
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Enter the topic of your video"
                            className="w-full px-3 py-2 sm:py-3 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white text-stone-900"
                        />
                    </div>
                    <div className="w-[150px]">
                        <label htmlFor="duration" className="block text-sm font-medium text-stone-700 mb-2">
                            Duration (minutes)
                        </label>
                        <input
                            type="number"
                            id="duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="0"
                            className="w-full px-3 py-2 sm:py-3 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white text-stone-900"
                        />
                    </div>
                    <div className="flex items-end w-full sm:w-auto">
                        <button
                            onClick={handleGenerate}
                            disabled={!topic || isGenerating}
                            className={`w-full sm:w-auto mt-auto px-4 sm:px-6 py-2 sm:py-3 rounded-md font-medium text-center whitespace-nowrap ${!topic || isGenerating
                                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                                : 'bg-stone-800 text-white hover:bg-stone-900'
                                } transition-colors`}
                        >
                            {isGenerating ? 'Generating...' : 'Generate Script'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-stone-200">
                    <h2 className="text-md sm:text-lg font-medium text-stone-900 mb-2 sm:mb-0">Generated Script</h2>
                    <div className="flex gap-2 w-full sm:w-auto">
                        {!isEditing && generatedScript && (
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    onClick={handleSave}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm font-medium bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors flex items-center justify-center sm:justify-start flex-1 sm:flex-none"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Save
                                </button>
                                <button
                                    onClick={handleEditToggle}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm font-medium bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors flex items-center justify-center sm:justify-start flex-1 sm:flex-none"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Edit
                                </button>
                            </div>
                        )}
                        {isEditing && (
                            <>
                                <button
                                    onClick={handleSaveEdits}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm font-medium bg-stone-800 text-white hover:bg-stone-900 transition-colors flex items-center justify-center sm:justify-start flex-1 sm:flex-none"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancelEdits}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm font-medium bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors flex items-center justify-center sm:justify-start flex-1 sm:flex-none"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                        <button
                            onClick={handleExport}
                            disabled={!generatedScript}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-sm font-medium flex-1 sm:flex-none ${!generatedScript
                                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                                : 'bg-stone-100 text-stone-800 hover:bg-stone-200'} transition-colors flex items-center justify-center sm:justify-start`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export
                        </button>
                    </div>
                </div>

                <div className="p-3 sm:p-4 md:p-6">
                    {isGenerating ? (
                        <AILoader />
                    ) : generatedScript ? (
                        isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={editableScript.title}
                                        onChange={handleTitleChange}
                                        className="w-full px-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Introduction</label>
                                    <textarea
                                        value={editableScript.introduction.text}
                                        onChange={handleIntroductionChange}
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300"
                                    />
                                </div>

                                {editableScript.content.map((section, index) => (
                                    <div key={index} className="border border-stone-200 rounded-md p-3">
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium text-stone-700 mb-1">Section Heading</label>
                                            <input
                                                type="text"
                                                value={section.heading}
                                                onChange={(e) => handleSectionChange(index, 'heading', e.target.value)}
                                                className="w-full px-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="block text-sm font-medium text-stone-700 mb-1">Section Details</label>
                                            <textarea
                                                value={section.details}
                                                onChange={(e) => handleSectionChange(index, 'details', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300"
                                            />
                                        </div>

                                        {section.examples && (
                                            <div>
                                                <label className="block text-sm font-medium text-stone-700 mb-1">Examples</label>
                                                {section.examples.map((example, exampleIndex) => (
                                                    <input
                                                        key={exampleIndex}
                                                        type="text"
                                                        value={example}
                                                        onChange={(e) => handleExampleChange(index, exampleIndex, e.target.value)}
                                                        className="w-full px-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 mb-2"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Conclusion</label>
                                    <textarea
                                        value={editableScript.conclusion.text}
                                        onChange={handleConclusionChange}
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Call to Action</label>
                                    <textarea
                                        value={editableScript.call_to_action.text}
                                        onChange={handleCtaChange}
                                        rows={2}
                                        className="w-full px-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300"
                                    />
                                </div>
                            </div>
                        ) : (
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
                        )
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