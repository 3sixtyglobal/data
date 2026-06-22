// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@twin.org/core";
import type { IDataTypeHandler } from "../models/IDataTypeHandler.js";

/**
 * Factory for creating handlers for data types.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const DataTypeHandlerFactory = Factory.createFactory<IDataTypeHandler>("data-type");
