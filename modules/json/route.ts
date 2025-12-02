import { Router, Request, Response } from "express";

const router = Router();

// Sample data templates (shared across functions)
const firstNames = [
  "John",
  "Jane",
  "Michael",
  "Emily",
  "David",
  "Sarah",
  "James",
  "Emma",
  "Robert",
  "Olivia",
];
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
];
const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
];
const companies = [
  "Tech Corp",
  "Innovate Ltd",
  "Digital Solutions",
  "Future Systems",
  "Cloud Services",
  "Data Analytics Inc",
  "Smart Tech",
  "NextGen Co",
  "Global Systems",
  "Quantum Labs",
];

interface GenerateOptions {
  minNestingLevel?: number;
  minStringLength?: number;
  minObjectKeys?: number;
  minArrayLength?: number;
}

/**
 * Pad a string to meet minimum length requirement
 */
function padString(str: string, minLength: number): string {
  if (str.length >= minLength) return str;
  const padding =
    " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.".repeat(
      Math.ceil((minLength - str.length) / 200)
    );
  return (str + padding).substring(0, minLength);
}

/**
 * Create meaningful nested object to meet minimum nesting level
 * This creates realistic nested structures like organization hierarchies, product categories, etc.
 */
function createNestedObject(
  level: number,
  currentLevel: number = 1,
  options: GenerateOptions = {}
): any {
  const { minArrayLength = 0 } = options;
  // Generate realistic nested structures based on level
  const nestingTypes = [
    // Organization hierarchy
    () => ({
      department: [
        "Engineering",
        "Sales",
        "Marketing",
        "Operations",
        "Finance",
      ][Math.floor(Math.random() * 5)],
      teamName: `Team ${String.fromCharCode(65 + (currentLevel % 26))}`,
      manager: {
        id: Math.floor(Math.random() * 10000),
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
          lastNames[Math.floor(Math.random() * lastNames.length)]
        }`,
        email: `manager${currentLevel}@company.com`,
        level: currentLevel,
      },
      metrics: {
        headcount: Math.floor(Math.random() * 50) + 5,
        budget: Math.floor(Math.random() * 1000000) + 100000,
        performance: (Math.random() * 100).toFixed(2),
      },
      ...(currentLevel < level && {
        subDepartment: createNestedObject(level, currentLevel + 1, options),
      }),
    }),
    // Product category hierarchy
    () => {
      const productNames = [
        "Wireless Headphones",
        "Smart Watch",
        "Laptop Stand",
        "USB Cable",
        "Phone Case",
        "Keyboard",
        "Mouse Pad",
        "Desk Lamp",
        "Water Bottle",
        "Backpack",
        "Notebook",
        "Pen Set",
        "Coffee Mug",
        "T-Shirt",
        "Running Shoes",
        "Yoga Mat",
        "Dumbbell Set",
        "Protein Powder",
        "Book Bundle",
        "Art Supplies",
        "Gaming Controller",
        "Monitor",
        "Camera Lens",
        "Tripod",
        "Microphone",
        "Speakers",
        "Tablet",
        "Charger",
        "Power Bank",
        "Screen Protector",
      ];
      const baseLength =
        minArrayLength > 0 ? minArrayLength : Math.floor(Math.random() * 3) + 1;
      const itemsLength = baseLength + Math.floor(Math.random() * 3);
      const shuffled = [...productNames].sort(() => Math.random() - 0.5);

      return {
        category: ["Electronics", "Clothing", "Home", "Sports", "Books"][
          Math.floor(Math.random() * 5)
        ],
        subcategory: `Level ${currentLevel} Category`,
        items: Array.from(
          { length: Math.min(itemsLength, productNames.length) },
          (_, i) => ({
            id: `item-${currentLevel}-${i}`,
            name: shuffled[i],
            price: (Math.random() * 1000).toFixed(2),
            inStock: Math.random() > 0.3,
            rating: (Math.random() * 2 + 3).toFixed(1),
            reviews: Math.floor(Math.random() * 500),
          })
        ),
        metadata: {
          totalProducts: Math.floor(Math.random() * 100) + 10,
          avgRating: (Math.random() * 2 + 3).toFixed(1),
          createdAt: new Date(
            Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
          ).toISOString(),
        },
        ...(currentLevel < level && {
          children: createNestedObject(level, currentLevel + 1, options),
        }),
      };
    },
    // File system hierarchy
    () => ({
      name: `folder-level-${currentLevel}`,
      type: currentLevel === level ? "file" : "directory",
      path: `/root/${Array.from(
        { length: currentLevel },
        (_, i) => `level${i + 1}`
      ).join("/")}`,
      size: Math.floor(Math.random() * 1024 * 1024),
      permissions: ["read", "write", "execute"][Math.floor(Math.random() * 3)],
      owner: {
        userId: Math.floor(Math.random() * 1000),
        username: `user${currentLevel}`,
        group: ["admin", "users", "developers"][Math.floor(Math.random() * 3)],
      },
      timestamps: {
        created: new Date(
          Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
        ).toISOString(),
        modified: new Date(
          Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
        ).toISOString(),
        accessed: new Date(
          Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
        ).toISOString(),
      },
      ...(currentLevel < level && {
        contents: createNestedObject(level, currentLevel + 1, options),
      }),
    }),
    // Location hierarchy
    () => ({
      level: currentLevel,
      locationType: [
        "Country",
        "State",
        "City",
        "District",
        "Street",
        "Building",
      ][Math.min(currentLevel - 1, 5)],
      name:
        currentLevel === 1
          ? "USA"
          : currentLevel === 2
          ? ["California", "New York", "Texas"][Math.floor(Math.random() * 3)]
          : `Location-${currentLevel}`,
      coordinates: {
        latitude: (Math.random() * 180 - 90).toFixed(6),
        longitude: (Math.random() * 360 - 180).toFixed(6),
        altitude: Math.floor(Math.random() * 1000),
      },
      population: Math.floor(Math.random() * 1000000),
      area: {
        squareKm: Math.floor(Math.random() * 10000),
        squareMiles: Math.floor(Math.random() * 3861),
      },
      demographics: {
        density: Math.floor(Math.random() * 10000),
        medianAge: Math.floor(Math.random() * 40) + 20,
        growthRate: (Math.random() * 5 - 1).toFixed(2),
      },
      ...(currentLevel < level && {
        subLocation: createNestedObject(level, currentLevel + 1, options),
      }),
    }),
    // Project/task hierarchy
    () => ({
      id: `project-${currentLevel}`,
      name: `Project Level ${currentLevel}`,
      status: ["active", "pending", "completed", "on-hold"][
        Math.floor(Math.random() * 4)
      ],
      priority: ["low", "medium", "high", "critical"][
        Math.floor(Math.random() * 4)
      ],
      assignee: {
        id: Math.floor(Math.random() * 1000),
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
          lastNames[Math.floor(Math.random() * lastNames.length)]
        }`,
        role: ["Developer", "Designer", "Manager", "QA"][
          Math.floor(Math.random() * 4)
        ],
      },
      timeline: {
        startDate: new Date(
          Date.now() - Math.floor(Math.random() * 180 * 24 * 60 * 60 * 1000)
        ).toISOString(),
        dueDate: new Date(
          Date.now() + Math.floor(Math.random() * 180 * 24 * 60 * 60 * 1000)
        ).toISOString(),
        estimatedHours: Math.floor(Math.random() * 200) + 10,
        actualHours: Math.floor(Math.random() * 250),
      },
      progress: {
        percentage: Math.floor(Math.random() * 100),
        completedTasks: Math.floor(Math.random() * 50),
        totalTasks: Math.floor(Math.random() * 100) + 50,
      },
      ...(currentLevel < level && {
        subTasks: createNestedObject(level, currentLevel + 1, options),
      }),
    }),
  ];

  // Select a random nesting type
  const nestingGenerator =
    nestingTypes[Math.floor(Math.random() * nestingTypes.length)];
  return nestingGenerator();
}

/**
 * Generate a single item with consistent structure
 */
function generateItem(counter: number, options: GenerateOptions = {}): any {
  const {
    minNestingLevel = 2,
    minStringLength = 0,
    minObjectKeys = 0,
    minArrayLength = 0,
  } = options;

  // Base strings
  let firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  let lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  let email = `user${counter}@example${Math.floor(Math.random() * 1000)}.com`;
  let phone = `+1-${Math.floor(Math.random() * 900) + 100}-${
    Math.floor(Math.random() * 900) + 100
  }-${Math.floor(Math.random() * 9000) + 1000}`;
  let notes = `This is a sample note for user ${counter}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

  // Apply minimum string length
  if (minStringLength > 0) {
    firstName = padString(firstName, minStringLength);
    lastName = padString(lastName, minStringLength);
    email = padString(email, minStringLength);
    phone = padString(phone, minStringLength);
    notes = padString(notes, minStringLength);
  }

  // Generate tags array with minimum length and variation
  // Use minimum length if specified, otherwise use random between 1-5
  const baseLength =
    minArrayLength > 0 ? minArrayLength : Math.floor(Math.random() * 5) + 1;
  // Add variation: 0 to 3 additional items beyond minimum
  const tagsLength = baseLength + Math.floor(Math.random() * 4);

  // Pool of meaningful tags to choose from
  const availableTags = [
    "javascript",
    "python",
    "react",
    "node.js",
    "typescript",
    "backend",
    "frontend",
    "fullstack",
    "api",
    "database",
    "cloud",
    "aws",
    "docker",
    "kubernetes",
    "microservices",
    "agile",
    "scrum",
    "devops",
    "machine-learning",
    "data-science",
    "analytics",
    "security",
    "testing",
    "mobile",
    "ios",
    "android",
    "web",
    "design",
    "ux-ui",
    "leadership",
    "management",
    "communication",
    "problem-solving",
    "teamwork",
    "innovation",
    "creativity",
    "strategic-thinking",
    "project-management",
    "quality-assurance",
  ];

  // Shuffle and select unique tags
  const shuffled = [...availableTags].sort(() => Math.random() - 0.5);
  const tags = shuffled
    .slice(0, Math.min(tagsLength, availableTags.length))
    .map((tag) =>
      minStringLength > 0 ? padString(tag, minStringLength) : tag
    );

  const item: any = {
    id: counter,
    uuid: `${Math.random().toString(36).substring(2, 15)}-${Math.random()
      .toString(36)
      .substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`,
    firstName,
    lastName,
    email,
    phone,
    age: Math.floor(Math.random() * 60) + 18,
    address: {
      street: `${Math.floor(Math.random() * 9999) + 1} ${
        ["Main", "Oak", "Maple", "Pine", "Cedar", "Elm"][
          Math.floor(Math.random() * 6)
        ]
      } Street`,
      city: cities[Math.floor(Math.random() * cities.length)],
      state: ["CA", "NY", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI"][
        Math.floor(Math.random() * 10)
      ],
      zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
      country: "USA",
    },
    company: {
      name: companies[Math.floor(Math.random() * companies.length)],
      position: [
        "Software Engineer",
        "Product Manager",
        "Data Analyst",
        "UX Designer",
        "DevOps Engineer",
      ][Math.floor(Math.random() * 5)],
      department: [
        "Engineering",
        "Product",
        "Sales",
        "Marketing",
        "Operations",
      ][Math.floor(Math.random() * 5)],
      salary: Math.floor(Math.random() * 150000) + 50000,
    },
    metadata: {
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
      ).toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: Math.random() > 0.3,
      tags,
      score: Math.random() * 100,
      notes,
    },
    preferences: {
      notifications: Math.random() > 0.5,
      newsletter: Math.random() > 0.5,
      darkMode: Math.random() > 0.5,
      language: ["en", "es", "fr", "de", "it"][Math.floor(Math.random() * 5)],
      timezone: [
        "America/New_York",
        "America/Los_Angeles",
        "America/Chicago",
        "America/Denver",
      ][Math.floor(Math.random() * 4)],
    },
    activity: {
      lastLogin: new Date(
        Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
      ).toISOString(),
      loginCount: Math.floor(Math.random() * 1000),
      purchases: Math.floor(Math.random() * 50),
      reviews: Math.floor(Math.random() * 20),
    },
  };

  // Add deep nesting if required (beyond the default 2 levels)
  if (minNestingLevel > 2) {
    item.details = createNestedObject(minNestingLevel, 1, options);
  }

  // Add extra keys to meet minObjectKeys requirement
  const currentKeys = Object.keys(item).length;
  if (minObjectKeys > currentKeys) {
    // Define meaningful additional fields that could exist in a user profile
    const additionalFields = [
      {
        key: "socialSecurity",
        value: () => `***-**-${Math.floor(Math.random() * 9000) + 1000}`,
      },
      {
        key: "bloodType",
        value: () =>
          ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"][
            Math.floor(Math.random() * 8)
          ],
      },
      {
        key: "maritalStatus",
        value: () =>
          ["Single", "Married", "Divorced", "Widowed"][
            Math.floor(Math.random() * 4)
          ],
      },
      {
        key: "education",
        value: () =>
          ["High School", "Bachelor's", "Master's", "PhD", "Associate"][
            Math.floor(Math.random() * 5)
          ],
      },
      {
        key: "occupation",
        value: () =>
          ["Engineer", "Teacher", "Doctor", "Artist", "Analyst", "Manager"][
            Math.floor(Math.random() * 6)
          ],
      },
      { key: "yearsOfExperience", value: () => Math.floor(Math.random() * 30) },
      {
        key: "creditScore",
        value: () => Math.floor(Math.random() * 350) + 450,
      },
      {
        key: "membershipLevel",
        value: () =>
          ["Bronze", "Silver", "Gold", "Platinum", "Diamond"][
            Math.floor(Math.random() * 5)
          ],
      },
      {
        key: "referralCode",
        value: () =>
          `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      },
      { key: "loyaltyPoints", value: () => Math.floor(Math.random() * 10000) },
      {
        key: "subscriptionStatus",
        value: () =>
          ["Active", "Inactive", "Pending", "Cancelled"][
            Math.floor(Math.random() * 4)
          ],
      },
      {
        key: "accountTier",
        value: () =>
          ["Free", "Basic", "Premium", "Enterprise"][
            Math.floor(Math.random() * 4)
          ],
      },
      {
        key: "nationality",
        value: () =>
          ["American", "Canadian", "British", "Australian", "German"][
            Math.floor(Math.random() * 5)
          ],
      },
      {
        key: "emergencyContact",
        value: () =>
          `+1-${Math.floor(Math.random() * 900) + 100}-${
            Math.floor(Math.random() * 900) + 100
          }-${Math.floor(Math.random() * 9000) + 1000}`,
      },
      {
        key: "dateOfBirth",
        value: () =>
          new Date(
            Date.now() -
              Math.floor(Math.random() * 60 * 365 * 24 * 60 * 60 * 1000) -
              18 * 365 * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0],
      },
      {
        key: "profileVisibility",
        value: () =>
          ["Public", "Private", "Friends Only"][Math.floor(Math.random() * 3)],
      },
      {
        key: "verificationStatus",
        value: () =>
          ["Verified", "Pending", "Unverified"][Math.floor(Math.random() * 3)],
      },
      { key: "twoFactorEnabled", value: () => Math.random() > 0.5 },
      {
        key: "bio",
        value: () =>
          "Passionate professional with expertise in various domains and a commitment to excellence.",
      },
      {
        key: "website",
        value: () =>
          `https://www.user-portfolio-${Math.floor(Math.random() * 1000)}.com`,
      },
      {
        key: "linkedInProfile",
        value: () =>
          `https://linkedin.com/in/user${Math.floor(Math.random() * 10000)}`,
      },
      {
        key: "githubUsername",
        value: () => `github_user_${Math.floor(Math.random() * 10000)}`,
      },
      {
        key: "twitterHandle",
        value: () => `@user${Math.floor(Math.random() * 10000)}`,
      },
      {
        key: "instagramHandle",
        value: () => `@insta_user${Math.floor(Math.random() * 10000)}`,
      },
      {
        key: "skills",
        value: () => {
          const allSkills = [
            "JavaScript",
            "Python",
            "Java",
            "C++",
            "React",
            "Node.js",
            "TypeScript",
            "Go",
            "Rust",
            "Ruby",
            "PHP",
            "Swift",
            "Kotlin",
            "SQL",
            "MongoDB",
            "PostgreSQL",
            "Redis",
            "GraphQL",
            "Docker",
            "Kubernetes",
            "AWS",
            "Azure",
            "GCP",
            "CI/CD",
            "Git",
            "Agile",
            "Scrum",
            "TDD",
            "REST API",
            "Microservices",
          ];
          const baseLength =
            minArrayLength > 0
              ? minArrayLength
              : Math.floor(Math.random() * 4) + 2;
          const arrayLength = baseLength + Math.floor(Math.random() * 3);
          const shuffled = [...allSkills].sort(() => Math.random() - 0.5);
          return shuffled
            .slice(0, Math.min(arrayLength, allSkills.length))
            .map((skill) =>
              minStringLength > 0 ? padString(skill, minStringLength) : skill
            );
        },
      },
      {
        key: "certifications",
        value: () =>
          ["AWS Certified", "Azure Certified", "Google Cloud", "PMP"][
            Math.floor(Math.random() * 4)
          ],
      },
      {
        key: "hobbies",
        value: () => {
          const allHobbies = [
            "Reading",
            "Gaming",
            "Sports",
            "Cooking",
            "Travel",
            "Photography",
            "Music",
            "Painting",
            "Hiking",
            "Cycling",
            "Swimming",
            "Yoga",
            "Dancing",
            "Gardening",
            "Writing",
            "Fishing",
            "Camping",
            "Running",
            "Chess",
            "Movies",
            "Theater",
            "Crafts",
            "Volunteering",
            "Meditation",
          ];
          const baseLength =
            minArrayLength > 0
              ? minArrayLength
              : Math.floor(Math.random() * 3) + 1;
          const arrayLength = baseLength + Math.floor(Math.random() * 3);
          const shuffled = [...allHobbies].sort(() => Math.random() - 0.5);
          return shuffled
            .slice(0, Math.min(arrayLength, allHobbies.length))
            .map((hobby) =>
              minStringLength > 0 ? padString(hobby, minStringLength) : hobby
            );
        },
      },
      {
        key: "spokenLanguages",
        value: () => {
          const allLanguages = [
            "English",
            "Spanish",
            "French",
            "German",
            "Chinese",
            "Japanese",
            "Korean",
            "Italian",
            "Portuguese",
            "Russian",
            "Arabic",
            "Hindi",
            "Dutch",
            "Swedish",
            "Polish",
            "Turkish",
            "Vietnamese",
            "Thai",
          ];
          const baseLength =
            minArrayLength > 0
              ? minArrayLength
              : Math.floor(Math.random() * 3) + 1;
          const arrayLength = baseLength + Math.floor(Math.random() * 2);
          const shuffled = [...allLanguages].sort(() => Math.random() - 0.5);
          return shuffled
            .slice(0, Math.min(arrayLength, allLanguages.length))
            .map((lang) =>
              minStringLength > 0 ? padString(lang, minStringLength) : lang
            );
        },
      },
      {
        key: "timezone",
        value: () =>
          [
            "America/New_York",
            "America/Los_Angeles",
            "Europe/London",
            "Asia/Tokyo",
          ][Math.floor(Math.random() * 4)],
      },
      {
        key: "currency",
        value: () =>
          ["USD", "EUR", "GBP", "JPY", "CAD"][Math.floor(Math.random() * 5)],
      },
      {
        key: "theme",
        value: () => ["Light", "Dark", "Auto"][Math.floor(Math.random() * 3)],
      },
      {
        key: "fontSize",
        value: () =>
          ["Small", "Medium", "Large"][Math.floor(Math.random() * 3)],
      },
      {
        key: "privacySettings",
        value: () => ({
          showEmail: Math.random() > 0.5,
          showPhone: Math.random() > 0.5,
          showLocation: Math.random() > 0.5,
        }),
      },
      {
        key: "accountAge",
        value: () => `${Math.floor(Math.random() * 10)} years`,
      },
      {
        key: "lastPasswordChange",
        value: () =>
          new Date(
            Date.now() - Math.floor(Math.random() * 180 * 24 * 60 * 60 * 1000)
          ).toISOString(),
      },
      {
        key: "securityQuestions",
        value: () => Math.floor(Math.random() * 3) + 1,
      },
      {
        key: "notificationPreferences",
        value: () => ({
          email: Math.random() > 0.5,
          sms: Math.random() > 0.5,
          push: Math.random() > 0.5,
        }),
      },
      {
        key: "storageUsed",
        value: () => `${(Math.random() * 10).toFixed(2)} GB`,
      },
      { key: "apiAccess", value: () => Math.random() > 0.7 },
      {
        key: "ipAddress",
        value: () =>
          `${Math.floor(Math.random() * 256)}.${Math.floor(
            Math.random() * 256
          )}.${Math.floor(Math.random() * 256)}.${Math.floor(
            Math.random() * 256
          )}`,
      },
    ];

    let keyIndex = 0;
    for (let i = currentKeys; i < minObjectKeys; i++) {
      const field = additionalFields[keyIndex % additionalFields.length];
      let value = field.value();

      // Apply string padding if needed and value is a string
      if (minStringLength > 0 && typeof value === "string") {
        value = padString(value, minStringLength);
      }

      item[field.key] = value;
      keyIndex++;
    }
  }

  return item;
}

/**
 * Generate a large JSON payload of specified size
 * This creates an array of objects with various data types
 */
function generateLargeJson(
  targetSizeInKB: number,
  options: GenerateOptions = {}
): any {
  const targetBytes = targetSizeInKB * 1024;
  const items: any[] = [];
  let currentSize = 0;

  let counter = 0;
  let checkInterval = 1; // Start by checking every item
  let avgItemSize = 0;

  while (currentSize < targetBytes) {
    const item = generateItem(counter, options);

    items.push(item);
    counter++;

    // Check size dynamically based on progress
    if (counter % checkInterval === 0) {
      currentSize = JSON.stringify(items).length;

      // After first 5 items, calculate average and adjust strategy
      if (counter === 5 && avgItemSize === 0) {
        avgItemSize = currentSize / counter;
        const estimatedTotalItems = Math.ceil(targetBytes / avgItemSize);

        // For small requests, be more careful
        if (estimatedTotalItems < 50) {
          checkInterval = 1; // Check every item for small requests
        } else {
          // For larger requests, check every 5% but at least every 10 items
          checkInterval = Math.max(10, Math.floor(estimatedTotalItems * 0.05));
        }
      }

      // When we're close to the target (within 2 average items), check every item
      if (avgItemSize > 0 && targetBytes - currentSize < avgItemSize * 2) {
        checkInterval = 1;
      }
    }
  }

  return {
    success: true,
    timestamp: new Date().toISOString(),
    totalRecords: items.length,
    approximateSize: `${(JSON.stringify(items).length / 1024).toFixed(2)} KB`,
    data: items,
  };
}

/**
 * GET /api/v1/json
 * Serves a JSON response of specified size
 * Query parameters:
 *   - size: Size in KB (default: 100, max: 102400)
 *   - stream: Whether to stream the response (default: false)
 *   - minNestingLevel: Minimum nesting level for objects (default: 2, max: 10)
 *   - minStringLength: Minimum length for string values (default: 0, max: 10000)
 *   - minObjectKeys: Minimum number of keys in objects (default: 0, max: 100)
 *   - minArrayLength: Minimum length for arrays (default: 0, max: 1000)
 *
 * Examples:
 *   GET /api/v1/json?size=500
 *   GET /api/v1/json?size=15360&stream=true
 *   GET /api/v1/json?size=100&minNestingLevel=5&minStringLength=50
 *   GET /api/v1/json?size=200&minObjectKeys=20&minArrayLength=10
 */
router.get("/", (req: Request, res: Response) => {
  try {
    // Parse query parameters
    const requestedSize = parseInt(req.query.size as string) || 100;
    const shouldStream =
      req.query.stream === "true" || req.query.stream === "1";

    // Parse structure parameters
    const minNestingLevel = Math.min(
      Math.max(parseInt(req.query.minNestingLevel as string) || 2, 1),
      10
    );
    const minStringLength = Math.min(
      Math.max(parseInt(req.query.minStringLength as string) || 0, 0),
      10000
    );
    const minObjectKeys = Math.min(
      Math.max(parseInt(req.query.minObjectKeys as string) || 0, 0),
      100
    );
    const minArrayLength = Math.min(
      Math.max(parseInt(req.query.minArrayLength as string) || 0, 0),
      1000
    );

    const options: GenerateOptions = {
      minNestingLevel,
      minStringLength,
      minObjectKeys,
      minArrayLength,
    };

    // Limit the size to prevent abuse (max 102400 KB = 100 MB)
    const size = Math.min(Math.max(requestedSize, 1), 102400);

    console.log(
      `[INFO] ${
        shouldStream ? "Streaming" : "Generating"
      } JSON response of ${size} KB with options:`,
      options
    );

    if (shouldStream) {
      // Stream response
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Transfer-Encoding", "chunked");

      // Start the JSON object
      res.write(
        '{"success":true,"timestamp":"' +
          new Date().toISOString() +
          '","data":['
      );

      const targetBytes = size * 1024;
      let currentSize = 0;
      let counter = 0;

      // Use setImmediate for non-blocking streaming
      const streamChunk = () => {
        if (currentSize >= targetBytes) {
          const sizeInKB = (currentSize / 1024).toFixed(2);
          res.write(
            `],"totalRecords":${counter},"approximateSize":"${sizeInKB} KB"}`
          );
          res.end();
          console.log(
            `[INFO] Finished streaming ${counter} records (${sizeInKB} KB)`
          );
          return;
        }

        // Generate and write a larger batch (500 items at a time for efficiency)
        const batchSize = 500;
        for (let i = 0; i < batchSize && currentSize < targetBytes; i++) {
          if (counter > 0) res.write(",");

          const item = generateItem(counter, options);
          counter++;

          const chunk = JSON.stringify(item);
          res.write(chunk);
          currentSize += chunk.length;
        }

        // Continue streaming in next tick (non-blocking)
        setImmediate(streamChunk);
      };

      // Start streaming
      streamChunk();
    } else {
      // Regular response
      const data = generateLargeJson(size, options);

      console.log(
        `[INFO] Generated JSON with ${data.totalRecords} records (${data.approximateSize})`
      );

      // Set appropriate headers
      res.setHeader("Content-Type", "application/json");
      res.setHeader("X-Records-Count", data.totalRecords.toString());
      res.setHeader("X-Approximate-Size", data.approximateSize);
      res.setHeader("X-Min-Nesting-Level", minNestingLevel.toString());
      res.setHeader("X-Min-String-Length", minStringLength.toString());
      res.setHeader("X-Min-Object-Keys", minObjectKeys.toString());
      res.setHeader("X-Min-Array-Length", minArrayLength.toString());

      res.json(data);
    }
  } catch (error) {
    console.error("[ERROR] Failed to generate JSON response:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate JSON response",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
