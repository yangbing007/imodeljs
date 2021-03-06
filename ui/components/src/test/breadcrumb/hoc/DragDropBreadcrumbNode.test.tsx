/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import * as React from "react";
import { cleanup, render } from "@testing-library/react";
import { DragDropBreadcrumbNodeComponent } from "../../../ui-components/breadcrumb/hoc/DragDropBreadcrumbNode";

describe("DragDropBreadcrumbNode", () => {

  afterEach(cleanup);
  it("should render", () => {
    render(<DragDropBreadcrumbNodeComponent isOver={false} isDragging={false} canDrag={true} canDrop={true} />);
  });
});
