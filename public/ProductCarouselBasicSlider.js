function getVisibleCount() {
  if (window.innerWidth < 640) return 2; // mobile
  return 4; // desktop/tablet
}

function initProductCarouselBasicSlider({ trackId, prevBtnId, nextBtnId, visibleCount, total }) {
  const slider = document.getElementById(trackId)
  const prevBtn = document.getElementById(prevBtnId)
  const nextBtn = document.getElementById(nextBtnId)
  let startIndex = 0
  const maxStartIndex = total > visibleCount ? total - visibleCount : 0

  function updateSlider() {
    if (!slider) return
    slider.style.transform = `translateX(-${startIndex * (100 / total)}%)`
    if (prevBtn) prevBtn.disabled = startIndex === 0
    if (nextBtn) nextBtn.disabled = startIndex === maxStartIndex
  }

  function goToPrev() {
    startIndex = Math.max(startIndex - visibleCount, 0)
    updateSlider()
  }
  function goToNext() {
    startIndex = Math.min(startIndex + visibleCount, maxStartIndex)
    updateSlider()
  }

  if (prevBtn) prevBtn.addEventListener('click', goToPrev)
  if (nextBtn) nextBtn.addEventListener('click', goToNext)
  updateSlider()

  // Return a cleanup function
  return function cleanup() {
    if (prevBtn) prevBtn.removeEventListener('click', goToPrev)
    if (nextBtn) nextBtn.removeEventListener('click', goToNext)
  }
}

function initializeCarousel() {
  var total = document.querySelectorAll('#slider-track > .carousel-item').length;
  var visibleCount = getVisibleCount();
  initProductCarouselBasicSlider({
    trackId: 'slider-track',
    prevBtnId: 'slider-prev',
    nextBtnId: 'slider-next',
    visibleCount: visibleCount,
    total: total
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initializeCarousel();
  window.addEventListener('resize', function() {
    initializeCarousel();
  });
})
