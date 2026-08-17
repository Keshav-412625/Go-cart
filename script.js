const { configureStore, createSlice } = RTK;
const { Provider, useDispatch, useSelector } = ReactRedux;

const {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} = React;

const productCatalog = [
    { id: 1, name: "Aurora Headphones", category: "Audio", price: 129, icon: "🎧" },
    { id: 2, name: "Nimbus Keyboard", category: "Accessories", price: 89, icon: "⌨️" },
    { id: 3, name: "Orbit Smartwatch", category: "Wearables", price: 199, icon: "⌚" },
    { id: 4, name: "Pixel Camera", category: "Photography", price: 349, icon: "📷" },
    { id: 5, name: "Echo Speaker", category: "Audio", price: 79, icon: "🔊" },
    { id: 6, name: "Nova Mouse", category: "Accessories", price: 49, icon: "🖱️" },
    { id: 7, name: "Pulse Fitness Band", category: "Wearables", price: 69, icon: "🏃" },
    { id: 8, name: "Focus Tripod", category: "Photography", price: 119, icon: "📸" },
    { id: 9, name: "Zen Noise Canceller", category: "Audio", price: 159, icon: "🎶" },
    { id: 10, name: "Glide Laptop Stand", category: "Accessories", price: 74, icon: "💻" },
    { id: 11, name: "Vivid Action Camera", category: "Photography", price: 279, icon: "🎥" },
    { id: 12, name: "Flex Smart Ring", category: "Wearables", price: 149, icon: "💍" },
    { id: 13, name: "Sonic Microphone", category: "Audio", price: 219, icon: "🎙️" },
    { id: 14, name: "Crystal Webcam", category: "Photography", price: 99, icon: "📹" },
    { id: 15, name: "Tactile Mechanical Pad", category: "Accessories", price: 59, icon: "🧩" },
    { id: 16, name: "Active Smart Scale", category: "Wearables", price: 89, icon: "⚖️" },
    { id: 17, name: "Wave Soundbar", category: "Audio", price: 249, icon: "📻" },
    { id: 18, name: "Vector USB Hub", category: "Accessories", price: 39, icon: "🔌" },
    { id: 19, name: "Lumen Studio Light", category: "Photography", price: 169, icon: "💡" },
    { id: 20, name: "Track Health Monitor", category: "Wearables", price: 229, icon: "❤️" },
    { id: 21, name: "Breeze Earbuds", category: "Audio", price: 109, icon: "🎵" },
    { id: 22, name: "Pro Desk Mat", category: "Accessories", price: 35, icon: "🖥️" },
    { id: 23, name: "Vista Mirrorless Lens", category: "Photography", price: 399, icon: "🔭" },
    { id: 24, name: "Core Sleep Tracker", category: "Wearables", price: 119, icon: "😴" },
    { id: 25, name: "Bass Boost Amp", category: "Audio", price: 299, icon: "🎼" },
    { id: 26, name: "Swift Wireless Charger", category: "Accessories", price: 45, icon: "⚡" },
    { id: 27, name: "Frame Photo Printer", category: "Photography", price: 189, icon: "🖨️" },
    { id: 28, name: "Move GPS Watch", category: "Wearables", price: 259, icon: "🧭" },
    { id: 29, name: "Mellow Vinyl Player", category: "Audio", price: 329, icon: "💿" },
    { id: 30, name: "Airflow Cooling Pad", category: "Accessories", price: 69, icon: "❄️" },
    { id: 31, name: "Snap Flash Kit", category: "Photography", price: 139, icon: "📸" },
    { id: 32, name: "Vital Smart Patch", category: "Wearables", price: 79, icon: "🩹" },
    { id: 33, name: "Clear Conference Speaker", category: "Audio", price: 179, icon: "📞" },
    { id: 34, name: "Link Bluetooth Adapter", category: "Accessories", price: 29, icon: "📡" },
    { id: 35, name: "Focus Prime Lens", category: "Photography", price: 449, icon: "🔍" },
    { id: 36, name: "Rise Activity Tracker", category: "Wearables", price: 99, icon: "📈" },
    { id: 37, name: "Studio Monitor Pair", category: "Audio", price: 389, icon: "🎚️" },
    { id: 38, name: "Ergo Vertical Mouse", category: "Accessories", price: 64, icon: "🖱️" },
    { id: 39, name: "Panorama Drone", category: "Photography", price: 499, icon: "🚁" },
    { id: 40, name: "Active Recovery Band", category: "Wearables", price: 129, icon: "💪" }
];

const categories = [
    "All",
    ...new Set(productCatalog.map((product) => product.category))
];

const initialFilters = {
    category: "All",
    minPrice: 0,
    maxPrice: 500
};

const createProductBatch = (page) =>
    productCatalog.map((product, index) => ({
        ...product,
        id: product.id + page * 10000,
        name: page === 0
            ? product.name
            : `${product.name} - Collection ${page + 1}`,
        price: Math.min(
            500,
            product.price + ((page * 17 + index * 3) % 35)
        )
    }));

const filtersSlice = createSlice({
    name: "filters",
    initialState: initialFilters,
    reducers: {
        setCategory: (state, action) => {
            state.category = categories.includes(action.payload)
                ? action.payload
                : "All";
        },

        setPriceRange: (state, action) => {
            const min = Number(action.payload.min);
            const max = Number(action.payload.max);

            const safeMin = Number.isFinite(min)
                ? Math.max(0, Math.min(500, min))
                : 0;

            const safeMax = Number.isFinite(max)
                ? Math.max(0, Math.min(500, max))
                : 500;

            state.minPrice = Math.min(safeMin, safeMax);
            state.maxPrice = Math.max(safeMin, safeMax);
        },

        resetFilters: () => initialFilters
    }
});

const cartSlice = createSlice({
    name: "cart",
    initialState: [],
    reducers: {
        addToCart: (state, action) => {
            state.push(action.payload);
        },

        removeFromCart: (state, action) =>
            state.filter((product) => product.id !== action.payload),

        clearCart: () => []
    }
});

const themeSlice = createSlice({
    name: "theme",
    initialState: "light",
    reducers: {
        toggleTheme: (state) =>
            state === "light" ? "dark" : "light"
    }
});

const store = configureStore({
    reducer: {
        filters: filtersSlice.reducer,
        cart: cartSlice.reducer,
        theme: themeSlice.reducer
    }
});

const {
    setCategory,
    setPriceRange,
    resetFilters
} = filtersSlice.actions;

const {
    addToCart,
    removeFromCart,
    clearCart
} = cartSlice.actions;

const { toggleTheme } = themeSlice.actions;

function Sidebar() {
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.filters);

    const updateCategory = useCallback(
        (event) => dispatch(setCategory(event.target.value)),
        [dispatch]
    );

    const updateMinPrice = useCallback(
        (event) =>
            dispatch(
                setPriceRange({
                    min: event.target.value,
                    max: filters.maxPrice
                })
            ),
        [dispatch, filters.maxPrice]
    );

    const updateMaxPrice = useCallback(
        (event) =>
            dispatch(
                setPriceRange({
                    min: filters.minPrice,
                    max: event.target.value
                })
            ),
        [dispatch, filters.minPrice]
    );

    const reset = useCallback(
        () => dispatch(resetFilters()),
        [dispatch]
    );

    return (
        <aside className="sidebar" aria-label="Product filters">
            <h2>Filter Products</h2>

            <div className="filter-group">
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    value={filters.category}
                    onChange={updateCategory}
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <fieldset className="filter-group">
                <legend>Price Range</legend>

                <div className="price-inputs">
                    <input
                        type="number"
                        min="0"
                        max="500"
                        value={filters.minPrice}
                        onChange={updateMinPrice}
                        aria-label="Minimum price"
                    />

                    <input
                        type="number"
                        min="0"
                        max="500"
                        value={filters.maxPrice}
                        onChange={updateMaxPrice}
                        aria-label="Maximum price"
                    />
                </div>
            </fieldset>

            <button
                className="reset-button"
                type="button"
                onClick={reset}
            >
                Reset Filters
            </button>
        </aside>
    );
}

const ProductCard = memo(function ProductCard({ product, onAdd }) {
    const addProduct = useCallback(
        () => onAdd(product),
        [onAdd, product]
    );

    return (
        <article className="product-card">
            <div className="product-image" aria-hidden="true">
                {product.icon}
            </div>

            <div className="product-details">
                <h3>{product.name}</h3>
                <p>{product.category}</p>

                <div className="product-footer">
                    <span className="price">${product.price}</span>

                    <button
                        className="add-button"
                        type="button"
                        onClick={addProduct}
                    >
                        Add to cart
                    </button>
                </div>
            </div>
        </article>
    );
});

function CartSummary() {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    const removeProduct = useCallback(
        (id) => dispatch(removeFromCart(id)),
        [dispatch]
    );

    const clear = useCallback(
        () => dispatch(clearCart()),
        [dispatch]
    );

    if (!cart.length) {
        return null;
    }

    return (
        <div
            style={{
                position: "fixed",
                right: "1rem",
                bottom: "1rem",
                zIndex: 10,
                maxWidth: "280px",
                padding: "1rem",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "1rem",
                boxShadow: "0 10px 30px rgba(0,0,0,.15)"
            }}
        >
            <strong>Cart Items: {cart.length}</strong>

            <ul>
                {cart.slice(-3).map((product) => (
                    <li key={`${product.id}-${cart.indexOf(product)}`}>
                        {product.name}
                        <button
                            type="button"
                            onClick={() => removeProduct(product.id)}
                            aria-label={`Remove ${product.name}`}
                        >
                            ×
                        </button>
                    </li>
                ))}
            </ul>

            <button
                className="reset-button"
                type="button"
                onClick={clear}
            >
                Clear Cart
            </button>
        </div>
    );
}

function App() {
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.filters);
    const cartCount = useSelector((state) => state.cart.length);
    const theme = useSelector((state) => state.theme);

    const [products, setProducts] = useState(() => createProductBatch(0));
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const loadMoreRef = useRef(null);
    const loadingRef = useRef(false);

    const loadMoreProducts = useCallback(() => {
        if (loadingRef.current) {
            return;
        }

        loadingRef.current = true;
        setIsLoading(true);

        window.setTimeout(() => {
            setPage((currentPage) => {
                const nextPage = currentPage + 1;

                setProducts((currentProducts) => [
                    ...currentProducts,
                    ...createProductBatch(nextPage)
                ]);

                return nextPage;
            });

            loadingRef.current = false;
            setIsLoading(false);
        }, 350);
    }, []);

    useEffect(() => {
        const target = loadMoreRef.current;

        if (!target || !("IntersectionObserver" in window)) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    loadMoreProducts();
                }
            },
            { rootMargin: "500px" }
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [loadMoreProducts]);

    const filteredProducts = useMemo(() => {
        const { category, minPrice, maxPrice } = filters;

        return products.filter((product) => {
            const matchesCategory =
                category === "All" ||
                product.category === category;

            const matchesPrice =
                product.price >= minPrice &&
                product.price <= maxPrice;

            return matchesCategory && matchesPrice;
        });
    }, [products, filters]);

    const handleAddToCart = useCallback(
        (product) => dispatch(addToCart(product)),
        [dispatch]
    );

    const toggleAppTheme = useCallback(
        () => dispatch(toggleTheme()),
        [dispatch]
    );

    return (
        <div className={`app ${theme}`}>
            <header className="header">
                <div className="logo">ReduxStore</div>

                <div className="header-actions">
                    <button
                        className="theme-button"
                        type="button"
                        onClick={toggleAppTheme}
                        aria-label="Toggle application theme"
                    >
                        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                    </button>

                    <button
                        className="cart-button"
                        type="button"
                        aria-label={`Shopping cart with ${cartCount} items`}
                    >
                        🛒 Cart ({cartCount})
                    </button>
                </div>
            </header>

            <section className="hero">
                <h1>Discover products built for better living.</h1>
                <p>
                    Explore our curated collection using globally managed,
                    instantly responsive filters.
                </p>
            </section>

            <main className="content">
                <Sidebar />

                <section>
                    <div className="results-header">
                        <h2>Featured products</h2>
                        <span>
                            {filteredProducts.length} results loaded
                        </span>
                    </div>

                    {filteredProducts.length ? (
                        <div className="product-grid">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAdd={handleAddToCart}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            No products match the selected filters.
                        </div>
                    )}

                    <div
                        ref={loadMoreRef}
                        className="load-more"
                        aria-live="polite"
                    >
                        {isLoading ? (
                            <>
                                <span
                                    className="loader"
                                    aria-hidden="true"
                                ></span>
                                Loading more unique products...
                            </>
                        ) : (
                            <button
                                className="reset-button"
                                type="button"
                                onClick={loadMoreProducts}
                            >
                                Load More
                            </button>
                        )}
                    </div>
                </section>
            </main>

            <CartSummary />
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <App />
    </Provider>
);