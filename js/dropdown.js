document.addEventListener("DOMContentLoaded", () => {
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle")
  const mobileToggle = document.getElementById("mobile-menu-toggle")
  const mobileClose = document.getElementById("mobile-menu-close")
  const mobileMenu = document.getElementById("mobile-menu")
  const navbar = document.querySelector(".js-site-navbar")
  const navbarSpacer = document.getElementById("navbar-spacer")

  const closeMobile = () => {
    if (!mobileMenu) return
    mobileMenu.classList.add("hidden")
    document.body.classList.remove("overflow-hidden")
    if (mobileToggle) mobileToggle.setAttribute("aria-expanded", "false")
  }

  const openMobile = () => {
    if (!mobileMenu) return
    mobileMenu.classList.remove("hidden")
    document.body.classList.add("overflow-hidden")
    if (mobileToggle) mobileToggle.setAttribute("aria-expanded", "true")
  }

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      if (!mobileMenu) return
      if (mobileMenu.classList.contains("hidden")) {
        openMobile()
      } else {
        closeMobile()
      }
    })
  }

  if (mobileClose) {
    mobileClose.addEventListener("click", closeMobile)
  }

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobile)
  })

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      event.stopPropagation()
      const parentGroup = toggle.closest('.group') || toggle.parentElement
      const dropdownMenu = toggle.nextElementSibling
      if (!dropdownMenu || !parentGroup) return

      // Close other open groups
      document.querySelectorAll('.group.group-open').forEach((g) => {
        if (g !== parentGroup) g.classList.remove('group-open')
      })

      // Toggle open state on the parent group; CSS handles visibility via group-open
      const isOpen = parentGroup.classList.toggle('group-open')
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
      updateSpacer()
    })
  })

  // Close dropdowns when clicking outside, pressing Escape, or clicking a dropdown link
  window.addEventListener("click", (e) => {
    if (!e.target.matches(".dropdown-toggle") && !e.target.closest(".dropdown-menu")) {
      document.querySelectorAll('.group.group-open').forEach((g) => g.classList.remove('group-open'))
      document.querySelectorAll('.dropdown-toggle').forEach((t) => t.setAttribute('aria-expanded', 'false'))
      updateSpacer()
    }
  })

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.group.group-open').forEach((g) => g.classList.remove('group-open'))
      document.querySelectorAll('.dropdown-toggle').forEach((t) => t.setAttribute('aria-expanded', 'false'))
      updateSpacer()
    }
  })

  // Close dropdown when a link inside it is clicked
  document.querySelectorAll('.dropdown-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      const parentGroup = link.closest('.group')
      if (parentGroup) parentGroup.classList.remove('group-open')
      const toggle = parentGroup?.querySelector('.dropdown-toggle')
      if (toggle) toggle.setAttribute('aria-expanded', 'false')
      updateSpacer()
    })
  })

  window.addEventListener("resize", updateSpacer)
  updateSpacer()
})
