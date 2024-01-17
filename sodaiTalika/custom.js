class Carousel {
  constructor(carousel) {
    this.carousel = carousel;
    this.slides = Array.from(this.carousel.getElementsByClassName("carousel-item"));
    this.slideIndex = 0;
    this.autoSlide = this.carousel.getAttribute("data-auto-slide") === "true";
    this.reverseSlide = this.carousel.getAttribute("data-slide-direction") === "reverse";
    this.delayTime = this.carousel.getAttribute("data-delay-time");
    this.slideInterval = null;
    this.dots = [];

    this.visibleItems = Math.round(this.carousel.offsetWidth / parseFloat(getComputedStyle(this.slides[0]).width));
    this.totalItems = this.slides.length;
    this.dotCount = this.totalItems - (this.visibleItems - 1);

    this.createDots();
    this.showSlide(this.slideIndex);

    if (this.autoSlide) {
      this.startSlide();
      this.carousel.addEventListener("mouseover", () => this.stopSlide());
      this.carousel.addEventListener("mouseout", () => this.startSlide());
    }
  }

  createDots() {
    let dotContainer = this.carousel.nextElementSibling;
    for (let i = 0; i < this.dotCount; i++) {
      let dot = document.createElement("span");
      dot.classList.add("dot");
      dot.addEventListener("click", () => this.dotSlide(i));
      dotContainer.appendChild(dot);
      this.dots.push(dot);
    }
  }

  showSlide(n) {
    this.slideIndex = n;
    this.slides.forEach((slide, i) => {
      slide.style.transform = "translateX(-" + (this.slideIndex * 100) + "%)";
      this.dots[i]?.classList.remove("active");
    });
    this.dots[this.slideIndex]?.classList.add("active");
  }

  dotSlide(i) {
    this.stopSlide();
    this.showSlide(i);
    if (this.autoSlide) this.startSlide();
  }

  nextSlide() {
    this.stopSlide();
    this.slideIndex += 1;
    if (this.slideIndex > (this.slides.length - this.visibleItems)) {
      this.slideIndex = 0;
    }
    this.showSlide(this.slideIndex);
    if (this.autoSlide) this.startSlide();
  }

  prevSlide() {
    this.stopSlide();
    this.slideIndex -= 1;
    if (this.slideIndex < 0) {
      this.slideIndex = (this.slides.length - this.visibleItems);
    }
    this.showSlide(this.slideIndex);
    if (this.autoSlide) this.startSlide();
  }

  startSlide() {
    this.slideInterval = setInterval(() => this.reverseSlide ? this.prevSlide() : this.nextSlide(), this.delayTime);
  }

  stopSlide() {
    clearInterval(this.slideInterval);
  }
}

// Initialize carousels
Array.from(document.getElementsByClassName("carouselSlider")).forEach((carousel, i) => {
  let carouselInstance = new Carousel(carousel);
  document.getElementsByClassName("carousel--prev")[i].addEventListener("click", () => carouselInstance.prevSlide());
  document.getElementsByClassName("carousel--next")[i].addEventListener("click", () => carouselInstance.nextSlide());
});