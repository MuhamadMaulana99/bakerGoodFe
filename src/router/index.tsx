import React from 'react'
import { Navigate, RouteObject, useRoutes } from 'react-router-dom'
import allRoutes from '../config/routes';

export const Router = () => {
    const mappedRoutes: RouteObject[] = [];


    const SetDefaultRoute = () => {
        return <Navigate to={allRoutes?.[0]?.path || "/"} />;
    };

    for (const el of allRoutes) {
        if (typeof el.path === 'string') {
    
          mappedRoutes.push({
            id: el.id,
            element: el.element,
            path: el.path,
            children: [{ path: el.path, element: el.element }],
          });
        }
      }

    const routes = useRoutes([
        {
            path: '/',
            element: <SetDefaultRoute />,
        },
        ...mappedRoutes,
    ]);

    return routes;

}