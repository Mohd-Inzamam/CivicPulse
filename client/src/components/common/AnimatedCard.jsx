import React from "react";

const AnimatedCard = ({
  children,
  hoverScale = 1.02, // kept in signature for API compat, ignored (CSS handles hover)
  animationDelay = 0, // kept in signature for API compat, ignored (no animation)
  sx = {},
  ...props
}) => {
  return (
    <div
      className="card"
      style={{
        borderRadius: 24, // borderRadius: 3 → 3×8 = 24px
        boxShadow: "var(--shadow-sm)", // boxShadow: 3 → var(--shadow-sm)
        ...sx,
      }}
      {...props}
    >
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default AnimatedCard;
