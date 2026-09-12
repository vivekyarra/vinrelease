(() => {
  const prior = document.getElementById("vinrelease-recorded-cursor");
  prior?.remove();

  const pointer = document.createElement("div");
  pointer.id = "vinrelease-recorded-cursor";
  pointer.setAttribute("aria-hidden", "true");
  pointer.innerHTML = '<svg width="25" height="31" viewBox="0 0 25 31" xmlns="http://www.w3.org/2000/svg"><path d="M2 2v22l5.5-5.2 4.2 9.1 4.1-2-4.1-8.5H21L2 2Z" fill="#fff" stroke="#15231e" stroke-width="2" stroke-linejoin="round"/></svg><span></span>';
  Object.assign(pointer.style, {
    position: "fixed",
    left: "0",
    top: "0",
    zIndex: "2147483647",
    pointerEvents: "none",
    transform: "translate3d(-60px,-60px,0)",
    filter: "drop-shadow(0 2px 2px rgba(0,0,0,.25))",
  });
  const ring = pointer.lastElementChild;
  Object.assign(ring.style, {
    position: "absolute",
    left: "-8px",
    top: "-8px",
    width: "23px",
    height: "23px",
    borderRadius: "50%",
    border: "2px solid #ed9d25",
    opacity: "0",
    transform: "scale(.5)",
    transition: "opacity .15s, transform .25s",
  });
  document.body.appendChild(pointer);
  document.addEventListener("mousemove", (event) => {
    pointer.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
  }, { passive: true });
  document.addEventListener("mousedown", () => {
    ring.style.opacity = "1";
    ring.style.transform = "scale(1.8)";
    setTimeout(() => {
      ring.style.opacity = "0";
      ring.style.transform = "scale(.5)";
    }, 320);
  });
  return "Recording pointer follows real browser mouse events";
})()
