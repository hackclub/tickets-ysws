(function () {
  // Respect prefers-reduced-motion
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Hero ticket subtle 3D tilt tracking on mouse move
  var ticket = document.getElementById("heroTicket");
  if (ticket && !prefersReducedMotion) {
    var boundingBox = null;

    var updateBox = function () {
      boundingBox = ticket.getBoundingClientRect();
    };

    window.addEventListener("resize", updateBox, { passive: true });
    window.addEventListener("scroll", updateBox, { passive: true });

    ticket.addEventListener("mouseenter", function () {
      updateBox();
    });

    ticket.addEventListener("mousemove", function (e) {
      if (!boundingBox) updateBox();
      var x = e.clientX - boundingBox.left;
      var y = e.clientY - boundingBox.top;
      var centerX = boundingBox.width / 2;
      var centerY = boundingBox.height / 2;

      var rotateX = ((y - centerY) / centerY) * -4;
      var rotateY = ((x - centerX) / centerX) * 4;

      ticket.style.transform =
        "perspective(1000px) rotateX(" +
        rotateX.toFixed(2) +
        "deg) rotateY(" +
        rotateY.toFixed(2) +
        "deg) translateY(-4px)";
    });

    ticket.addEventListener("mouseleave", function () {
      ticket.style.transform = "";
    });
  }

  // Marquee chase simulation for bulbs
  var bulbs = document.querySelectorAll(".bulb-row .bulb");
  if (bulbs.length > 0 && !prefersReducedMotion) {
    var step = 0;
    setInterval(function () {
      step = (step + 1) % bulbs.length;
      bulbs.forEach(function (bulb, idx) {
        if (idx === step || (idx + 10) % bulbs.length === step) {
          bulb.style.boxShadow = "0 0 16px var(--gold-light), 0 0 24px #ffffff";
        } else {
          bulb.style.boxShadow = "";
        }
      });
    }, 320);
  }
})();
