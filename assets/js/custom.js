document.addEventListener("DOMContentLoaded", () => {
  const embla__sliders = document.querySelectorAll(".embla");
  embla__sliders.forEach((embla__slider) => {
    let slidesToScroll__mobile = embla__slider.getAttribute("slides-mobile") || 1;
      let slidesToScroll__tab = embla__slider.getAttribute("slides-tab") || 1;
    let slidesToScroll__desk = embla__slider.getAttribute("slides-desk") || 1;
    let mobile__only = embla__slider.getAttribute("mobile-only") || 0;
    let slide__align = embla__slider.getAttribute("slide-align") || "start";
    let embla__loop = embla__slider.hasAttribute("embla-loop");

    if (mobile__only == 1) {
      options = {
        loop: false,
        align: slide__align,
        slidesToScroll: slidesToScroll__mobile,
        containScroll: "trimSnaps",
        breakpoints: {
          "(min-width: 768px)": { loop: true, slidesToScroll: slidesToScroll__tab },
          "(min-width: 1080px)": { loop: true, slidesToScroll: slidesToScroll__desk, active: false }
        }
      };
    } else {
      options = {
        loop: embla__loop,
        align: slide__align,
        containScroll: "trimSnaps",
        slidesToScroll: slidesToScroll__mobile,
        breakpoints: {
          "(min-width: 768px)": { loop: embla__loop, slidesToScroll: slidesToScroll__tab },
          "(min-width: 1080px)": { loop: embla__loop, slidesToScroll: slidesToScroll__desk }
        }
      };
    }

    const viewportNode = embla__slider.querySelector(".embla__viewport");
    const prevButtonNode = embla__slider.querySelector(".embla__arrow--prev");
    const nextButtonNode = embla__slider.querySelector(".embla__arrow--next");
    const dotsNode = embla__slider.querySelector(".embla__dots");

    const emblaApi = EmblaCarousel(viewportNode, options);

    // Next/Prev button click handlers
    if (prevButtonNode) {
      prevButtonNode.addEventListener("click", emblaApi.scrollPrev, false);
    }
    if (nextButtonNode) {
      nextButtonNode.addEventListener("click", emblaApi.scrollNext, false);
    }

    // Next/Prev button disable toggle + is-disabled class
    const toggleArrowButtonsState = () => {
      if (prevButtonNode) {
        const canScrollPrev = emblaApi.canScrollPrev();
        prevButtonNode.disabled = !canScrollPrev;
        prevButtonNode.classList.toggle("is-disabled", !canScrollPrev);
      }
      if (nextButtonNode) {
        const canScrollNext = emblaApi.canScrollNext();
        nextButtonNode.disabled = !canScrollNext;
        nextButtonNode.classList.toggle("is-disabled", !canScrollNext);
      }
    };

    // Dots variables & functions
    let dotNodes = [];

    const addDotBtnsWithClickHandlers = () => {
      if (!dotsNode) return false;

      const snapCount = emblaApi.scrollSnapList().length;

      // Only show dots if there's more than 1 page
      if (snapCount <= 1) {
        dotsNode.innerHTML = "";
        return;
      }

      dotsNode.innerHTML = emblaApi
        .scrollSnapList()
        .map(() => '<button class="embla__dot" type="button"></button>')
        .join("");

      const scrollTo = (index) => {
        emblaApi.scrollTo(index);
      };

      dotNodes = Array.from(dotsNode.querySelectorAll(".embla__dot"));
      dotNodes.forEach((dotNode, index) => {
        dotNode.addEventListener("click", () => scrollTo(index), false);
      });
    };

    const toggleDotBtnsActive = () => {
      if (!dotsNode || dotNodes.length === 0) return;

      const previous = emblaApi.previousScrollSnap();
      const selected = emblaApi.selectedScrollSnap();

      if (dotNodes[previous]) {
        dotNodes[previous].classList.remove("embla__dot--selected");
      }
      if (dotNodes[selected]) {
        dotNodes[selected].classList.add("embla__dot--selected");
      }
    };

    // Register Embla events
    emblaApi
      .on("init", toggleArrowButtonsState)
      .on("select", toggleArrowButtonsState)
      .on("reInit", toggleArrowButtonsState)
      .on("init", addDotBtnsWithClickHandlers)
      .on("reInit", addDotBtnsWithClickHandlers)
      .on("init", toggleDotBtnsActive)
      .on("reInit", toggleDotBtnsActive)
      .on("select", toggleDotBtnsActive);
  });

  //Accordion

  // Hero tabs with animations
  const hero = document.querySelector('.lp-hero');
  if (hero) {
    const baseImg = hero.querySelector('.lp-hero__image .base-image');
    const overlayImg = hero.querySelector('.lp-hero__image .overlay-image');
    const finalImg = hero.querySelector('.lp-hero__image .final-image');

    const priceRoot = hero.querySelector('.lp-hero__price-card');
    const priceEl = priceRoot ? priceRoot.querySelector('.lp-hero__price h3') : null;
    const greffonsEl = priceRoot ? priceRoot.querySelector('.lp-hero__price small') : null;
    const priceLabelEl = priceRoot ? priceRoot.querySelector('.lp-hero__price p') : null;

    const mobilePriceRoot = hero.querySelector('.mobile-price');
    const mobilePriceTitleEl = mobilePriceRoot ? mobilePriceRoot.querySelector('p') : null;
    const mobilePriceValueEl = mobilePriceRoot ? mobilePriceRoot.querySelector('h3') : null;
    const mobileGreffonsEl = mobilePriceRoot ? mobilePriceRoot.querySelector('small') : null;
    const buttons = Array.from(hero.querySelectorAll('.lp-hero__icons button'));

    const tabsConf = [
      { base: 'assets/img/hero-slide1.webp', overlay: 'assets/img/hero-slide-overlay1.png', price: '≈ 3 300 €', greffons: 'Environ 2500 greffons', label: 'Recul de la ligne frontale' },
      { base: 'assets/img/hero-slide2.webp', overlay: 'assets/img/hero-slide-overlay2.png', price: '≈ 3 600 €', greffons: 'Environ 4000 greffons', label: 'Recul de la ligne frontale + <br/> Dégarnissement du vertex' },
      { base: 'assets/img/hero-slide3.webp', overlay: 'assets/img/hero-slide-overlay3.png', price: '≈ 3 900 €', greffons: 'Environ 5000 greffons', label: 'Perte de cheveux modérée à sévère' },
    ];

    let isAnimating = false;

    const runAnimations = () => {
      if (!overlayImg || !finalImg) return;
      if (isAnimating) return;
      isAnimating = true;

      finalImg.style.transition = 'none';
      finalImg.classList.remove('reveal-clip');
      void finalImg.offsetWidth;

      overlayImg.style.transition = 'none';
      overlayImg.classList.remove('fade-in');
      void overlayImg.offsetWidth;

      const overlayFadeInDelay = 500;
      const finalRevealDelayAfterOverlay = 900; 
      const totalFinishDelay = 1000; 

      const startOverlayFade = () => {
        overlayImg.style.transition = '';
        void overlayImg.offsetWidth;
        setTimeout(() => {
          overlayImg.classList.add('fade-in');

          setTimeout(() => {
            finalImg.style.transition = '';
            void finalImg.offsetWidth;
            finalImg.classList.add('reveal-clip');
            setTimeout(() => {
              isAnimating = false;
            }, totalFinishDelay);
          }, finalRevealDelayAfterOverlay);
        }, overlayFadeInDelay);
      };

      if (overlayImg.complete && overlayImg.naturalWidth > 0) {
        startOverlayFade();
      } else {
        const onLoad = () => {
          overlayImg.removeEventListener('load', onLoad);
          startOverlayFade();
        };
        overlayImg.addEventListener('load', onLoad, { once: true });
      }
    };

    buttons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) return;
        if (isAnimating) return;

        buttons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-label', 'Sélectionner');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'Sélectionné');

        const conf = tabsConf[idx] || tabsConf[0];

        if (baseImg) baseImg.src = conf.base;
        if (overlayImg) overlayImg.src = conf.overlay;
        if (finalImg && !finalImg.src) finalImg.src = 'assets/img/final-result.webp';

        if (priceEl) priceEl.textContent = conf.price;
        if (greffonsEl) greffonsEl.textContent = conf.greffons;
        if (priceLabelEl) priceLabelEl.innerHTML = conf.label;

        if (mobilePriceTitleEl) mobilePriceTitleEl.innerHTML = conf.label;
        if (mobilePriceValueEl) mobilePriceValueEl.textContent = conf.price;
        if (mobileGreffonsEl) mobileGreffonsEl.textContent = conf.greffons;

        runAnimations();
      });
    });

    if (finalImg && !finalImg.src) finalImg.src = 'assets/img/final-result.webp';
    runAnimations();
  }

  const summaries = document.querySelectorAll(".accordion__quesion")
  // Add click event listener to each summary
  summaries.forEach((summary) => {
    summary.addEventListener("click", function (e) {
      // Prevent the default toggle behavior
      e.preventDefault()

      // Get the details element that contains this summary
      const currentDetails = this.parentElement

      // Find the closest section parent
      const parentSection = currentDetails.closest("section")

      if (parentSection) {
        // Find all details elements within this section
        const allDetails = parentSection.querySelectorAll("details.accordion__item")

        // Close all other details elements in this section
        allDetails.forEach((details) => {
          if (details !== currentDetails) {
            details.removeAttribute("open")
          }
        })

        // Toggle the current details element
        if (currentDetails.hasAttribute("open")) {
          currentDetails.removeAttribute("open")
        } else {
          currentDetails.setAttribute("open", "")
        }
      }
    })
  })

});


  // Smooth scroll and section link handling
  const topNav = document.querySelector('.top-nav');
  const topNavWrapper = document.querySelector('.top-nav .top-nav-wrapper');
  const navLinks = Array.from(document.querySelectorAll('.top-nav .list-unstyled a'));

  const getHeaderOffset = () => {
    const stickyHeight = topNav ? topNav.offsetHeight : 0;
    return stickyHeight + 10; // small padding
  };

  const sectionsMap = new Map();
  const idForLink = (link) => (link.getAttribute('href') || '').replace('#', '');

  navLinks.forEach((link) => {
    const id = idForLink(link);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) sectionsMap.set(id, target);

    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const targetEl = document.getElementById(id);
      if (!targetEl) return;

      const rect = targetEl.getBoundingClientRect();
      const absoluteY = window.pageYOffset + rect.top - getHeaderOffset();
      window.scrollTo({ top: absoluteY, behavior: 'smooth' });

      setActiveLink(link);

      scrollNavLinkIntoView(link, 'start');
    });
  });

  function setActiveLink(activeLink) {
    navLinks.forEach((l) => l.classList.remove('active'));
    if (activeLink) activeLink.classList.add('active');
  }

  function scrollNavLinkIntoView(link, block = 'nearest') {
    if (!topNavWrapper || !link) return;
    // If the nav is horizontally scrollable, align clicked link to left
    const wrapperRect = topNavWrapper.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const currentScroll = topNavWrapper.scrollLeft;
    const offsetLeft = linkRect.left - wrapperRect.left + currentScroll;
    // Leave a small padding on the left
    const paddingLeft = 16;
    topNavWrapper.scrollTo({ left: Math.max(offsetLeft - paddingLeft, 0), behavior: 'smooth' });
  }

  const observerOptions = {
    root: null,
    rootMargin: `-${getHeaderOffset()}px 0px -60% 0px`,
    threshold: [0, 0.25, 0.5, 0.75, 1],
  };

  const linkById = {};
  navLinks.forEach((l) => { const id = idForLink(l); if (id) linkById[id] = l; });

  let lastActiveId = null;
  const onIntersect = (entries) => {
    let best = { id: null, ratio: 0 };
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      if (entry.intersectionRatio > best.ratio) best = { id, ratio: entry.intersectionRatio };
    });

    if (best.id && best.id !== lastActiveId) {
      lastActiveId = best.id;
      const link = linkById[best.id];
      if (link) {
        setActiveLink(link);
        scrollNavLinkIntoView(link, 'start');
      }
    }
  };

  const observer = new IntersectionObserver(onIntersect, observerOptions);
  sectionsMap.forEach((section) => observer.observe(section));

  document.documentElement.style.scrollBehavior = 'smooth';