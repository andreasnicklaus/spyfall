import { useEffect } from "react";

function setMeta(name, content, attr = "name") {
    if (content == null) return;
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
}

export function Seo({ title, description, noindex = false }) {
    useEffect(() => {
        if (title) document.title = title;

        if (description) {
            setMeta("description", description);
            setMeta("og:description", description, "property");
            setMeta("twitter:description", description);
        }
        if (title) {
            setMeta("og:title", title, "property");
            setMeta("twitter:title", title);
        }
        setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");
    }, [title, description, noindex]);

    return null;
}

export default Seo;
