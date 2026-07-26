import { useState } from "react"

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
        "A timeless statement piece from CHEN, created for those who appreciate elegance, confidence, and distinctive style.",
    },

    {
      id: 2,
      name: "The CHEN Woven Bag",
      category: "Woven Bags",
      priceKES: 2500,
      images: [
        "/images/hat-main.jpg",
        "/images/woven-bag.jpeg",
        "/images/woven-bag.jpg",
      ],
      giftEligible: false,
      featured: true,
      description:
        "A beautifully crafted woven bag inspired by Kenyan artistry and timeless everyday elegance.",
    },

    {
      id: 3,
      name: "CHEN Signature Sunglasses",
      category: "Sunglasses",
      priceKES: 1000,
      images: [
        "/images/placeholder.jpg",
        "/images/sunglasses.jpg",
        "/images/premium-shades.jpg",
      ],
      giftEligible: false,
      featured: true,
      description:
        "Signature eyewear designed to complete the CHEN look — available to purchase separately or receive complimentary with a qualifying hat purchase.",
    },

    {
      id: 4,
      name: "The CHEN Hat & Woven Bag Set",
      category: "CHEN Sets",
      priceKES: 2500,
      image: "/images/woven-bag.jpeg",
      giftEligible: true,
      bundle: true,
      featured: true,
      description:
        "The perfect CHEN combination. Get one CHEN Signature Hat and one CHEN Woven Bag for KSh 2,500, plus one complimentary pair of CHEN Signature Sunglasses.",
    },
  ]

  // =====================================================
  // LOGO
  // =====================================================
  // Change this path if your logo has a different filename.

  const logoImage = "/images/chen-logo.png"

  // =====================================================
  // HERO IMAGE
  // =====================================================

  const heroImage = "/images/woven-bag.jpeg"

  // =====================================================
  // FREE GIFT
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

  const [activeImages, setActiveImages] = useState({})

  // =====================================================
  // DYNAMIC CATEGORIES
  // =====================================================

  const categories = [
    ...new Set(products.map((product) => product.category)),
  ]

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
  // GET PRODUCT IMAGES
  // =====================================================

  const getProductImages = (product) => {
    if (product.images) {
      return product.images
    }

    return [product.image]
  }

  // =====================================================
  // CHANGE PRODUCT SLIDE
  // =====================================================

  const changeSlide = (productId, direction, totalImages) => {
    setActiveImages((current) => {
      const currentIndex = current[productId] || 0

      let nextIndex

      if (direction === "next") {
        nextIndex = (currentIndex + 1) % totalImages
      } else {
        nextIndex =
          (currentIndex - 1 + totalImages) % totalImages
      }

      return {
        ...current,
        [productId]: nextIndex,
      }
    })
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
  // CART TOTAL QUANTITY
  // =====================================================

  const cartQuantity = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )

  // =====================================================
  // CART TOTAL PRICE
  // =====================================================

  const cartTotalKES = cart.reduce(
    (total, item) =>
      total + item.priceKES * item.quantity,
    0
  )

  // =====================================================
  // FREE SUNGLASSES QUANTITY
  //
  // ONE FREE PAIR PER:
  // - CHEN Signature Hat
  // - CHEN Hat & Woven Bag Set
  // =====================================================

  const freeSunglassesQuantity = cart.reduce(
    (total, item) =>
      item.giftEligible
        ? total + item.quantity
        : total,
    0
  )

  // =====================================================
  // WHATSAPP
  // =====================================================

  const whatsappNumber = "254782233163"

  const openWhatsApp = () => {
    const message =
      "Hello CHEN, I am interested in your products."

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    )
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#2c211b] font-['Montserrat']">

      {/* =====================================================
          TOP ANNOUNCEMENT
      ===================================================== */}

      <div className="bg-[#2c211b] text-white text-center py-3 px-4 text-sm md:text-base tracking-[0.15em] uppercase">

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

          <div className="h-24 flex items-center justify-between">

            {/* LOGO */}

            <a
              href="#"
              className="flex items-center"
            >
              <img
                src={logoImage}
                alt="CHEN Logo"
                className="h-14 md:h-16 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />

              <span className="font-['Cormorant_Garamond'] text-4xl font-semibold tracking-[0.25em]">
                CHEN
              </span>
            </a>

            {/* MENU */}

            <div className="hidden md:flex items-center gap-10 text-base uppercase tracking-widest font-medium">

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
              className="relative text-base uppercase tracking-widest font-semibold"
            >
              Cart

              <span className="ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#2c211b] text-white text-xs">
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

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* TEXT */}

            <div className="order-2 lg:order-1">

              <p className="uppercase tracking-[0.4em] text-sm md:text-base mb-6 opacity-60 font-medium">
                Kenyan Craft • Global Style
              </p>

              <h1 className="font-['Cormorant_Garamond'] text-7xl md:text-8xl lg:text-9xl leading-[0.85] font-medium">

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

              <p className="mt-8 max-w-lg text-lg md:text-xl leading-relaxed opacity-70">
                Welcome to CHEN — a Kenyan fashion and lifestyle
                brand bringing timeless style, beautiful
                craftsmanship, and African creativity from Kenya
                to the world.
              </p>

              {/* PROMOTION */}

              <div className="mt-8 border border-[#2c211b]/20 bg-white p-6 max-w-lg">

                <p className="text-sm uppercase tracking-[0.25em] opacity-60 font-medium">
                  Limited CHEN Offer
                </p>

                <p className="mt-2 font-['Cormorant_Garamond'] text-3xl font-semibold">
                  🎁 1 Hat + 1 Woven Bag = KSh 2,500
                </p>

                <p className="mt-2 text-base opacity-60">
                  Plus 1 complimentary pair of CHEN
                  sunglasses.
                </p>

              </div>

              <div className="mt-10 flex flex-wrap gap-4">

                <a
                  href="#shop"
                  className="inline-block bg-[#2c211b] text-white px-9 py-5 uppercase tracking-widest text-sm md:text-base font-semibold hover:bg-[#4a372c] transition"
                >
                  Shop CHEN
                </a>

                <a
                  href="#about"
                  className="inline-block border border-[#2c211b] px-9 py-5 uppercase tracking-widest text-sm md:text-base font-semibold hover:bg-[#2c211b] hover:text-white transition"
                >
                  Our Story
                </a>

              </div>

              <div className="mt-12 flex items-center gap-4">

                <div className="h-px w-12 bg-[#2c211b]/30"></div>

                <p className="text-sm uppercase tracking-[0.25em] opacity-50 font-medium">
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
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          COLLECTION NAVIGATION
      ===================================================== */}

      <section
        id="collections"
        className="py-20 bg-[#2c211b] text-white"
      >

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {categories.map((category, index) => (

              <a
                key={category}
                href={`#${createSectionId(category)}`}
                className="border border-white/20 p-9 hover:bg-white hover:text-[#2c211b] transition"
              >

                <p className="text-sm uppercase tracking-[0.3em] opacity-60 font-medium">
                  Collection {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl mt-4 font-semibold">
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

            <p className="uppercase tracking-[0.3em] text-sm opacity-60 mb-5 font-medium">
              The CHEN Collection
            </p>

            <h2 className="font-['Cormorant_Garamond'] text-6xl md:text-7xl font-semibold">
              Kenyan Style.
              <br />
              Global Presence.
            </h2>

            <p className="mt-7 text-lg leading-relaxed opacity-60">
              Discover CHEN hats, woven bags, sunglasses,
              and exclusive sets — crafted with Kenyan
              creativity and designed for the world.
            </p>

          </div>

          {/* DYNAMIC COLLECTION */}

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

                <div className="mb-16 text-center">

                  <p className="uppercase tracking-[0.3em] text-sm opacity-50 mb-4 font-medium">
                    CHEN Collection
                  </p>

                  <h2 className="font-['Cormorant_Garamond'] text-6xl md:text-7xl font-semibold">
                    {category}
                  </h2>

                  <div className="mt-6 mx-auto h-px w-16 bg-[#2c211b]/30"></div>

                </div>

                {/* PRODUCTS */}

                <div className="space-y-36">

                  {categoryProducts.map(
                    (product, productIndex) => {

                      const productImages =
                        getProductImages(product)

                      const currentImageIndex =
                        activeImages[product.id] || 0

                      return (

                        <div
                          key={product.id}
                          className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center ${
                            productIndex % 2 !== 0
                              ? "md:[&>*:first-child]:order-2"
                              : ""
                          }`}
                        >

                          {/* PRODUCT IMAGE */}

                          <div className="group">

                            <div className="relative aspect-[4/5] bg-[#f1ece5] overflow-hidden">

                              <img
                                src={
                                  productImages[
                                    currentImageIndex
                                  ]
                                }
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/images/placeholder.jpg"
                                }}
                              />

                              {/* FEATURED */}

                              {product.featured && (

                                <div className="absolute top-5 left-5 bg-[#2c211b] text-white px-5 py-3 text-xs uppercase tracking-widest font-semibold">
                                  Featured
                                </div>

                              )}

                              {/* SLIDER ARROWS */}

                              {productImages.length > 1 && (

                                <>

                                  <button
                                    onClick={() =>
                                      changeSlide(
                                        product.id,
                                        "prev",
                                        productImages.length
                                      )
                                    }
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-[#2c211b] text-xl shadow hover:bg-white transition"
                                  >
                                    ←
                                  </button>

                                  <button
                                    onClick={() =>
                                      changeSlide(
                                        product.id,
                                        "next",
                                        productImages.length
                                      )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-[#2c211b] text-xl shadow hover:bg-white transition"
                                  >
                                    →
                                  </button>

                                  {/* SLIDE INDICATORS */}

                                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">

                                    {productImages.map(
                                      (_, index) => (

                                        <button
                                          key={index}
                                          onClick={() =>
                                            setActiveImages(
                                              (current) => ({
                                                ...current,
                                                [product.id]:
                                                  index,
                                              })
                                            )
                                          }
                                          className={`w-2.5 h-2.5 rounded-full transition ${
                                            index ===
                                            currentImageIndex
                                              ? "bg-white"
                                              : "bg-white/50"
                                          }`}
                                        />

                                      )
                                    )}

                                  </div>

                                </>

                              )}

                            </div>

                          </div>

                          {/* PRODUCT INFO */}

                          <div>

                            <p className="uppercase tracking-[0.3em] text-sm opacity-50 mb-4 font-medium">
                              {product.category}
                            </p>

                            <h3 className="font-['Cormorant_Garamond'] text-6xl md:text-7xl font-semibold leading-tight">
                              {product.name}
                            </h3>

                            <p className="mt-6 text-lg leading-relaxed opacity-65">
                              {product.description}
                            </p>

                            {/* BUNDLE OFFER */}

                            {product.bundle && (

                              <div className="mt-7 bg-[#f8f5f0] border border-[#2c211b]/10 p-6">

                                <p className="text-sm uppercase tracking-[0.2em] font-semibold">
                                  🎁 CHEN Exclusive Bundle
                                </p>

                                <p className="mt-3 text-lg font-semibold">
                                  1 Hat + 1 Woven Bag =
                                  KSh 2,500
                                </p>

                                <p className="mt-2 text-base opacity-60">
                                  Plus 1 Free Pair of
                                  CHEN Sunglasses.
                                </p>

                              </div>

                            )}

                            {/* PRICE */}

                            <p className="mt-8 text-4xl font-['Montserrat'] font-semibold">
                              {currencySymbols[currency]}{" "}
                              {convertPrice(product.priceKES)}
                            </p>

                            {currency !== "KES" && (

                              <p className="mt-2 text-sm opacity-50 font-medium">
                                Base price: KSh{" "}
                                {product.priceKES}
                              </p>

                            )}

                            {/* FREE GIFT */}

                            {product.giftEligible && (

                              <div className="mt-6 bg-[#f8f5f0] border border-[#2c211b]/10 p-6">

                                <p className="text-sm font-semibold">
                                  🎁 FREE SUNGLASSES INCLUDED
                                </p>

                                <p className="mt-2 text-base opacity-60">
                                  Get 1 complimentary pair
                                  of CHEN Signature
                                  Sunglasses with this
                                  qualifying purchase.
                                </p>

                              </div>

                            )}

                            {/* ADD TO CART */}

                            <button
                              onClick={() =>
                                addToCart(product)
                              }
                              className="mt-8 w-full bg-[#2c211b] text-white py-6 uppercase tracking-[0.2em] text-sm md:text-base font-semibold hover:bg-[#4a372c] transition"
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

          <div className="mt-24 text-center">

            <p className="text-sm uppercase tracking-[0.3em] opacity-60 mb-5 font-medium">
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
                    className={`px-7 py-4 text-sm uppercase tracking-widest border font-semibold transition ${
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

          <p className="uppercase tracking-[0.3em] text-sm opacity-60 mb-6 font-medium">
            The CHEN Story
          </p>

          <h2 className="font-['Cormorant_Garamond'] text-6xl md:text-8xl leading-tight font-semibold">

            From Kenya,

            <br />

            <span className="italic">
              To the World.
            </span>

          </h2>

          <p className="mt-8 text-lg md:text-xl leading-relaxed opacity-70 max-w-2xl mx-auto">
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

          <div className="grid md:grid-cols-3 gap-12">

            {/* BRAND */}

            <div>

              <div className="flex items-center">

                <img
                  src={logoImage}
                  alt="CHEN Logo"
                  className="h-14 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />

                <span className="font-['Cormorant_Garamond'] text-4xl font-semibold tracking-[0.2em]">
                  CHEN
                </span>

              </div>

              <p className="mt-5 text-base opacity-60 max-w-xs leading-relaxed">
                A Kenyan fashion and lifestyle brand
                taking timeless style from Kenya to the
                world.
              </p>

            </div>

            {/* EXPLORE */}

            <div>

              <h4 className="uppercase tracking-widest text-sm mb-6 font-semibold">
                Explore
              </h4>

              <div className="space-y-4 text-base opacity-70 font-medium">

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

              <h4 className="uppercase tracking-widest text-sm mb-6 font-semibold">
                Connect With CHEN
              </h4>

              <div className="space-y-5 text-base opacity-70 font-medium">

                <button
                  onClick={openWhatsApp}
                  className="block hover:opacity-100 transition"
                >
                  WhatsApp: 0782233163
                </button>

                <a
                  href="mailto:chenmaashir@gmail.com"
                  className="block hover:opacity-100 transition"
                >
                  Email: chenmaashir@gmail.com
                </a>

                <p>
                  Instagram
                </p>

              </div>

            </div>

          </div>

          <div className="mt-16 pt-8 border-t border-[#2c211b]/10 text-sm opacity-50">
            © 2026 CHEN. All Rights Reserved.
          </div>

        </div>

      </footer>

      {/* =====================================================
          FLOATING WHATSAPP BUTTON
      ===================================================== */}

      <button
        onClick={openWhatsApp}
        className="fixed bottom-6 right-6 z-40 bg-[#2c211b] text-white px-6 py-4 rounded-full shadow-xl uppercase tracking-widest text-xs font-semibold hover:bg-[#4a372c] transition"
      >
        WhatsApp CHEN
      </button>

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
            className="absolute inset-0 bg-black/40"
          ></div>

          {/* CART DRAWER */}

          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#f8f5f0] shadow-2xl flex flex-col">

            {/* HEADER */}

            <div className="flex items-center justify-between px-6 py-7 border-b border-[#2c211b]/10">

              <h2 className="font-['Cormorant_Garamond'] text-4xl font-semibold">
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

            <div className="flex-1 overflow-y-auto px-6 py-8">

              {cart.length === 0 ? (

                <div className="text-center py-20">

                  <p className="font-['Cormorant_Garamond'] text-4xl font-semibold">
                    Your cart is empty.
                  </p>

                  <p className="mt-4 text-base opacity-60">
                    Discover something beautiful from CHEN.
                  </p>

                </div>

              ) : (

                <div className="space-y-8">

                  {cart.map((item) => (

                    <div
                      key={item.id}
                      className="flex gap-4"
                    >

                      <img
                        src={
                          getProductImages(item)[
                            activeImages[item.id] || 0
                          ]
                        }
                        alt={item.name}
                        className="w-24 h-28 object-cover"
                      />

                      <div className="flex-1">

                        <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold">
                          {item.name}
                        </h3>

                        <p className="mt-2 text-lg font-semibold">
                          {currencySymbols[currency]}{" "}
                          {convertPrice(item.priceKES)}
                        </p>

                        {/* QUANTITY */}

                        <div className="mt-4 flex items-center gap-4">

                          <button
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                            className="w-9 h-9 border border-[#2c211b]/30"
                          >
                            −
                          </button>

                          <span className="font-semibold">
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
                          className="mt-4 text-xs uppercase tracking-widest opacity-50 hover:opacity-100 font-semibold"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  ))}

                  {/* FREE GIFT */}

                  {freeSunglassesQuantity > 0 &&
                    freeGift && (

                    <div className="border border-[#2c211b]/20 bg-white p-5">

                      <p className="text-xs uppercase tracking-widest opacity-60 font-semibold">
                        🎁 Complimentary Gift
                      </p>

                      <div className="flex gap-4 mt-4">

                        <img
                          src={freeGift.images[0]}
                          alt={freeGift.name}
                          className="w-20 h-24 object-cover"
                        />

                        <div>

                          <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold">
                            {freeGift.name}
                          </h3>

                          <p className="mt-2 text-sm">
                            Quantity:{" "}
                            {freeSunglassesQuantity}
                          </p>

                          <p className="mt-2 text-sm font-semibold">
                            FREE
                          </p>

                        </div>

                      </div>

                      <p className="mt-4 text-xs opacity-50">
                        One complimentary pair included
                        with each qualifying purchase.
                      </p>

                    </div>

                  )}

                </div>

              )}

            </div>

            {/* CART FOOTER */}

            {cart.length > 0 && (

              <div className="border-t border-[#2c211b]/10 px-6 py-7">

                <div className="flex justify-between items-center mb-6">

                  <span className="uppercase tracking-widest text-xs font-semibold">
                    Subtotal
                  </span>

                  <span className="font-['Montserrat'] text-2xl font-semibold">
                    {currencySymbols[currency]}{" "}
                    {convertPrice(cartTotalKES)}
                  </span>

                </div>

                <button
                  onClick={openCheckout}
                  className="w-full bg-[#2c211b] text-white py-5 uppercase tracking-[0.2em] text-sm font-semibold hover:bg-[#4a372c] transition"
                >
                  Proceed to Checkout
                </button>

                <p className="mt-4 text-center text-xs opacity-50">
                  Free sunglasses included with
                  qualifying purchases.
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

              <div className="h-24 flex items-center justify-between">

                <button
                  onClick={closeCheckout}
                  className="text-sm uppercase tracking-widest hover:opacity-60 font-semibold"
                >
                  ← Back to Cart
                </button>

                <div className="flex items-center">

                  <img
                    src={logoImage}
                    alt="CHEN Logo"
                    className="h-12 w-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />

                  <span className="font-['Cormorant_Garamond'] text-4xl font-semibold tracking-[0.2em]">
                    CHEN
                  </span>

                </div>

                <div className="text-xs uppercase tracking-widest opacity-50 font-semibold">
                  Secure Checkout
                </div>

              </div>

            </div>

          </div>

          {/* CHECKOUT CONTENT */}

          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">

            <div className="grid lg:grid-cols-3 gap-12">

              {/* CHECKOUT FORM */}

              <div className="lg:col-span-2">

                <h2 className="font-['Cormorant_Garamond'] text-5xl font-semibold mb-10">
                  Checkout
                </h2>

                {/* CONTACT */}

                <div>

                  <h3 className="text-sm uppercase tracking-[0.2em] mb-6 font-semibold">
                    Contact Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-5">

                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full border border-[#2c211b]/20 bg-transparent px-5 py-5 outline-none focus:border-[#2c211b] text-base"
                    />

                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full border border-[#2c211b]/20 bg-transparent px-5 py-5 outline-none focus:border-[#2c211b] text-base"
                    />

                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full border border-[#2c211b]/20 bg-transparent px-5 py-5 outline-none focus:border-[#2c211b] text-base"
                    />

                  </div>

                </div>

                {/* DELIVERY */}

                <div className="mt-14">

                  <h3 className="text-sm uppercase tracking-[0.2em] mb-6 font-semibold">
                    Delivery Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-5">

                    <select
                      className="w-full border border-[#2c211b]/20 bg-transparent px-5 py-5 outline-none text-base"
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
                      className="w-full border border-[#2c211b]/20 bg-transparent px-5 py-5 outline-none text-base"
                    />

                    <input
                      type="text"
                      placeholder="Delivery Address"
                      className="md:col-span-2 w-full border border-[#2c211b]/20 bg-transparent px-5 py-5 outline-none text-base"
                    />

                    <input
                      type="text"
                      placeholder="Postal Code"
                      className="w-full border border-[#2c211b]/20 bg-transparent px-5 py-5 outline-none text-base"
                    />

                  </div>

                </div>

                {/* PAYMENT */}

                <div className="mt-14">

                  <h3 className="text-sm uppercase tracking-[0.2em] mb-6 font-semibold">
                    Payment Method
                  </h3>

                  <div className="space-y-4">

                    <label className="flex items-center gap-4 border border-[#2c211b]/20 p-6 cursor-pointer hover:border-[#2c211b]">

                      <input
                        type="radio"
                        name="payment"
                        defaultChecked
                      />

                      <div>

                        <p className="font-semibold">
                          M-Pesa
                        </p>

                        <p className="text-sm opacity-50">
                          Available for customers in Kenya
                        </p>

                      </div>

                    </label>

                    <label className="flex items-center gap-4 border border-[#2c211b]/20 p-6 cursor-pointer hover:border-[#2c211b]">

                      <input
                        type="radio"
                        name="payment"
                      />

                      <div>

                        <p className="font-semibold">
                          Credit / Debit Card
                        </p>

                        <p className="text-sm opacity-50">
                          Visa, Mastercard and other cards
                        </p>

                      </div>

                    </label>

                    <label className="flex items-center gap-4 border border-[#2c211b]/20 p-6 cursor-pointer hover:border-[#2c211b]">

                      <input
                        type="radio"
                        name="payment"
                      />

                      <div>

                        <p className="font-semibold">
                          PayPal
                        </p>

                        <p className="text-sm opacity-50">
                          Pay securely with PayPal
                        </p>

                      </div>

                    </label>

                  </div>

                </div>

                {/* PLACE ORDER */}

                <button
                  className="mt-10 w-full bg-[#2c211b] text-white py-6 uppercase tracking-[0.2em] text-sm font-semibold hover:bg-[#4a372c] transition"
                >
                  Place Order
                </button>

              </div>

              {/* ORDER SUMMARY */}

              <div>

                <div className="bg-white border border-[#2c211b]/10 p-8 sticky top-8">

                  <h3 className="font-['Cormorant_Garamond'] text-4xl font-semibold mb-8">
                    Your Order
                  </h3>

                  <div className="space-y-6">

                    {cart.map((item) => (

                      <div
                        key={item.id}
                        className="flex gap-4"
                      >

                        <img
                          src={
                            getProductImages(item)[
                              activeImages[item.id] || 0
                            ]
                          }
                          alt={item.name}
                          className="w-20 h-24 object-cover"
                        />

                        <div className="flex-1">

                          <p className="font-['Cormorant_Garamond'] text-xl font-semibold">
                            {item.name}
                          </p>

                          <p className="text-sm opacity-50 mt-1">
                            Quantity: {item.quantity}
                          </p>

                          <p className="mt-2 font-semibold">
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

                      <div className="pt-6 border-t border-[#2c211b]/10">

                        <p className="text-xs uppercase tracking-widest opacity-60 font-semibold">
                          🎁 Free Gift
                        </p>

                        <div className="flex justify-between mt-3">

                          <span>
                            CHEN Sunglasses ×{" "}
                            {freeSunglassesQuantity}
                          </span>

                          <span className="font-semibold">
                            FREE
                          </span>

                        </div>

                      </div>

                    )}

                  </div>

                  {/* TOTALS */}

                  <div className="mt-8 pt-6 border-t border-[#2c211b]/10 space-y-4">

                    <div className="flex justify-between text-sm">

                      <span>
                        Subtotal
                      </span>

                      <span className="font-semibold">
                        {currencySymbols[currency]}{" "}
                        {convertPrice(cartTotalKES)}
                      </span>

                    </div>

                    <div className="flex justify-between text-sm">

                      <span>
                        Shipping
                      </span>

                      <span>
                        Calculated at checkout
                      </span>

                    </div>

                    <div className="flex justify-between pt-4 border-t border-[#2c211b]/10">

                      <span className="font-['Cormorant_Garamond'] text-2xl font-semibold">
                        Total
                      </span>

                      <span className="font-['Montserrat'] text-2xl font-semibold">
                        {currencySymbols[currency]}{" "}
                        {convertPrice(cartTotalKES)}
                      </span>

                    </div>

                  </div>

                  <p className="mt-8 text-xs leading-relaxed opacity-50">
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