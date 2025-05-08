import { Flex } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

export function AutoScroll({ children, ...props }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && children) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [children]);

  return (
    <Flex
      ref={containerRef}
      flexDir="column"
      rounded="md"
      gap="2"
      overflow="auto"
      className="custom-scrollbar"
      data-state="open"
      _open={{
        animation: "fade-in 300ms ease-out",
      }}
      {...props}
    >
      {children}
    </Flex>
  );
}
