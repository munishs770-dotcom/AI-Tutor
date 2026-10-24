// Dynamic Algorithmic Math Problem Generator
// Procedurally generates infinite Class 8 Algebra questions with guaranteed clean integer solutions,
// progressive hints (Level 1, Level 2, Full Solution), and step-by-step derivations.

export class ProblemGenerator {
  // Helper to pick random integer between min and max (inclusive)
  static randInt(min, max, avoidZero = true) {
    let val = 0;
    do {
      val = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (avoidZero && val === 0);
    return val;
  }

  // Helper to pick random item from array
  static sample(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Generates a single problem based on topic and difficulty
  static generate({ topic = "linear_eq", difficulty = "Beginner" }) {
    if (topic === "linear_eq" || topic === "linear_eq_one_var") {
      if (difficulty === "Beginner") {
        return this.generateBeginnerLinear();
      } else if (difficulty === "Intermediate") {
        return this.generateIntermediateLinear();
      } else {
        return this.generateAdvancedLinear();
      }
    } else if (topic === "algebraic_expressions") {
      return this.generateIdentityProblem(difficulty);
    } else if (topic === "factorisation") {
      return this.generateFactorisationProblem(difficulty);
    } else if (topic === "word_problems") {
      return this.generateWordProblem(difficulty);
    } else {
      // Mixed random
      const generators = [
        () => this.generateBeginnerLinear(),
        () => this.generateIntermediateLinear(),
        () => this.generateAdvancedLinear(),
        () => this.generateIdentityProblem(difficulty),
        () => this.generateFactorisationProblem(difficulty),
        () => this.generateWordProblem(difficulty)
      ];
      return this.sample(generators)();
    }
  }

  // Beginner: Single-step and simple two-step equations
  // e.g., x + 5 = 12, 3x = 18, 2x + 4 = 14
  static generateBeginnerLinear() {
    const varName = this.sample(["x", "y", "z", "m", "n", "p"]);
    const type = this.randInt(1, 4);
    const ans = this.randInt(2, 12);

    if (type === 1) {
      // x + a = b
      const a = this.randInt(2, 15);
      const b = ans + a;
      return {
        id: "lin_beg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        topic: "Linear Equations",
        subtopic: "Single-Step Addition",
        difficulty: "Beginner",
        variable: varName,
        answer: ans.toString(),
        numericAnswer: ans,
        questionHtml: `Solve for $${varName}$: <br><span class="math-highlight">$${varName} + ${a} = ${b}$</span>`,
        plainQuestion: `Solve for ${varName}: ${varName} + ${a} = ${b}`,
        hints: [
          `💡 **Hint 1 (The Goal):** You want to get $${varName}$ completely alone on the left side. What is currently sitting with $${varName}$?`,
          `💡 **Hint 2 (Opposite Operation):** $+${a}$ is being added. To undo addition, what operation must you perform on both sides? Subtract $${a}$ from $${b}$!`,
          `📝 **Step-by-Step Solution:**\n1. Subtract $${a}$ from both sides:\n$$${varName} = ${b} - ${a}$$\n2. Calculate RHS: $${varName} = ${ans}$`
        ],
        steps: [
          `Given: $${varName} + ${a} = ${b}$`,
          `Transpose $+${a}$ to the right side (sign becomes negative): $${varName} = ${b} - ${a}$`,
          `Simplify: $${varName} = ${ans}$`
        ]
      };
    } else if (type === 2) {
      // x - a = b
      const a = this.randInt(2, 12);
      const b = this.randInt(3, 15);
      const answer = a + b;
      return {
        id: "lin_beg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        topic: "Linear Equations",
        subtopic: "Single-Step Subtraction",
        difficulty: "Beginner",
        variable: varName,
        answer: answer.toString(),
        numericAnswer: answer,
        questionHtml: `Solve for $${varName}$: <br><span class="math-highlight">$${varName} - ${a} = ${b}$</span>`,
        plainQuestion: `Solve for ${varName}: ${varName} - ${a} = ${b}`,
        hints: [
          `💡 **Hint 1:** Notice $-${a}$ is being subtracted from $${varName}$.`,
          `💡 **Hint 2:** The opposite of subtraction is addition. Add $${a}$ to both sides!`,
          `📝 **Solution:** $${varName} = ${b} + ${a} = ${answer}$`
        ],
        steps: [
          `Given: $${varName} - ${a} = ${b}$`,
          `Add $${a}$ to both sides: $${varName} = ${b} + ${a}$`,
          `Simplify: $${varName} = ${answer}$`
        ]
      };
    } else if (type === 3) {
      // ax = b
      const a = this.randInt(2, 8);
      const b = a * ans;
      return {
        id: "lin_beg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        topic: "Linear Equations",
        subtopic: "Single-Step Multiplication",
        difficulty: "Beginner",
        variable: varName,
        answer: ans.toString(),
        numericAnswer: ans,
        questionHtml: `Solve for $${varName}$: <br><span class="math-highlight">$${a}${varName} = ${b}$</span>`,
        plainQuestion: `Solve for ${varName}: ${a}${varName} = ${b}`,
        hints: [
          `💡 **Hint 1:** The number $${a}$ is multiplied by $${varName}$.`,
          `💡 **Hint 2:** To isolate $${varName}$, divide both sides by the coefficient $${a}$.`,
          `📝 **Solution:** $${varName} = \\frac{${b}}{${a}} = ${ans}$`
        ],
        steps: [
          `Given: $${a}${varName} = ${b}$`,
          `Divide both sides by $${a}$: $${varName} = \\frac{${b}}{${a}}$`,
          `Simplify: $${varName} = ${ans}$`
        ]
      };
    } else {
      // Two-step: ax + b = c
      const a = this.randInt(2, 6);
      const b = this.randInt(2, 12);
      const c = a * ans + b;
      return {
        id: "lin_beg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        topic: "Linear Equations",
        subtopic: "Two-Step Linear Equations",
        difficulty: "Beginner",
        variable: varName,
        answer: ans.toString(),
        numericAnswer: ans,
        questionHtml: `Solve for $${varName}$: <br><span class="math-highlight">$${a}${varName} + ${b} = ${c}$</span>`,
        plainQuestion: `Solve for ${varName}: ${a}${varName} + ${b} = ${c}`,
        hints: [
          `💡 **Hint 1:** Two operations are acting on $${varName}$: multiplication by $${a}$ and addition of $${b}$. Always undo addition or subtraction FIRST!`,
          `💡 **Hint 2:** Transpose $+${b}$ across the equals sign: $${a}${varName} = ${c} - ${b} = ${c - b}$. Then divide by $${a}$!`,
          `📝 **Solution:**\n1. $${a}${varName} = ${c - b}$\n2. $${varName} = \\frac{${c - b}}{${a}} = ${ans}$`
        ],
        steps: [
          `Given: $${a}${varName} + ${b} = ${c}$`,
          `Subtract $${b}$ from both sides: $${a}${varName} = ${c} - ${b} = ${c - b}$`,
          `Divide by $${a}$: $${varName} = \\frac{${c - b}}{${a}} = ${ans}$`
        ]
      };
    }
  }

  // Intermediate: Variables on both sides, or brackets
  // e.g., 5x - 3 = 2x + 12, or 3(x - 2) = 15
  static generateIntermediateLinear() {
    const varName = this.sample(["x", "y", "t", "a", "k"]);
    const isBrackets = Math.random() > 0.5;

    if (isBrackets) {
      // a(x + b) = c
      const a = this.randInt(2, 5);
      const ans = this.randInt(2, 10);
      const b = this.randInt(1, 6) * (Math.random() > 0.5 ? 1 : -1);
      const c = a * (ans + b);
      const bStr = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;

      return {
        id: "lin_int_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        topic: "Linear Equations",
        subtopic: "Equations with Parentheses",
        difficulty: "Intermediate",
        variable: varName,
        answer: ans.toString(),
        numericAnswer: ans,
        questionHtml: `Solve for $${varName}$: <br><span class="math-highlight">$${a}(${varName} ${bStr}) = ${c}$</span>`,
        plainQuestion: `Solve for ${varName}: ${a}(${varName} ${bStr}) = ${c}`,
        hints: [
          `💡 **Hint 1:** You can either divide both sides by $${a}$ right away, or use the distributive property to expand the bracket!`,
          `💡 **Hint 2:** If you divide both sides by $${a}$, you get: $${varName} ${bStr} = ${c / a}$. Now isolate $${varName}$!`,
          `📝 **Solution:**\n$$${varName} ${bStr} = ${c / a}$$\n$$${varName} = ${c / a} ${b >= 0 ? '-' : '+'} ${Math.abs(b)} = ${ans}$$`
        ],
        steps: [
          `Given: $${a}(${varName} ${bStr}) = ${c}$`,
          `Divide both sides by $${a}$: $${varName} ${bStr} = ${c / a}$`,
          `Isolate $${varName}$: $${varName} = ${c / a} ${b >= 0 ? '-' : '+'} ${Math.abs(b)} = ${ans}$`
        ]
      };
    } else {
      // Variables on both sides: ax + b = cx + d
      const ans = this.randInt(2, 9);
      const c = this.randInt(2, 4);
      const diffCoeff = this.randInt(1, 4);
      const a = c + diffCoeff; // ensures a > c
      const b = this.randInt(1, 15);
      // a*ans + b = c*ans + d  => d = (a - c)*ans + b
      const d = diffCoeff * ans + b;

      return {
        id: "lin_int_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        topic: "Linear Equations",
        subtopic: "Variables on Both Sides",
        difficulty: "Intermediate",
        variable: varName,
        answer: ans.toString(),
        numericAnswer: ans,
        questionHtml: `Solve for $${varName}$: <br><span class="math-highlight">$${a}${varName} + ${b} = ${c}${varName} + ${d}$</span>`,
        plainQuestion: `Solve for ${varName}: ${a}${varName} + ${b} = ${c}${varName} + ${d}`,
        hints: [
          `💡 **Hint 1:** Move all terms with $${varName}$ to the left, and all plain numbers to the right!`,
          `💡 **Hint 2:** Subtract $${c}${varName}$ from both sides to get: $(${a} - ${c})${varName} + ${b} = ${d}$. That gives $${diffCoeff}${varName} + ${b} = ${d}$.`,
          `📝 **Solution:**\n$$${diffCoeff}${varName} = ${d} - ${b} = ${d - b}$$\n$$${varName} = \\frac{${d - b}}{${diffCoeff}} = ${ans}$$`
        ],
        steps: [
          `Given: $${a}${varName} + ${b} = ${c}${varName} + ${d}$`,
          `Transpose $${c}${varName}$ to LHS: $${a}${varName} - ${c}${varName} + ${b} = ${d}$`,
          `Transpose $+${b}$ to RHS: $${diffCoeff}${varName} = ${d} - ${b}$`,
          `Simplify: $${diffCoeff}${varName} = ${d - b}$`,
          `Divide by $${diffCoeff}$: $${varName} = ${ans}$`
        ]
      };
    }
  }

  // Advanced: Fractional equations and multi-bracket distributions
  // e.g., (x - 5)/3 = (x - 3)/5 or x/2 - 1/5 = x/3 + 1/4
  static generateAdvancedLinear() {
    const varName = "x";
    const type = this.randInt(1, 2);

    if (type === 1) {
      // (x - a)/b = (x - c)/d with cross-multiplication
      const b = 3;
      const d = 5;
      const ans = this.randInt(6, 15);
      // d*(ans - a) = b*(ans - c)
      // Let's choose a:
      const a = this.randInt(1, 5);
      // 5*(ans - a) = 3*(ans - c) => 3c = 3*ans - 5*(ans - a) = -2*ans + 5a
      // To ensure integer c:
      const cVal = Math.round((3 * ans - 5 * (ans - a)) / -3);
      // Let's make an exact formula: (x + a)/b = (x + c)/d
      // b = 2, d = 3
      const den1 = 2;
      const den2 = 3;
      const chosenAns = this.randInt(3, 10);
      const aNum = this.randInt(1, 6);
      // den2 * (chosenAns + aNum) = den1 * (chosenAns + cNum)
      // 3*(chosenAns + aNum) = 2*(chosenAns + cNum)
      // 3*chosenAns + 3*aNum = 2*chosenAns + 2*cNum
      // chosenAns + 3*aNum = 2*cNum  => cNum must make it even
      const lhsVal = chosenAns + 3 * aNum;
      let finalAns = chosenAns;
      let finalA = aNum;
      if (lhsVal % 2 !== 0) {
        finalA += 1;
      }
      const finalC = (finalAns + 3 * finalA) / 2;

      return {
        id: "lin_adv_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        topic: "Linear Equations",
        subtopic: "Fractional Equations (Cross-Multiplication)",
        difficulty: "Advanced",
        variable: varName,
        answer: finalAns.toString(),
        numericAnswer: finalAns,
        questionHtml: `Solve using cross-multiplication: <br><span class="math-highlight">$\\frac{${varName} + ${finalA}}{${den1}} = \\frac{${varName} + ${finalC}}{${den2}}$</span>`,
        plainQuestion: `Solve using cross-multiplication: (${varName} + ${finalA})/${den1} = (${varName} + ${finalC})/${den2}`,
        hints: [
          `💡 **Hint 1:** Cross-multiply! Multiply the numerator of each side by the denominator of the other side: $${den2}(${varName} + ${finalA}) = ${den1}(${varName} + ${finalC})$.`,
          `💡 **Hint 2:** Expand both brackets: $${den2}${varName} + ${den2 * finalA} = ${den1}${varName} + ${den1 * finalC}$.`,
          `📝 **Solution:** Move variables to LHS: $${den2 - den1}${varName} = ${den1 * finalC} - ${den2 * finalA} = ${finalAns}$`
        ],
        steps: [
          `Given: $\\frac{${varName} + ${finalA}}{${den1}} = \\frac{${varName} + ${finalC}}{${den2}}$`,
          `Cross-multiply: $${den2}(${varName} + ${finalA}) = ${den1}(${varName} + ${finalC})$`,
          `Expand: $${den2}${varName} + ${den2 * finalA} = ${den1}${varName} + ${den1 * finalC}$`,
          `Group variables: $(${den2} - ${den1})${varName} = ${den1 * finalC} - ${den2 * finalA}$`,
          `Simplify: $${varName} = ${finalAns}$`
        ]
      };
    } else {
      // 3(5x - 7) - 2(9x - 11) = 4
      const ans = this.randInt(2, 6);
      const coeff1 = 3;
      const m1 = 5;
      const c1 = 7;
      const coeff2 = 2;
      const m2 = 9;
      // LHS = 3(5*ans - 7) - 2(9*ans - c2)
      // 3(5*ans - 7) = 15*ans - 21
      // 2(9*ans - c2) = 18*ans - 2*c2
      // Difference = (15*ans - 21) - (18*ans - 2*c2) = -3*ans - 21 + 2*c2
      // Let RHS = 4 => 2*c2 = 4 + 3*ans + 21 = 25 + 3*ans
      let testAns = ans;
      if ((25 + 3 * testAns) % 2 !== 0) {
        testAns += 1;
      }
      const c2 = (25 + 3 * testAns) / 2;
      const rhs = 4;

      return {
        id: "lin_adv_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        topic: "Linear Equations",
        subtopic: "Multi-Bracket Linear Equations",
        difficulty: "Advanced",
        variable: varName,
        answer: testAns.toString(),
        numericAnswer: testAns,
        questionHtml: `Solve for $${varName}$: <br><span class="math-highlight">$${coeff1}(${m1}${varName} - ${c1}) - ${coeff2}(${m2}${varName} - ${c2}) = ${rhs}$</span>`,
        plainQuestion: `Solve for ${varName}: ${coeff1}(${m1}${varName} - ${c1}) - ${coeff2}(${m2}${varName} - ${c2}) = ${rhs}`,
        hints: [
          `💡 **Hint 1:** Expand both sets of parentheses carefully. Watch the minus sign in $-${coeff2}(...)$! It flips all signs inside.`,
          `💡 **Hint 2:** $${coeff1 * m1}${varName} - ${coeff1 * c1} - ${coeff2 * m2}${varName} + ${coeff2 * c2} = ${rhs}$. Now combine like terms!`,
          `📝 **Solution:** Combine $x$ terms and constant terms to isolate $x = ${testAns}$.`
        ],
        steps: [
          `Given: $${coeff1}(${m1}${varName} - ${c1}) - ${coeff2}(${m2}${varName} - ${c2}) = ${rhs}$`,
          `Expand: $${coeff1 * m1}${varName} - ${coeff1 * c1} - ${coeff2 * m2}${varName} + ${coeff2 * c2} = ${rhs}$`,
          `Combine like terms: $(${coeff1 * m1} - ${coeff2 * m2})${varName} + (${coeff2 * c2 - coeff1 * c1}) = ${rhs}$`,
          `Simplify: $-3${varName} + ${coeff2 * c2 - coeff1 * c1} = ${rhs}$`,
          `Solve for ${varName}: ${varName} = ${testAns}`
        ]
      };
    }
  }

  // Word Problems: Procedural generator for age, perimeter, and number puzzles
  static generateWordProblem(difficulty = "Beginner") {
    const type = this.randInt(1, 3);

    if (type === 1) {
      // Age problem: Father is 3 times as old as his son. In 12 years...
      const sonAge = this.randInt(8, 14);
      const ratio = this.sample([3, 4]);
      const fatherAge = ratio * sonAge;
      const yearsFuture = this.randInt(6, 12);
      // In yearsFuture: son is (sonAge + yearsFuture), father is (fatherAge + yearsFuture)
      const sumFuture = (sonAge + yearsFuture) + (fatherAge + yearsFuture);

      return {
        id: "word_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        topic: "Word Problems",
        subtopic: "Age Word Problems",
        difficulty: difficulty,
        variable: "x",
        answer: sonAge.toString(),
        numericAnswer: sonAge,
        questionHtml: `A father is $${ratio}$ times as old as his son today. In $${yearsFuture}$ years, the sum of their ages will be $${sumFuture}$ years. <br><strong>What is the son's present age?</strong>`,
        plainQuestion: `A father is ${ratio} times as old as his son today. In ${yearsFuture} years, the sum of their ages will be ${sumFuture} years. What is the son's present age?`,
        hints: [
          `💡 **Hint 1 (Assign Variables):** Let the son's present age be $x$. What will the father's present age be in terms of $x$? ($${ratio}x$).`,
          `💡 **Hint 2 (Travel in Time):** In $${yearsFuture}$ years, son is $(x + ${yearsFuture})$ and father is $(${ratio}x + ${yearsFuture})$. Write an equation for their sum!`,
          `📝 **Solution:** $(x + ${yearsFuture}) + (${ratio}x + ${yearsFuture}) = ${sumFuture} \\implies ${ratio + 1}x + ${2 * yearsFuture} = ${sumFuture} \\implies x = ${sonAge}$.`
        ],
        steps: [
          `Let the son's age = $x$ years.`,
          `Father's age = $${ratio}x$ years.`,
          `After $${yearsFuture}$ years, son's age = $x + ${yearsFuture}$, father's age = $${ratio}x + ${yearsFuture}$.`,
          `Equation: $(x + ${yearsFuture}) + (${ratio}x + ${yearsFuture}) = ${sumFuture}$`,
          `Simplify: $${ratio + 1}x + ${2 * yearsFuture} = ${sumFuture}$`,
          `Subtract $${2 * yearsFuture}$: $${ratio + 1}x = ${sumFuture - 2 * yearsFuture}$`,
          `Divide: $x = \\frac{${sumFuture - 2 * yearsFuture}}{${ratio + 1}} = ${sonAge}$`
        ]
      };
    } else if (type === 2) {
      // Perimeter of rectangle
      const width = this.randInt(4, 15);
      const extra = this.randInt(3, 8);
      const length = width + extra;
      const perimeter = 2 * (length + width);

      return {
        id: "word_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        topic: "Word Problems",
        subtopic: "Geometry Word Problems",
        difficulty: difficulty,
        variable: "w",
        answer: width.toString(),
        numericAnswer: width,
        questionHtml: `The length of a rectangular swimming pool is $${extra}\\text{ m}$ more than its width. If its perimeter is $${perimeter}\\text{ m}$, <strong>find its width (in meters)</strong>.`,
        plainQuestion: `The length of a rectangular swimming pool is ${extra} m more than its width. If its perimeter is ${perimeter} m, find its width.`,
        hints: [
          `💡 **Hint 1:** Let the width be $w$. Then the length is $w + ${extra}$.`,
          `💡 **Hint 2:** Recall the perimeter formula: $\\text{Perimeter} = 2(\\text{length} + \\text{width}) = 2(w + w + ${extra}) = ${perimeter}$.`,
          `📝 **Solution:** $2(2w + ${extra}) = ${perimeter} \\implies 4w + ${2 * extra} = ${perimeter} \\implies 4w = ${perimeter - 2 * extra} \\implies w = ${width}$.`
        ],
        steps: [
          `Let width = $w$ meters.`,
          `Length = $w + ${extra}$ meters.`,
          `Perimeter formula: $2(\\text{Length} + \\text{Width}) = ${perimeter}$`,
          `Substitute: $2(w + ${extra} + w) = ${perimeter}$`,
          `$2(2w + ${extra}) = ${perimeter} \\implies 4w + ${2 * extra} = ${perimeter}$`,
          `$4w = ${perimeter - 2 * extra} \\implies w = ${width}$ meters.`
        ]
      };
    } else {
      // Consecutive numbers
      const start = this.randInt(10, 30);
      const sum = start + (start + 1) + (start + 2);

      return {
        id: "word_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        topic: "Word Problems",
        subtopic: "Consecutive Numbers",
        difficulty: difficulty,
        variable: "x",
        answer: start.toString(),
        numericAnswer: start,
        questionHtml: `The sum of three consecutive integers is $${sum}$. <strong>Find the smallest of the three integers.</strong>`,
        plainQuestion: `The sum of three consecutive integers is ${sum}. Find the smallest of the three integers.`,
        hints: [
          `💡 **Hint 1:** Let the three consecutive numbers be $x$, $x+1$, and $x+2$.`,
          `💡 **Hint 2:** Add them together: $x + (x + 1) + (x + 2) = 3x + 3 = ${sum}$.`,
          `📝 **Solution:** $3x = ${sum} - 3 = ${sum - 3} \\implies x = \\frac{${sum - 3}}{3} = ${start}$.`
        ],
        steps: [
          `Let numbers be $x$, $x+1$, and $x+2$.`,
          `Sum: $x + x + 1 + x + 2 = ${sum}$`,
          `$3x + 3 = ${sum}$`,
          `$3x = ${sum - 3}$`,
          `$x = ${start}$ (Smallest integer)`
        ]
      };
    }
  }

  // Identities & Expansion problems
  static generateIdentityProblem(difficulty = "Beginner") {
    const a = this.randInt(2, 6);
    const b = this.randInt(1, 7);
    const type = this.randInt(1, 3);

    if (type === 1) {
      // (x + b)^2
      const middleCoeff = 2 * b;
      const constTerm = b * b;
      return {
        id: "id_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        topic: "Algebraic Expressions",
        subtopic: "Square of a Sum $(a+b)^2$",
        difficulty: difficulty,
        variable: "coeff",
        answer: middleCoeff.toString(),
        numericAnswer: middleCoeff,
        questionHtml: `Using the identity $(x + y)^2 = x^2 + 2xy + y^2$, expand $(x + ${b})^2$. <br><strong>What is the coefficient of the middle term $x$?</strong>`,
        plainQuestion: `Using identity (x + y)^2 = x^2 + 2xy + y^2, what is the middle term coefficient of (x + ${b})^2?`,
        hints: [
          `💡 **Hint 1:** The middle term in $(x + b)^2$ is always $2 \\times x \\times b$.`,
          `💡 **Hint 2:** Calculate $2 \\times ${b} = ${middleCoeff}$.`,
          `📝 **Solution:** $(x + ${b})^2 = x^2 + 2(${b})x + ${b}^2 = x^2 + ${middleCoeff}x + ${constTerm}$. The coefficient is $${middleCoeff}$.`
        ],
        steps: [
          `Identify: $(a + b)^2 = a^2 + 2ab + b^2$ where $a = x, b = ${b}$`,
          `Middle term $= 2 \\times x \\times ${b} = ${middleCoeff}x$`,
          `Coefficient is $${middleCoeff}$`
        ]
      };
    } else if (type === 2) {
      // Difference of squares: (x + b)(x - b) = x^2 - b^2
      const bSq = b * b;
      return {
        id: "id_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        topic: "Algebraic Expressions",
        subtopic: "Difference of Squares $(a+b)(a-b)$",
        difficulty: difficulty,
        variable: "const",
        answer: bSq.toString(),
        numericAnswer: bSq,
        questionHtml: `Calculate using the identity $(a + b)(a - b) = a^2 - b^2$: <br>$(x + ${b})(x - ${b}) = x^2 - \\text{?}$ <br><strong>What number replaces the question mark?</strong>`,
        plainQuestion: `In (x + ${b})(x - ${b}) = x^2 - ?, what number replaces the question mark?`,
        hints: [
          `💡 **Hint 1:** The identity is $(a+b)(a-b) = a^2 - b^2$.`,
          `💡 **Hint 2:** Here $a = x$ and $b = ${b}$. You need to calculate $b^2 = ${b}^2$.`,
          `📝 **Solution:** $${b}^2 = ${b * b}$. So $(x + ${b})(x - ${b}) = x^2 - ${bSq}$.`
        ],
        steps: [
          `Formula: $(a + b)(a - b) = a^2 - b^2$`,
          `Here $a = x, b = ${b}$`,
          `Missing number is $b^2 = ${b}^2 = ${bSq}$`
        ]
      };
    } else {
      // Mental math trick: e.g. 104 * 96 = (100 + 4)(100 - 4) = 10000 - 16
      const base = 100;
      const diff = this.randInt(2, 8);
      const n1 = base + diff;
      const n2 = base - diff;
      const ansVal = base * base - diff * diff;

      return {
        id: "id_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        topic: "Algebraic Expressions",
        subtopic: "Identity Mental Math Trick",
        difficulty: difficulty,
        variable: "product",
        answer: ansVal.toString(),
        numericAnswer: ansVal,
        questionHtml: `Find the value of $${n1} \\times ${n2}$ without direct multiplication, using $(a+b)(a-b) = a^2 - b^2$.`,
        plainQuestion: `Find the value of ${n1} * ${n2} using identity (a+b)(a-b) = a^2 - b^2.`,
        hints: [
          `💡 **Hint 1:** Express $${n1}$ as $(100 + ${diff})$ and $${n2}$ as $(100 - ${diff})$.`,
          `💡 **Hint 2:** Use $(100 + ${diff})(100 - ${diff}) = 100^2 - ${diff}^2 = 10000 - ${diff * diff}$.`,
          `📝 **Solution:** $10000 - ${diff * diff} = ${ansVal}$.`
        ],
        steps: [
          `Rewrite: $(${base} + ${diff})(${base} - ${diff})$`,
          `Apply identity: $a^2 - b^2 = ${base}^2 - ${diff}^2$`,
          `$= 10000 - ${diff * diff} = ${ansVal}$`
        ]
      };
    }
  }

  // Factorisation problems
  static generateFactorisationProblem(difficulty = "Beginner") {
    const a = this.randInt(2, 6);
    const b = this.randInt(1, 5);

    // Quadratic: x^2 + (a+b)x + ab
    const p = a + b;
    const q = a * b;

    return {
      id: "fact_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      topic: "Factorisation",
      subtopic: "Splitting the Middle Term",
      difficulty: difficulty,
      variable: "larger_factor",
      answer: Math.max(a, b).toString(),
      numericAnswer: Math.max(a, b),
      questionHtml: `The expression $x^2 + ${p}x + ${q}$ factorises into $(x + m)(x + n)$. <br><strong>What is the value of the larger number between $m$ and $n$?</strong>`,
      plainQuestion: `The expression x^2 + ${p}x + ${q} factorises into (x + m)(x + n). What is the larger number between m and n?`,
      hints: [
        `💡 **Hint 1:** Look for two numbers whose **Product is $${q}$** and whose **Sum is $${p}$**.`,
        `💡 **Hint 2:** Factors of $${q}$ include $${a}$ and $${b}$. Check if $${a} + ${b} = ${p}$!`,
        `📝 **Solution:** The numbers are $${Math.min(a, b)}$$ and $${Math.max(a, b)}$$. The larger one is $${Math.max(a, b)}$.`
      ],
      steps: [
        `Identify quadratic form: $x^2 + (m+n)x + mn = x^2 + ${p}x + ${q}$`,
        `Product $mn = ${q}$ and Sum $m + n = ${p}$`,
        `Factors are $${a}$ and $${b}$ because $${a} \\times ${b} = ${q}$ and $${a} + ${b} = ${p}$`,
        `Factored form: $(x + ${a})(x + ${b})$`,
        `The larger constant is $${Math.max(a, b)}$`
      ]
    };
  }

  // Diagnostic Evaluator: Analyzes student response for common misconceptions
  static evaluateAnswer(problem, studentInput) {
    if (!studentInput || studentInput.toString().trim() === "") {
      return {
        isCorrect: false,
        feedback: "Please enter an answer to submit!",
        type: "empty"
      };
    }

    const cleanInput = studentInput.toString().trim().toLowerCase();
    const cleanAnswer = problem.answer.toString().trim().toLowerCase();

    // Check if user typed "x = 5" or "5"
    let userNum = null;
    const match = cleanInput.match(/-?\d+(\.\d+)?/);
    if (match) {
      userNum = parseFloat(match[0]);
    }

    const targetNum = problem.numericAnswer !== undefined ? problem.numericAnswer : parseFloat(cleanAnswer);

    if (userNum !== null && !isNaN(targetNum) && Math.abs(userNum - targetNum) < 0.001) {
      return {
        isCorrect: true,
        feedback: "🎉 **Spot on! Brilliant job!** You solved it accurately.",
        encouragement: "Keep up the momentum! You're thinking like a true algebra pro."
      };
    }

    // Direct string match fallback
    if (cleanInput === cleanAnswer) {
      return {
        isCorrect: true,
        feedback: "🎉 **Correct!** Excellent work.",
        encouragement: "Great job mastering this concept!"
      };
    }

    // Diagnostic Feedback for Common Mistakes
    let diagnosis = null;
    if (userNum !== null && !isNaN(targetNum)) {
      // 1. Sign error (e.g. +6 vs -6)
      if (Math.abs(userNum + targetNum) < 0.001 && targetNum !== 0) {
        diagnosis = "⚠️ **Close, but check your sign!** Remember when you transpose a term across the equals sign ($=$), a positive becomes negative and a negative becomes positive.";
      }
      // 2. Off by one
      else if (Math.abs(userNum - targetNum) === 1) {
        diagnosis = "🔍 **Very close! You are just off by 1.** Double-check your arithmetic addition/subtraction.";
      }
    }

    return {
      isCorrect: false,
      feedback: diagnosis || "🤔 **Not quite, but you're learning!** Every mistake is a stepping stone to mastery.",
      encouragement: "Review the hints or check the step-by-step breakdown below to see where the path diverged.",
      hintAvailable: true
    };
  }
}
