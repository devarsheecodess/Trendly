import React, { useState, useRef } from 'react';

const VoiceOver = () => {
    const [script, setScript] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [audioUrl, setAudioUrl] = useState('');
    const [selectedVoice, setSelectedVoice] = useState('female-1');
    const [voiceSpeed, setVoiceSpeed] = useState(1);
    const audioRef = useRef(null);

    // Voice options
    const voices = [
        { id: 'female-1', name: 'Emma (Female)', accent: 'American' },
        { id: 'male-1', name: 'James (Male)', accent: 'British' },
        { id: 'female-2', name: 'Sophia (Female)', accent: 'Australian' },
        { id: 'male-2', name: 'Michael (Male)', accent: 'American' },
    ];

    const handleGenerate = () => {
        if (!script) return;

        setIsGenerating(true);

        // Simulate AI voice generation
        setTimeout(() => {
            setAudioUrl('https://example.com/sample-audio.mp3');
            setIsGenerating(false);
        }, 2000);
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setScript(event.target.result);
                };
                reader.readAsText(file);
            }
        };

        input.click();
    };

    return (
        <div className="w-full p-3 sm:p-4 md:p-6 bg-stone-50 min-h-screen md:pl-[300px] lg:pl-[300px]">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 mb-3 sm:mb-4 md:mb-6">Voice Over</h1>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
                {/* Script Input Section */}
                <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-stone-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 sm:mb-3 md:mb-4">
                        <label htmlFor="script" className="block text-sm font-medium text-stone-700 mb-2 sm:mb-0">
                            Script Content
                        </label>
                        <button
                            onClick={handleImport}
                            className="px-3 py-1.5 text-sm rounded-md bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors flex items-center w-full sm:w-auto justify-center sm:justify-start mb-2 sm:mb-0"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Import
                        </button>
                    </div>
                    <textarea
                        id="script"
                        value={script}
                        onChange={(e) => setScript(e.target.value)}
                        placeholder="Enter or paste your script here..."
                        className="w-full h-36 sm:h-48 md:h-64 px-3 sm:px-4 py-2 sm:py-3 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white text-stone-900 resize-none"
                    />
                </div>

                {/* Voice Settings Section */}
                <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-stone-200">
                    <h2 className="text-md sm:text-lg font-medium text-stone-900 mb-3 sm:mb-4">Voice Settings</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                        <div className="mb-3 sm:mb-4">
                            <label htmlFor="voice" className="block text-sm font-medium text-stone-700 mb-1">
                                Select Voice
                            </label>
                            <select
                                id="voice"
                                value={selectedVoice}
                                onChange={(e) => setSelectedVoice(e.target.value)}
                                className="w-full px-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white text-stone-900"
                            >
                                {voices.map((voice) => (
                                    <option key={voice.id} value={voice.id}>
                                        {voice.name} ({voice.accent})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3 sm:mb-4">
                            <label htmlFor="speed" className="block text-sm font-medium text-stone-700 mb-1">
                                Speed: {voiceSpeed}x
                            </label>
                            <input
                                type="range"
                                id="speed"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={voiceSpeed}
                                onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                                className="w-full accent-stone-800"
                            />
                            <div className="flex justify-between text-xs text-stone-500">
                                <span>0.5x</span>
                                <span>1x</span>
                                <span>2x</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!script || isGenerating}
                        className={`w-full px-4 py-2 sm:py-3 rounded-md font-medium mt-2 sm:mt-3 ${!script || isGenerating
                            ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                            : 'bg-stone-800 text-white hover:bg-stone-900'
                            } transition-colors flex items-center justify-center`}
                    >
                        {isGenerating ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            'Generate Voice Over'
                        )}
                    </button>
                </div>
            </div>

            {/* Audio Player Section */}
            <div className={`mt-3 sm:mt-4 md:mt-6 bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-stone-200 ${audioUrl ? 'block' : 'hidden'}`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4">
                    <h2 className="text-md sm:text-lg font-medium text-stone-900 mb-2 sm:mb-0">Generated Audio</h2>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                        <button
                            className="px-3 py-1.5 text-sm rounded-md bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors flex items-center justify-center"
                            onClick={() => audioRef.current?.play()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Play
                        </button>
                        <a
                            href={audioUrl}
                            download="voice-over.mp3"
                            className="px-3 py-1.5 text-sm rounded-md bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                        </a>
                    </div>
                </div>

                <div className="bg-stone-50 p-2 sm:p-3 md:p-4 rounded-md">
                    <audio ref={audioRef} controls className="w-full">
                        <source src={audioUrl} type="audio/mp3" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            </div>
        </div>
    );
};

export default VoiceOver;