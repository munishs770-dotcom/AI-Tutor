// Notes & Document Processor Module
// Allows students to paste study notes or upload text/markdown/PDF notes,
// automatically extracts key algebra formulas, and generates custom quiz questions!

export class NotesProcessor {
  // Extracts mathematical terms and formulas from text
  static analyzeNotes(rawText) {
    if (!rawText || rawText.trim().length === 0) {
      return null;
    }

    const text = rawText.trim();

    // 1. Extract formulas (equations with '=', brackets, or powers)
    const formulaRegex = /([a-zA-Z0-9\(\)\+\-\*\/\^\s]+\s*=\s*[a-zA-Z0-9\(\)\+\-\*\/\^\s]+)/g;
    const rawMatches = text.match(formulaRegex) || [];
    const formulas = Array.from(new Set(rawMatches.map(f => f.trim()))).filter(f => f.length > 3 && f.length < 50);

    // 2. Identify key concept terms
    const keywords = [
      "linear equation", "variable", "constant", "coefficient", 
      "transposition", "identities", "factorisation", "distributive", 
      "perimeter", "consecutive", "binomial", "monomial"
    ];
    const detectedKeywords = keywords.filter(k => text.toLowerCase().includes(k));

    // 3. Auto-generate tailored practice questions based on detected concepts
    const generatedQuestions = [];

    if (detectedKeywords.includes("transposition") || detectedKeywords.includes("linear equation")) {
      generatedQuestions.push({
        question: "Based on your notes on linear equations: In $4x + 9 = 25$, what is $x$?",
        answer: "4",
        concept: "Transposition of constant and division by coefficient"
      });
    }

    if (detectedKeywords.includes("identities") || text.includes("(a+b)^2")) {
      generatedQuestions.push({
        question: "Based on your notes on identities: What is the expanded form of $(x + 4)^2$?",
        answer: "x^2 + 8x + 16",
        concept: "Identity (a+b)^2 = a^2 + 2ab + b^2"
      });
    }

    if (detectedKeywords.includes("factorisation")) {
      generatedQuestions.push({
        question: "Based on your notes on factorisation: What are the factors of $x^2 - 36$?",
        answer: "(x - 6)(x + 6)",
        concept: "Difference of squares identity"
      });
    }

    // Default question if no specific keyword triggered
    if (generatedQuestions.length === 0) {
      generatedQuestions.push({
        question: "Solve the linear equation: $3y - 5 = 16$. What is $y$?",
        answer: "7",
        concept: "Two-step linear equation solving"
      });
    }

    return {
      wordCount: text.split(/\s+/).length,
      detectedKeywords,
      formulas: formulas.length > 0 ? formulas.slice(0, 5) : ["$ax + b = c$", "$(a + b)^2 = a^2 + 2ab + b^2$"],
      generatedQuestions,
      summary: `Analyzed ${text.split(/\s+/).length} words. Detected focus on: ${detectedKeywords.length > 0 ? detectedKeywords.join(", ") : "Class 8 Algebra Fundamentals"}.`
    };
  }
}
