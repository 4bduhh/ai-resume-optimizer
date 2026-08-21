(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/utils/atsScorer.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateAtsScore",
    ()=>calculateAtsScore
]);
function calculateAtsScore(resumeText, jobDescription) {
    // Normalize strings
    const normalizedResume = resumeText.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const normalizedJD = jobDescription.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    // Extract keywords from JD (simple heuristic: words > 4 chars, excluding common stop words)
    const stopWords = new Set([
        'about',
        'above',
        'after',
        'again',
        'against',
        'all',
        'am',
        'an',
        'and',
        'any',
        'are',
        'aren',
        'as',
        'at',
        'be',
        'because',
        'been',
        'before',
        'being',
        'below',
        'between',
        'both',
        'but',
        'by',
        'can',
        'cannot',
        'could',
        'couldn',
        'did',
        'didn',
        'do',
        'does',
        'doesn',
        'doing',
        'don',
        'down',
        'during',
        'each',
        'few',
        'for',
        'from',
        'further',
        'had',
        'hadn',
        'has',
        'hasn',
        'have',
        'haven',
        'having',
        'he',
        'her',
        'here',
        'hers',
        'herself',
        'him',
        'himself',
        'his',
        'how',
        'if',
        'in',
        'into',
        'is',
        'isn',
        'it',
        'its',
        'itself',
        'let',
        'me',
        'more',
        'most',
        'mustn',
        'my',
        'myself',
        'no',
        'nor',
        'not',
        'of',
        'off',
        'on',
        'once',
        'only',
        'or',
        'other',
        'ought',
        'our',
        'ours',
        'ourselves',
        'out',
        'over',
        'own',
        'same',
        'shan',
        'she',
        'should',
        'shouldn',
        'so',
        'some',
        'such',
        'than',
        'that',
        'the',
        'their',
        'theirs',
        'them',
        'themselves',
        'then',
        'there',
        'these',
        'they',
        'this',
        'those',
        'through',
        'to',
        'too',
        'under',
        'until',
        'up',
        'very',
        'was',
        'wasn',
        'we',
        'were',
        'weren',
        'what',
        'when',
        'where',
        'which',
        'while',
        'who',
        'whom',
        'why',
        'with',
        'won',
        'would',
        'wouldn',
        'you',
        'your',
        'yours',
        'yourself',
        'yourselves'
    ]);
    const words = normalizedJD.split(/\s+/).filter((w)=>w.length > 4 && !stopWords.has(w));
    // Frequency map to find top keywords
    const frequencyMap = {};
    for (const word of words){
        frequencyMap[word] = (frequencyMap[word] || 0) + 1;
    }
    // Sort and pick top 15 keywords
    const topKeywords = Object.entries(frequencyMap).sort((a, b)=>b[1] - a[1]).slice(0, 15).map((entry)=>entry[0]);
    let matchCount = 0;
    const missingKeywords = [];
    for (const keyword of topKeywords){
        if (normalizedResume.includes(keyword)) {
            matchCount++;
        } else {
            missingKeywords.push(keyword);
        }
    }
    // Calculate score
    let score = topKeywords.length > 0 ? Math.round(matchCount / topKeywords.length * 100) : 0;
    // Length penalties
    const resumeWordCount = normalizedResume.split(/\s+/).length;
    if (resumeWordCount < 200) {
        score = Math.max(0, score - 15);
    }
    const suggestions = [];
    if (resumeWordCount < 200) {
        suggestions.push('Your resume is quite short. Consider adding more detail about your past responsibilities and achievements.');
    }
    if (missingKeywords.length > 0) {
        suggestions.push(`Try to seamlessly integrate these keywords: ${missingKeywords.slice(0, 3).join(', ')}.`);
    }
    if (score < 50) {
        suggestions.push('Your resume has a low match with the job description. Re-read the JD and ensure your experience aligns.');
    } else if (score > 80) {
        suggestions.push('Great match! Ensure your formatting is clean and easy for human recruiters to read.');
    }
    return {
        score,
        missingKeywords,
        suggestions: suggestions.length > 0 ? suggestions : [
            'Your resume looks well optimized for this role!'
        ]
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_utils_atsScorer_ts_0lk7y3l._.js.map