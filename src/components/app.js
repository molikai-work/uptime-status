import { useMemo } from "react";
import Link from "./link";
import Header from "./header";
import UptimeRobot from "./uptimerobot";
import Package from "../../package.json";

function App() {
    const apikeys = useMemo(() => {
        const { ApiKeys } = window.Config;
        if (Array.isArray(ApiKeys)) {return ApiKeys;}
        if (typeof ApiKeys === "string") {return [ApiKeys];}
        return [];
    }, []);

    // 读取 Footer 配置
    const Footer = window.Config.Footer || {
        StartYear: new Date().getFullYear(), // 默认为当前年份
        CopyrightName: "SiteStatus",
        CopyrightUrl: "/",
    };

    const currentYear = new Date().getFullYear(); // 获取当前年份
    const copyrightYear =
        Footer.StartYear === currentYear ? currentYear : `${Footer.StartYear} - ${currentYear}`;

    return (
        <>
            <Header />
            <div className='container'>
                <div id='uptime'>
                    {apikeys.map((key) => (
                        <UptimeRobot key={key} apikey={key} />
                    ))}
                </div>
                <div id='footer'>
                    <p>基于 <Link to='https://uptimerobot.com/' text='UptimeRobot' rel='external nofollow noopener noreferrer' target='_blank' /> 接口制作，检测频率 5 分钟</p>
                    <p>
                        &copy; {copyrightYear}{" "}
                        <Link to={Footer.CopyrightUrl} text={Footer.CopyrightName} />, Version {Package.version}
                    </p>
                </div>
            </div>
        </>
    );
}

export default App;
