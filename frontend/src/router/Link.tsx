import type {MouseEvent, ReactNode} from "react";
import {navigateTo} from "./util.tsx";

const Link = ({to, children}: {to: string, children: ReactNode}) => {
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigateTo(to);
    }
    return <a href={to} onClick={handleClick}>{children}</a>
}

export default Link;