import React, { Suspense} from "react";


export const withSuspense = (Component, fallback = null) => (
    <Suspense fallback={fallback}>
        <Component />
    </Suspense>
);