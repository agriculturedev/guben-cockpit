import { Language } from "./i18n/Languages";
import i18next from "i18next";
import DOMPurify from "dompurify";

const cache: Record<string, string> = {};
const htmlCache: Record<string, string> = {};

function collectTextNodes(node: ChildNode, nodes: Text[] = []) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        nodes.push(node as Text);
    } else {
        node.childNodes.forEach((child) => collectTextNodes(child, nodes));
    }
    return nodes;
}

export async function translateBatchedMultiple(texts: string[], targetLang: string) {
    const results: string[] = [];
    const untranslated: { index: number; text: string }[] = [];

    texts.forEach((text, i) => {
        const cacheKey = `${text}_${targetLang}`;
        if (cache[cacheKey]) {
            results[i] = cache[cacheKey];
        } else {
            untranslated.push({ index: i, text });
        }
    });

    if (untranslated.length === 0) return results;

    const textsToTranslate = untranslated.map(({ text }) => text);

    try {
        const response = await fetch(import.meta.env.VITE_TRANSLATE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                q: textsToTranslate,
                source: "auto",
                target: targetLang,
                api_key: import.meta.env.VITE_TRANSLATE_API_KEY
            }),
        });

        if (!response.ok) {
            console.error("Translation API returned", response.status);
            untranslated.forEach(({ index, text }) => {
                results[index] = text;
            });
            return results;
        }

        const data = await response.json();

        untranslated.forEach(({ index, text }, i) => {
            const translated = data.translatedText?.[i] ?? text;
            const cacheKey = `${text}_${targetLang}`;
            cache[cacheKey] = translated;
            results[index] = translated;
        });
    } catch (err) {
        console.error("Translation fetch failed", err);
        untranslated.forEach(({ index, text }) => {
            results[index] = text;
        });
    }

    return results;
}

export async function translateHtmlBatchedMultiple(htmls: string[], targetLang: string) {
    const results: string[] = [];
    const untranslated: { index: number; text: string }[] = [];

    htmls.forEach((html, i) => {
        const cacheKey = `${html}_${targetLang}`;
        if (htmlCache[cacheKey]) {
            console.log(htmlCache[cacheKey]);
            results[i] = htmlCache[cacheKey];
        } else {
            untranslated.push({ index: i, text: html });
        }
    });

    if (untranslated.length === 0) return results;

    const allTexts: string[][] = untranslated.map(({ text }) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<div>${text}</div>`, "text/html");
        const root = doc.body.firstElementChild!;

        const nodes = collectTextNodes(root);
        return nodes.map((n) => n.textContent!.trim());
    });

    const flatTexts = allTexts.flat();
    if (!flatTexts.length) {
        untranslated.forEach(({ index, text }) => {
            htmlCache[`${text}_${targetLang}`] = text;
            results[index] = text;
        });
        return results;
    }

    let data;
    try {
        const response = await fetch(import.meta.env.VITE_TRANSLATE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            q: flatTexts,
            source: "auto",
            target: targetLang,
            api_key: import.meta.env.VITE_TRANSLATE_API_KEY
            }),
        });

        data = await response.json();
    } catch (err) {
        console.error("Translation fetch failed", err);
        untranslated.forEach(({ index, text }) => {
            htmlCache[`${text}_${targetLang}`] = text;
            results[index] = text;
        });
        return results;
    }

    if (!data?.translatedText) {
        untranslated.forEach(({ index, text }) => {
            htmlCache[`${text}_${targetLang}`] = text;
            results[index] = text;
        });
        return results;
    }

    let counter = 0;
    untranslated.forEach(({ index, text }) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<div>${text}</div>`, "text/html");
        const root = doc.body.firstElementChild!;
        const nodes = collectTextNodes(root);
        nodes.forEach((node) => {
            node.textContent = data.translatedText[counter++];
        });
        const translatedHTML = root.innerHTML;
        htmlCache[`${text}_${targetLang}`] = translatedHTML;
        results[index] = translatedHTML;
    });

    return results;
}

export function TranslatedText({ text }: { text: string }) {
    const currentLang = i18next.language as Language;
    
    if (currentLang === "de") return text;

    const cacheKey = `${text}_${currentLang}`;
    const translation = cache[cacheKey];

    return <>{translation}</>;
}

export function TranslatedHtml({ text, className }: { text: string; className?: string }) {
    const currentLang = i18next.language as Language;

    if (currentLang === "de") return <div className={className} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }} />;

    const cacheKey = `${text}_${currentLang}`;
    const translation = htmlCache[cacheKey];

    return <div className={className} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(translation) }} />;
}