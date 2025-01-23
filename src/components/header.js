/*
 * Copyright (c) molikai-work (2025)
 * molikai-work 的特定修改和新增部分
 * 根据 MIT 许可证发布
 */

import { useEffect } from "react";
import Link from "./link";

function Header() {
    useEffect(() => {
        document.title = window.Config.SiteName;
    }, []);

    return (
        <div id='header'>
            <div className='container'>
                <h1 className='logo'>{window.Config.SiteName}</h1>
                <div className='navi'>
                    {window.Config.Navi.map((item, index) => (
                        <Link key={index} to={item.url} text={item.text} rel={item.rel || ""} target={item.target || "_self"} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Header;
