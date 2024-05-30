import React from 'react';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';

function CustomLink({ children, to, ...props }) {
    let resolved = useResolvedPath(to);
    let match = useMatch({ path: resolved.pathname, end: true });

     // useResolvedPath(to): Resolves the to path to an absolute path.
    // useMatch({ path: resolved.pathname, end: true }): 
    //Checks if the current URL matches the resolved path. The end: true option specifies that the match should be exact.
    //resolving a path" means converting a relative URL path to an absolute URL path based on the current location.
    return (
        <div>
            <Link
                style={{
                    textDecoration: 'none',
                    color: match ? "var(--twitter-color)" : "black"
                }}
                to={to}
                {...props}
            >
                {children}
            </Link>
        </div>
    );
}

export default CustomLink;