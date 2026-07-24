import { getBreadcrumbs } from "./breadcrumbSchema";
/**
 * 4. SCHEMA DE BÚSQUEDA
 */
export const getSearchSchema = (query, totalResults) => ({
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "SearchResultsPage",
            "mainEntity": {
                "@type": "ItemList",
                "name": `Resultados de búsqueda para ${query}`,
                "numberOfItems": totalResults
            }
        },
        getBreadcrumbs([
            { name: "Inicio", item: "https://disdelsa.com/" },
            { name: "Búsqueda", item: "https://disdelsa.com/buscar" }
        ])
    ]
});
