import * as Elementa from '../../Elementa';

import { Ref } from './types';

export type IDKConstraint = Elementa.SizeConstraint | Elementa.PositionConstraint | Elementa.CenterConstraint
export type Size = number | string | IDKConstraint;
export type BasicProps<T extends Elementa.UIComponent = Elementa.UIComponent> = {
  x?: Size,
  y?: Size,
  w?: Size,
  h?: Size,
  effects?: Elementa.Effect[],
  ref?: Ref<T>
}
export type Children = { 
  children?: (undefined | string | Elementa.UIComponent)[],
  stackVertical?: boolean,
  stackHorizontal?: boolean,
}

export const getScreenWidth = () => new (Java.type('net.minecraft.client.gui.ScaledResolution'))(Client.getMinecraft()).func_78327_c();
export const getScreenHeight = () => new (Java.type('net.minecraft.client.gui.ScaledResolution'))(Client.getMinecraft()).func_78324_d();
export const getScreenMin = () => Math.min(getScreenWidth(), getScreenHeight());
export const getScreenMax = () => Math.max(getScreenWidth(), getScreenHeight());

export const parseNumeric = (val: Size, multi: number = 1): IDKConstraint  => {
  if(typeof val === 'string'){
    val = val.toLowerCase();
    if(val === 'center') return new Elementa.CenterConstraint();
    if(val.endsWith('px')) return new Elementa.PixelConstraint(Number(val.substring(0, val.length - 2)) * multi);
    if(val.endsWith('%')) return new Elementa.RelativeConstraint(multi * Number(val.substring(0, val.length-1)) / 100);
    if(val.endsWith('vw')) return new Elementa.PixelConstraint(Number(val.substring(0, val.length - 2)) * multi * getScreenWidth() / 100);
    if(val.endsWith('vh')) return new Elementa.PixelConstraint(Number(val.substring(0, val.length - 2)) * multi * getScreenHeight() / 100);
    if(val.endsWith('vmin')) return new Elementa.PixelConstraint(Number(val.substring(0, val.length - 4)) * multi * getScreenMin() / 100);
    if(val.endsWith('vmax')) return new Elementa.PixelConstraint(Number(val.substring(0, val.length - 4)) * multi * getScreenMax() / 100);
    return new Elementa.PixelConstraint(Number(val)*multi);
  }
  if(typeof val === 'number') return new Elementa.PixelConstraint(val*multi);
  return val;
}

export const transformSizeProps = <T extends Record<string, any>, K extends Record<string, number>>(
  props: T,
  keys: K
): {[key in keyof T]: key extends keyof K ? IDKConstraint : T[key]} => {
  const copy: any = {...props};
  for(let key in keys){
    if(copy[key] !== undefined) copy[key] = parseNumeric(copy[key], keys[key]);
  }
  return copy;
}

export const applyBasicProps = <T extends Elementa.UIComponent>(elem: T, props: BasicProps<T>): T => {
  const safeProps = transformSizeProps(props, {x: 1, y: 1, w: 1, h: 1});
  if(safeProps.w) elem.setWidth(safeProps.w as Elementa.WidthConstraint);
  if(safeProps.h) elem.setHeight(safeProps.h as Elementa.HeightConstraint);
  if(safeProps.y) elem.setX(safeProps.x as Elementa.XConstraint);
  if(safeProps.x) elem.setY(safeProps.y as Elementa.YConstraint);
  if(safeProps.effects) elem.enableEffects(...safeProps.effects);
  if(safeProps.ref) safeProps.ref.component = elem;
  return elem;
}

export const adoptChildren = <T extends Elementa.UIComponent>(elem: T, props: Children): T => {
  const components = (props.children || [])
    .filter(c => !!c)
    .map(c => typeof c === 'string' ? new Elementa.UIText(c) : c) as Elementa.UIComponent[];
  if(props.stackHorizontal) components.forEach(c => c.setX(new Elementa.SiblingConstraint()));
  if(props.stackVertical) components.forEach(c => c.setY(new Elementa.SiblingConstraint()));
  elem.addChildren(...components);
  return elem;
}
