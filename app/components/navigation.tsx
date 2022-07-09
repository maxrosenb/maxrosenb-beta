import React from "react";
import { Link } from "remix";
import { CssModuleWrapper } from "~/components/css-module-wrapper";

const Navigation: React.FC = () => (
  <CssModuleWrapper className={"navigation-module"}>
    <nav role="navigation" className={"container"} aria-label="Main">
      <Link to="/" className={"logoLink"}>
        {/* <span className={"logo"} /> */}
        <span className={"navigationItem"}>Max Rosenberg's Tech Blog</span>
      </Link>
    </nav>
  </CssModuleWrapper>
);

export default Navigation;
