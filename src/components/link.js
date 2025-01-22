import React from "react";

function Link({ text, to, rel = "", target = "_self" }) {
    return (
        <a href={to} rel={rel} target={target}>
            {text}
        </a>
    );
}

export default Link;
