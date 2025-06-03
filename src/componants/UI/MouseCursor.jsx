import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import cn from "mxcn";
import { useRef } from "react";
import useMouseCursorStore from "../../stores/useMouseCursorStore";
import CursorDefault from "./Cursors/CursorDefault";
import CursorDecouvrir from "./Cursors/CursorDecouvrir";
import CursorPoursuivre from "./Cursors/CursorPoursuivre";

function MouseCursor() {
  const { mode } = useMouseCursorStore();
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const mousePosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useGSAP(() => {
    if (!cursorRef.current || !followerRef.current) return;
    const cursorXSetter = gsap.quickTo("#cursor", "x", {
      duration: 0.2,
      ease: "power3",
    });
    const cursorYSetter = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.2,
      ease: "power3",
    });

    const followerXSetter = gsap.quickTo(followerRef.current, "x", {
      duration: 0.6,
      ease: "power3",
    });
    const followerYSetter = gsap.quickTo("#follower", "y", {
      duration: 0.6,
      ease: "power3",
    });

    const cursorWidth = cursorRef.current.attributes.width.value; 
    const cursorHeight = cursorRef.current.attributes.height.value;

    const mouseMoveHandler = (e) => {
      const x = e.clientX - (cursorWidth / 2);
      const y = e.clientY - (cursorHeight / 2);

      mousePosRef.current = { x, y }; // On stocke la position dans le ref
      cursorXSetter(x);
      cursorYSetter(y);
      followerXSetter(x);
      followerYSetter(y);
    }

    window.addEventListener("mousemove", mouseMoveHandler);

    // Quand le mode change, on repositionne le curseur à la dernière position connue
    cursorXSetter(mousePosRef.current.x);
    cursorYSetter(mousePosRef.current.y);
    followerXSetter(mousePosRef.current.x);
    followerYSetter(mousePosRef.current.y);

    return () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [mode]);

  return (
    <>
      {/* <span id="cursor" className={cn({ 'negative': negative })} ref={cursorRef} /> */}
      <CursorDefault cursorRef={cursorRef} followerRef={followerRef} />
      <CursorDecouvrir cursorRef={cursorRef} followerRef={followerRef} />
      <CursorPoursuivre cursorRef={cursorRef} followerRef={followerRef} />
    </>
  );
}

export default MouseCursor;