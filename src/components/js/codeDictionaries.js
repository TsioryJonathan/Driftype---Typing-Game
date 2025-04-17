export const codeDictionaries = {
    python: {
        easy: [
            // Niveau facile - Bases du langage
            `def greet(name):
    print(f"Hello {name}!")`,
            `def add(a, b):
    return a + b`,
            `for i in range(5):
    print(i)`,
            `numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]`
        ],
        medium: [
            // Niveau moyen - Algorithmes et POO
            `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
            `class Person:
    def __init__(self, name):
        self.name = name
    
    def greet(self):
        print(f"Hello, I'm {self.name}")`,
            `def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True`,
            `def flatten(lst):
    return [item for sublist in lst for item in sublist]`
        ],
        hard: [
            // Niveau difficile - Algorithmes avancés
            `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`,
            `def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    queue = list(graph.keys())
    
    while queue:
        current = min(queue, key=lambda node: distances[node])
        queue.remove(current)
        
        for neighbor, weight in graph[current].items():
            if distances[neighbor] > distances[current] + weight:
                distances[neighbor] = distances[current] + weight
                
    return distances`,
            `class BinaryTree:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        
    def invert(self):
        self.left, self.right = self.right, self.left
        if self.left:
            self.left.invert()
        if self.right:
            self.right.invert()`,
            `async def fetch_data(urls):
    import aiohttp
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        return await asyncio.gather(*tasks)`
        ],
        expert: [
            // Niveau expert - Défis complexes
            `def knapsack(items, max_weight):
    n = len(items)
    dp = [[0] * (max_weight + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        weight, value = items[i-1]
        for w in range(max_weight + 1):
            if weight > w:
                dp[i][w] = dp[i-1][w]
            else:
                dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight] + value)
                
    return dp[n][max_weight]`,
            `def levenshtein_distance(s1, s2):
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
        
    if len(s2) == 0:
        return len(s1)
        
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
        
    return previous_row[-1]`,
            `class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()
        
    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]
        
    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)`
        ]
    },
    javascript: {
        easy: [
            // Niveau facile - Bases du langage
            `function greet(name) {
    console.log(\`Hello \${name}!\`);
}`,
            `const add = (a, b) => a + b;`,
            `for (let i = 0; i < 5; i++) {
    console.log(i);
}`,
            `const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map(x => x * x);`
        ],
        medium: [
            // Niveau moyen - Algorithmes et POO
            `function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`,
            `class Person {
    constructor(name) {
        this.name = name;
    }
    
    greet() {
        console.log(\`Hello, I'm \${this.name}\`);
    }
}`,
            `function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}`,
            `function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}`
        ],
        hard: [
            // Niveau difficile - Algorithmes avancés
            `function quickSort(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(x => x < pivot);
    const middle = arr.filter(x => x === pivot);
    const right = arr.filter(x => x > pivot);
    return [...quickSort(left), ...middle, ...quickSort(right)];
}`,
            `function binarySearch(sortedArray, target) {
    let left = 0;
    let right = sortedArray.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (sortedArray[mid] === target) return mid;
        if (sortedArray[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return -1;
}`,
            `class Observable {
    constructor() {
        this.subscribers = [];
    }
    
    subscribe(fn) {
        this.subscribers.push(fn);
    }
    
    unsubscribe(fn) {
        this.subscribers = this.subscribers.filter(sub => sub !== fn);
    }
    
    notify(data) {
        this.subscribers.forEach(fn => fn(data));
    }
}`,
            `async function parallelFetch(urls) {
    const promises = urls.map(url => 
        fetch(url).then(res => res.json())
    );
    return Promise.all(promises);
}`
        ],
        expert: [
            // Niveau expert - Défis complexes
            `function* fibonacci() {
    let [prev, curr] = [0, 1];
    while (true) {
        yield curr;
        [prev, curr] = [curr, prev + curr];
    }
}`,
            `function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function(...args2) {
                return curried.apply(this, args.concat(args2));
            };
        }
    };
}`,
            `class VirtualDOM {
    constructor(tag, props, children) {
        this.tag = tag;
        this.props = props || {};
        this.children = children || [];
    }
    
    render() {
        const el = document.createElement(this.tag);
        
        for (const [key, value] of Object.entries(this.props)) {
            el.setAttribute(key, value);
        }
        
        this.children.forEach(child => {
            const childEl = child instanceof VirtualDOM 
                ? child.render() 
                : document.createTextNode(child);
            el.appendChild(childEl);
        });
        
        return el;
    }
}`,
            `function topologicalSort(graph) {
    const visited = new Set();
    const stack = [];
    
    function visit(node) {
        if (visited.has(node)) return;
        visited.add(node);
        
        graph[node].forEach(visit);
        stack.push(node);
    }
    
    Object.keys(graph).forEach(visit);
    return stack.reverse();
}`
        ]
    },
    // Nouveau : Ajout du langage TypeScript
    typescript: {
        medium: [
            `interface User {
    id: number;
    name: string;
    email: string;
}

function getUserInfo(user: User): string {
    return \`\${user.name} <\${user.email}>\`;
}`,
            `class GenericStack<T> {
    private items: T[] = [];
    
    push(item: T): void {
        this.items.push(item);
    }
    
    pop(): T | undefined {
        return this.items.pop();
    }
}`
        ],
        hard: [
            `type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};`,
            `function debounce<F extends (...args: any[]) => any>(
    func: F,
    delay: number
): (...args: Parameters<F>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function(...args: Parameters<F>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}`
        ]
    }
};

export const getRandomCode = (mode = 'medium', language = 'javascript') => {
    const dictionary = codeDictionaries[language.toLowerCase()];
    if (!dictionary) {
        throw new Error(`Language ${language} not supported`);
    }
    
    const codeList = dictionary[mode.toLowerCase()];
    if (!codeList || codeList.length === 0) {
        throw new Error(`No code samples found for ${language} ${mode} mode`);
    }
    
    return codeList[Math.floor(Math.random() * codeList.length)];
};

// Fonction utilitaire supplémentaire
export const getSupportedLanguages = () => Object.keys(codeDictionaries);

// Fonction pour obtenir les modes disponibles pour un langage
export const getAvailableModes = (language) => {
    const dict = codeDictionaries[language];
    return dict ? Object.keys(dict) : [];
};