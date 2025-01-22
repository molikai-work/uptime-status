function Link({ to, text, className = "" , rel = "", target = "_self"}) {
    return (
        <a href={to} class={className} rel={rel} target={target}>
            {text}
        </a>
    );
}

export default Link;
