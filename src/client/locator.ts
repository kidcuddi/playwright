/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as structs from '../../types/structs';
import * as api from '../../types/types';
import * as channels from '../protocol/channels';
import * as util from 'util';
import { monotonicTime } from '../utils/utils';
import { ElementHandle } from './elementHandle';
import { Frame } from './frame';
import { FilePayload, Rect, SelectOption, SelectOptionOptions, TimeoutOptions } from './types';

export class Locator implements api.Locator {
  private _frame: Frame;
  private _selector: string;

  constructor(frame: Frame, selector: string) {
    this._frame = frame;
    this._selector = selector;
  }

  private async _withFirst<R, O extends TimeoutOptions>(task: (handle: ElementHandle<SVGElement | HTMLElement>, options?: O) => Promise<R>, options?: O): Promise<R> {
    if (!options)
      options = {} as any;
    const timeout = this._frame.page()._timeoutSettings.timeout(options!);
    const deadline = timeout ? monotonicTime() + timeout : 0;
    const first = await this.first(options);
    try {
      return await task(first, { ...options!, timeout: deadline ? deadline - monotonicTime() : 0 });
    } finally {
      first.dispose();
    }
  }

  async all(): Promise<api.ElementHandle<SVGElement | HTMLElement>[]> {
    return this._frame.$$(this._selector);
  }

  async boundingBox(options?: TimeoutOptions): Promise<Rect | null> {
    return this._withFirst(h => h.boundingBox(), options);
  }

  async check(options: channels.ElementHandleCheckOptions = {}) {
    return this._frame.check(this._selector, options);
  }

  async click(options: channels.ElementHandleClickOptions = {}): Promise<void> {
    return this._frame.click(this._selector, options);
  }

  async dblclick(options: channels.ElementHandleDblclickOptions = {}): Promise<void> {
    return this._frame.dblclick(this._selector, options);
  }

  async dispatchEvent(type: string, eventInit: Object = {}, options?: TimeoutOptions) {
    return this._frame.dispatchEvent(this._selector, type, eventInit, options);
  }

  async evaluate<R, Arg>(pageFunction: structs.PageFunctionOn<SVGElement | HTMLElement, Arg, R>, arg?: Arg, options?: TimeoutOptions): Promise<R> {
    return this._withFirst(h => h.evaluate(pageFunction as any, arg), options);
  }

  async evaluateAll<R, Arg>(pageFunction: structs.PageFunctionOn<(SVGElement | HTMLElement)[], Arg, R>, arg?: Arg): Promise<R> {
    return this._frame.$$eval(this._selector, pageFunction as any, arg);
  }

  async evaluateHandle<R, Arg>(pageFunction: structs.PageFunction<Arg, R>, arg?: Arg, options?: TimeoutOptions): Promise<structs.SmartHandle<R>> {
    return this._withFirst(h => h.evaluateHandle(pageFunction as any, arg), options);
  }

  async fill(value: string, options: channels.ElementHandleFillOptions = {}): Promise<void> {
    return this._frame.fill(this._selector, value, options);
  }

  locator(selector: string): Locator {
    return new Locator(this._frame, this._selector + ' >> ' + selector);
  }

  async first(options?: TimeoutOptions): Promise<ElementHandle<SVGElement | HTMLElement>> {
    const result = await this._frame.waitForSelector(this._selector, options);
    return result!;
  }

  async focus(options?: TimeoutOptions): Promise<void> {
    return this._frame.focus(this._selector, options);
  }

  async getAttribute(name: string, options?: TimeoutOptions): Promise<string | null> {
    return this._frame.getAttribute(this._selector, name, options);
  }

  async hover(options: channels.ElementHandleHoverOptions = {}): Promise<void> {
    return this._frame.hover(this._selector, options);
  }

  async innerHTML(options?: TimeoutOptions): Promise<string> {
    return this._frame.innerHTML(this._selector, options);
  }

  async innerText(options?: TimeoutOptions): Promise<string> {
    return this._frame.innerText(this._selector, options);
  }

  async inputValue(options?: TimeoutOptions): Promise<string> {
    return this._frame.inputValue(this._selector, options);
  }

  async isChecked(options?: TimeoutOptions): Promise<boolean> {
    return this._frame.isChecked(this._selector, options);
  }

  async isDisabled(options?: TimeoutOptions): Promise<boolean> {
    return this._frame.isDisabled(this._selector, options);
  }

  async isEditable(options?: TimeoutOptions): Promise<boolean> {
    return this._frame.isEditable(this._selector, options);
  }

  async isEnabled(options?: TimeoutOptions): Promise<boolean> {
    return this._frame.isEnabled(this._selector, options);
  }

  async isHidden(options?: TimeoutOptions): Promise<boolean> {
    return this._frame.isHidden(this._selector);
  }

  async isVisible(options?: TimeoutOptions): Promise<boolean> {
    return this._frame.isVisible(this._selector);
  }

  async press(key: string, options: channels.ElementHandlePressOptions = {}): Promise<void> {
    return this._frame.press(this._selector, key, options);
  }

  async screenshot(options: channels.ElementHandleScreenshotOptions & { path?: string } = {}): Promise<Buffer> {
    return this._withFirst((h, o) => h.screenshot(o), options);
  }

  async scrollIntoViewIfNeeded(options: channels.ElementHandleScrollIntoViewIfNeededOptions = {}) {
    return this._withFirst((h, o) => h.scrollIntoViewIfNeeded(o), options);
  }

  async selectOption(values: string | api.ElementHandle | SelectOption | string[] | api.ElementHandle[] | SelectOption[] | null, options: SelectOptionOptions = {}): Promise<string[]> {
    return this._frame.selectOption(this._selector, values, options);
  }

  async selectText(options: channels.ElementHandleSelectTextOptions = {}): Promise<void> {
    return this._withFirst((h, o) => h.selectText(o), options);
  }

  async setInputFiles(files: string | FilePayload | string[] | FilePayload[], options: channels.ElementHandleSetInputFilesOptions = {}) {
    return this._frame.setInputFiles(this._selector, files, options);
  }

  async tap(options: channels.ElementHandleTapOptions = {}): Promise<void> {
    return this._frame.tap(this._selector, options);
  }

  async textContent(options?: TimeoutOptions): Promise<string | null> {
    return this._frame.textContent(this._selector, options);
  }

  async type(text: string, options: channels.ElementHandleTypeOptions = {}): Promise<void> {
    return this._frame.type(this._selector, text, options);
  }

  async uncheck(options: channels.ElementHandleUncheckOptions = {}) {
    return this._frame.uncheck(this._selector, options);
  }

  waitFor(options: channels.FrameWaitForSelectorOptions & { state: 'attached' | 'visible' }): Promise<ElementHandle<SVGElement | HTMLElement>>;
  waitFor(options?: channels.FrameWaitForSelectorOptions): Promise<ElementHandle<SVGElement | HTMLElement> | null>;
  async waitFor(options?: channels.FrameWaitForSelectorOptions): Promise<ElementHandle<SVGElement | HTMLElement> | null> {
    return this._frame.waitForSelector(this._selector, options);
  }

  [(util.inspect as any).custom]() {
    return this.toString();
  }

  toString() {
    return `Locator@${this._selector}`;
  }
}
