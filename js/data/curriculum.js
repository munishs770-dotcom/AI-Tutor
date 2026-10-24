// Curriculum Data for Class 8 Mathematics (Algebra Focus)
// Aligned with NCERT, CBSE, ICSE, and Common Core Standards

export const CURRICULUM = [
  {
    id: "linear_eq_one_var",
    title: "Linear Equations in One Variable",
    icon: "⚖️",
    badge: "Core Algebra",
    description: "Learn to solve equations where the highest power of the variable is 1, using the balance scale and transposition method.",
    difficultyLevels: ["Beginner", "Intermediate", "Advanced"],
    subtopics: [
      {
        id: "intro_to_equations",
        title: "What is an Equation? (The Balance Scale)",
        summary: "An equation is a mathematical statement showing two expressions are equal.",
        content: `
### ⚖️ The Big Idea: An Equation is a Balanced Scale

Think of an equation like a grocery balance scale. The **equals sign ($=$)** is the balancing pivot in the middle!
Whatever weight you place or take away from the left pan, you MUST do the exact same thing to the right pan to keep it balanced.

* **Algebraic Expression:** $2x + 5$ (just a phrase, like "two mystery boxes plus 5 marbles")
* **Algebraic Equation:** $2x + 5 = 15$ (a complete sentence: "two mystery boxes plus 5 marbles balance with 15 marbles")

#### 🔍 Anatomy of a Linear Equation:
In $3x - 4 = 14$:
* **$x$** is the **Variable** (the unknown quantity we need to find).
* **$3$** is the **Coefficient** of $x$ (it multiplies $x$).
* **$-4$** and **$14$** are **Constants** (fixed numbers).
* **Highest power of $x$ is $1$**, which makes it **Linear**!
        `,
        example: {
          problem: "Is $4x^2 + 3 = 19$ a linear equation in one variable?",
          solution: "No! The variable $x$ has an exponent of 2 (it is quadratic, not linear). A linear equation only has $x$ raised to power 1 (e.g., $4x + 3 = 19$)."
        },
        quickCheck: {
          question: "Which of these is a linear equation in one variable?",
          options: ["$2x + 5 = 11$", "$x^2 - 4 = 0$", "$x + y = 10$", "$3x + 1$"],
          correctIndex: 0,
          explanation: "$2x + 5 = 11$ has only one variable ($x$) and its highest power is 1."
        }
      },
      {
        id: "solving_single_step",
        title: "Single-Step & Two-Step Linear Equations",
        summary: "Master the Golden Rule of Algebra: whatever you do to one side, do to the other.",
        content: `
### 🎯 The Mission: Isolate the Variable!

Your goal in every equation is to get $x$ all alone on one side of the equals sign:
$$\\mathbf{x = \\text{some number}}$$

#### The 4 Golden Operations:
1. **To undo Addition ($+$):** Subtract ($-$) the same number from both sides.
2. **To undo Subtraction ($-$):** Add ($+$) the same number to both sides.
3. **To undo Multiplication ($\\\\times$):** Divide ($\\\\div$) both sides by that number.
4. **To undo Division ($\\\\div$):** Multiply ($\\\\times$) both sides by that number.

#### 🚀 Fast-Track: The Transposition Method
When you move a term across the equals sign ($=$), its sign **flips**:
* $+5$ moving to the other side becomes $-5$
* $-7$ moving to the other side becomes $+7$
* $\\times 3$ moving to the other side becomes $\\div 3$
        `,
        example: {
          problem: "Solve: $2x + 5 = 17$",
          steps: [
            "Step 1: Get rid of $+5$ by subtracting $5$ from both sides (or transposing $+5$): \n$$2x = 17 - 5$$\n$$2x = 12$$",
            "Step 2: Isolate $x$ by dividing both sides by $2$:\n$$x = \\frac{12}{2}$$\n$$x = 6$$",
            "Step 3: Verification (always check your answer!):\n$$2(6) + 5 = 12 + 5 = 17 \\quad \\text{✓ Correct!}$$"
          ]
        },
        quickCheck: {
          question: "In the equation $3x - 7 = 14$, what is the first step to isolate $x$?",
          options: ["Add 7 to both sides", "Divide both sides by 3", "Subtract 7 from both sides", "Multiply both sides by 3"],
          correctIndex: 0,
          explanation: "Always undo addition/subtraction first! Adding 7 to both sides leaves $3x = 21$."
        }
      },
      {
        id: "variables_both_sides",
        title: "Equations with Variables on Both Sides",
        summary: "Collect like terms: bring all variable terms to one side and constants to the other.",
        content: `
### 📦 Mystery Boxes on Both Pans!

What happens when $x$ appears on both sides, like $5x - 4 = 2x + 11$?
Don't panic! Follow this universal 2-step playbook:

1. **Move all variable terms ($x$) to one side** (usually to the side with the larger coefficient to keep it positive).
2. **Move all constant numbers to the opposite side**.
3. **Simplify and solve!**

#### Example Walkthrough:
$$5x - 4 = 2x + 11$$
* Move $2x$ to the left: $5x - 2x - 4 = 11$
* $3x - 4 = 11$
* Move $-4$ to the right: $3x = 11 + 4$
* $3x = 15$
* Divide by $3$: $x = 5$
        `,
        example: {
          problem: "Solve: $7x - 5 = 3x + 19$",
          steps: [
            "Transpose $3x$ to LHS: $7x - 3x - 5 = 19$",
            "Simplify variables: $4x - 5 = 19$",
            "Transpose $-5$ to RHS: $4x = 19 + 5 = 24$",
            "Divide by $4$: $x = \\frac{24}{4} = 6$"
          ]
        },
        quickCheck: {
          question: "If $4x + 3 = 2x + 13$, what is the value of $x$?",
          options: ["5", "8", "10", "4"],
          correctIndex: 0,
          explanation: "$4x - 2x = 13 - 3 \\implies 2x = 10 \\implies x = 5$."
        }
      },
      {
        id: "fractions_and_brackets",
        title: "Equations with Brackets & Fractions",
        summary: "Clear parentheses using distributive property and cross-multiply fractions.",
        content: `
### ⚡ Clearing the Obstacles: Brackets and Fractions

#### 1. Distributive Property:
$$a(b + c) = ab + ac$$
When you see $3(x - 2) = 15$, expand first:
$$3x - 6 = 15 \\implies 3x = 21 \\implies x = 7$$

#### 2. Cross-Multiplication for Fractions:
If you have a fraction on both sides:
$$\\frac{A}{B} = \\frac{C}{D} \\implies A \\times D = B \\times C$$
For example:
$$\\frac{x + 1}{2} = \\frac{x + 7}{4}$$
$$4(x + 1) = 2(x + 7)$$
$$4x + 4 = 2x + 14 \\implies 2x = 10 \\implies x = 5$$
        `,
        example: {
          problem: "Solve: $2(x - 3) + 3(4 - x) = 1$",
          steps: [
            "Expand brackets: $2x - 6 + 12 - 3x = 1$",
            "Group like terms: $(2x - 3x) + (-6 + 12) = 1$",
            "$-x + 6 = 1$",
            "$-x = 1 - 6 = -5$",
            "Multiply/divide by $-1$: $x = 5$"
          ]
        },
        quickCheck: {
          question: "Solve $\\frac{x}{3} + 2 = 5$. What is $x$?",
          options: ["9", "15", "6", "3"],
          correctIndex: 0,
          explanation: "$\\frac{x}{3} = 5 - 2 = 3 \\implies x = 3 \\times 3 = 9$."
        }
      },
      {
        id: "word_problems",
        title: "Translating Real-World Word Problems into Equations",
        summary: "Turn English sentences into mathematical algebra step-by-step.",
        content: `
### 🕵️ The Algebra Translator Dictionary

Word problems are just puzzles written in English. Learn the conversion code:

| English Phrase | Math Translation |
| :--- | :--- |
| "A number", "an unknown" | $x$ |
| "Is", "was", "will be", "gives", "equals" | $=$ |
| "Sum of", "increased by", "more than", "older by" | $+$ |
| "Difference of", "decreased by", "less than" | $-$ |
| "Product of", "times", "twice", "thrice" | $\\times$ ($2x, 3x$) |
| "Ratio of $A$ to $B$" | $\\frac{A}{B}$ |
| "Consecutive integers" | $x, x+1, x+2$ |

#### 3-Step Word Problem Strategy:
1. **Assign a variable:** Let the unknown be $x$.
2. **Form the equation:** Re-read sentence by sentence to write the relation.
3. **Solve & check:** Find $x$ and answer the exact question asked (e.g., "Find the present age").
        `,
        example: {
          problem: "The sum of three consecutive multiples of $8$ is $888$. Find the multiples.",
          steps: [
            "Let the three consecutive multiples of $8$ be $8x$, $8(x+1)$, and $8(x+2)$, or $x, x+8, x+16$.",
            "Equation: $x + (x + 8) + (x + 16) = 888$",
            "$3x + 24 = 888$",
            "$3x = 888 - 24 = 864$",
            "$x = \\frac{864}{3} = 288$",
            "The numbers are: $288, 296, 304$."
          ]
        },
        quickCheck: {
          question: "The perimeter of a rectangle is 26 cm. If its width is 5 cm, what is its length $L$?",
          options: ["8 cm", "10 cm", "16 cm", "21 cm"],
          correctIndex: 0,
          explanation: "Perimeter $= 2(L + W) \\implies 2(L + 5) = 26 \\implies L + 5 = 13 \\implies L = 8$ cm."
        }
      }
    ]
  },
  {
    id: "algebraic_expressions",
    title: "Algebraic Expressions & Identities",
    icon: "🧩",
    badge: "Class 8 Foundations",
    description: "Understand terms, like & unlike terms, operations on polynomials, and the 4 standard algebraic identities.",
    difficultyLevels: ["Beginner", "Intermediate", "Advanced"],
    subtopics: [
      {
        id: "terms_and_polynomials",
        title: "Terms, Factors, Coefficients & Like Terms",
        summary: "Building blocks of expressions: identifying terms and combining like terms.",
        content: `
### 🧱 The Building Blocks of Algebra

* **Term:** Formed as a product of factors. In $7xy - 5x$, the terms are $7xy$ and $-5x$.
* **Coefficient:** The numerical factor of a term. In $-5x$, the coefficient is $-5$. In $xy$, the coefficient is $1$.
* **Like Terms:** Terms having the EXACT same algebraic variables with the same powers (e.g., $4x^2y$ and $-7x^2y$).
* **Unlike Terms:** Different variables or different powers (e.g., $4x$ and $4x^2$, or $3x$ and $3y$).

**Remember:** You can ONLY add or subtract **LIKE terms**!
$$3x + 5x = 8x \\quad \\text{✓ (apples + apples)}$$
$$3x + 5y = 3x + 5y \\quad \\text{(cannot be combined!)}$$
        `,
        example: {
          problem: "Add: $(7x^2 - 4x + 5)$ and $(9x - 10)$",
          steps: [
            "Align like terms together: $7x^2 + (-4x + 9x) + (5 - 10)$",
            "Combine coefficients: $7x^2 + 5x - 5$"
          ]
        },
        quickCheck: {
          question: "Which of the following pair consists of like terms?",
          options: ["$7xy$ and $-3yx$", "$2x$ and $2x^2$", "$5ab$ and $5bc$", "$4x$ and $4y$"],
          correctIndex: 0,
          explanation: "$7xy$ and $-3yx$ both have variables $x$ and $y$ to power 1 (order of multiplication does not matter)."
        }
      },
      {
        id: "standard_identities",
        title: "The 4 Essential Algebraic Identities",
        summary: "Formulas that hold true for EVERY value of the variables.",
        content: `
### ⚡ The Super-Power Shortcuts: Identities

An **Identity** is an equality that is true for ALL values of its variables.
Memorize these four gems for Class 8:

1. **Square of a Sum:**
   $$(a + b)^2 = a^2 + 2ab + b^2$$
2. **Square of a Difference:**
   $$(a - b)^2 = a^2 - 2ab + b^2$$
3. **Difference of Two Squares:**
   $$(a + b)(a - b) = a^2 - b^2$$
4. **Product with Common First Term:**
   $$(x + a)(x + b) = x^2 + (a + b)x + ab$$

#### 💡 Mental Math Wonder:
You can calculate $103 \\times 97$ instantly!
$$103 \\times 97 = (100 + 3)(100 - 3) = 100^2 - 3^2 = 10000 - 9 = 9991$$
        `,
        example: {
          problem: "Expand using an identity: $(2x + 3y)^2$",
          steps: [
            "Use $(a + b)^2 = a^2 + 2ab + b^2$ where $a = 2x$ and $b = 3y$",
            "$(2x)^2 + 2(2x)(3y) + (3y)^2$",
            "$= 4x^2 + 12xy + 9y^2$"
          ]
        },
        quickCheck: {
          question: "Expand $(x - 5)^2$",
          options: ["$x^2 - 10x + 25$", "$x^2 - 25$", "$x^2 - 5x + 25$", "$x^2 + 10x + 25$"],
          correctIndex: 0,
          explanation: "$(a - b)^2 = a^2 - 2ab + b^2 = x^2 - 2(x)(5) + 5^2 = x^2 - 10x + 25$."
        }
      }
    ]
  },
  {
    id: "factorisation",
    title: "Factorisation of Algebraic Expressions",
    icon: "🔍",
    badge: "Mastery Topic",
    description: "Write expressions as products of factors using common factors, regrouping, identities, and middle-term splitting.",
    difficultyLevels: ["Beginner", "Intermediate", "Advanced"],
    subtopics: [
      {
        id: "common_factors_regrouping",
        title: "Common Factors & Regrouping Method",
        summary: "Factor out the greatest common factor (GCF) and group pairs of terms.",
        content: `
### 🎁 Unwrapping Expressions: Factorisation

Factorisation is the **reverse of multiplication**.
Instead of multiplying $2(x + 3) = 2x + 6$, we start with $2x + 6$ and rewrite it as $2(x + 3)$.

#### Method 1: Greatest Common Factor (GCF)
1. Find the highest number that divides all coefficients.
2. Find the lowest power of any shared variable.
3. Put the common factor outside brackets!

Example: $6x^2y + 9xy^2$
* Common numerical factor: $3$
* Common variables: $x$ and $y$
* Factored form: $3xy(2x + 3y)$

#### Method 2: Regrouping (when there are 4 terms)
Group in pairs that share common factors:
$$ax + bx + ay + by$$
$$= x(a + b) + y(a + b)$$
$$= (a + b)(x + y)$$
        `,
        example: {
          problem: "Factorise: $15xy - 6x + 5y - 2$",
          steps: [
            "Group pairs: $(15xy - 6x) + (5y - 2)$",
            "Factor GCF from first pair: $3x(5y - 2) + 1(5y - 2)$",
            "Take out common binomial $(5y - 2)$: $(5y - 2)(3x + 1)$"
          ]
        },
        quickCheck: {
          question: "What is the factorised form of $12a^2b + 15ab^2$?",
          options: ["$3ab(4a + 5b)$", "$3a(4ab + 5b^2)$", "$ab(12a + 15b)$", "$3ab(4a - 5b)$"],
          correctIndex: 0,
          explanation: "GCF of 12 and 15 is 3. GCF of $a^2b$ and $ab^2$ is $ab$. Thus $3ab(4a + 5b)$."
        }
      },
      {
        id: "factorise_identities_middle_term",
        title: "Factorisation using Identities & Splitting Middle Term",
        summary: "Identify difference of squares and split middle term for quadratics $x^2 + px + q$.",
        content: `
### 🎯 Pattern Recognition: The Secret Weapon

#### 1. Difference of Two Squares: $a^2 - b^2 = (a + b)(a - b)$
Whenever you see two perfect squares subtracted:
* $x^2 - 16 = x^2 - 4^2 = (x + 4)(x - 4)$
* $49p^2 - 36 = (7p)^2 - 6^2 = (7p + 6)(7p - 6)$

#### 2. Splitting the Middle Term: $x^2 + (a+b)x + ab = (x + a)(x + b)$
To factorise $x^2 + 7x + 12$:
1. We need two numbers $a$ and $b$ whose **Product is $12$** and **Sum is $7$**.
2. Think of factors of $12$: $(1,12)$, $(2,6)$, $(3,4)$.
3. Notice that $3 + 4 = 7$ and $3 \\times 4 = 12$!
4. Answer: $(x + 3)(x + 4)$
        `,
        example: {
          problem: "Factorise: $y^2 - 7y + 12$",
          steps: [
            "Find two numbers whose product is $+12$ and sum is $-7$.",
            "Since the product is positive and sum is negative, both numbers are negative: $-3$ and $-4$.",
            "$(-3) \\times (-4) = +12$ and $(-3) + (-4) = -7$.",
            "Factorised form: $(y - 3)(y - 4)$."
          ]
        },
        quickCheck: {
          question: "Factorise $x^2 - 25$",
          options: ["$(x - 5)(x + 5)$", "$(x - 5)^2$", "$(x + 5)^2$", "$(x - 25)(x + 1)$"],
          correctIndex: 0,
          explanation: "Difference of squares: $x^2 - 5^2 = (x - 5)(x + 5)$."
        }
      }
    ]
  }
];

export const COMMON_MISCONCEPTIONS = [
  {
    mistake: "Forgetting to flip the sign when transposing across '='",
    example: "In $x + 4 = 10$, writing $x = 10 + 4 = 14$ instead of $x = 10 - 4 = 6$.",
    tip: "Think of the '=' sign as a magic border checkpoint: you must change your sign passport (+ becomes -, - becomes +) to cross!"
  },
  {
    mistake: "Multiplying instead of dividing to isolate $x$",
    example: "In $3x = 12$, writing $x = 12 \\times 3 = 36$ instead of $x = 12 / 3 = 4$.",
    tip: "The 3 is stuck to $x$ by multiplication. The only way to detach it is division!"
  },
  {
    mistake: "Adding unlike terms together",
    example: "Writing $2x + 3 = 5x$.",
    tip: "You can't add 2 apples and 3 dollars to get 5 apple-dollars! $2x$ and $3$ stay separate unless both have $x$."
  },
  {
    mistake: "Distributing only to the first term in parentheses",
    example: "$2(x + 5) = 2x + 5$ instead of $2x + 10$.",
    tip: "The number outside is knocking on EVERY door inside the bracket: $2 \\times x$ AND $2 \\times 5$!"
  }
];
