import React, { Fragment } from "react";

function RenderIf(props) {
  return props.condition ? <Fragment>{props.children}</Fragment> : null;
}

export default RenderIf;