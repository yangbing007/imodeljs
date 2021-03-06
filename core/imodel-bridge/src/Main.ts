/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { BridgeRunner } from "./BridgeRunner";
import { IModelHost } from "@bentley/imodeljs-backend";
import { ChangesType } from "@bentley/imodelhub-client";
import { Logger } from "@bentley/bentleyjs-core";

async function run(inputParams: string[]) {
  try {
    await IModelHost.startup();
    const fwk = BridgeRunner.fromArgs(inputParams);
    await fwk.synchronize();
    await fwk.pushDataChanges("", ChangesType.Regular);
    await IModelHost.shutdown();
  } catch (error) {
    Logger.logError("run", `Failed with error: ${error}`);
  }

}

function initMain() {
  Logger.initializeToConsole();
  const commandLineArgs = process.argv.slice(2);
  run(commandLineArgs).then(() => { }).catch((err) => {
    Logger.logError("Entrypoint", `Failed with error: ${err}`);
  });
}

initMain();
