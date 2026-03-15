/* @ts-self-types="./puzzle_core.d.ts" */

import * as wasm from "./puzzle_core_bg.wasm";
import { __wbg_set_wasm } from "./puzzle_core_bg.js";
__wbg_set_wasm(wasm);
wasm.__wbindgen_start();
export {
    solve_json
} from "./puzzle_core_bg.js";
