import { useEffect, useMemo, useState } from "react"

function App() {
  // =====================================================
  // CHEN PRODUCT DATABASE
  // =====================================================

  const products = [
    {
      id: 1,
      name: "The CHEN Signature Hat",
      category: "Hats",
      priceKES: 1500,
      image: "/images/hat-main.jpg",
      giftEligible: true,
      featured: true,
      description:
        "A timeless CHEN statement piece created for those who appreciate elegance, confidence, and distinctive Kenyan style.",
    },

    {
      id: 2,
      name: "The CHEN Woven Bag",
      category: "Woven Bags",
      priceKES: 2500,
      image: "/images/woven-bag.jpeg",
      giftEligible: false,
      featured: true,
      isSlider: true,
      imageSlides: [
        "/images/hat-main.jpg",
        "/images/woven-bag.jpeg",
        "/images/woven-bag.jpg",
      ],
      description:
        "A beautifully crafted woven bag inspired by Kenyan artistry, culture, and timeless everyday elegance.",
    },

    {
      id: 3,
      name: "CHEN Signature Sunglasses",
      category: "Sunglasses",
      priceKES: 1000,
      image: "/images/sunglasses.jpg",
      giftEligible: false,
      featured: true,
      isSlider: true,
      imageSlides: [
        "/images/placeholder.jpg",
        "/images/sunglasses.jpg",
        "/images/premium-shades.jpg",
      ],
      description:
        "Signature CHEN eyewear designed to complete your look with a confident and distinctive finish.",
    },
  ]

  // =====================================================
  // CHEN BUNDLE
  // 1 HAT + 1 WOVEN BAG = KSh 2,500
  // + 1 FREE SUNGLASSES
  // =====================================================

  const bundle = {
    id: "chen-bundle",
    name: "CHEN Signature Bundle",
    category: "Bundles",
    priceKES: 2500,
    image: "/images/hat-main.jpg",
    giftEligible: true,
    featured: true,
    description:
      "One CHEN Signature Hat + One CHEN Woven Bag for KSh 2,500, plus one complimentary pair of CHEN sunglasses.",
  }

  // =====================================================
  // HERO IMAGE
  // =====================================================

  const heroImage = "/images/woven-bag.jpeg"

  // =====================================================
  // FREE GIFT PRODUCT
  // =====================================================

  const freeGift = products.find(
    (product) => product.name === "CHEN Signature Sunglasses"
  )

  // =====================================================
  // CURRENCY SYSTEM
  // =====================================================

  const exchangeRates = {
    KES: 1,
    USD: 0.0077,
    GBP: 0.0057,
    EUR: 0.0066,
    AUD: 0.0118,
  }

  const currencySymbols = {
    KES: "KSh",
    USD: "$",
    GBP: "£",
    EUR: "€",
    AUD: "A$",
  }

  // =====================================================
  // STATE
  // =====================================================

  const [currency, setCurrency] = useState("KES")
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  // =====================================================
  // IMAGE SLIDER STATE
  // =====================================================

  const [sliderIndexes, setSliderIndexes] = useState({})

  // =====================================================
  // AUTO SLIDE
  // =====================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndexes((currentIndexes) => {
        const updatedIndexes = { ...currentIndexes }

        products.forEach((product) => {
          if (product.isSlider && product.imageSlides?.length) {
            const currentIndex = currentIndexes[product.id] || 0

            updatedIndexes[product.id] =
              (currentIndex + 1) % product.imageSlides.length
          }
        })

        return updatedIndexes
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  // =====================================================
  // DYNAMIC CATEGORIES
  // =====================================================

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    []
  )

  // =====================================================
  // CREATE SECTION ID
  // =====================================================

  const createSectionId = (category) => {
    return category
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  // =====================================================
  // PRICE CONVERSION
  // =====================================================

  const convertPrice = (priceKES) => {
    const convertedPrice = priceKES * exchangeRates[currency]

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: currency === "KES" ? 0 : 2,
      maximumFractionDigits: currency === "KES" ? 0 : 2,
    }).format(convertedPrice)
  }

  // =====================================================
  // GET PRODUCT IMAGE
  // =====================================================

  const getProductImage = (product) => {
    if (!product.isSlider || !product.imageSlides?.length) {
      return product.image
    }

    const currentIndex = sliderIndexes[product.id] || 0

    return product.imageSlides[currentIndex]
  }

  // =====================================================
  // NEXT IMAGE
  // =====================================================

  const nextImage = (productId, totalImages) => {
    setSliderIndexes((currentIndexes) => ({
      ...currentIndexes,
      [productId]:
        ((currentIndexes[productId] || 0) + 1) % totalImages,
    }))
  }

  // =====================================================
  // PREVIOUS IMAGE
  // =====================================================

  const previousImage = (productId, totalImages) => {
    setSliderIndexes((currentIndexes) => ({
      ...currentIndexes,
      [productId]:
        ((currentIndexes[productId] || 0) - 1 + totalImages) %
        totalImages,
    }))
  }

  // =====================================================
  // SELECT SLIDER IMAGE
  // =====================================================

  const selectImage = (productId, index) => {
    setSliderIndexes((currentIndexes) => ({
      ...currentIndexes,
      [productId]: index,
    }))
  }

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = (selectedProduct) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === selectedProduct.id
      )

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === selectedProduct.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      }

      return [
        ...currentCart,
        {
          ...selectedProduct,
          quantity: 1,
        },
      ]
    })

    setCartOpen(true)
  }

  // =====================================================
  // REMOVE FROM CART
  // =====================================================

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    )
  }

  // =====================================================
  // INCREASE QUANTITY
  // =====================================================

  const increaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    )
  }

  // =====================================================
  // DECREASE QUANTITY
  // =====================================================

  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  // =====================================================
  // OPEN CHECKOUT
  // =====================================================

  const openCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  // =====================================================
  // CLOSE CHECKOUT
  // =====================================================

  const closeCheckout = () => {
    setCheckoutOpen(false)
  }

  // =====================================================
  // CART QUANTITY
  // =====================================================

  const cartQuantity = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  // =====================================================
  // CART TOTAL
  // =====================================================

  const cartTotalKES = cart.reduce(
    (total, item) =>
      total + item.priceKES * item.quantity,
    0
  )

  // =====================================================
  // FREE SUNGLASSES QUANTITY
  //
  // Every hat purchased = 1 free sunglasses
  // Every bundle purchased = 1 free sunglasses
  // =====================================================

  const freeSunglassesQuantity = cart.reduce(
    (total, item) => {
      if (item.id === "chen-bundle") {
        return total + item.quantity
      }

      if (item.giftEligible) {
        return total + item.quantity
      }

      return total
    },
    0
  )

  // =====================================================
  // WHATSAPP CHECKOUT
  // =====================================================

  const sendWhatsAppOrder = () => {
    const orderItems = cart
      .map(
        (item) =>
          `${item.name} x ${item.quantity} - KSh ${
            item.priceKES * item.quantity
          }`
      )
      .join("\n")

    const message = `Hello CHEN, I would like to place an order:

${orderItems}

Subtotal: KSh ${cartTotalKES}

Free Sunglasses: ${freeSunglassesQuantity}

Please assist me with my order and delivery.`

    const whatsappUrl = `https://wa.me/254798766568?text=${encodeURIComponent(
      message
    )}`

    window.open(whatsappUrl, "_blank")
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#2c211b]">

      {/* =====================================================
          TOP ANNOUNCEMENT
      ===================================================== */}

      <div className="bg-[#2c211b] text-white text-center py-4 px-4 text-sm md:text-base tracking-[0.18em] uppercase">

        🇰🇪 Proudly Kenyan

        <span className="mx-2 opacity-50">•</span>

        1 Hat + 1 Woven Bag = KSh 2,500 + 1 Free Sunglasses

        <span className="mx-2 opacity-50">•</span>

        Shipping Worldwide 🌍

      </div>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="sticky top-0 z-40 bg-[#f8f5f0]/95 backdrop-blur-md border-b border-[#2c211b]/10">

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="min-h-24 flex items-center justify-between gap-6">

            {/* LOGO */}

            <a
              href="#"
              className="flex items-center shrink-0"
            >
              <img
                src="/images/logo.png"
                alt="CHEN"
                className="h-12 md:h-16 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />

              <span className="hidden text-4xl font-serif tracking-[0.25em] font-semibold">
                CHEN
              </span>
            </a>

            {/* MENU */}

            <div className="hidden lg:flex items-center gap-10 text-base uppercase tracking-widest">

              <a
                href="#"
                className="hover:opacity-60 transition"
              >
                Home
              </a>

              <a
                href="#shop"
                className="hover:opacity-60 transition"
              >
                Shop
              </a>

              <a
                href="#collections"
                className="hover:opacity-60 transition"
              >
                Collections
              </a>

              <a
                href="#about"
                className="hover:opacity-60 transition"
              >
                Our Story
              </a>

              <a
                href="#contact"
                className="hover:opacity-60 transition"
              >
                Contact
              </a>

            </div>

            {/* CART */}

            <button
              onClick={() => setCartOpen(true)}
              className="relative text-sm md:text-base uppercase tracking-widest flex items-center"
            >
              Cart

              <span className="ml-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2c211b] text-white text-sm">
                {cartQuantity}
              </span>
            </button>

          </div>

        </div>

      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="min-h-[calc(100vh-120px)] flex items-center">

        <div className="max-w-7xl mx-auto w-full px-6 lg:px-10 py-20">

          <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">

            {/* TEXT */}

            <div className="order-2 lg:order-1">

              <p className="uppercase tracking-[0.4em] text-sm md:text-base mb-7 opacity-60">
                Kenyan Craft • Global Style
              </p>

              <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl leading-[0.88] font-medium">

                Born in

                <br />

                <span className="italic">
                  Kenya.
                </span>

                <br />

                Made for

                <br />

                <span className="italic">
                  the World.
                </span>

              </h1>

              <p className="mt-10 max-w-lg text-xl leading-relaxed opacity-70">

                Welcome to CHEN — a Kenyan fashion and
                lifestyle brand bringing timeless style,
                beautiful craftsmanship, and African
                creativity from Kenya to the world.

              </p>

              {/* PROMOTION */}

              <div className="mt-10 border border-[#2c211b]/20 bg-white p-7 max-w-xl">

                <p className="text-sm uppercase tracking-[0.25em] opacity-60">
                  CHEN Signature Bundle
                </p>

                <p className="mt-3 font-serif text-3xl md:text-4xl">
                  1 Hat + 1 Woven Bag
                </p>

                <p className="mt-2 text-xl font-medium">
                  KSh 2,500 + 1 Free Sunglasses
                </p>

                <p className="mt-3 text-base opacity-60">
                  Get the CHEN Signature Hat and Woven Bag
                  together for KSh 2,500 and receive a
                  complimentary pair of CHEN sunglasses.
                </p>

              </div>

              <div className="mt-10 flex flex-wrap gap-4">

                <a
                  href="#shop"
                  className="inline-block bg-[#2c211b] text-white px-10 py-5 uppercase tracking-widest text-base hover:bg-[#4a372c] transition"
                >
                  Shop CHEN
                </a>

                <a
                  href="#about"
                  className="inline-block border border-[#2c211b] px-10 py-5 uppercase tracking-widest text-base hover:bg-[#2c211b] hover:text-white transition"
                >
                  Our Story
                </a>

              </div>

              <div className="mt-14 flex items-center gap-4">

                <div className="h-px w-14 bg-[#2c211b]/30"></div>

                <p className="text-sm uppercase tracking-[0.25em] opacity-50">
                  Designed in Kenya
                </p>

              </div>

            </div>

            {/* HERO IMAGE */}

            <div className="order-1 lg:order-2">

              <div className="relative aspect-[4/5] overflow-hidden bg-[#f1ece5]">

                <img
                  src={heroImage}
                  alt="CHEN Kenyan Fashion"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/images/placeholder.jpg"
                  }}
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          BUNDLE SECTION
      ===================================================== */}

      <section className="py-24 bg-[#2c211b] text-white">

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>

              <p className="text-sm uppercase tracking-[0.3em] opacity-60">
                CHEN Exclusive Offer
              </p>

              <h2 className="font-serif text-5xl md:text-7xl mt-6 leading-tight">
                The CHEN
                <br />
                Signature Bundle.
              </h2>

              <p className="mt-8 text-lg md:text-xl leading-relaxed opacity-70 max-w-xl">

                One Signature Hat.
                One Woven Bag.
                One complimentary pair of sunglasses.

              </p>

              <p className="mt-6 text-3xl md:text-4xl font-serif">
                KSh 2,500
              </p>

              <p className="mt-3 text-base opacity-60">
                1 Hat + 1 Woven Bag + 1 Free Sunglasses
              </p>

              <button
                onClick={() => addToCart(bundle)}
                className="mt-10 bg-white text-[#2c211b] px-10 py-5 uppercase tracking-widest text-sm hover:bg-[#f1ece5] transition"
              >
                Add Bundle to Cart
              </button>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="aspect-[4/5] overflow-hidden bg-[#f1ece5]">

                <img
                  src="/images/hat-main.jpg"
                  alt="CHEN Signature Hat"
                  className="w-full h-full object-cover"
                />

              </div>

              <div className="aspect-[4/5] overflow-hidden bg-[#f1ece5] mt-12">

                <img
                  src="/images/woven-bag.jpeg"
                  alt="CHEN Woven Bag"
                  className="w-full h-full object-cover"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          DYNAMIC COLLECTION NAVIGATION
      ===================================================== */}

      <section
        id="collections"
        className="py-20 bg-[#2c211b] text-white border-t border-white/10"
      >

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {categories.map((category, index) => (

              <a
                key={category}
                href={`#${createSectionId(category)}`}
                className="border border-white/20 p-10 hover:bg-white hover:text-[#2c211b] transition"
              >

                <p className="text-sm uppercase tracking-[0.3em] opacity-60">
                  Collection {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="font-serif text-4xl md:text-5xl mt-5">
                  {category}
                </h3>

              </a>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          SHOP
      ===================================================== */}

      <section
        id="shop"
        className="py-28 bg-white"
      >

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* SHOP INTRO */}

          <div className="text-center max-w-3xl mx-auto mb-24">

            <p className="uppercase tracking-[0.3em] text-sm opacity-60 mb-6">
              The CHEN Collection
            </p>

            <h2 className="font-serif text-6xl md:text-7xl">
              Kenyan Style.
              <br />
              Global Presence.
            </h2>

            <p className="mt-8 text-lg md:text-xl leading-relaxed opacity-60">

              Discover CHEN hats, woven bags,
              sunglasses, and exclusive bundles —
              crafted with Kenyan creativity and
              designed for the world.

            </p>

          </div>

          {/* DYNAMIC PRODUCT COLLECTION */}

          {categories.map((category) => {

            const categoryProducts = products.filter(
              (product) =>
                product.category === category
            )

            return (

              <div
                key={category}
                id={createSectionId(category)}
                className="mb-36"
              >

                {/* CATEGORY TITLE */}

                <div className="mb-20 text-center">

                  <p className="uppercase tracking-[0.3em] text-sm opacity-50 mb-5">
                    CHEN Collection
                  </p>

                  <h2 className="font-serif text-6xl md:text-7xl">
                    {category}
                  </h2>

                  <div className="mt-8 mx-auto h-px w-20 bg-[#2c211b]/30"></div>

                </div>

                {/* PRODUCTS */}

                <div className="space-y-36">

                  {categoryProducts.map(
                    (product, productIndex) => {

                      const currentImageIndex =
                        sliderIndexes[product.id] || 0

                      return (

                        <div
                          key={product.id}
                          className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-14 lg:gap-24 items-center ${
                            productIndex % 2 !== 0
                              ? "md:[&>*:first-child]:order-2"
                              : ""
                          }`}
                        >

                          {/* PRODUCT IMAGE */}

                          <div className="group">

                            <div className="relative aspect-[4/5] bg-[#f1ece5] overflow-hidden">

                              <img
                                src={getProductImage(product)}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/images/placeholder.jpg"
                                }}
                              />

                              {/* FEATURED */}

                              {product.featured && (

                                <div className="absolute top-6 left-6 bg-[#2c211b] text-white px-5 py-3 text-sm uppercase tracking-widest">
                                  Featured
                                </div>

                              )}

                              {/* SLIDER CONTROLS */}

                              {product.isSlider &&
                                product.imageSlides?.length > 1 && (

                                <>

                                  <button
                                    onClick={() =>
                                      previousImage(
                                        product.id,
                                        product.imageSlides.length
                                      )
                                    }
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 text-[#2c211b] text-2xl hover:bg-white transition"
                                    aria-label="Previous image"
                                  >
                                    ‹
                                  </button>

                                  <button
                                    onClick={() =>
                                      nextImage(
                                        product.id,
                                        product.imageSlides.length
                                      )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 text-[#2c211b] text-2xl hover:bg-white transition"
                                    aria-label="Next image"
                                  >
                                    ›
                                  </button>

                                  {/* SLIDER DOTS */}

                                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">

                                    {product.imageSlides.map(
                                      (_, index) => (

                                        <button
                                          key={index}
                                          onClick={() =>
                                            selectImage(
                                              product.id,
                                              index
                                            )
                                          }
                                          className={`w-3 h-3 rounded-full border border-white transition ${
                                            currentImageIndex === index
                                              ? "bg-white"
                                              : "bg-white/40"
                                          }`}
                                          aria-label={`View image ${
                                            index + 1
                                          }`}
                                        />

                                      )
                                    )}

                                  </div>

                                </>

                              )}

                            </div>

                            {/* SLIDER THUMBNAILS */}

                            {product.isSlider &&
                              product.imageSlides?.length > 1 && (

                              <div className="mt-5 flex gap-3 overflow-x-auto">

                                {product.imageSlides.map(
                                  (image, index) => (

                                    <button
                                      key={image}
                                      onClick={() =>
                                        selectImage(
                                          product.id,
                                          index
                                        )
                                      }
                                      className={`w-20 h-24 shrink-0 overflow-hidden border-2 transition ${
                                        currentImageIndex === index
                                          ? "border-[#2c211b]"
                                          : "border-transparent"
                                      }`}
                                    >

                                      <img
                                        src={image}
                                        alt={`${product.name} view ${
                                          index + 1
                                        }`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.src =
                                            "/images/placeholder.jpg"
                                        }}
                                      />

                                    </button>

                                  )
                                )}

                              </div>

                            )}

                          </div>

                          {/* PRODUCT INFO */}

                          <div>

                            <p className="uppercase tracking-[0.3em] text-sm opacity-50 mb-5">
                              {product.category}
                            </p>

                            <h3 className="font-serif text-5xl md:text-6xl lg:text-7xl">
                              {product.name}
                            </h3>

                            <p className="mt-8 text-lg leading-relaxed opacity-65">
                              {product.description}
                            </p>

                            {/* PRICE */}

                            <p className="mt-10 text-4xl font-medium">

                              {currencySymbols[currency]}{" "}
                              {convertPrice(product.priceKES)}

                            </p>

                            {currency !== "KES" && (

                              <p className="mt-3 text-base opacity-50">
                                Base price: KSh{" "}
                                {product.priceKES}
                              </p>

                            )}

                            {/* FREE GIFT */}

                            {product.giftEligible && (

                              <div className="mt-8 bg-[#f8f5f0] border border-[#2c211b]/10 p-6">

                                <p className="text-base font-medium">
                                  🎁 FREE GIFT INCLUDED
                                </p>

                                <p className="mt-3 text-base opacity-60">

                                  Every CHEN Signature Hat
                                  purchase comes with a
                                  complimentary pair of CHEN
                                  sunglasses.

                                </p>

                              </div>

                            )}

                            {/* ADD TO CART */}

                            <button
                              onClick={() =>
                                addToCart(product)
                              }
                              className="mt-10 w-full bg-[#2c211b] text-white py-6 uppercase tracking-[0.2em] text-base hover:bg-[#4a372c] transition"
                            >
                              Add to Cart
                            </button>

                          </div>

                        </div>

                      )
                    }
                  )}

                </div>

              </div>

            )
          })}

          {/* =================================================
              CURRENCY SELECTOR
          ================================================== */}

          <div className="mt-28 text-center">

            <p className="text-sm uppercase tracking-[0.3em] opacity-60 mb-6">
              Select Your Currency
            </p>

            <div className="flex flex-wrap justify-center gap-3">

              {Object.keys(exchangeRates).map(
                (currencyCode) => (

                  <button
                    key={currencyCode}
                    onClick={() =>
                      setCurrency(currencyCode)
                    }
                    className={`px-7 py-4 text-sm uppercase tracking-widest border transition ${
                      currency === currencyCode
                        ? "bg-[#2c211b] text-white border-[#2c211b]"
                        : "border-[#2c211b]/30 hover:border-[#2c211b]"
                    }`}
                  >
                    {currencyCode}
                  </button>

                )
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section
        id="about"
        className="py-32 bg-[#2c211b] text-white"
      >

        <div className="max-w-4xl mx-auto px-6 text-center">

          <p className="uppercase tracking-[0.3em] text-sm opacity-60 mb-7">
            The CHEN Story
          </p>

          <h2 className="font-serif text-6xl md:text-8xl leading-tight">

            From Kenya,

            <br />

            <span className="italic">
              To the World.
            </span>

          </h2>

          <p className="mt-10 text-lg md:text-xl leading-relaxed opacity-70 max-w-2xl mx-auto">

            CHEN is a Kenyan fashion and lifestyle brand
            built on the belief that great style knows no
            borders. We celebrate creativity, craftsmanship,
            and the unique spirit of Kenya while creating
            pieces that belong everywhere.

          </p>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        id="contact"
        className="bg-[#f8f5f0] py-20 border-t border-[#2c211b]/10"
      >

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="grid md:grid-cols-3 gap-14">

            {/* BRAND */}

            <div>

              <img
                src="/images/logo.png"
                alt="CHEN"
                className="h-14 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />

              <p className="mt-6 text-base opacity-60 max-w-xs leading-relaxed">

                A Kenyan fashion and lifestyle brand taking
                timeless style from Kenya to the world.

              </p>

            </div>

            {/* EXPLORE */}

            <div>

              <h4 className="uppercase tracking-widest text-sm mb-6">
                Explore
              </h4>

              <div className="space-y-4 text-base opacity-70">

                <p>
                  <a href="#shop">
                    Shop CHEN
                  </a>
                </p>

                {categories.map((category) => (

                  <p key={category}>

                    <a
                      href={`#${createSectionId(category)}`}
                    >
                      {category}
                    </a>

                  </p>

                ))}

                <p>
                  <a href="#about">
                    Our Story
                  </a>
                </p>

              </div>

            </div>

            {/* CONNECT */}

            <div>

              <h4 className="uppercase tracking-widest text-sm mb-6">
                Connect With CHEN
              </h4>

              <div className="space-y-5 text-base opacity-70">

                <p>
                  <a
                    href="https://wa.me/254798766568"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:opacity-60 transition"
                  >
                    WhatsApp: 0798766568
                  </a>
                </p>

                <p>
                  <a
                    href="mailto:chenmaashir@gmail.com"
                    className="hover:opacity-60 transition"
                  >
                    Email: chenmaashir@gmail.com
                  </a>
                </p>

                <p>
                  Instagram
                </p>

              </div>

            </div>

          </div>

          <div className="mt-20 pt-8 border-t border-[#2c211b]/10 text-sm opacity-50">

            © 2026 CHEN. All Rights Reserved.

          </div>

        </div>

      </footer>

      {/* =====================================================
          FLOATING WHATSAPP BUTTON
      ===================================================== */}

      <a
        href="https://wa.me/254798766568"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-30 bg-[#25D366] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition"
        aria-label="Chat with CHEN on WhatsApp"
      >
        <span className="text-2xl font-bold">
          WA
        </span>
      </a>

      {/* =====================================================
          CART DRAWER
      ===================================================== */}

      {cartOpen && (

        <div className="fixed inset-0 z-50">

          {/* BACKDROP */}

          <div
            onClick={() =>
              setCartOpen(false)
            }
            className="absolute inset-0 bg-black/50"
          ></div>

          {/* CART DRAWER */}

          <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-[#f8f5f0] shadow-2xl flex flex-col">

            {/* HEADER */}

            <div className="flex items-center justify-between px-7 py-7 border-b border-[#2c211b]/10">

              <h2 className="font-serif text-4xl">
                Your Cart
              </h2>

              <button
                onClick={() =>
                  setCartOpen(false)
                }
                className="text-3xl"
              >
                ×
              </button>

            </div>

            {/* CONTENT */}

            <div className="flex-1 overflow-y-auto px-7 py-9">

              {cart.length === 0 ? (

                <div className="text-center py-24">

                  <p className="font-serif text-4xl">
                    Your cart is empty.
                  </p>

                  <p className="mt-5 text-base opacity-60">
                    Discover something beautiful from CHEN.
                  </p>

                </div>

              ) : (

                <div className="space-y-10">

                  {cart.map((item) => (

                    <div
                      key={item.id}
                      className="flex gap-5"
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-28 h-32 object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/images/placeholder.jpg"
                        }}
                      />

                      <div className="flex-1">

                        <h3 className="font-serif text-2xl">
                          {item.name}
                        </h3>

                        <p className="mt-3 text-base">
                          {currencySymbols[currency]}{" "}
                          {convertPrice(item.priceKES)}
                        </p>

                        {/* QUANTITY */}

                        <div className="mt-5 flex items-center gap-5">

                          <button
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                            className="w-9 h-9 border border-[#2c211b]/30"
                          >
                            −
                          </button>

                          <span className="text-base">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                            className="w-9 h-9 border border-[#2c211b]/30"
                          >
                            +
                          </button>

                        </div>

                        {/* REMOVE */}

                        <button
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                          className="mt-5 text-sm uppercase tracking-widest opacity-50 hover:opacity-100"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  ))}

                  {/* FREE GIFT */}

                  {freeSunglassesQuantity > 0 &&
                    freeGift && (

                    <div className="border border-[#2c211b]/20 bg-white p-6">

                      <p className="text-sm uppercase tracking-widest opacity-60">
                        🎁 Complimentary Gift
                      </p>

                      <div className="flex gap-5 mt-5">

                        <img
                          src={freeGift.image}
                          alt={freeGift.name}
                          className="w-24 h-28 object-cover"
                        />

                        <div>

                          <h3 className="font-serif text-xl">
                            {freeGift.name}
                          </h3>

                          <p className="mt-3 text-base">
                            Quantity:{" "}
                            {freeSunglassesQuantity}
                          </p>

                          <p className="mt-3 text-base font-medium">
                            FREE
                          </p>

                        </div>

                      </div>

                      <p className="mt-5 text-sm opacity-50">

                        One complimentary pair included
                        with each qualifying hat or
                        bundle purchase.

                      </p>

                    </div>

                  )}

                </div>

              )}

            </div>

            {/* CART FOOTER */}

            {cart.length > 0 && (

              <div className="border-t border-[#2c211b]/10 px-7 py-7">

                <div className="flex justify-between items-center mb-7">

                  <span className="uppercase tracking-widest text-sm">
                    Subtotal
                  </span>

                  <span className="font-serif text-3xl">
                    {currencySymbols[currency]}{" "}
                    {convertPrice(cartTotalKES)}
                  </span>

                </div>

                <button
                  onClick={openCheckout}
                  className="w-full bg-[#2c211b] text-white py-6 uppercase tracking-[0.2em] text-sm hover:bg-[#4a372c] transition"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={sendWhatsAppOrder}
                  className="mt-4 w-full border border-[#2c211b] py-5 uppercase tracking-[0.2em] text-sm hover:bg-[#2c211b] hover:text-white transition"
                >
                  Order via WhatsApp
                </button>

                <p className="mt-5 text-center text-sm opacity-50">

                  Free sunglasses included with qualifying
                  hat and bundle purchases.

                </p>

              </div>

            )}

          </div>

        </div>

      )}

      {/* =====================================================
          CHECKOUT
      ===================================================== */}

      {checkoutOpen && (

        <div className="fixed inset-0 z-[60] bg-[#f8f5f0] overflow-y-auto">

          {/* CHECKOUT HEADER */}

          <div className="border-b border-[#2c211b]/10">

            <div className="max-w-7xl mx-auto px-6 lg:px-10">

              <div className="h-24 flex items-center justify-between gap-6">

                <button
                  onClick={closeCheckout}
                  className="text-sm uppercase tracking-widest hover:opacity-60"
                >
                  ← Back to Cart
                </button>

                <img
                  src="/images/logo.png"
                  alt="CHEN"
                  className="h-12 w-auto object-contain"
                />

                <div className="hidden sm:block text-sm uppercase tracking-widest opacity-50">
                  Secure Checkout
                </div>

              </div>

            </div>

          </div>

          {/* CHECKOUT CONTENT */}

          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">

            <div className="grid lg:grid-cols-3 gap-14">

              {/* CHECKOUT FORM */}

              <div className="lg:col-span-2">

                <h2 className="font-serif text-5xl mb-12">
                  Checkout
                </h2>

                {/* CONTACT */}

                <div>

                  <h3 className="text-sm uppercase tracking-[0.2em] mb-7">
                    Contact Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-5">

                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full border border-[#2c211b]/20 bg-transparent px-6 py-5 text-base outline-none focus:border-[#2c211b]"
                    />

                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full border border-[#2c211b]/20 bg-transparent px-6 py-5 text-base outline-none focus:border-[#2c211b]"
                    />

                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full border border-[#2c211b]/20 bg-transparent px-6 py-5 text-base outline-none focus:border-[#2c211b]"
                    />

                  </div>

                </div>

                {/* DELIVERY */}

                <div className="mt-14">

                  <h3 className="text-sm uppercase tracking-[0.2em] mb-7">
                    Delivery Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-5">

                    <select
                      className="w-full border border-[#2c211b]/20 bg-transparent px-6 py-5 text-base outline-none"
                    >
                      <option>Kenya</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                      <option>Other Country</option>
                    </select>

                    <input
                      type="text"
                      placeholder="City"
                      className="w-full border border-[#2c211b]/20 bg-transparent px-6 py-5 text-base outline-none"
                    />

                    <input
                      type="text"
                      placeholder="Delivery Address"
                      className="md:col-span-2 w-full border border-[#2c211b]/20 bg-transparent px-6 py-5 text-base outline-none"
                    />

                    <input
                      type="text"
                      placeholder="Postal Code"
                      className="w-full border border-[#2c211b]/20 bg-transparent px-6 py-5 text-base outline-none"
                    />

                  </div>

                </div>

                {/* PAYMENT */}

                <div className="mt-14">

                  <h3 className="text-sm uppercase tracking-[0.2em] mb-7">
                    Payment Method
                  </h3>

                  <div className="space-y-5">

                    <label className="flex items-center gap-5 border border-[#2c211b]/20 p-6 cursor-pointer hover:border-[#2c211b]">

                      <input
                        type="radio"
                        name="payment"
                        defaultChecked
                      />

                      <div>

                        <p className="text-base font-medium">
                          M-Pesa
                        </p>

                        <p className="text-sm opacity-50 mt-1">
                          Available for customers in Kenya
                        </p>

                      </div>

                    </label>

                    <label className="flex items-center gap-5 border border-[#2c211b]/20 p-6 cursor-pointer hover:border-[#2c211b]">

                      <input
                        type="radio"
                        name="payment"
                      />

                      <div>

                        <p className="text-base font-medium">
                          Credit / Debit Card
                        </p>

                        <p className="text-sm opacity-50 mt-1">
                          Visa, Mastercard and other cards
                        </p>

                      </div>

                    </label>

                    <label className="flex items-center gap-5 border border-[#2c211b]/20 p-6 cursor-pointer hover:border-[#2c211b]">

                      <input
                        type="radio"
                        name="payment"
                      />

                      <div>

                        <p className="text-base font-medium">
                          PayPal
                        </p>

                        <p className="text-sm opacity-50 mt-1">
                          Pay securely with PayPal
                        </p>

                      </div>

                    </label>

                  </div>

                </div>

                {/* PLACE ORDER */}

                <button
                  onClick={sendWhatsAppOrder}
                  className="mt-12 w-full bg-[#2c211b] text-white py-6 uppercase tracking-[0.2em] text-sm hover:bg-[#4a372c] transition"
                >
                  Place Order via WhatsApp
                </button>

                <p className="mt-5 text-center text-sm opacity-50">
                  Your order will be sent to CHEN via WhatsApp
                  for confirmation and payment instructions.
                </p>

              </div>

              {/* ORDER SUMMARY */}

              <div>

                <div className="bg-white border border-[#2c211b]/10 p-8 lg:p-10 sticky top-8">

                  <h3 className="font-serif text-4xl mb-10">
                    Your Order
                  </h3>

                  <div className="space-y-7">

                    {cart.map((item) => (

                      <div
                        key={item.id}
                        className="flex gap-5"
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-28 object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/images/placeholder.jpg"
                          }}
                        />

                        <div className="flex-1">

                          <p className="font-serif text-xl">
                            {item.name}
                          </p>

                          <p className="text-sm opacity-50 mt-2">
                            Quantity: {item.quantity}
                          </p>

                          <p className="mt-3 text-base">
                            {currencySymbols[currency]}{" "}
                            {convertPrice(
                              item.priceKES *
                                item.quantity
                            )}
                          </p>

                        </div>

                      </div>

                    ))}

                    {/* FREE GIFT SUMMARY */}

                    {freeSunglassesQuantity > 0 && (

                      <div className="pt-7 border-t border-[#2c211b]/10">

                        <p className="text-sm uppercase tracking-widest opacity-60">
                          🎁 Free Gift
                        </p>

                        <div className="flex justify-between mt-4 text-base">

                          <span>
                            CHEN Sunglasses ×{" "}
                            {freeSunglassesQuantity}
                          </span>

                          <span className="font-medium">
                            FREE
                          </span>

                        </div>

                      </div>

                    )}

                  </div>

                  {/* TOTALS */}

                  <div className="mt-10 pt-7 border-t border-[#2c211b]/10 space-y-5">

                    <div className="flex justify-between text-base">

                      <span>
                        Subtotal
                      </span>

                      <span>
                        {currencySymbols[currency]}{" "}
                        {convertPrice(cartTotalKES)}
                      </span>

                    </div>

                    <div className="flex justify-between text-base">

                      <span>
                        Shipping
                      </span>

                      <span>
                        Calculated at checkout
                      </span>

                    </div>

                    <div className="flex justify-between pt-5 border-t border-[#2c211b]/10">

                      <span className="font-serif text-2xl">
                        Total
                      </span>

                      <span className="font-serif text-2xl">
                        {currencySymbols[currency]}{" "}
                        {convertPrice(cartTotalKES)}
                      </span>

                    </div>

                  </div>

                  <p className="mt-10 text-sm leading-relaxed opacity-50">

                    By placing your order, you agree to
                    CHEN's terms and conditions and privacy
                    policy.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default App