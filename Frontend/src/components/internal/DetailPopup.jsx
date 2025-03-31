import React from 'react';
import { X } from 'lucide-react';

const DetailPopup = ({ isOpen, onClose, itemType, itemData }) => {
    if (!isOpen || !itemData) return null;

    const renderContent = () => {
        switch (itemType) {
            case 'script':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">{itemData.title}</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-stone-500">Date</p>
                                <p>
                                    {itemData.date ||
                                        (itemData.createdAt ?
                                            new Date(itemData.createdAt).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            }) :
                                            "N/A"
                                        )
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-stone-500">Content Preview</p>
                            <div className="p-4 bg-stone-50 rounded-md border border-stone-200 mt-2 max-h-60 overflow-y-auto">
                                {
                                    itemData.content.map((item, index) => (
                                        <div key={index} className="mb-4 last:mb-0">
                                            <h3 className="font-medium text-lg">{item.heading}</h3>
                                            <p className="text-stone-700 mt-1">{item.details}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                );

            case 'seo':
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold">{itemData.optimizedTitle}</h3>
                        <p className="text-sm text-stone-600">{itemData.description}</p>

                        {/* SEO Score */}
                        <div className="mt-4">
                            <div className="flex items-center mb-3">
                                <p className="text-sm text-stone-500 mr-2">SEO Score:</p>
                                <div className="h-2 w-full max-w-xs bg-stone-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${itemData.titleScore > 75
                                            ? "bg-green-500"
                                            : itemData.titleScore > 50
                                                ? "bg-yellow-500"
                                                : "bg-red-500"
                                            }`}
                                        style={{ width: `${itemData.titleScore}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-stone-600 ml-2">{itemData.titleScore}%</span>
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-stone-500">Created At</p>
                                <span className="text-sm">
                                    {new Date(itemData.createdAt).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-stone-500">Updated At</p>
                                <span className="text-sm">
                                    {new Date(itemData.updatedAt).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Primary Keywords */}
                        <div>
                            <p className="text-sm text-stone-500 mb-2">Primary Keywords</p>
                            <div className="flex flex-wrap gap-2">
                                {(itemData.primaryKeywords || []).map((keywordObj, index) => (
                                    <span
                                        key={index}
                                        className={`px-2 py-1 text-xs rounded-full ${keywordObj.difficulty === "High"
                                            ? "bg-red-200 text-red-800"
                                            : "bg-yellow-200 text-yellow-800"
                                            }`}
                                    >
                                        {keywordObj.keyword}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Long-Tail Keywords */}
                        <div>
                            <p className="text-sm text-stone-500 mb-2">Long-Tail Keywords</p>
                            <div className="flex flex-wrap gap-2">
                                {(itemData.longTailKeywords || []).map((keyword, index) => (
                                    <span key={index} className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Hashtags */}
                        <div>
                            <p className="text-sm text-stone-500 mb-2">Hashtags</p>
                            <div className="flex flex-wrap gap-2">
                                {(itemData.hashtags || []).map((tag, index) => (
                                    <span key={index} className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <p className="text-sm text-stone-500 mb-2">Tags</p>
                            <div className="flex flex-wrap gap-2">
                                {(itemData.tags || []).map((tag, index) => (
                                    <span key={index} className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Insights */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-stone-500">Optimal Video Length</p>
                                <span>{itemData.optimalVideoLength}</span>
                            </div>
                            <div>
                                <p className="text-sm text-stone-500">Best Publishing Time</p>
                                <span>{itemData.bestPublishingTime}</span>
                            </div>
                            <div>
                                <p className="text-sm text-stone-500">Thumbnail Style</p>
                                <span>{itemData.thumbnailStyle}</span>
                            </div>
                            <div>
                                <p className="text-sm text-stone-500">Engagement Hooks</p>
                                <span>{itemData.engagementHooks}</span>
                            </div>
                        </div>

                        {/* Strengths, Opportunities, Weaknesses */}
                        <div>
                            <p className="text-sm text-stone-500 mb-2">Strength Points</p>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                                {(itemData.strengthPoints || []).map((point, index) => (
                                    <li key={index}>{point}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p className="text-sm text-stone-500 mb-2">Opportunity Points</p>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                                {(itemData.opportunityPoints || []).map((point, index) => (
                                    <li key={index}>{point}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p className="text-sm text-stone-500 mb-2">Weakness Points</p>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                                {(itemData.weaknessPoints || []).map((point, index) => (
                                    <li key={index}>{point}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Recommendations */}
                        <div>
                            <p className="text-sm text-stone-500 mb-2">Recommendations</p>
                            <ul className="list-disc pl-5 text-sm space-y-2">
                                {(itemData.recommendations || [
                                    'Add more targeted keywords in your title',
                                    'Increase video description length',
                                    'Include timestamps in your description',
                                    'Add more tags related to your content',
                                    'Improve thumbnail click-through rate'
                                ]).map((rec, index) => (
                                    <li key={index}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );


            case 'iot':
                // Assuming itemData is either a single item or the entire array
                const contentArray = Array.isArray(itemData) ? itemData : [itemData];

                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold">IoT Topics</h3>

                        {contentArray.map((item, index) => (
                            <div key={index} className="border-b border-stone-200 pb-4 mb-4 last:border-0">
                                <h4 className="text-lg font-medium text-green-700">{item.heading}</h4>
                                <div className="mt-2">
                                    <div className="p-4 bg-stone-50 rounded-md border border-stone-200 mt-2">
                                        <p className="text-stone-700">{item.details}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="mt-4">
                            <p className="text-sm text-stone-500 mb-2">Related IoT Keywords</p>
                            <div className="flex flex-wrap gap-2">
                                {['IoT', 'Smart Home', 'Automation', 'Connected Devices', 'Smart Technology'].map((keyword, index) => (
                                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return <p>No details available for this item.</p>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-gray-200 p-4">
                    <h2 className="text-lg font-medium">
                        {itemType === 'script' && 'Script Details'}
                        {itemType === 'seo' && 'SEO Analysis Details'}
                        {itemType === 'iot' && 'IoT Content'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-6">
                    {renderContent()}
                </div>
                <div className="border-t border-gray-200 p-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 border border-stone-300 rounded-md shadow-sm hover:bg-stone-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailPopup;