/*
 * Copyright (c) molikai-work (2025)
 * molikai-work 的特定修改和新增部分
 * 根据 MIT 许可证发布
 */

function Link({ to, text = "", className = "" , rel = "", target = "_self"}) {
    return (
        <a href={to} class={className} rel={rel} target={target}>
            {text}
        </a>
    );
}

export default Link;
