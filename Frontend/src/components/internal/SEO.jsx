import React, { useState } from 'react';
import { Search, ArrowRight, RefreshCw, Check, X, ThumbsUp, AlertCircle, Sparkles } from 'lucide-react';
import axios from 'axios';

const SEO = () => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [briefValue, setBriefValue] = useState('');
    const [titleValue, setTitleValue] = useState('');
    const [titleScore, setTitleScore] = useState(0);
    const [optimizedTitle, setOptimizedTitle] = useState('');
    const [description, setDescription] = useState('');
    const [hashtags, setHashtags] = useState([]);
    const [tags, setTags] = useState([]);
    const [strengthPoints, setStrengthPoints] = useState([]);
    const [opportunityPoints, setOpportunityPoints] = useState([]);
    const [weaknessPoints, setWeaknessPoints] = useState([]);
    const [primaryKeywords, setPrimaryKeywords] = useState([]);
    const [longTailKeywords, setLongTailKeywords] = useState([]);
    const [optimalVideoLength, setOptimalVideoLength] = useState('');
    const [bestPublishingTime, setBestPublishingTime] = useState('');
    const [thumbnailStyle, setThumbnailStyle] = useState('');
    const [engagementHooks, setEngagementHooks] = useState('');
    const [SEOData, setSEOData] = useState({});
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    // Process the API response
    const processAnalysisResponse = (responseText) => {
        try {
            // First, try to parse the responseText as JSON
            let jsonData;
            try {
                jsonData = JSON.parse(responseText);
                responseText = jsonData.response || responseText;
            } catch (e) {
                // If parsing fails, use the responseText as is
                console.log("Response is not valid JSON, using as text");
            }

            // Extract values into local variables first
            let extractedTitleScore;
            let extractedOptimizedTitle;
            let extractedDescription;
            let extractedHashtags = [];
            let extractedTags = [];
            let extractedStrengthPoints = [];
            let extractedOpportunityPoints = [];
            let extractedWeaknessPoints = [];
            let extractedPrimaryKeywords = [];
            let extractedLongTailKeywords = [];
            let extractedOptimalVideoLength;
            let extractedBestPublishingTime;
            let extractedThumbnailStyle;
            let extractedEngagementHooks;

            // Extract title score
            const scoreMatch = responseText.match(/Score: (\d+)/);
            if (scoreMatch) {
                extractedTitleScore = parseInt(scoreMatch[1]);
                setTitleScore(extractedTitleScore);
            }

            // Extract optimized title
            const optimizedTitleMatch = responseText.match(/Optimized Title Suggestion: ['"](.+?)['"]/);
            if (optimizedTitleMatch) {
                extractedOptimizedTitle = optimizedTitleMatch[1];
                setOptimizedTitle(extractedOptimizedTitle);
            }

            // Extract description
            const descriptionMatch = responseText.match(/Generated Description:([\s\S]*?)(?=Recommended Hashtags:|$)/);
            if (descriptionMatch) {
                extractedDescription = descriptionMatch[1].trim();
                setDescription(extractedDescription);
            }

            // Extract hashtags
            const hashtagsMatch = responseText.match(/Recommended Hashtags:([\s\S]*?)(?=Recommended Tags:|$)/);
            if (hashtagsMatch) {
                const hashtagText = hashtagsMatch[1].trim();
                extractedHashtags = hashtagText.split(/\s+/).filter(tag => tag.startsWith('#'));
                setHashtags(extractedHashtags);
            }

            // Extract tags
            const tagsMatch = responseText.match(/Recommended Tags:([\s\S]*?)(?=Content Improvement Suggestions:|$)/);
            if (tagsMatch) {
                const tagsText = tagsMatch[1].trim();
                extractedTags = tagsText.split(',').map(tag => tag.trim());
                setTags(extractedTags);
            }

            // Extract improvement suggestions
            const improvementMatch = responseText.match(/Content Improvement Suggestions:([\s\S]*?)(?=Keyword Analysis:|$)/);
            if (improvementMatch) {
                const improvementText = improvementMatch[1].trim();
                extractedStrengthPoints = improvementText.split('\n').filter(line => line.includes('✓')).map(line => line.replace('✓', '').trim());
                extractedOpportunityPoints = improvementText.split('\n').filter(line => line.includes('⚠')).map(line => line.replace('⚠', '').trim());
                extractedWeaknessPoints = improvementText.split('\n').filter(line => line.includes('✗')).map(line => line.replace('✗', '').trim());

                setStrengthPoints(extractedStrengthPoints);
                setOpportunityPoints(extractedOpportunityPoints);
                setWeaknessPoints(extractedWeaknessPoints);
            }

            // Extract primary keywords
            const keywordMatch = responseText.match(/Primary Keywords:([\s\S]*?)(?=Long-tail Opportunities:|$)/);
            if (keywordMatch) {
                const keywordText = keywordMatch[1].trim();
                extractedPrimaryKeywords = keywordText.split('\n').map(line => {
                    const match = line.match(/- (.+?) - Volume: (.+?), Difficulty: (.+)/);
                    if (match) {
                        return {
                            keyword: match[1],
                            volume: match[2],
                            difficulty: match[3]
                        };
                    }
                    return null;
                }).filter(Boolean);
                setPrimaryKeywords(extractedPrimaryKeywords);
            }

            // Extract long-tail keywords
            const longTailMatch = responseText.match(/Long-tail Opportunities:([\s\S]*?)(?=Competitive Analysis:|$)/);
            if (longTailMatch) {
                const longTailText = longTailMatch[1].trim();
                extractedLongTailKeywords = longTailText.split('\n').map(line => line.replace('-', '').trim());
                setLongTailKeywords(extractedLongTailKeywords);
            }

            // Extract competitive analysis
            const competitiveMatch = responseText.match(/Competitive Analysis:([\s\S]*?)(?=$)/);
            if (competitiveMatch) {
                const competitiveText = competitiveMatch[1].trim();

                const videoLengthMatch = competitiveText.match(/Optimal Video Length: (.+?)(?=\n|$)/);
                if (videoLengthMatch) {
                    extractedOptimalVideoLength = videoLengthMatch[1];
                    setOptimalVideoLength(extractedOptimalVideoLength);
                }

                const publishTimeMatch = competitiveText.match(/Best Publishing Time: (.+?)(?=\n|$)/);
                if (publishTimeMatch) {
                    extractedBestPublishingTime = publishTimeMatch[1];
                    setBestPublishingTime(extractedBestPublishingTime);
                }

                const thumbnailMatch = competitiveText.match(/Thumbnail Style: (.+?)(?=\n|$)/);
                if (thumbnailMatch) {
                    extractedThumbnailStyle = thumbnailMatch[1];
                    setThumbnailStyle(extractedThumbnailStyle);
                }

                const hooksMatch = competitiveText.match(/Engagement Hooks: (.+?)(?=\n|$)/);
                if (hooksMatch) {
                    extractedEngagementHooks = hooksMatch[1];
                    setEngagementHooks(extractedEngagementHooks);
                }
            }

            setShowResults(true);
            setIsAnalyzing(false);

            // Combine all the extracted data in a single object to export
            setSEOData({
                titleScore: extractedTitleScore,
                optimizedTitle: extractedOptimizedTitle,
                description: extractedDescription,
                hashtags: extractedHashtags,
                tags: extractedTags,
                strengthPoints: extractedStrengthPoints,
                opportunityPoints: extractedOpportunityPoints,
                weaknessPoints: extractedWeaknessPoints,
                primaryKeywords: extractedPrimaryKeywords,
                longTailKeywords: extractedLongTailKeywords,
                optimalVideoLength: extractedOptimalVideoLength,
                bestPublishingTime: extractedBestPublishingTime,
                thumbnailStyle: extractedThumbnailStyle,
                engagementHooks: extractedEngagementHooks
            })
        } catch (error) {
            console.error("Error processing response:", error);
            setShowResults(true);
            setIsAnalyzing(false);
            return {}; // Return an empty object in case of error
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsAnalyzing(true);

        try {
            const prompt = `Generate a comprehensive SEO analysis for a video about ${briefValue} with the title ${titleValue}. \n\nFormat your response as a JSON string with this structure:\n{\n  \"response\": \"\n    Title Analysis:\n    - Score: [score between 1-100]\n    - Original Title: '${titleValue}'\n    - Optimized Title Suggestion: '[improved title]'\n    - Rating: [Excellent/Moderate/Needs Improvement]\n\n    Generated Description:\n    [compelling 2-paragraph description with benefits and value proposition]\n\n    Recommended Hashtags:\n    [5-6 relevant hashtags starting with #]\n\n    Recommended Tags:\n    [10 relevant tags separated by commas]\n\n    Content Improvement Suggestions:\n    ✓ [strength point 1]\n    ✓ [strength point 2]\n    ⚠ [opportunity point]\n    ✗ [weakness point]\n\n    Keyword Analysis:\n    Primary Keywords:\n    - [keyword 1] - Volume: [High/Medium/Low], Difficulty: [High/Medium/Low]\n    - [keyword 2] - Volume: [High/Medium/Low], Difficulty: [High/Medium/Low]\n    - [keyword 3] - Volume: [High/Medium/Low], Difficulty: [High/Medium/Low]\n    - [keyword 4] - Volume: [High/Medium/Low], Difficulty: [High/Medium/Low]\n\n    Long-tail Opportunities:\n    - [long-tail keyword 1]\n    - [long-tail keyword 2]\n    - [long-tail keyword 3]\n    - [long-tail keyword 4]\n\n    Competitive Analysis:\n    - Optimal Video Length: [length recommendation]\n    - Best Publishing Time: [day and time recommendation]\n    - Thumbnail Style: [specific thumbnail advice]\n    - Engagement Hooks: [engagement strategy recommendation]\n  \"\n}`;


            const response = await axios.post(`${BACKEND_URL}/seo/analyze`, {
                prompt,
                format: "json",
                responseStructure: {
                    titleAnalysis: {
                        score: "number between 1-100",
                        originalTitle: titleValue,
                        optimizedTitle: "improved title suggestion",
                        rating: "Excellent/Moderate/Needs Improvement"
                    },
                    description: "compelling 2-paragraph description",
                    hashtags: "5-6 relevant hashtags starting with #",
                    tags: "10 relevant tags separated by commas",
                    improvementSuggestions: {
                        strengths: ["strength point 1", "strength point 2"],
                        opportunities: ["opportunity point"],
                        weaknesses: ["weakness point"]
                    },
                    keywordAnalysis: {
                        primaryKeywords: [
                            { keyword: "keyword 1", volume: "High/Medium/Low", difficulty: "High/Medium/Low" },
                            { keyword: "keyword 2", volume: "High/Medium/Low", difficulty: "High/Medium/Low" }
                        ],
                        longTailKeywords: ["long-tail keyword 1", "long-tail keyword 2"]
                    },
                    competitiveAnalysis: {
                        optimalVideoLength: "length recommendation",
                        bestPublishingTime: "day and time recommendation",
                        thumbnailStyle: "specific thumbnail advice",
                        engagementHooks: "engagement strategy recommendation"
                    }
                }
            });
            processAnalysisResponse(response.data.response);
        } catch (err) {
            console.error("API Error:", err);
            setShowResults(true);
            setIsAnalyzing(false);
        }
    };

    const resetForm = () => {
        setBriefValue('');
        setTitleValue('');
        setShowResults(false);
        setTitleScore(0);
        setOptimizedTitle('');
        setDescription('');
        setHashtags([]);
        setTags([]);
        setStrengthPoints([]);
        setOpportunityPoints([]);
        setWeaknessPoints([]);
        setPrimaryKeywords([]);
        setLongTailKeywords([]);
        setOptimalVideoLength('');
        setBestPublishingTime('');
        setThumbnailStyle('');
        setEngagementHooks('');
    };

    // Function to determine score color
    const getScoreColor = (score) => {
        if (score >= 80) return 'bg-green-600';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    // Function to determine score text color
    const getScoreTextColor = (score) => {
        if (score >= 80) return 'bg-green-100 text-green-800';
        if (score >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    // Function to get score label
    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Moderate';
        return 'Needs Improvement';
    };

    const handleSave = () => {
        const FormData = {
            userId: localStorage.getItem('userId'),
            ...SEOData
        }
        console.log(FormData);
    };

    return (
        <div className="md:ml-64 p-4 md:p-6 bg-stone-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-stone-800 mb-2">SEO Analysis</h1>
                <p className="text-stone-600 mb-8">Optimize your video title, description, and content for better visibility and engagement</p>

                {!showResults ? (
                    <div className="bg-stone-100 rounded-xl shadow-lg p-6 mb-8">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="content-brief" className="block text-sm font-medium text-stone-700 mb-2">
                                    Content Brief
                                </label>
                                <textarea
                                    id="content-brief"
                                    className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500 bg-stone-50 transition"
                                    rows="4"
                                    placeholder="Describe your video content in detail to get better SEO recommendations..."
                                    value={briefValue}
                                    onChange={(e) => setBriefValue(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="video-title" className="block text-sm font-medium text-stone-700 mb-2">
                                    Proposed Video Title
                                </label>
                                <input
                                    type="text"
                                    id="video-title"
                                    className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500 bg-stone-50 transition"
                                    placeholder="Enter your proposed title..."
                                    value={titleValue}
                                    onChange={(e) => setTitleValue(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center bg-stone-800 hover:bg-stone-900 text-white py-3 px-6 rounded-lg font-medium transition"
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Analyzing Content...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search size={18} className="mr-2" />
                                        Analyze SEO
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Results Section */}
                        <div className="bg-stone-100 rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-stone-800 px-4 py-4 flex items-center justify-between">
                                <h2 className="text-lg md:text-xl font-semibold text-stone-50">
                                    SEO Analysis Results
                                </h2>
                                <button onClick={handleSave} className="px-4 py-2 bg-stone-700 text-stone-50 rounded-md hover:bg-stone-600 transition-colors">
                                    Save
                                </button>
                            </div>

                            <div className="p-6">
                                {/* Title Score */}
                                <div className="mb-8">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-lg font-medium text-stone-800">Title Score</h3>
                                        <div className={`font-medium px-3 py-1 rounded-full text-sm ${getScoreTextColor(titleScore)}`}>
                                            {titleScore}/100 - {getScoreLabel(titleScore)}
                                        </div>
                                    </div>

                                    <div className="w-full bg-stone-200 rounded-full h-2.5">
                                        <div className={`h-2.5 rounded-full ${getScoreColor(titleScore)}`} style={{ width: `${titleScore}%` }}></div>
                                    </div>

                                    <div className="mt-4 md:mt-6 p-4 md:p-5 bg-gradient-to-br from-stone-50 to-stone-200 rounded-lg md:rounded-xl border border-stone-300 shadow-sm w-full max-w-full overflow-hidden">
                                        <h4 className="font-semibold text-stone-800 mb-2 md:mb-3 text-base md:text-lg">Original Title</h4>
                                        <p className="text-stone-700 font-medium text-sm md:text-base break-words">{titleValue}</p>

                                        <div className="my-3 md:my-4 border-t border-stone-300"></div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 mb-2 md:mb-3">
                                            <h4 className="font-semibold text-stone-800 text-base md:text-lg">Optimized Title Suggestion</h4>
                                            <div className="flex items-center gap-1 bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium self-start sm:self-auto">
                                                <Sparkles size={12} className="text-indigo-500 shrink-0" />
                                                <span>AI recommended</span>
                                            </div>
                                        </div>

                                        <p className="text-stone-700 font-medium text-sm md:text-base break-words">{optimizedTitle}</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-stone-800 mb-3">Generated Description</h3>
                                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-300">
                                        <p className="text-stone-700 whitespace-pre-line">
                                            {description}
                                        </p>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {hashtags.map((tag, index) => (
                                                <span key={index} className="bg-stone-200 text-stone-700 px-3 py-1 rounded-full text-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-stone-800 mb-3">Recommended Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag, index) => (
                                            <span key={index} className="bg-stone-200 text-stone-800 px-3 py-1 rounded-full text-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Improvement Suggestions */}
                                <div>
                                    <h3 className="text-lg font-medium text-stone-800 mb-3">Content Improvement Suggestions</h3>
                                    <ul className="space-y-3">
                                        {strengthPoints.map((point, index) => (
                                            <li key={`strength-${index}`} className="flex items-start">
                                                <Check size={18} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="text-stone-700">{point}</span>
                                            </li>
                                        ))}
                                        {opportunityPoints.map((point, index) => (
                                            <li key={`opportunity-${index}`} className="flex items-start">
                                                <AlertCircle size={18} className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="text-stone-700">{point}</span>
                                            </li>
                                        ))}
                                        {weaknessPoints.map((point, index) => (
                                            <li key={`weakness-${index}`} className="flex items-start">
                                                <X size={18} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="text-stone-700">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Keywords Section */}
                        <div className="bg-stone-100 rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-stone-700 px-6 py-4">
                                <h2 className="text-xl font-semibold text-stone-50">Keyword Analysis</h2>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-stone-800 mb-3">Primary Keywords</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {primaryKeywords.map((item, index) => (
                                            <div key={index} className="flex justify-between bg-stone-50 p-3 rounded-lg border border-stone-300">
                                                <span className="font-medium text-stone-800">{item.keyword}</span>
                                                <div className="flex space-x-2">
                                                    <span className="text-sm text-stone-800 bg-stone-200 px-2 py-0.5 rounded">Vol: {item.volume}</span>
                                                    <span className="text-sm text-stone-800 bg-stone-200 px-2 py-0.5 rounded">Diff: {item.difficulty}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-stone-800 mb-3">Long-tail Opportunities</h3>
                                    <ul className="space-y-2">
                                        {longTailKeywords.map((item, index) => (
                                            <li key={index} className="flex items-center">
                                                <ArrowRight size={16} className="text-stone-600 mr-2" />
                                                <span className="text-stone-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Competitive Analysis */}
                        <div className="bg-stone-100 rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-stone-600 px-6 py-4">
                                <h2 className="text-xl font-semibold text-stone-50">Competitive Analysis</h2>
                            </div>

                            <div className="p-6">
                                <p className="text-stone-700 mb-4">Based on top performing videos in this niche, here's what's working:</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-300">
                                        <h4 className="font-medium text-stone-800 mb-2">Optimal Video Length</h4>
                                        <p className="text-stone-700">{optimalVideoLength}</p>
                                    </div>

                                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-300">
                                        <h4 className="font-medium text-stone-800 mb-2">Best Publishing Time</h4>
                                        <p className="text-stone-700">{bestPublishingTime}</p>
                                    </div>

                                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-300">
                                        <h4 className="font-medium text-stone-800 mb-2">Thumbnail Style</h4>
                                        <p className="text-stone-700">{thumbnailStyle}</p>
                                    </div>

                                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-300">
                                        <h4 className="font-medium text-stone-800 mb-2">Engagement Hooks</h4>
                                        <p className="text-stone-700">{engagementHooks}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={resetForm}
                                className="flex-1 flex items-center justify-center bg-stone-200 border border-stone-300 hover:bg-stone-300 text-stone-800 py-3 px-6 rounded-lg font-medium transition"
                            >
                                <RefreshCw size={18} className="mr-2" />
                                Start New Analysis
                            </button>

                            <button className="flex-1 flex items-center justify-center bg-stone-800 hover:bg-stone-900 text-white py-3 px-6 rounded-lg font-medium transition">
                                <ThumbsUp size={18} className="mr-2" />
                                Save Results
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SEO;