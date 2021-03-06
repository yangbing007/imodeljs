/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { expect } from "chai";
import React from "react";
import sinon from "sinon";
import { PrimitiveValue } from "@bentley/ui-abstract";
import { cleanup, fireEvent, render, waitForElement } from "@testing-library/react";
import { EditorContainer, PropertyUpdatedArgs } from "../../ui-components/editors/EditorContainer";
import { EnumButtonGroupEditor } from "../../ui-components/editors/EnumButtonGroupEditor";
import TestUtils from "../TestUtils";

describe("<EnumButtonGroupEditor />", () => {
  afterEach(cleanup);

  it("should render", () => {
    const renderedComponent = render(<EnumButtonGroupEditor setFocus={true} />);
    expect(renderedComponent).not.to.be.undefined;
  });

  it("editor with buttons renders correctly", async () => {
    const record1 = TestUtils.createEnumProperty("Test", 1);
    const record2 = TestUtils.createEnumProperty("Test", 2);
    TestUtils.addEnumButtonGroupEditorSpecification(record1);
    TestUtils.addEnumButtonGroupEditorSpecification(record2);
    const renderedComponent = render(<EnumButtonGroupEditor propertyRecord={record1} />);
    renderedComponent.rerender(<EnumButtonGroupEditor propertyRecord={record2} />);
    expect(renderedComponent).not.to.be.undefined;
  });

  it("button press updates value and display", async () => {
    const record = TestUtils.createEnumProperty("Test", 0);
    TestUtils.addEnumButtonGroupEditorSpecification(record);

    const originalValue = (record.value as PrimitiveValue).value as number;
    expect(originalValue).to.be.equal(0);

    const spyOnCommit = sinon.spy();
    function handleCommit(commit: PropertyUpdatedArgs): void {
      const newValue = (commit.newValue as PrimitiveValue).value as number;
      expect(newValue).to.be.equal(2);
      spyOnCommit();
    }

    const renderedComponent = render(<EnumButtonGroupEditor propertyRecord={record} onCommit={handleCommit} />);
    const greenButton = renderedComponent.getByTestId("Green");
    expect(greenButton.tagName).to.be.equal("BUTTON");
    expect(greenButton.classList.contains("nz-is-active")).to.be.false;

    fireEvent.click(greenButton);
    await TestUtils.flushAsyncOperations();
    expect(greenButton.classList.contains("nz-is-active")).to.be.true;
    expect(spyOnCommit.calledOnce).to.be.true;
  });

  it("test support for enable/disable button states", async () => {
    const record = TestUtils.createEnumProperty("Test", 0);
    TestUtils.addEnumButtonGroupEditorSpecification(record);

    const renderedComponent = render(<EnumButtonGroupEditor propertyRecord={record} />);

    const blueButton = renderedComponent.getByTestId("Blue");
    expect(blueButton.tagName).to.be.equal("BUTTON");
    expect(blueButton.classList.contains("nz-is-disabled")).to.be.equal(!TestUtils.blueEnumValueIsEnabled);
    TestUtils.toggleBlueEnumValueEnabled();
    renderedComponent.rerender(<EnumButtonGroupEditor propertyRecord={record} />);
    await waitForElement(() => renderedComponent.getByTestId("Blue"));
    expect(blueButton.classList.contains("nz-is-disabled")).to.be.equal(!TestUtils.blueEnumValueIsEnabled);
  });

  it("renders editor for 'enum' type and 'enum-buttongroup' editor", () => {
    const propertyRecord = TestUtils.createEnumProperty("Test", 1);
    TestUtils.addEnumButtonGroupEditorSpecification(propertyRecord);
    const renderedComponent = render(<EditorContainer propertyRecord={propertyRecord} title="abc" onCommit={() => { }} onCancel={() => { }} />);
    expect(renderedComponent.container.querySelector(".components-enumbuttongroup-editor")).to.not.be.null;
  });

});
