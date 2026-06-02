import React, {useState, useEffect} from "react";
import { DatosCompania } from "api/VentasApi";

export const VentasComponents = () => {
    const [infoEmpresa, setInfoEmpresa] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setCargando(true);
                const datos = await DatosCompania();
                setInfoEmpresa(datos);
            } catch (err) {
                setError("No se pudo cargar la infomación de la empresa.");
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, []);

    useEffect(() => {
        if (infoEmpresa) {
            // 1. Actualizar el título de la pestaña del navegador
            document.title = `${infoEmpresa.NombreEmpresa} | Lider en Suministros de Limpieza y Mantenimiento`;

            // 2. Actualizar la Meta Descripción para que aparezca en los resultados de Google
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.name = "description";
                document.head.appendChild(metaDescription);
            }
            metaDescription.setAttribute("content", infoEmpresa.DescripcionCorta || infoEmpresa.DescripcionLarga);

            // 3. Crear Datos Estructurados (Schema JSON-LD) para el motor de búsqueda
            const schemaData = {
                "@context": "https://schema.org",
                "@type": "LocalBusiness", // O "Organization"
                "name": infoEmpresa.NombreEmpresa,
                "alternativeName": infoEmpresa.NombreAlternativo,
                "description": infoEmpresa.DescripcionCorta,
                "url": infoEmpresa.URL || window.location.origin,
                "telephone": infoEmpresa.Telefono ? infoEmpresa.Telefono.toString() : "",
                "email": infoEmpresa.Correo,
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": infoEmpresa.Direccion,
                    "addressLocality": infoEmpresa.Ciudad,
                    "addressCountry": infoEmpresa.Pais,
                    "postalCode": infoEmpresa.CodigoPostal
                }
            };

            // Inyectar el script JSON-LD en el head del documento
            const scriptId = "jsonld-empresa";
            let scriptElement = document.getElementById(scriptId);
            if (!scriptElement) {
                scriptElement = document.createElement("script");
                scriptElement.id = scriptId;
                scriptElement.type = "application/ld+json";
                document.head.appendChild(scriptElement);
            }
            scriptElement.text = JSON.stringify(schemaData);
        }
    }, [infoEmpresa]);


    if (cargando) {
        return <div className="loading">Cargando información de la empresa...</div>;
    }

    if (error) {
        return<div>No hay información disponible.</div>;
    }

    //RENDERIZAMOS LOS DATOS
    return (
        <div className="empresa-info-container">
            <h2>{infoEmpresa.NombreEmpresa || "Lider en Suministros de Limpieza y Mantenimiento Industrial en Guatemala."}</h2>
            <p><strong>Categoría:</strong> {infoEmpresa.CategoriaNegocio}</p>
            <p><strong>Descripción Corta:</strong>{infoEmpresa.DescripcionCorta}</p>
            <p><strong>Descripción Larga:</strong>{infoEmpresa.DescripcionLarga}</p>
            <p><strong>URL :</strong>{infoEmpresa.URL}</p>

            <div className="contact-info">
                <h3>Contacto</h3>
                <p><strong>Dirección :</strong> {infoEmpresa.Direccion}</p>
                <p><strong>Ciudad :</strong> {infoEmpresa.Ciudad}</p>
                <p><strong>Código Postal :</strong>{infoEmpresa.CodigoPostal}</p>
                <p><strong>Correo :</strong>{infoEmpresa.Correo}</p>
                <p><strong>Teléfono :</strong> {infoEmpresa.Telefono}</p>
            </div>
        </div>
    )
};