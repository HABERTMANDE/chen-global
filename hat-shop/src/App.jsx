import { useState } from "react"
import "./App.css"

function App() {
  // =========================================================
  // CHEN MAASHIR — PRODUCT DATABASE
  // =========================================================

  const products = {
    hat: {
      id: "hat",
      name: "The CHEN Signature Hat",
      category: "Signature Hats",
      priceKES: 1500,
      images: ["/images/hat-main.jpg"],
      giftEligible: true,
      featured: true,
      description:
        "A timeless CHEN statement piece created for those who appreciate elegance, confidence, and distinctive Kenyan style.",
    },

    bag: {
      id: "bag",
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

    sunglasses: {
      id: "sunglasses",
      name: "CHEN Signature Sunglasses",
      category: "Statement Eyewear",
      priceKES: 1000,
      images: [
        "/images/placeholder.jpg",
        "/images/sunglasses.jpg",
        "/images/premium-shades.webp",
      ],
      giftEligible: false,
      featured: true,
      description:
        "Signature eyewear designed to complete the CHEN look with a refined, confident, and contemporary finish.",
    },
  }

  // =========================================================
  // CHEN SIGNATURE BUNDLE
  // 1 HAT + 1 WOVEN BAG + 1 FREE SUNGLASSES
  // TOTAL = KSh 2,500
  // =========================================================

  const bundle = {
    id: "bundle",
    name: "The CHEN Signature Bundle",
    category: "Exclusive Bundle",
    priceKES: 2500,
    images: [
      "/images/hat-main.jpg",
      "/images/woven-bag.jpeg",
    ],
    description:
      "The complete CHEN experience. Get one Signature Hat, one Woven Bag, and receive one complimentary pair of CHEN Signature Sunglasses.",
  }

  // =========================================================
  // CONTACT DETAILS
  // =========================================================

  const whatsappNumber = "254798766568"
  const whatsappDisplay = "0798 766 568"
  const emailAddress = "chenmaashir@gmail.com"

  // =========================================================
  // SOCIAL MEDIA
  // =========================================================

  const instagramUrl = "#"

  // =========================================================
  // CURRENCY SYSTEM
  // =========================================================

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

  // =========================================================
  // STATE
  // =========================================================

  const [currency, setCurrency] = useState("KES")

  const [cart, setCart] = useState([])

  const [cartOpen, setCartOpen] = useState(false)

  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [bagImageIndex, setBagImageIndex] = useState(0)

  const [sunglassesImageIndex, setSunglassesImageIndex] =
    useState(0)

  // =========================================================
  // PAYMENT STATE
  // =========================================================

  const [paymentMethod, setPaymentMethod] =
    useState("mpesa")

  const [mpesaPhone, setMpesaPhone] =
    useState("")

  // =========================================================
  // PRICE CONVERSION
  // =========================================================

  const convertPrice = (priceKES) => {
    const convertedPrice =
      priceKES * exchangeRates[currency]

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits:
        currency === "KES" ? 0 : 2,
      maximumFractionDigits:
        currency === "KES" ? 0 : 2,
    }).format(convertedPrice)
  }

  // =========================================================
  // IMAGE FALLBACK
  // =========================================================

  const handleImageError = (event) => {
    const image = event.currentTarget

    if (
      image.dataset.fallbackApplied === "true"
    ) {
      return
    }

    image.dataset.fallbackApplied = "true"

    image.src = "/images/placeholder.jpg"
  }

  // =========================================================
  // ADD PRODUCT TO CART
  // =========================================================

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct =
        currentCart.find(
          (item) => item.id === product.id
        )

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        )
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
          isBundle: false,
        },
      ]
    })

    setCartOpen(true)
  }

  // =========================================================
  // ADD BUNDLE TO CART
  // =========================================================

  const addBundleToCart = () => {
    setCart((currentCart) => {
      const existingBundle =
        currentCart.find(
          (item) => item.id === bundle.id
        )

      if (existingBundle) {
        return currentCart.map((item) =>
          item.id === bundle.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        )
      }

      return [
        ...currentCart,
        {
          ...bundle,
          quantity: 1,
          isBundle: true,
        },
      ]
    })

    setCartOpen(true)
  }

  // =========================================================
  // REMOVE FROM CART
  // =========================================================

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== productId
      )
    )
  }

  // =========================================================
  // INCREASE QUANTITY
  // =========================================================

  const increaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    )
  }

  // =========================================================
  // DECREASE QUANTITY
  // =========================================================

  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    )
  }

  // =========================================================
  // CART QUANTITY
  // =========================================================

  const cartQuantity = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  )

  // =========================================================
  // CART TOTAL
  // =========================================================

  const cartTotalKES = cart.reduce(
    (total, item) =>
      total +
      item.priceKES *
        item.quantity,
    0
  )

  // =========================================================
  // FREE SUNGLASSES
  //
  // 1 FREE PAIR FOR EVERY HAT
  // 1 FREE PAIR FOR EVERY BUNDLE
  // =========================================================

  const freeSunglassesQuantity =
    cart.reduce(
      (total, item) => {
        if (item.id === "hat") {
          return (
            total + item.quantity
          )
        }

        if (item.id === "bundle") {
          return (
            total + item.quantity
          )
        }

        return total
      },
      0
    )

  // =========================================================
  // BAG SLIDER
  // =========================================================

  const nextBagImage = () => {
    setBagImageIndex(
      (currentIndex) =>
        (currentIndex + 1) %
        products.bag.images.length
    )
  }

  const previousBagImage = () => {
    setBagImageIndex(
      (currentIndex) =>
        (currentIndex -
          1 +
          products.bag.images.length) %
        products.bag.images.length
    )
  }

  // =========================================================
  // SUNGLASSES SLIDER
  // =========================================================

  const nextSunglassesImage = () => {
    setSunglassesImageIndex(
      (currentIndex) =>
        (currentIndex + 1) %
        products.sunglasses.images.length
    )
  }

  const previousSunglassesImage = () => {
    setSunglassesImageIndex(
      (currentIndex) =>
        (currentIndex -
          1 +
          products.sunglasses.images.length) %
        products.sunglasses.images.length
    )
  }

  // =========================================================
  // WHATSAPP
  // =========================================================

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      "Hello CHEN Maashir, I would like to make an inquiry about your products."
    )

    window.open(
      `https://wa.me/${whatsappNumber}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  // =========================================================
  // PLACE ORDER VIA WHATSAPP
  // =========================================================

  const placeOrderViaWhatsApp = () => {
    // Validate M-Pesa phone number
    if (
      paymentMethod === "mpesa" &&
      !mpesaPhone.trim()
    ) {
      alert(
        "Please enter your M-Pesa phone number before placing your order."
      )

      return
    }

    // Basic Kenyan phone number validation
    if (
      paymentMethod === "mpesa" &&
      !/^(\+254|254|0)?7\d{8}$/.test(
        mpesaPhone.replace(/\s/g, "")
      )
    ) {
      alert(
        "Please enter a valid Kenyan M-Pesa phone number."
      )

      return
    }

    const orderItems =
      cart
        .map(
          (item) =>
            `${item.name} x${item.quantity}`
        )
        .join(", ")

    const selectedPaymentMethod =
      paymentMethod === "mpesa"
        ? "M-Pesa"
        : paymentMethod === "card"
        ? "Credit / Debit Card"
        : "PayPal"

    const message =
      encodeURIComponent(
        `Hello CHEN Maashir, I would like to place an order.

Items:
${orderItems}

Total:
${currencySymbols[currency]} ${convertPrice(cartTotalKES)}

Payment Method:
${selectedPaymentMethod}

${
  paymentMethod === "mpesa"
    ? `M-Pesa Phone Number:
${mpesaPhone}`
    : ""
}

Free Sunglasses:
${freeSunglassesQuantity}

Please let me know the next steps for payment and delivery.`
      )

    window.open(
      `https://wa.me/${whatsappNumber}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  // =========================================================
  // CLOSE MOBILE MENU
  // =========================================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  // =========================================================
  // PRODUCT SECTION COMPONENT
  // =========================================================

  const ProductSection = ({
    product,
    image,
    onPrevious,
    onNext,
    imageIndex = 0,
  }) => {
    return (
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">

        {/* PRODUCT IMAGE */}

        <div className="relative">

          <div className="relative aspect-[4/5] bg-[#f1ece5] overflow-hidden">

            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover transition duration-700 hover:scale-[1.02]"
              onError={handleImageError}
            />

            {product.featured && (
              <div className="absolute top-6 left-6 bg-[#2c211b] text-white px-5 py-3 text-xs uppercase tracking-[0.2em]">
                Featured
              </div>
            )}

            {/* SLIDER CONTROLS */}

            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={onPrevious}
                  aria-label="Previous image"
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 text-[#2c211b] text-2xl hover:bg-white transition"
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={onNext}
                  aria-label="Next image"
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 text-[#2c211b] text-2xl hover:bg-white transition"
                >
                  →
                </button>
              </>
            )}

          </div>

          {/* SLIDER DOTS */}

          {product.images.length > 1 && (
            <div className="flex justify-center gap-2 mt-5">

              {product.images.map(
                (_, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => {
                      if (
                        product.id === "bag"
                      ) {
                        setBagImageIndex(index)
                      }

                      if (
                        product.id ===
                        "sunglasses"
                      ) {
                        setSunglassesImageIndex(
                          index
                        )
                      }
                    }}
                    aria-label={`View image ${
                      index + 1
                    }`}
                    className={`w-2.5 h-2.5 rounded-full transition ${
                      imageIndex === index
                        ? "bg-[#2c211b]"
                        : "bg-[#2c211b]/25"
                    }`}
                  />
                )
              )}

            </div>
          )}

        </div>

        {/* PRODUCT INFORMATION */}

        <div>

          <p className="uppercase tracking-[0.35em] text-sm opacity-50 mb-5">
            {product.category}
          </p>

          <h3 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[0.95]">
            {product.name}
          </h3>

          <p className="mt-8 text-lg leading-relaxed opacity-65 max-w-xl">
            {product.description}
          </p>

          <p className="mt-8 text-4xl font-medium">
            {currencySymbols[currency]}{" "}
            {convertPrice(
              product.priceKES
            )}
          </p>

          {currency !== "KES" && (
            <p className="mt-2 text-sm opacity-50">
              Base price: KSh{" "}
              {product.priceKES.toLocaleString(
                "en-US"
              )}
            </p>
          )}

          {/* FREE GIFT */}

          {product.giftEligible && (
            <div className="mt-8 bg-[#f8f5f0] border border-[#2c211b]/15 p-6">

              <p className="text-base font-medium">
                🎁 FREE SUNGLASSES INCLUDED
              </p>

              <p className="mt-3 text-base opacity-60">
                Purchase the CHEN Signature Hat
                for KSh 1,500 and receive one
                complimentary pair of CHEN
                Signature Sunglasses.
              </p>

            </div>
          )}

          <button
            type="button"
            onClick={() =>
              addToCart(product)
            }
            className="mt-8 w-full bg-[#2c211b] text-white py-5 uppercase tracking-[0.2em] text-sm hover:bg-[#4a372c] transition"
          >
            Add to Cart
          </button>

        </div>

      </div>
    )
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-[#2c211b]">

      {/* =====================================================
          ANNOUNCEMENT BAR
      ===================================================== */}

      <div className="bg-[#2c211b] text-white text-center py-3 px-4 text-xs md:text-sm tracking-[0.15em] uppercase">

        <span>
          🇰🇪 Proudly Kenyan
        </span>

        <span className="mx-3 opacity-40">
          •
        </span>

        <span>
          Buy a CHEN Hat & Get Free Sunglasses
        </span>

        <span className="mx-3 opacity-40">
          •
        </span>

        <span>
          Shipping Worldwide 🌍
        </span>

      </div>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="sticky top-0 z-40 bg-[#f8f5f0]/95 backdrop-blur-md border-b border-[#2c211b]/10">

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="h-24 md:h-28 flex items-center justify-between">

            {/* CHEN LOGO */}

            <a
              href="#"
              onClick={closeMobileMenu}
              className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.18em] text-[#2c211b] leading-none hover:opacity-70 transition"
              aria-label="CHEN Maashir Home"
            >
              CHEN
            </a>

            {/* DESKTOP MENU */}

            <div className="hidden lg:flex items-center gap-9 text-sm uppercase tracking-[0.18em]">

              <a
                href="#"
                className="hover:opacity-50 transition"
              >
                Home
              </a>

              <a
                href="#shop"
                className="hover:opacity-50 transition"
              >
                Shop
              </a>

              <a
                href="#bundle"
                className="hover:opacity-50 transition"
              >
                Bundle
              </a>

              <a
                href="#about"
                className="hover:opacity-50 transition"
              >
                Our Story
              </a>

              <a
                href="#contact"
                className="hover:opacity-50 transition"
              >
                Contact
              </a>

            </div>

            {/* DESKTOP CART */}

            <button
              type="button"
              onClick={() =>
                setCartOpen(true)
              }
              className="hidden lg:flex text-sm uppercase tracking-[0.18em] items-center gap-3"
            >
              Cart

              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#2c211b] text-white text-xs">
                {cartQuantity}
              </span>

            </button>

            {/* MOBILE CONTROLS */}

            <div className="lg:hidden flex items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  setCartOpen(true)
                }
                className="uppercase tracking-widest text-xs"
              >
                Cart

                <span className="ml-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2c211b] text-white text-xs">
                  {cartQuantity}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(
                    !mobileMenuOpen
                  )
                }
                className="w-11 h-11 flex flex-col items-center justify-center gap-1.5 border border-[#2c211b]/20"
                aria-label="Toggle menu"
                aria-expanded={
                  mobileMenuOpen
                }
              >
                <span className="w-5 h-0.5 bg-[#2c211b]" />
                <span className="w-5 h-0.5 bg-[#2c211b]" />
                <span className="w-5 h-0.5 bg-[#2c211b]" />
              </button>

            </div>

          </div>

        </div>

        {/* MOBILE MENU */}

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#2c211b]/10 bg-[#f8f5f0]">

            <div className="px-6 py-8 flex flex-col gap-6 text-base uppercase tracking-widest">

              <a
                href="#"
                onClick={closeMobileMenu}
              >
                Home
              </a>

              <a
                href="#shop"
                onClick={closeMobileMenu}
              >
                Shop
              </a>

              <a
                href="#bundle"
                onClick={closeMobileMenu}
              >
                Bundle
              </a>

              <a
                href="#about"
                onClick={closeMobileMenu}
              >
                Our Story
              </a>

              <a
                href="#contact"
                onClick={closeMobileMenu}
              >
                Contact
              </a>

              <button
                type="button"
                onClick={() => {
                  closeMobileMenu()
                  setCartOpen(true)
                }}
                className="text-left"
              >
                Open Cart
              </button>

            </div>

          </div>
        )}

      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="min-h-[calc(100vh-124px)] flex items-center">

        <div className="max-w-7xl mx-auto w-full px-6 lg:px-10 py-20 lg:py-28">

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* HERO COPY */}

            <div>

              <p className="uppercase tracking-[0.4em] text-xs md:text-sm mb-7 opacity-60">
                Kenyan Craft • Global Style
              </p>

              <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.86]">

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

              <p className="mt-10 max-w-xl text-lg md:text-xl leading-relaxed opacity-70">
                Welcome to CHEN — a Kenyan fashion
                and lifestyle brand bringing timeless
                style, beautiful craftsmanship, and
                African creativity from Kenya to the world.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">

                <a
                  href="#shop"
                  className="bg-[#2c211b] text-white px-9 py-5 uppercase tracking-widest text-xs md:text-sm hover:bg-[#4a372c] transition"
                >
                  Shop CHEN
                </a>

                <a
                  href="#bundle"
                  className="border border-[#2c211b] px-9 py-5 uppercase tracking-widest text-xs md:text-sm hover:bg-[#2c211b] hover:text-white transition"
                >
                  View Bundle
                </a>

              </div>

            </div>

            {/* HERO IMAGE */}

            <div className="relative aspect-[4/5] bg-[#f1ece5] overflow-hidden">

              <img
                src="/images/hat-main.jpg"
                alt="CHEN Signature Hat"
                className="w-full h-full object-cover hover:scale-[1.02] transition duration-700"
                onError={handleImageError}
              />

              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-5">

                <p className="text-xs uppercase tracking-[0.25em] opacity-50">
                  CHEN Maashir
                </p>

                <p className="font-serif text-2xl mt-2">
                  Kenyan Style. Global Presence.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          COLLECTION INTRO
      ===================================================== */}

      <section
        id="shop"
        className="py-28 md:py-36 bg-white"
      >

        <div className="max-w-5xl mx-auto px-6 text-center">

          <p className="uppercase tracking-[0.35em] text-xs md:text-sm opacity-60 mb-6">
            The CHEN Collection
          </p>

          <h2 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[0.95]">
            Kenyan Style.
            <br />
            Global Presence.
          </h2>

          <p className="mt-8 text-lg md:text-xl leading-relaxed opacity-60 max-w-3xl mx-auto">
            Discover CHEN hats, woven bags, and
            signature sunglasses — crafted with Kenyan
            creativity and designed for the world.
          </p>

        </div>

      </section>

      {/* =====================================================
          HAT
      ===================================================== */}

      <section className="py-28 md:py-36 bg-white px-6 lg:px-10">

        <ProductSection
          product={products.hat}
          image={products.hat.images[0]}
          imageIndex={0}
        />

      </section>

      {/* =====================================================
          BAG
      ===================================================== */}

      <section className="py-28 md:py-36 bg-[#f8f5f0] px-6 lg:px-10">

        <ProductSection
          product={products.bag}
          image={
            products.bag.images[
              bagImageIndex
            ]
          }
          imageIndex={bagImageIndex}
          onPrevious={
            previousBagImage
          }
          onNext={nextBagImage}
        />

      </section>

      {/* =====================================================
          SUNGLASSES
      ===================================================== */}

      <section className="py-28 md:py-36 bg-white px-6 lg:px-10">

        <ProductSection
          product={
            products.sunglasses
          }
          image={
            products.sunglasses
              .images[
              sunglassesImageIndex
            ]
          }
          imageIndex={
            sunglassesImageIndex
          }
          onPrevious={
            previousSunglassesImage
          }
          onNext={
            nextSunglassesImage
          }
        />

      </section>

      {/* =====================================================
          SIGNATURE BUNDLE
      ===================================================== */}

      <section
        id="bundle"
        className="py-32 md:py-40 bg-[#2c211b] text-white px-6 lg:px-10"
      >

        <div className="max-w-7xl mx-auto">

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* BUNDLE COPY */}

            <div>

              <p className="uppercase tracking-[0.35em] text-xs md:text-sm opacity-60">
                CHEN Exclusive Offer
              </p>

              <h2 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[0.9] mt-7">
                The CHEN
                <br />
                Signature
                <br />
                Bundle.
              </h2>

              <p className="mt-8 text-lg md:text-xl leading-relaxed opacity-70 max-w-xl">
                One Signature Hat. One Woven Bag.
                One complimentary pair of sunglasses.
              </p>

              <p className="mt-8 font-serif text-5xl">
                KSh 2,500
              </p>

              <p className="mt-4 text-sm opacity-60">
                1 Hat + 1 Woven Bag + 1 Free Sunglasses
              </p>

              <button
                type="button"
                onClick={addBundleToCart}
                className="mt-10 bg-white text-[#2c211b] px-9 py-5 uppercase tracking-widest text-xs md:text-sm hover:bg-[#f1ece5] transition"
              >
                Add Bundle to Cart
              </button>

            </div>

            {/* BUNDLE IMAGES */}

            <div className="grid grid-cols-2 gap-5">

              <div className="aspect-[4/5] bg-[#f1ece5] overflow-hidden">

                <img
                  src="/images/hat-main.jpg"
                  alt="CHEN Signature Hat"
                  className="w-full h-full object-cover hover:scale-[1.03] transition duration-700"
                  onError={handleImageError}
                />

              </div>

              <div className="aspect-[4/5] bg-[#f1ece5] overflow-hidden mt-12">

                <img
                  src="/images/woven-bag.jpeg"
                  alt="CHEN Woven Bag"
                  className="w-full h-full object-cover hover:scale-[1.03] transition duration-700"
                  onError={handleImageError}
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CURRENCY SELECTOR
      ===================================================== */}

      <section className="py-20 bg-white text-center">

        <div className="max-w-4xl mx-auto px-6">

          <p className="text-xs md:text-sm uppercase tracking-[0.3em] opacity-60 mb-6">
            Shop In Your Currency
          </p>

          <div className="flex flex-wrap justify-center gap-3">

            {Object.keys(
              exchangeRates
            ).map(
              (currencyCode) => (

                <button
                  type="button"
                  key={currencyCode}
                  onClick={() =>
                    setCurrency(
                      currencyCode
                    )
                  }
                  className={`px-7 py-4 text-xs uppercase tracking-widest border transition ${
                    currency ===
                    currencyCode
                      ? "bg-[#2c211b] text-white border-[#2c211b]"
                      : "border-[#2c211b]/30 hover:border-[#2c211b]"
                  }`}
                >
                  {currencyCode}
                </button>

              )
            )}

          </div>

          <p className="mt-6 text-xs opacity-40">
            Prices are displayed using approximate
            currency conversion. Final orders are
            processed through CHEN.
          </p>

        </div>

      </section>

      {/* =====================================================
          ABOUT / OUR STORY
      ===================================================== */}

      <section
        id="about"
        className="py-32 md:py-40 bg-[#2c211b] text-white"
      >

        <div className="max-w-4xl mx-auto px-6 text-center">

          <p className="uppercase tracking-[0.35em] text-xs md:text-sm opacity-60">
            The CHEN Maashir Story
          </p>

          <h2 className="font-serif text-6xl md:text-8xl leading-[0.95] mt-7">
            From Kenya,
            <br />
            <span className="italic">
              To the World.
            </span>
          </h2>

          <p className="mt-10 text-lg md:text-xl leading-relaxed opacity-70">
            CHEN is a Kenyan fashion and lifestyle
            brand built on the belief that great style
            knows no borders. We celebrate creativity,
            craftsmanship, and the unique spirit of
            Kenya while creating pieces that belong
            everywhere.
          </p>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        id="contact"
        className="bg-[#f8f5f0] py-20 md:py-24 border-t border-[#2c211b]/10"
      >

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="grid md:grid-cols-3 gap-14">

            {/* BRAND */}

            <div>

              <h3 className="font-serif text-5xl md:text-6xl tracking-[0.18em] font-bold">
                CHEN
              </h3>

              <p className="mt-6 text-base opacity-60 max-w-sm leading-relaxed">
                A Kenyan fashion and lifestyle brand
                taking timeless style from Kenya to the world.
              </p>

            </div>

            {/* EXPLORE */}

            <div>

              <h4 className="uppercase tracking-widest text-xs mb-7">
                Explore
              </h4>

              <div className="space-y-4 text-base opacity-70">

                <p>
                  <a
                    href="#shop"
                    className="hover:opacity-50 transition"
                  >
                    Shop CHEN
                  </a>
                </p>

                <p>
                  <a
                    href="#bundle"
                    className="hover:opacity-50 transition"
                  >
                    Signature Bundle
                  </a>
                </p>

                <p>
                  <a
                    href="#about"
                    className="hover:opacity-50 transition"
                  >
                    Our Story
                  </a>
                </p>

                <p>
                  <a
                    href="#contact"
                    className="hover:opacity-50 transition"
                  >
                    Contact
                  </a>
                </p>

              </div>

            </div>

            {/* CONNECT */}

            <div>

              <h4 className="uppercase tracking-widest text-xs mb-7">
                Connect With CHEN
              </h4>

              <div className="space-y-5 text-base opacity-70">

                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="block hover:opacity-50 transition text-left"
                >
                  WhatsApp: {whatsappDisplay}
                </button>

                <a
                  href={`mailto:${emailAddress}`}
                  className="block hover:opacity-50 transition"
                >
                  {emailAddress}
                </a>

                <a
                  href={instagramUrl}
                  className="block hover:opacity-50 transition"
                >
                  Instagram
                </a>

              </div>

            </div>

          </div>

          <div className="mt-16 pt-8 border-t border-[#2c211b]/10 text-xs md:text-sm opacity-50 flex flex-col md:flex-row justify-between gap-4">

            <p>
              © 2026 CHEN Maashir. All Rights Reserved.
            </p>

            <p>
              Born in Kenya. Made for the World.
            </p>

          </div>

        </div>

      </footer>

      {/* =====================================================
          WHATSAPP FLOATING BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={openWhatsApp}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-[#25D366] text-white font-bold text-sm shadow-2xl hover:scale-105 transition"
        aria-label="Contact CHEN on WhatsApp"
      >
        WA
      </button>

      {/* =====================================================
          CART DRAWER
      ===================================================== */}

      {cartOpen && (

        <div className="fixed inset-0 z-50">

          {/* OVERLAY */}

          <button
            type="button"
            aria-label="Close cart"
            onClick={() =>
              setCartOpen(false)
            }
            className="absolute inset-0 bg-black/50 cursor-default"
          />

          {/* CART */}

          <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-[#f8f5f0] shadow-2xl flex flex-col">

            {/* CART HEADER */}

            <div className="flex items-center justify-between px-7 py-7 border-b border-[#2c211b]/10">

              <h2 className="font-serif text-4xl">
                Your Cart
              </h2>

              <button
                type="button"
                onClick={() =>
                  setCartOpen(false)
                }
                className="text-3xl"
                aria-label="Close cart"
              >
                ×
              </button>

            </div>

            {/* CART CONTENT */}

            <div className="flex-1 overflow-y-auto px-7 py-8">

              {cart.length === 0 ? (

                <div className="text-center py-24">

                  <p className="font-serif text-4xl">
                    Your cart is empty.
                  </p>

                  <p className="mt-5 text-base opacity-60">
                    Discover something beautiful from CHEN.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setCartOpen(false)
                    }
                    className="mt-8 bg-[#2c211b] text-white px-7 py-4 text-xs uppercase tracking-widest"
                  >
                    Continue Shopping
                  </button>

                </div>

              ) : (

                <div className="space-y-8">

                  {cart.map((item) => (

                    <div
                      key={item.id}
                      className="flex gap-5"
                    >

                      <img
                        src={
                          item.isBundle
                            ? "/images/hat-main.jpg"
                            : item.images[0]
                        }
                        alt={item.name}
                        className="w-24 h-28 object-cover bg-[#f1ece5]"
                        onError={handleImageError}
                      />

                      <div className="flex-1">

                        <h3 className="font-serif text-2xl">
                          {item.name}
                        </h3>

                        {item.isBundle ? (

                          <p className="mt-2 text-sm opacity-60">
                            1 Hat + 1 Woven Bag +
                            1 Free Sunglasses
                          </p>

                        ) : (

                          <p className="mt-2 text-base">
                            {currencySymbols[currency]}{" "}
                            {convertPrice(
                              item.priceKES
                            )}
                          </p>

                        )}

                        <div className="mt-5 flex items-center gap-4">

                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(
                                item.id
                              )
                            }
                            className="w-9 h-9 border border-[#2c211b]/30 hover:bg-[#2c211b] hover:text-white transition"
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(
                                item.id
                              )
                            }
                            className="w-9 h-9 border border-[#2c211b]/30 hover:bg-[#2c211b] hover:text-white transition"
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            +
                          </button>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.id
                            )
                          }
                          className="mt-4 text-xs uppercase tracking-widest opacity-50 hover:opacity-100 transition"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  ))}

                  {/* FREE GIFT */}

                  {freeSunglassesQuantity > 0 && (

                    <div className="border border-[#2c211b]/15 bg-white p-6">

                      <p className="text-xs uppercase tracking-widest opacity-60">
                        🎁 Complimentary Gift
                      </p>

                      <p className="font-serif text-xl mt-4">
                        CHEN Signature Sunglasses
                      </p>

                      <p className="mt-2 text-base">
                        Quantity:{" "}
                        {freeSunglassesQuantity}
                      </p>

                      <p className="mt-2 font-medium">
                        FREE
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

                  <span className="uppercase tracking-widest text-xs">
                    Subtotal
                  </span>

                  <span className="font-serif text-3xl">
                    {currencySymbols[currency]}{" "}
                    {convertPrice(
                      cartTotalKES
                    )}
                  </span>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCartOpen(false)
                    setCheckoutOpen(true)
                  }}
                  className="w-full bg-[#2c211b] text-white py-5 uppercase tracking-[0.2em] text-xs hover:bg-[#4a372c] transition"
                >
                  Proceed to Checkout
                </button>

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

              <div className="min-h-24 py-5 flex items-center justify-between gap-5">

                <button
                  type="button"
                  onClick={() =>
                    setCheckoutOpen(false)
                  }
                  className="text-xs uppercase tracking-widest hover:opacity-50 transition"
                >
                  ← Back to Cart
                </button>

                <h1 className="font-serif text-4xl md:text-5xl tracking-[0.2em] font-bold">
                  CHEN
                </h1>

                <span className="hidden md:block text-xs uppercase tracking-widest opacity-50">
                  Secure Checkout
                </span>

              </div>

            </div>

          </div>

          {/* CHECKOUT CONTENT */}

          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">

            <div className="grid lg:grid-cols-3 gap-14">

              {/* CHECKOUT FORM */}

              <div className="lg:col-span-2">

                <h2 className="font-serif text-5xl mb-12">
                  Checkout
                </h2>

                {/* CONTACT INFORMATION */}

                <h3 className="text-xs uppercase tracking-[0.2em] mb-7">
                  Contact Information
                </h3>

                <div className="grid md:grid-cols-2 gap-5">

                  <input
                    type="text"
                    placeholder="Full Name"
                    aria-label="Full Name"
                    className="w-full border border-[#2c211b]/20 bg-transparent px-5 py-5 outline-none focus:border-[#2c211b]"
                  />

                  <input
                    type="email"
                    placeholder="Email Address"
                    aria-label="Email Address"
                    className="w-full border border-[#2c211b]/20 bg-transparent px-5 py-5 outline-none focus:border-[#2c211b]"
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number"
                    aria-label="Phone Number"
                    className="w-full border border-[#2c211b]/20 bg-transparent px-5 py-5 outline-none focus:border-[#2c211b]"
                  />

                </div>

                {/* DELIVERY INFORMATION */}

                <h3 className="text-xs uppercase tracking-[0.2em] mt-14 mb-7">
                  Delivery Information
                </h3>

                <div className="grid md:grid-cols-2 gap-5">

                  <select
                    aria-label="Country"
                    className="w-full border border-[#2c211b]/20 bg-transparent px-5 py-5"
                  >
                    <option>
                      Kenya
                    </option>

                    <option>
                      United States
                    </option>

                    <option>
                      United Kingdom
                    </option>

                    <option>
                      Canada
                    </option>

                    <option>
                      Australia
                    </option>

                    <option>
                      Other Country
                    </option>
                  </select>

                  <input
                    type="text"
                    placeholder="City"
                    aria-label="City"
                    className="w-full border border-[#2c211b]/20 bg-transparent px-5 py-5"
                  />

                  <input
                    type="text"
                    placeholder="Delivery Address"
                    aria-label="Delivery Address"
                    className="md:col-span-2 w-full border border-[#2c211b]/20 bg-transparent px-5 py-5"
                  />

                </div>

                {/* =================================================
                    PAYMENT METHOD
                ================================================= */}

                <h3 className="text-xs uppercase tracking-[0.2em] mt-14 mb-7">
                  Payment Method
                </h3>

                <div className="space-y-4">

                  {/* M-PESA */}

                  <label
                    className={`block border p-6 cursor-pointer transition ${
                      paymentMethod === "mpesa"
                        ? "border-[#2c211b] bg-white"
                        : "border-[#2c211b]/20"
                    }`}
                  >

                    <div className="flex items-center gap-4">

                      <input
                        type="radio"
                        name="payment"
                        value="mpesa"
                        checked={
                          paymentMethod ===
                          "mpesa"
                        }
                        onChange={() =>
                          setPaymentMethod(
                            "mpesa"
                          )
                        }
                      />

                      <div>

                        <span className="font-medium">
                          M-Pesa
                        </span>

                        <p className="text-sm opacity-50 mt-1">
                          Pay securely using M-Pesa
                        </p>

                      </div>

                    </div>

                    {/* M-PESA PHONE NUMBER */}

                    {paymentMethod ===
                      "mpesa" && (

                      <div className="mt-6">

                        <label className="block text-xs uppercase tracking-widest opacity-60 mb-3">
                          M-Pesa Phone Number
                        </label>

                        <input
                          type="tel"
                          value={mpesaPhone}
                          onChange={(event) =>
                            setMpesaPhone(
                              event.target.value
                            )
                          }
                          placeholder="07XXXXXXXX"
                          className="w-full border border-[#2c211b]/20 bg-transparent px-5 py-5 outline-none focus:border-[#2c211b]"
                        />

                        <p className="mt-3 text-xs opacity-50">
                          Enter the M-Pesa number you want to use for this order.
                        </p>

                      </div>

                    )}

                  </label>

                  {/* CREDIT / DEBIT CARD */}

                  <label
                    className={`flex items-center gap-4 border p-6 cursor-pointer transition ${
                      paymentMethod === "card"
                        ? "border-[#2c211b] bg-white"
                        : "border-[#2c211b]/20"
                    }`}
                  >

                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={
                        paymentMethod ===
                        "card"
                      }
                      onChange={() =>
                        setPaymentMethod(
                          "card"
                        )
                      }
                    />

                    <div>

                      <span>
                        Credit / Debit Card
                      </span>

                      <p className="text-sm opacity-50 mt-1">
                        Card payment
                      </p>

                    </div>

                  </label>

                  {/* PAYPAL */}

                  <label
                    className={`flex items-center gap-4 border p-6 cursor-pointer transition ${
                      paymentMethod === "paypal"
                        ? "border-[#2c211b] bg-white"
                        : "border-[#2c211b]/20"
                    }`}
                  >

                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={
                        paymentMethod ===
                        "paypal"
                      }
                      onChange={() =>
                        setPaymentMethod(
                          "paypal"
                        )
                      }
                    />

                    <div>

                      <span>
                        PayPal
                      </span>

                      <p className="text-sm opacity-50 mt-1">
                        Pay using PayPal
                      </p>

                    </div>

                  </label>

                </div>

                {/* =================================================
                    PLACE ORDER BUTTON
                ================================================= */}

                <button
                  type="button"
                  onClick={
                    placeOrderViaWhatsApp
                  }
                  className="mt-10 w-full bg-[#2c211b] text-white py-6 uppercase tracking-[0.2em] text-xs hover:bg-[#4a372c] transition"
                >
                  Place Order via WhatsApp
                </button>

                <p className="mt-5 text-xs opacity-50 text-center">
                  Your order details and selected payment method will be sent to CHEN through WhatsApp for confirmation.
                </p>

              </div>

              {/* =================================================
                  ORDER SUMMARY
              ================================================= */}

              <div>

                <div className="bg-white border border-[#2c211b]/10 p-8 lg:sticky lg:top-8">

                  <h3 className="font-serif text-4xl mb-8">
                    Your Order
                  </h3>

                  <div className="space-y-6">

                    {cart.map((item) => (

                      <div
                        key={item.id}
                        className="flex justify-between gap-5"
                      >

                        <div>

                          <p className="font-serif text-xl">
                            {item.name}
                          </p>

                          <p className="text-sm opacity-50 mt-2">
                            Quantity:{" "}
                            {item.quantity}
                          </p>

                        </div>

                        <p className="whitespace-nowrap">
                          {currencySymbols[currency]}{" "}
                          {convertPrice(
                            item.priceKES *
                              item.quantity
                          )}
                        </p>

                      </div>

                    ))}

                    {/* FREE SUNGLASSES */}

                    {freeSunglassesQuantity > 0 && (

                      <div className="pt-6 border-t border-[#2c211b]/10">

                        <p className="text-xs uppercase tracking-widest opacity-60">
                          🎁 Free Gift
                        </p>

                        <div className="flex justify-between gap-5 mt-4">

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

                  {/* PAYMENT SUMMARY */}

                  <div className="mt-8 pt-6 border-t border-[#2c211b]/10">

                    <p className="text-xs uppercase tracking-widest opacity-50">
                      Payment Method
                    </p>

                    <p className="mt-3 font-medium">

                      {paymentMethod ===
                        "mpesa" &&
                        "M-Pesa"}

                      {paymentMethod ===
                        "card" &&
                        "Credit / Debit Card"}

                      {paymentMethod ===
                        "paypal" &&
                        "PayPal"}

                    </p>

                    {paymentMethod ===
                      "mpesa" &&
                      mpesaPhone && (

                      <p className="mt-2 text-sm opacity-50">
                        {mpesaPhone}
                      </p>

                    )}

                  </div>

                  {/* TOTAL */}

                  <div className="mt-8 pt-6 border-t border-[#2c211b]/10">

                    <div className="flex justify-between gap-5">

                      <span className="font-serif text-2xl">
                        Total
                      </span>

                      <span className="font-serif text-2xl whitespace-nowrap">
                        {currencySymbols[currency]}{" "}
                        {convertPrice(
                          cartTotalKES
                        )}
                      </span>

                    </div>

                  </div>

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