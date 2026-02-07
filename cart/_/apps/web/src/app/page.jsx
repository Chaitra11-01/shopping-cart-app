import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Plus,
  Minus,
  Trash2,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "@/utils/useUser";

export default function ShoppingCartApp() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { data: user, loading: userLoading } = useUser();

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  // Fetch cart items
  const { data: cartItems = [], isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Failed to fetch cart");
      return response.json();
    },
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (itemId) => {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity: 1 }),
      });
      if (!response.ok) throw new Error("Failed to add to cart");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });

  // Update cart quantity mutation
  const updateCartMutation = useMutation({
    mutationFn: async ({ cartItemId, quantity }) => {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity }),
      });
      if (!response.ok) throw new Error("Failed to update cart");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (cartItemId) => {
      const response = await fetch(`/api/cart?cartItemId=${cartItemId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove from cart");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });

  // Calculate cart total
  const cartTotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price);
    const finalPrice = item.on_sale
      ? price * (1 - item.sale_percent / 100)
      : price;
    return sum + finalPrice * item.quantity;
  }, 0);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Filter products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] font-inter">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800">
        <div className="h-20 flex items-center justify-between px-6 md:px-12 max-w-[1280px] mx-auto">
          {/* Logo and Navigation Links */}
          <div className="flex items-center space-x-10">
            {/* Brand Logo */}
            <div className="w-7 h-7 bg-black dark:bg-white rounded-full flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white dark:text-black" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              <a
                href="#"
                className="text-black text-opacity-80 hover:text-opacity-100 dark:text-white dark:text-opacity-70 dark:hover:text-opacity-87 text-sm font-normal transition-opacity"
              >
                Shop
              </a>
              <a
                href="#"
                className="text-black text-opacity-80 hover:text-opacity-100 dark:text-white dark:text-opacity-70 dark:hover:text-opacity-87 text-sm font-normal transition-opacity"
              >
                About
              </a>
              <a
                href="#"
                className="text-black text-opacity-80 hover:text-opacity-100 dark:text-white dark:text-opacity-70 dark:hover:text-opacity-87 text-sm font-normal transition-opacity"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Cart Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* User Account Button */}
            {!userLoading && (
              <a
                href={user ? "/account/logout" : "/account/signin"}
                className="hidden md:flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-[10px] text-sm font-semibold text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-200"
              >
                <User className="w-4 h-4" />
                <span>{user ? user.email?.split("@")[0] : "Sign In"}</span>
              </a>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-[10px] text-sm font-semibold text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-200 flex items-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black dark:bg-white text-white dark:text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10 rounded transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-black dark:text-white" />
              ) : (
                <Menu className="w-5 h-5 text-black dark:text-white" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 md:hidden">
              <div className="px-6 py-4 space-y-4">
                <a
                  href="#"
                  className="block text-black text-opacity-80 dark:text-white dark:text-opacity-70 text-sm font-normal"
                >
                  Shop
                </a>
                <a
                  href="#"
                  className="block text-black text-opacity-80 dark:text-white dark:text-opacity-70 text-sm font-normal"
                >
                  About
                </a>
                <a
                  href="#"
                  className="block text-black text-opacity-80 dark:text-white dark:text-opacity-70 text-sm font-normal"
                >
                  Contact
                </a>
                {!userLoading && (
                  <a
                    href={user ? "/account/logout" : "/account/signin"}
                    className="block text-black text-opacity-80 dark:text-white dark:text-opacity-70 text-sm font-normal"
                  >
                    {user
                      ? `${user.email?.split("@")[0]} (Sign Out)`
                      : "Sign In"}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black dark:text-white leading-tight mb-4">
            Shop with pleasure.
          </h1>
          <p className="text-lg text-black text-opacity-80 dark:text-white dark:text-opacity-70 mb-8">
            Discover our curated collection of premium products.
          </p>

          {/* Search Bar */}
          <div className="max-w-md">
            <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <Search className="w-5 h-5 text-gray-500 dark:text-gray-400 ml-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 bg-transparent text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const price = parseFloat(product.price);
              const finalPrice = product.on_sale
                ? price * (1 - product.sale_percent / 100)
                : price;

              return (
                <div
                  key={product.id}
                  className="border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                      </div>
                    )}
                    {product.on_sale && (
                      <div className="absolute top-3 right-3 bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-xs font-bold">
                        -{product.sale_percent}%
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-black dark:text-white mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-black text-opacity-60 dark:text-white dark:text-opacity-60 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-3 text-xs text-black text-opacity-60 dark:text-white dark:text-opacity-60">
                      <span>★ {product.rating}/5</span>
                      <span className="mx-2">•</span>
                      <span>{product.reviews} reviews</span>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between">
                      <div>
                        {product.on_sale ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-black dark:text-white">
                              ${finalPrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-black dark:text-white">
                            ${price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => addToCartMutation.mutate(product.id)}
                        disabled={addToCartMutation.isPending}
                        className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 active:bg-gray-700 dark:active:bg-gray-300 transition-colors duration-200 disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredProducts.length === 0 && !productsLoading && (
          <div className="text-center py-12">
            <p className="text-black text-opacity-60 dark:text-white dark:text-opacity-60">
              No products found matching your search.
            </p>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsCartOpen(false)}
          ></div>

          {/* Drawer */}
          <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-white dark:bg-[#121212] z-50 shadow-2xl overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  Shopping Cart
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-black dark:text-white" />
                </button>
              </div>

              {/* Cart Items */}
              {cartLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white rounded-full animate-spin"></div>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-black text-opacity-60 dark:text-white dark:text-opacity-60 mb-4">
                    Your cart is empty
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => {
                      const price = parseFloat(item.price);
                      const finalPrice = item.on_sale
                        ? price * (1 - item.sale_percent / 100)
                        : price;

                      return (
                        <div
                          key={item.cart_item_id}
                          className="flex space-x-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4"
                        >
                          {/* Image */}
                          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded flex-shrink-0">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingCart className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-black dark:text-white mb-1 truncate">
                              {item.name}
                            </h3>
                            <p className="text-sm font-bold text-black dark:text-white mb-2">
                              ${finalPrice.toFixed(2)}
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    updateCartMutation.mutate({
                                      cartItemId: item.cart_item_id,
                                      quantity: item.quantity - 1,
                                    });
                                  }
                                }}
                                disabled={
                                  item.quantity <= 1 ||
                                  updateCartMutation.isPending
                                }
                                className="w-7 h-7 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                              >
                                <Minus className="w-3 h-3 text-black dark:text-white" />
                              </button>
                              <span className="text-sm font-semibold text-black dark:text-white w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => {
                                  updateCartMutation.mutate({
                                    cartItemId: item.cart_item_id,
                                    quantity: item.quantity + 1,
                                  });
                                }}
                                disabled={updateCartMutation.isPending}
                                className="w-7 h-7 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                              >
                                <Plus className="w-3 h-3 text-black dark:text-white" />
                              </button>
                              <button
                                onClick={() =>
                                  removeFromCartMutation.mutate(
                                    item.cart_item_id,
                                  )
                                }
                                disabled={removeFromCartMutation.isPending}
                                className="ml-2 w-7 h-7 flex items-center justify-center border-2 border-red-300 dark:border-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900 transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total and Checkout */}
                  <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-lg font-semibold text-black dark:text-white">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-black dark:text-white">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <button className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 active:bg-gray-700 dark:active:bg-gray-300 transition-colors duration-200">
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
