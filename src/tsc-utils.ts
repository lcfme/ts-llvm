// tslint:disable:no-bitwise

import * as ts from "typescript";

// Internal utility functions from https://github.com/Microsoft/TypeScript/blob/master/src/compiler/utilities.ts

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

export function isConst(node: ts.Node): boolean {
  return (
    !!(ts.getCombinedNodeFlags(node) & ts.NodeFlags.Const) ||
    !!(ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Const)
  );
}