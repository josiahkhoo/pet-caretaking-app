import React from "react";

export default function Category({ name }) {
  return (
    <div
      className="bg-secondary text-white text-center rounded p-1"
      style={{
        display: "inline-block",
        boxShadow: "inset 2 2 2px rgba(0,0,0,.1)",
        marginLeft: 5,
        marginRight: 5,
      }}
    >
      {name}
    </div>
  );
}
