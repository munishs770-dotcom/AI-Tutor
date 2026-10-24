// Hybrid AI Engine: Gemini API Connector + Offline Socratic AI Tutor Brain
// Implements the Socratic teaching persona for Class 8 Mathematics:
// - Explains simply with real-life metaphors (balance scales, mystery gift boxes)
// - Never gives direct answers immediately; provides progressive hints and scaffolds thinking
// - Detects student misconceptions and encourages growth mindset
// - Seamlessly toggles between Live Gemini API and built-in offline smart tutor brain

export class AIEngine {
  constructor() {
    this.apiKey = localStorage.getItem("ai_tutor_gemini_api_key") || "";
    this.selectedModel = localStorage.getItem("ai_tutor_gemini_model") || "gemini-1.5-flash";
    this.useLiveApi = localStorage.getItem("ai_tutor_use_live_api") === "true" && this.apiKey !== "";
    this.conversationHistory = [];
  }

  setApiKey(key, useLive = true) {
    this.apiKey = key.trim();
    this.useLiveApi = useLive && this.apiKey !== "";
    localStorage.setItem("ai_tutor_gemini_api_key", this.apiKey);
    localStorage.setItem("ai_tutor_use_live_api", this.useLiveApi ? "true" : "false");
  }

  setModel(model) {
    this.selectedModel = model;
    localStorage.setItem("ai_tutor_gemini_model", model);
  }

  // System Prompt as defined in Project Requirements
  getSystemPrompt(studentProfile) {
    const name = studentProfile?.name || "Student";
    const difficulty = studentProfile?.difficulty || "Beginner";
    const topic = studentProfile?.topic || "Linear Equations in One Variable";

    return `
You are "Arya", an empathetic, expert AI Mathematics Tutor specializing in Class 8 Mathematics (ages 12-15), specifically focusing on "${topic}".
The current student's name is ${name}, and their difficulty level is ${difficulty}.

TEACHING PHILOSOPHY & BEHAVIOR:
1. Socratic Teaching: Guide through questions. If the student asks for an answer to a problem, DO NOT give the final number directly. Give a gentle conceptual hint first, then a leading question, and only provide the full solution if they remain stuck after multiple attempts.
2. Simplicity & Clarity: Use plain, conversational language suitable for an 8th grader. Avoid intimidating mathematical jargon unless you explain it with an everyday analogy (e.g., compare an equation to a grocery balance scale, or a variable to a mystery gift box).
3. Encouragement & Growth Mindset: Always validate effort. If the student makes a mistake, celebrate that they tried and diagnose why it happened (e.g., "Ah, check what happened to the plus sign when it crossed the equals border!").
4. Math Notation: Format math formulas clearly using standard markdown and dollar signs for equations (e.g., $2x + 5 = 15$ or $$\\frac{x}{2} = 4$$).
5. Interactivity: End your explanations with a quick, easy check-for-understanding question or an encouraging prompt to take the next step.
6. Tone: Warm, enthusiastic, patient, and engaging.
    `.trim();
  }

  // Primary method to chat with AI Tutor
  async chat({ message, studentProfile, currentProblem = null }) {
    // Record user message
    this.conversationHistory.push({ role: "user", content: message });

    if (this.useLiveApi && this.apiKey) {
      try {
        const liveResponse = await this.callGeminiApi(message, studentProfile, currentProblem);
        this.conversationHistory.push({ role: "assistant", content: liveResponse });
        return {
          source: "gemini-api",
          response: liveResponse
        };
      } catch (err) {
        console.warn("Gemini API call failed, falling back to smart offline brain:", err);
        // Fallback to offline brain
      }
    }

    // Offline Smart Socratic Engine
    const offlineResponse = this.generateOfflineResponse(message, studentProfile, currentProblem);
    this.conversationHistory.push({ role: "assistant", content: offlineResponse });
    return {
      source: "offline-tutor",
      response: offlineResponse
    };
  }

  // Live Google Gemini API Fetcher
  async callGeminiApi(userMessage, studentProfile, currentProblem) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.selectedModel}:generateContent?key=${this.apiKey}`;

    const systemInstruction = this.getSystemPrompt(studentProfile);
    let promptWithContext = userMessage;

    if (currentProblem) {
      promptWithContext = `[Context: Current Problem Student is Working on: "${currentProblem.plainQuestion}"]\nStudent says: "${userMessage}"`;
    }

    // Build contents payload
    const contents = [];
    // Include last few history turns for context
    const recentHistory = this.conversationHistory.slice(-6);
    for (const turn of recentHistory) {
      contents.push({
        role: turn.role === "assistant" ? "model" : "user",
        parts: [{ text: turn.content }]
      });
    }

    // Append latest prompt
    contents.push({
      role: "user",
      parts: [{ text: promptWithContext }]
    });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error("No text response from Gemini API");
    }
    return candidateText;
  }

  // Offline Smart Socratic AI Brain (Rule + NLP Heuristic Engine)
  generateOfflineResponse(userMessage, studentProfile, currentProblem) {
    const lower = userMessage.toLowerCase().trim();
    const name = studentProfile?.name || "Friend";

    // 1. Direct answer requests (e.g. "What is the answer?", "Tell me the answer", "Solve it for me")
    if (lower.includes("give me the answer") || lower.includes("tell me the answer") || lower.includes("what is the answer") || lower.includes("just solve it") || lower.includes("what's the answer")) {
      if (currentProblem) {
        return `I know you're eager to see the number, ${name}! 😊 But my superpower as your tutor is helping YOU discover it yourself! 

Let's take it one step at a time:
Look at **$${currentProblem.plainQuestion}$**.

* What is the first thing preventing your variable from standing completely alone?
* Try applying the **opposite operation** to both sides of the equals sign!

What do you think happens if you move the constant number across the $=$ sign? Give it a shot!`;
      }
      return `I'd love to guide you, ${name}! However, I want to see you solve it step-by-step so it stays in your brain forever. Share a specific problem or step you are stuck on, and let's conquer it together!`;
    }

    // 2. Greetings
    if (lower === "hi" || lower === "hello" || lower === "hey" || lower.startsWith("hi ") || lower.startsWith("hello ")) {
      return `Hello ${name}! 👋 I'm **Arya**, your personal Math Companion. 
I'm here to make Class 8 Algebra simple, intuitive, and fun!

What would you like to explore today?
* ⚖️ **Linear Equations in One Variable** (The Balance Scale method)
* 🧩 **Algebraic Expressions & Identities** ($(a+b)^2$, like terms)
* 🔍 **Factorisation** (Splitting middle term, common factors)
* 📝 **Word Problems** (Age & number puzzles)

Tell me what you'd like to learn or ask me any question!`;
    }

    // 3. Explaining Linear Equations
    if (lower.includes("what is a linear equation") || lower.includes("explain linear equation") || lower.includes("linear equation")) {
      return `Great question, ${name}! 

A **Linear Equation** is simply an equality statement where the highest power (exponent) of the variable is **1**.

### ⚖️ The Real-Life Metaphor: A Grocery Balance Scale
Imagine a classic two-pan balance scale:
* The **left pan** has: 2 mystery gift boxes ($2x$) and 5 marbles ($+ 5$).
* The **right pan** has: 15 marbles ($= 15$).
* The scale is perfectly balanced in the middle:
$$2x + 5 = 15$$

Because both pans balance, whatever you take away from the left pan, you MUST take away from the right pan to keep it level!

Would you like to try solving this equation together step-by-step?`;
    }

    // 4. Transposition Method / Sign change
    if (lower.includes("transposition") || lower.includes("transpose") || lower.includes("change sign")) {
      return `The **Transposition Method** is algebra's fastest shortcut! 🚀

Think of the equals sign ($=$) as a **magic border checkpoint**:
Whenever any term travels across the border to the other side:
* A **Positive term ($+$)** turns into a **Negative term ($-$)**
* A **Negative term ($-$)** turns into a **Positive term ($+$)**
* A **Multiplier ($\\times$)** turns into a **Divisor ($\\div$)**
* A **Divisor ($\\div$)** turns into a **Multiplier ($\\times$)**

**Example:**
In $x + 7 = 19$, move $+7$ across:
$$x = 19 - 7 = 12$$

Simple, right? Remember: **Cross the border, switch the sign!**`;
    }

    // 5. Identities
    if (lower.includes("identity") || lower.includes("identities") || lower.includes("(a+b)^2") || lower.includes("formula")) {
      return `Ah, the **Standard Algebraic Identities**! These are your secret weapons for multiplying polynomials fast.

Here are the 4 essential formulas for Class 8:
1. **Square of a Sum:**
   $$(a + b)^2 = a^2 + 2ab + b^2$$
2. **Square of a Difference:**
   $$(a - b)^2 = a^2 - 2ab + b^2$$
3. **Difference of Squares:**
   $$(a + b)(a - b) = a^2 - b^2$$
4. **Product with Shared Variable:**
   $$(x + a)(x + b) = x^2 + (a + b)x + ab$$

**Quick trick:** Notice how $(a+b)^2$ is NOT just $a^2 + b^2$! It always has that friendly middle term $+ 2ab$! Would you like an example of how to expand $(2x + 3)^2$?`;
    }

    // 6. Factorisation
    if (lower.includes("factorisation") || lower.includes("factorize") || lower.includes("factorise") || lower.includes("factors")) {
      return `**Factorisation** is simply multiplication in reverse! ⏪

When you multiply: $2 \\times (x + 3) = 2x + 6$.
When you factorise, you start with $2x + 6$ and package it back into $2(x + 3)$!

#### The 3 Main Strategies:
1. **Common Factors:** Pull out the Greatest Common Divisor from every term.
   $$4x + 12 = 4(x + 3)$$
2. **Difference of Squares:** $a^2 - b^2 = (a+b)(a-b)$
   $$x^2 - 49 = (x + 7)(x - 7)$$
3. **Splitting the Middle Term:** For $x^2 + 5x + 6$, find two numbers that multiply to $6$ and add to $5$ ($2$ and $3$), giving $(x + 2)(x + 3)$.

Which of these would you like to practice?`;
    }

    // 7. Word Problems
    if (lower.includes("word problem") || lower.includes("age problem") || lower.includes("perimeter")) {
      return `Word problems look scary, but they are just English sentences in disguise! 🕵️

Here is our secret **3-Step Codebreaker**:
1. **Name the Hero ($x$):** What unknown is the question asking for? Set that as $x$. (e.g. "Let son's age = $x$").
2. **Translate to Math:**
   * "is / was / will be" $\\implies =$
   * "more than / increased by" $\\implies +$
   * "times / twice / thrice" $\\implies \\times$
3. **Balance & Solve:** Write the equation and solve for $x$!

Would you like me to give you a fun beginner age puzzle to try?`;
    }

    // 8. Help or stuck on current problem
    if (lower.includes("help") || lower.includes("stuck") || lower.includes("i don't know") || lower.includes("hint")) {
      if (currentProblem && currentProblem.hints && currentProblem.hints.length > 0) {
        return `Don't worry at all, ${name}! Being stuck is the first step to a lightbulb moment! 💡

Here is a targeted hint for our problem:
${currentProblem.hints[0]}

Take a second to think about that. What do you get if you try that first step?`;
      }
      return `I'm right here with you! Tell me what step or concept is giving you trouble, or click on **Practice Mode** and we can walk through a problem hand-in-hand!`;
    }

    // 9. Praise / Thanks
    if (lower.includes("thank") || lower.includes("thanks") || lower.includes("awesome") || lower.includes("cool") || lower.includes("got it")) {
      return `You are very welcome, ${name}! 🌟 You are doing fantastic work today. Mathematical confidence comes from persistent practice. Ready for another challenge or shall we review something else?`;
    }

    // 10. General math equation in message (e.g., student typed "3x + 2 = 11")
    const eqMatch = userMessage.match(/(\d*)x\s*([+-])\s*(\d+)\s*=\s*(\d+)/i);
    if (eqMatch) {
      const coeff = eqMatch[1] ? parseInt(eqMatch[1]) : 1;
      const sign = eqMatch[2];
      const constant = parseInt(eqMatch[3]);
      const rhs = parseInt(eqMatch[4]);
      const adjustedRhs = sign === "+" ? rhs - constant : rhs + constant;
      const ans = adjustedRhs / coeff;

      return `Ooh, nice equation: **$${userMessage.trim()}$**! Let's break it down together!

1. First, transpose the constant ($ ${sign} ${constant} $) to the right side:
   $$${coeff}x = ${rhs} ${sign === "+" ? "-" : "+"} ${constant} = ${adjustedRhs}$$
2. Next, isolate $x$ by dividing both sides by the coefficient $${coeff}$:
   $$x = \\frac{${adjustedRhs}}{${coeff}} = ${ans}$$

Does that clear it up, ${name}?`;
    }

    // Default conversational response
    return `That's an interesting thought, ${name}! In Class 8 Algebra, everything connects back to maintaining balance and recognizing patterns. 

Would you like to:
1. Break down this concept with a visual example?
2. Try a practice problem on this?
3. Or test yourself with a quick 3-question quiz?

Tell me which way you'd like to go! 🚀`;
  }
}
